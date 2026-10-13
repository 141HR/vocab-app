/* ==========================================================================
 * 单词卡片 —— 数据层（普通脚本，非 ES module，file:// 下可直接加载）
 *
 * 负责：localStorage 读写（全部 try/catch 降级）、数据规范化、SM-2 简化版
 * 调度算法、批量导入解析、JSON 导出。对外暴露 window.VocabStore。
 *
 * localStorage 键名（契约固定）：
 *   vocab.decks.v1      [{ id, name, createdAt }]
 *   vocab.cards.v1      [{ id, deckId, front, back, example, tags[],
 *                          srs: { due, interval, ease, reps, lapses }, createdAt }]
 *   vocab.settings.v1   { theme, dailyNewLimit, activeDeckId }
 *   vocab.reviewlog.v1  [{ cardId, rating, at, prevInterval, nextInterval }]
 * ========================================================================== */
(function (global) {
  'use strict';

  var KEYS = {
    decks: 'vocab.decks.v1',
    cards: 'vocab.cards.v1',
    settings: 'vocab.settings.v1',
    reviewlog: 'vocab.reviewlog.v1'
  };

  var DAY_MS = 24 * 60 * 60 * 1000;
  var RATINGS = ['again', 'hard', 'good', 'easy'];
  var RATING_LABELS = { again: '忘记', hard: '模糊', good: '记得', easy: '简单' };
  var EASE_START = 2.5;
  var EASE_MIN = 1.3;
  var EASE_MAX = 3.0;
  var MAX_INTERVAL = 3650; // 天，避免异常数据把间隔撑爆
  var MAX_FIELD = 500; // 单词 / 释义 / 例句 的字数上限
  var MAX_LOG = 5000; // 复习日志保留条数上限

  /* ------------------------------------------------------------ 存储适配层 */
  function describeError(error) {
    if (!error) return '未知错误';
    var name = error.name || 'Error';
    var message = error.message || String(error);
    if (name === 'QuotaExceededError' || /quota/i.test(message)) {
      return '本地存储空间不足（QuotaExceededError）';
    }
    return name + '：' + message;
  }

  var storage = {
    usable: true,
    lastError: null,
    read: function (key) {
      try {
        return global.localStorage.getItem(key);
      } catch (error) {
        this.usable = false;
        this.lastError = describeError(error);
        return null;
      }
    },
    write: function (key, value) {
      if (!this.usable) return false;
      try {
        global.localStorage.setItem(key, JSON.stringify(value));
        this.lastError = null;
        return true;
      } catch (error) {
        // 写入失败（如配额不足）：数据留在内存里，由界面提示用户重试
        this.usable = false;
        this.lastError = describeError(error);
        return false;
      }
    }
  };

  /** 当前存储状态，供界面展示持久化警告。 */
  function storageStatus() {
    return { usable: storage.usable, lastError: storage.lastError };
  }

  /** 「重试写入」：重新允许写入并探针一次，成功即恢复持久化。 */
  function retryStorage() {
    storage.usable = true;
    storage.lastError = null;
    try {
      global.localStorage.setItem('vocab.__probe__.v1', '1');
      global.localStorage.removeItem('vocab.__probe__.v1');
      return true;
    } catch (error) {
      storage.usable = false;
      storage.lastError = describeError(error);
      return false;
    }
  }

  /* --------------------------------------------------------------- 基础工具 */
  function newId() {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      try {
        return global.crypto.randomUUID();
      } catch (error) {
        /* 非安全上下文会抛错，走降级 */
      }
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function str(value) {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
  }

  function clean(value, max) {
    return str(value).trim().slice(0, max || MAX_FIELD);
  }

  function num(value, fallback) {
    return typeof value === 'number' && isFinite(value) ? value : fallback;
  }

  function startOfDay(ts) {
    var date = new Date(num(ts, Date.now()));
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  function todayStart() {
    return startOfDay(Date.now());
  }

  function endOfToday() {
    return todayStart() + DAY_MS - 1;
  }

  /* 展示用：相对天数（+2 = 2 天后，-1 = 逾期 1 天） */
  function dayDiff(from, to) {
    return Math.round((startOfDay(to) - startOfDay(from)) / DAY_MS);
  }

  function dueLabel(srs, now) {
    var ts = num(now, Date.now());
    if (num(srs.reps, 0) === 0) return '新卡';
    var diff = dayDiff(ts, srs.due);
    if (diff <= 0) return '今天到期';
    if (diff === 1) return '明天到期';
    if (diff < 30) return diff + ' 天后到期';
    return Math.round(diff / 30) + ' 个月后';
  }

  /* ------------------------------------------------------------- 数据规范化 */
  function normalizeDeck(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var name = clean(raw.name, 80);
    if (!name) return null;
    return {
      id: clean(raw.id, 64) || newId(),
      name: name,
      createdAt: num(raw.createdAt, Date.now())
    };
  }

  function normalizeSrs(raw) {
    var source = raw && typeof raw === 'object' ? raw : {};
    return {
      due: num(source.due, todayStart()),
      interval: Math.max(0, Math.min(MAX_INTERVAL, num(source.interval, 0))),
      ease: Math.max(EASE_MIN, Math.min(EASE_MAX, num(source.ease, EASE_START))),
      reps: Math.max(0, Math.round(num(source.reps, 0))),
      lapses: Math.max(0, Math.round(num(source.lapses, 0)))
    };
  }

  function normalizeCard(raw, validDeckIds) {
    if (!raw || typeof raw !== 'object') return null;
    var front = clean(raw.front);
    var deckId = clean(raw.deckId, 64);
    if (!front || !deckId) return null;
    if (validDeckIds && validDeckIds.indexOf(deckId) === -1) return null;
    var tags = Array.isArray(raw.tags)
      ? raw.tags.map(function (tag) {
          return clean(tag, 24);
        }).filter(Boolean).slice(0, 10)
      : [];
    return {
      id: clean(raw.id, 64) || newId(),
      deckId: deckId,
      front: front,
      back: clean(raw.back),
      example: clean(raw.example),
      tags: tags,
      srs: normalizeSrs(raw.srs),
      createdAt: num(raw.createdAt, Date.now())
    };
  }

  function normalizeLog(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var cardId = clean(raw.cardId, 64);
    if (!cardId) return null;
    return {
      cardId: cardId,
      rating: RATINGS.indexOf(raw.rating) !== -1 ? raw.rating : 'good',
      at: num(raw.at, Date.now()),
      prevInterval: Math.max(0, num(raw.prevInterval, 0)),
      nextInterval: Math.max(0, num(raw.nextInterval, 0))
    };
  }

  function normalizeSettings(raw) {
    var source = raw && typeof raw === 'object' ? raw : {};
    return {
      theme: source.theme === 'dark' || source.theme === 'light' ? source.theme : null,
      dailyNewLimit: Math.max(0, Math.min(500, Math.round(num(source.dailyNewLimit, 20)))),
      activeDeckId: clean(source.activeDeckId, 64) || null,
      autoSpeak: source.autoSpeak !== false
    };
  }

  /* ----------------------------------------------------------------- 读写 */
  function readArray(key) {
    var raw = storage.read(key);
    if (!raw) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      global.console.warn('[vocab] ' + key + ' 解析失败，已忽略。', error);
      return [];
    }
  }

  function readObject(key) {
    var raw = storage.read(key);
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      global.console.warn('[vocab] ' + key + ' 解析失败，已忽略。', error);
      return null;
    }
  }

  function write(key, value) {
    return storage.write(key, value);
  }

  function loadAll() {
    var decks = readArray(KEYS.decks).map(normalizeDeck).filter(Boolean);
    var deckIds = decks.map(function (deck) {
      return deck.id;
    });
    var cards = readArray(KEYS.cards)
      .map(function (raw) {
        return normalizeCard(raw, deckIds);
      })
      .filter(Boolean);
    var log = readArray(KEYS.reviewlog).map(normalizeLog).filter(Boolean);
    if (log.length > MAX_LOG) log = log.slice(-MAX_LOG);
    return {
      decks: decks,
      cards: cards,
      log: log,
      settings: normalizeSettings(readObject(KEYS.settings)),
      storageUsable: storage.usable
    };
  }

  /* ------------------------------------------------------------------ SM-2 */
  /**
   * 简化版 SM-2：四档评分 → 新的 srs 状态。
   *   again 忘记：间隔重置为 1 天、lapses+1、ease-0.2，到期日算“今天”，今天稍后再来
   *   hard  模糊：间隔 × 1.2
   *   good  记得：间隔 × ease
   *   easy  简单：间隔 × ease × 1.3，ease+0.15
   * ease 下限 1.3、上限 3.0；间隔至少 1 天。
   * 新卡（reps=0）没有历史间隔，按 1 天起步，评「简单」给 3 天。
   */
  function review(srs, rating, now) {
    var current = normalizeSrs(srs);
    var ts = num(now, Date.now());
    var interval;

    if (current.reps === 0) {
      interval = rating === 'easy' ? 3 : 1;
    } else if (rating === 'again') {
      interval = 1;
    } else if (rating === 'hard') {
      // 小间隔时 ×1.2 会原地踏步（2×1.2→2），保证 2 天及以上的卡至少前进 1 天；
      // 间隔 1 天是最小值，评「模糊」后仍为 1 天，即 due = 明天。
      interval = current.interval * 1.2;
      if (current.interval >= 2 && Math.round(interval) <= current.interval) {
        interval = current.interval + 1;
      }
    } else if (rating === 'easy') {
      interval = current.interval * current.ease * 1.3;
    } else {
      interval = current.interval * current.ease;
    }

    interval = Math.max(1, Math.min(MAX_INTERVAL, Math.round(interval)));

    var ease = current.ease;
    if (rating === 'again') ease = Math.max(EASE_MIN, ease - 0.2);
    else if (rating === 'easy') ease = Math.min(EASE_MAX, ease + 0.15);
    ease = Math.round(ease * 100) / 100;

    // 忘记 → 今天稍后再来；其余 → 今天 + interval 天
    var due = rating === 'again' ? startOfDay(ts) : startOfDay(ts) + interval * DAY_MS;

    return {
      due: due,
      interval: interval,
      ease: ease,
      reps: current.reps + 1,
      lapses: current.lapses + (rating === 'again' ? 1 : 0)
    };
  }

  function createSrs(now) {
    return { due: startOfDay(num(now, Date.now())), interval: 0, ease: EASE_START, reps: 0, lapses: 0 };
  }

  /* -------------------------------------------------------------- 批量导入 */
  /** 解析一行：支持逗号 / 中文逗号 / 制表符分隔，带引号字段可用 "" 转义。 */
  function splitLine(line) {
    var text = line;
    if (text.indexOf('\t') !== -1) {
      return text.split('\t');
    }
    var fields = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < text.length; i += 1) {
      var ch = text.charAt(i);
      if (inQuotes) {
        if (ch === '"') {
          if (text.charAt(i + 1) === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',' || ch === '，') {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    fields.push(current);
    return fields;
  }

  var HEADER_WORDS = /^(单词|word|front|term|英文)$/i;
  var HEADER_MEANINGS = /^(释义|意思|meaning|back|definition|中文)$/i;

  /**
   * 解析整段文本，每行「单词,释义[,例句[,标签]]」。
   * 也兼容「单词 - 释义」「单词 = 释义」以及制表符分隔（从 Excel 直接粘贴）。
   * 表头只认「首个非空行」，前面的空行/注释行不影响判断。
   * 返回 { items: [{front, back, example, tags}], invalid: 行数 }
   */
  function parseImportText(text) {
    var lines = str(text).split(/\r?\n/);
    var items = [];
    var invalid = 0;
    var seenContent = false;

    lines.forEach(function (line) {
      var raw = line.trim();
      if (!raw || raw.charAt(0) === '#') return;

      var isFirstContentLine = !seenContent;
      seenContent = true;

      var fields = splitLine(raw);
      if (fields.length === 1) {
        var parts = raw.split(/\s+[-–—=:：]\s+/);
        if (parts.length >= 2) fields = [parts[0], parts.slice(1).join(' - ')];
      }

      var front = clean(fields[0], MAX_FIELD);
      var back = clean(fields[1], MAX_FIELD);

      if (isFirstContentLine && HEADER_WORDS.test(front) && HEADER_MEANINGS.test(back)) return;

      if (!front || !back) {
        invalid += 1;
        return;
      }

      var tags = clean(fields[3], 200)
        .split(/[,，;；、\s]+/)
        .map(function (tag) {
          return tag.trim();
        })
        .filter(Boolean)
        .slice(0, 10);

      items.push({
        front: front,
        back: back,
        example: clean(fields[2], MAX_FIELD),
        tags: tags
      });
    });

    return { items: items, invalid: invalid };
  }

  /**
   * 把整段文本当作本应用导出的 JSON 备份解析（Q1）。
   * 认 { app: 'vocab-app', decks, cards, reviewlog } 结构，也接受裸卡片数组。
   * 不像导出数据时返回 null，交回按行的文本导入处理。
   */
  function parseJsonImport(text) {
    var raw = str(text).trim();
    if (raw.charAt(0) !== '{' && raw.charAt(0) !== '[') return null;

    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      return null;
    }

    if (Array.isArray(parsed)) {
      return { decks: [], cards: parsed, reviewlog: [] };
    }
    if (!parsed || typeof parsed !== 'object') return null;

    var looksLikeBackup =
      parsed.app === 'vocab-app' || Array.isArray(parsed.decks) || Array.isArray(parsed.cards);
    if (!looksLikeBackup) return null;

    return {
      decks: Array.isArray(parsed.decks) ? parsed.decks : [],
      cards: Array.isArray(parsed.cards) ? parsed.cards : [],
      reviewlog: Array.isArray(parsed.reviewlog) ? parsed.reviewlog : []
    };
  }

  /** 导出 JSON 文本（整库或单个卡组）。 */
  function buildExport(data, deckId) {
    var payload;
    if (deckId) {
      var deck = null;
      data.decks.forEach(function (item) {
        if (item.id === deckId) deck = item;
      });
      payload = {
        app: 'vocab-app',
        version: 1,
        exportedAt: new Date().toISOString(),
        decks: deck ? [deck] : [],
        cards: data.cards.filter(function (card) {
          return card.deckId === deckId;
        })
      };
    } else {
      payload = {
        app: 'vocab-app',
        version: 1,
        exportedAt: new Date().toISOString(),
        decks: data.decks,
        cards: data.cards,
        settings: data.settings,
        reviewlog: data.log
      };
    }
    return JSON.stringify(payload, null, 2);
  }

  global.VocabStore = {
    KEYS: KEYS,
    RATINGS: RATINGS,
    RATING_LABELS: RATING_LABELS,
    DAY_MS: DAY_MS,
    MAX_FIELD: MAX_FIELD,
    MAX_LOG: MAX_LOG,
    EASE_START: EASE_START,
    storageUsable: function () {
      return storage.usable;
    },
    storageStatus: storageStatus,
    retryStorage: retryStorage,
    loadAll: loadAll,
    save: write,
    readObject: readObject,
    createSrs: createSrs,
    createDeck: function (name, now) {
      return { id: newId(), name: clean(name, 80), createdAt: num(now, Date.now()) };
    },
    createCard: function (deckId, fields, now) {
      var ts = num(now, Date.now());
      return {
        id: newId(),
        deckId: clean(deckId, 64),
        front: clean(fields.front),
        back: clean(fields.back),
        example: clean(fields.example),
        tags: (fields.tags || []).map(function (tag) {
          return clean(tag, 24);
        }).filter(Boolean).slice(0, 10),
        srs: createSrs(ts),
        createdAt: ts
      };
    },
    normalizeCard: normalizeCard,
    normalizeDeck: normalizeDeck,
    normalizeLog: normalizeLog,
    review: review,
    dueLabel: dueLabel,
    startOfDay: startOfDay,
    todayStart: todayStart,
    endOfToday: endOfToday,
    dayDiff: dayDiff,
    parseImportText: parseImportText,
    parseJsonImport: parseJsonImport,
    buildExport: buildExport,
    newId: newId,
    clean: clean
  };
})(window);
