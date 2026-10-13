/* ==========================================================================
 * 单词卡片 —— 界面层（普通脚本，非 ES module）
 *
 * 视图：卡组列表 → 卡组详情 → 学习页 → 统计页，用 URL hash 路由切换。
 * 依赖 store.js 暴露的 window.VocabStore。
 * 所有用户内容一律用 textContent 写入，不使用 innerHTML。
 * ========================================================================== */
(function () {
  'use strict';

  var Store = window.VocabStore;
  var DAY_MS = Store.DAY_MS;
  var IMPORT_DECK_NAME = '导入的卡片';

  /* --------------------------------------------------------- 内置考研英语词库 */
  var KAOYAN_VOCAB_DATA = [
    {
      front: 'accommodate',
      back: 'vt. 容纳；提供住宿；顺应；顾及',
      example: 'The university built new facilities to accommodate the growing number of graduate students.',
      tags: ['考研高频', '核心阅读']
    },
    {
      front: 'arbitrary',
      back: 'adj. 武断的；专制的；任意的',
      example: 'An arbitrary decision made without empirical data often leads to organizational failure.',
      tags: ['考研高频', '逻辑关联']
    },
    {
      front: 'coherent',
      back: 'adj. 连贯的；一致的；条理清楚的',
      example: 'A coherent argumentative essay requires clear logic and convincing textual evidence.',
      tags: ['考研写作', '核心词汇']
    },
    {
      front: 'comprehensive',
      back: 'adj. 全面的；综合的；广泛的',
      example: 'Scholars conducted a comprehensive analysis of global economic transformations.',
      tags: ['考研高频', '学术阅读']
    },
    {
      front: 'controversial',
      back: 'adj. 有争议的；引发争论的',
      example: 'The commercialization of genetic research remains a deeply controversial topic.',
      tags: ['考研高频', '社会焦点']
    },
    {
      front: 'diminish',
      back: 'v. 减少；缩小；削弱',
      example: 'Rapid inflation will inevitably diminish the purchasing power of middle-class families.',
      tags: ['考研高频', '经济社会']
    },
    {
      front: 'distort',
      back: 'vt. 扭曲；曲解；变形',
      example: 'Certain sensational media outlets distort statistical data to attract readership.',
      tags: ['考研高频', '真题常考']
    },
    {
      front: 'eligible',
      back: 'adj. 有资格的；合格的',
      example: 'Only postgraduates who pass the qualification exam are eligible for doctoral research.',
      tags: ['考研高频', '政策规定']
    },
    {
      front: 'eliminate',
      back: 'vt. 消除；排除；淘汰',
      example: 'Strict quality control helped the laboratory eliminate systematic experimental errors.',
      tags: ['考研高频', '科学探索']
    },
    {
      front: 'enhance',
      back: 'vt. 提高；增强；增加',
      example: 'Continuous professional training will enhance your analytical competence.',
      tags: ['考研高频', '真题词汇']
    },
    {
      front: 'evaluate',
      back: 'vt. 评估；评价；估价',
      example: 'Professors were asked to evaluate the practical impact of the proposed project.',
      tags: ['考研高频', '学术规范']
    },
    {
      front: 'explicit',
      back: 'adj. 明确的；清晰的；直率的',
      example: 'The mentor gave explicit instructions on academic integrity and citation rules.',
      tags: ['考研高频', '核心词汇']
    },
    {
      front: 'fluctuate',
      back: 'vi. 波动；起伏；动摇',
      example: 'Exchange rates fluctuate unpredictably according to shifting geopolitical dynamics.',
      tags: ['考研高频', '图表分析']
    },
    {
      front: 'inevitable',
      back: 'adj. 不可避免的；必然的',
      example: 'Market restructuring is an inevitable phase in long-term economic development.',
      tags: ['考研高频', '哲理分析']
    },
    {
      front: 'indispensable',
      back: 'adj. 不可或缺的；绝对必需的',
      example: 'Rigorous peer review is indispensable to maintaining the credibility of scientific journals.',
      tags: ['考研高频', '写作核心']
    },
    {
      front: 'innovative',
      back: 'adj. 创新的；革新的',
      example: 'The institution adopted innovative pedagogical models to engage modern students.',
      tags: ['考研高频', '科技人文']
    },
    {
      front: 'legislation',
      back: 'n. 立法；法规；法律',
      example: 'Parliament passed environmental legislation to penalize heavy carbon polluters.',
      tags: ['考研高频', '法律政策']
    },
    {
      front: 'manipulate',
      back: 'vt. 操纵；熟练操作；操纵市场',
      example: 'Sophisticated marketing algorithms can manipulate consumer purchasing habits.',
      tags: ['考研高频', '信息科技']
    },
    {
      front: 'perspective',
      back: 'n. 视角；观点；洞察力',
      example: 'Comparing multiple historical documents provides a more objective perspective.',
      tags: ['考研高频', '阅读理解']
    },
    {
      front: 'phenomenon',
      back: 'n. 现象；非凡之人或事',
      example: 'Rapid urbanization has become a defining phenomenon of the 21st century.',
      tags: ['考研高频', '真题必备']
    },
    {
      front: 'preliminary',
      back: 'adj. 初步的；预备的 n. 准备工作',
      example: 'Preliminary clinical trials indicated significant improvement in patient recovery.',
      tags: ['考研高频', '科研论文']
    },
    {
      front: 'prevalent',
      back: 'adj. 流行的；普遍存在的',
      example: 'Digital fatigue has become increasingly prevalent among remote knowledge workers.',
      tags: ['考研高频', '社会生活']
    },
    {
      front: 'prospect',
      back: 'n. 前景；希望；展望',
      example: 'Investing in renewable infrastructure improves the long-term economic prospect of the region.',
      tags: ['考研高频', '经济发展']
    },
    {
      front: 'reluctant',
      back: 'adj. 不情愿的；勉强的',
      example: 'Traditional manufacturers were reluctant to transition into automated production lines.',
      tags: ['考研高频', '心理态度']
    },
    {
      front: 'scrutiny',
      back: 'n. 仔细审视；严格审查',
      example: 'Big data algorithms are now subject to rigorous ethical and legal scrutiny.',
      tags: ['考研难词', '真题焦点']
    },
    {
      front: 'subsequent',
      back: 'adj. 随后的；后来的',
      example: 'Subsequent investigations verified that the safety protocol had been breached.',
      tags: ['考研高频', '逻辑衔接']
    },
    {
      front: 'substitute',
      back: 'v. 代替；取代 n. 替代品',
      example: 'Artificial intelligence cannot completely substitute for human empathy and moral reasoning.',
      tags: ['考研高频', '观点论述']
    },
    {
      front: 'sustainable',
      back: 'adj. 可持续的；能承受的',
      example: 'Developing green transit networks is key to building sustainable metropolitan centers.',
      tags: ['考研高频', '热点考词']
    },
    {
      front: 'undermine',
      back: 'vt. 逐渐削弱；从暗中破坏',
      example: 'Unchecked misinformation can undermine public trust in democratic mechanisms.',
      tags: ['考研高频', '高频难词']
    },
    {
      front: 'vulnerable',
      back: 'adj. 脆弱的；易受伤害的',
      example: 'Developing supply chains remain vulnerable to sudden global transportation disruptions.',
      tags: ['考研高频', '真题考点']
    },
    {
      front: 'paradox',
      back: 'n. 悖论；矛盾的人或事',
      example: 'The digital era presents a paradox: unprecedented connectivity alongside increasing isolation.',
      tags: ['考研难词', '思辨阅读']
    },
    {
      front: 'plausible',
      back: 'adj. 貌似合理的；看似可信的',
      example: 'The detective proposed a plausible hypothesis that accounted for all the forensic clues.',
      tags: ['考研高频', '真题常考']
    },
    {
      front: 'consensus',
      back: 'n. 共识；一致意见',
      example: 'Scientific consensus confirms that global temperatures are rising at an alarming rate.',
      tags: ['考研高频', '学术观点']
    },
    {
      front: 'deteriorate',
      back: 'v. 恶化；退化；变质',
      example: 'Air quality in industrial zones will continue to deteriorate without stringent intervention.',
      tags: ['考研高频', '生态环境']
    },
    {
      front: 'accumulate',
      back: 'v. 积累；积聚；堆积',
      example: 'Students need to accumulate comprehensive empirical evidence before writing the thesis.',
      tags: ['考研高频', '高分写作']
    },
    {
      front: 'pragmatic',
      back: 'adj. 务实的；实用主义的',
      example: 'Policymakers adopted a pragmatic framework to address structural unemployment.',
      tags: ['考研高频', '学术观点']
    }
  ];

  /* ------------------------------------------------------------------ 状态 */
  var state = {
    decks: [],
    cards: [],
    log: [],
    settings: { theme: 'light', dailyNewLimit: 20, activeDeckId: null, autoSpeak: true },
    route: { name: 'decks', deckId: null },
    ui: {
      search: '',
      cardFormOpen: false,
      editingCardId: null,
      editingDeckId: null,
      confirmDeleteDeckId: null,
      importOpen: false,
      importText: '',
      backupOpen: false
    },
    study: null,
    toastTimer: null,
    undoHandler: null
  };

  var dom = {};

  /* -------------------------------------------------------------- DOM 工具 */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function actionButton(label, action, data, className) {
    var button = el('button', className || 'btn btn--small', label);
    button.type = 'button';
    button.dataset.action = action;
    if (data) {
      Object.keys(data).forEach(function (key) {
        button.dataset[key] = data[key];
      });
    }
    return button;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function mount(node) {
    clear(dom.view);
    dom.view.appendChild(node);
    dom.view.classList.remove('view-enter');
    void dom.view.offsetWidth;
    dom.view.classList.add('view-enter');
  }

  function launchConfetti() {
    var canvas = document.getElementById('confetti-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width = (canvas.width = window.innerWidth);
    var height = (canvas.height = window.innerHeight);

    var colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];
    var particles = [];
    var count = 70;

    for (var i = 0; i < count; i += 1) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 160,
        y: height * 0.45 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14 - 3,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    var start = Date.now();
    var duration = 2600;

    function frame() {
      var elapsed = Date.now() - start;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      var fade = elapsed > duration - 800 ? (duration - elapsed) / 800 : 1;

      for (var i = 0; i < particles.length; i += 1) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.vx *= 0.985;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity * fade);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /** 渲染后聚焦某个输入框（用于重命名 / 新建卡片的键盘连续性）。 */
  function focusInput(selector) {
    var target = dom.view.querySelector(selector);
    if (target && typeof target.focus === 'function') {
      target.focus();
      if (typeof target.select === 'function') target.select();
    }
  }

  function findDeck(id) {
    for (var i = 0; i < state.decks.length; i += 1) {
      if (state.decks[i].id === id) return state.decks[i];
    }
    return null;
  }

  function findCard(id) {
    for (var i = 0; i < state.cards.length; i += 1) {
      if (state.cards[i].id === id) return state.cards[i];
    }
    return null;
  }

  function cardIndex(id) {
    for (var i = 0; i < state.cards.length; i += 1) {
      if (state.cards[i].id === id) return i;
    }
    return -1;
  }

  function fmtDate(ts) {
    var date = new Date(ts);
    return date.getMonth() + 1 + '月' + date.getDate() + '日';
  }

  function fmtShortDate(ts) {
    var date = new Date(ts);
    return date.getMonth() + 1 + '/' + date.getDate();
  }

  /* --------------------------------------------------------------- 持久化 */
  function saveDecks() {
    return save(Store.KEYS.decks, state.decks);
  }
  function saveCards() {
    return save(Store.KEYS.cards, state.cards);
  }
  function saveLog() {
    return save(Store.KEYS.reviewlog, state.log);
  }
  function saveSettings() {
    return save(Store.KEYS.settings, state.settings);
  }

  /** 写盘失败时立刻把持久化警告条亮出来，不再让用户以为存上了。 */
  function save(key, value) {
    var ok = Store.save(key, value);
    if (!ok) updateStorageWarning();
    return ok;
  }

  function updateStorageWarning() {
    if (!dom.storageWarning) return;
    var status = Store.storageStatus();
    if (status.usable) {
      dom.storageWarning.hidden = true;
      dom.storageWarningText.textContent = '';
      return;
    }
    dom.storageWarning.hidden = false;
    dom.storageWarningText.textContent =
      '⚠ 本地存储写入失败（' + (status.lastError || '未知原因') + '）：当前改动只保留在内存中，刷新页面会丢失。请清理浏览器存储后点「重试写入」。';
  }

  /** 成功提示：写盘失败时明确说明没有存上。 */
  function notifySaved(message) {
    if (Store.storageStatus().usable) {
      showToast(message);
      return;
    }
    updateStorageWarning();
    showToast(message + '，但本地存储写入失败，数据只在当前页面', null, 7000);
  }

  /* ----------------------------------------------------------- 派生数据 */
  /** 今天已经引入的新卡数量（按复习日志统计，prevInterval === 0 即首次复习）。 */
  function countNewToday() {
    var from = Store.todayStart();
    var to = Store.endOfToday();
    return state.log.filter(function (entry) {
      return entry.at >= from && entry.at <= to && entry.prevInterval === 0;
    }).length;
  }

  /**
   * 今日学习队列：到期的复习卡（due ≤ 今天，按 due 升序）+ 新卡
   * （受每日新卡上限约束，按加入顺序）。参数 deckId 为 'all' 时跨卡组。
   */
  function buildQueue(deckId) {
    var eod = Store.endOfToday();
    var isAll = !deckId || deckId === 'all';
    var pool = state.cards.filter(function (card) {
      return isAll || card.deckId === deckId;
    });
    var reviews = pool
      .filter(function (card) {
        return card.srs.reps > 0 && card.srs.due <= eod;
      })
      .sort(function (a, b) {
        return a.srs.due - b.srs.due;
      });
    var fresh = pool.filter(function (card) {
      return card.srs.reps === 0;
    });
    var quota = Math.max(0, state.settings.dailyNewLimit - countNewToday());
    var selected = fresh.slice(0, quota);
    return reviews.concat(selected).map(function (card) {
      return card.id;
    });
  }

  /**
   * 巩固复习队列：即使今日计划已学完，也允许随时复习已学卡片。
   * 优先排列已学过的卡片（按下次到期时间 due 升序，先巩固近期或薄弱单词），未学卡片随后。
   */
  function buildFreeQueue(deckId) {
    var isAll = !deckId || deckId === 'all';
    var pool = state.cards.filter(function (card) {
      return isAll || card.deckId === deckId;
    });
    var learned = pool
      .filter(function (card) {
        return card.srs.reps > 0;
      })
      .sort(function (a, b) {
        return (a.srs.due || 0) - (b.srs.due || 0);
      });
    var unlearned = pool.filter(function (card) {
      return card.srs.reps === 0;
    });
    return learned.concat(unlearned).map(function (card) {
      return card.id;
    });
  }

  function pendingUniqueCount(queue) {
    var seen = {};
    var count = 0;
    queue.forEach(function (id) {
      if (!seen[id]) {
        seen[id] = true;
        count += 1;
      }
    });
    return count;
  }

  function computeStreak() {
    var days = {};
    state.log.forEach(function (entry) {
      days[Store.startOfDay(entry.at)] = true;
    });
    var cursor = Store.todayStart();
    if (!days[cursor]) cursor -= DAY_MS; // 今天还没复习时从昨天往前算
    var streak = 0;
    while (days[cursor]) {
      streak += 1;
      cursor -= DAY_MS;
    }
    return streak;
  }

  /* ------------------------------------------------------------------ 路由 */
  function parseHash() {
    var raw = String(location.hash || '').replace(/^#\/?/, '');
    var parts = raw.split('/').filter(Boolean);
    if (parts[0] === 'deck' && parts[1]) {
      return { name: 'deck', deckId: decodeURIComponent(parts[1]) };
    }
    if (parts[0] === 'study') {
      return { name: 'study', deckId: parts[1] ? decodeURIComponent(parts[1]) : 'all' };
    }
    if (parts[0] === 'stats') return { name: 'stats', deckId: null };
    return { name: 'decks', deckId: null };
  }

  function navigate(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function updateNav() {
    var links = document.querySelectorAll('[data-nav]');
    Array.prototype.forEach.call(links, function (link) {
      var isActive =
        (link.dataset.nav === 'decks' && (state.route.name === 'decks' || state.route.name === 'deck')) ||
        (link.dataset.nav === 'stats' && state.route.name === 'stats');
      link.classList.toggle('is-active', !!isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function render() {
    state.route = parseHash();
    updateNav();
    updateStorageWarning();

    var title = '单词卡片';
    if (state.route.name === 'deck') {
      var deck = findDeck(state.route.deckId);
      title = (deck ? deck.name : '卡组') + ' · 单词卡片';
      renderDeckView();
    } else if (state.route.name === 'study') {
      title = '学习 · 单词卡片';
      renderStudyView();
    } else if (state.route.name === 'stats') {
      title = '统计 · 单词卡片';
      renderStatsView();
    } else {
      renderDecksView();
    }
    document.title = title;
  }

  /* ------------------------------------------------------------ 卡组列表页 */
  function buildDeckForm() {
    var panel = el('section', 'panel');
    panel.appendChild(el('h2', 'panel__title', '新建卡组'));

    var form = el('form', 'form-grid');
    form.dataset.action = 'deck-create';

    var field = el('div', 'field');
    var label = el('label', 'field__label', '卡组名称');
    label.setAttribute('for', 'deck-name');
    field.appendChild(label);
    var input = el('input', 'input');
    input.type = 'text';
    input.id = 'deck-name';
    input.name = 'name';
    input.maxLength = 80;
    input.placeholder = '例如：四级核心词';
    input.autocomplete = 'off';
    field.appendChild(input);
    form.appendChild(field);

    var actions = el('div', 'form-actions');
    var submit = el('button', 'btn btn--primary', '创建卡组');
    submit.type = 'submit';
    actions.appendChild(submit);
    var error = el('p', 'form-error');
    error.dataset.formError = 'true';
    actions.appendChild(error);
    form.appendChild(actions);

    panel.appendChild(form);
    return panel;
  }

  function buildSettingsPanel() {
    var panel = el('section', 'panel');
    panel.appendChild(el('h2', 'panel__title', '学习设置'));

    var row = el('div', 'row');
    var field = el('div', 'field');
    var label = el('label', 'field__label', '每日新卡上限');
    label.setAttribute('for', 'new-limit');
    field.appendChild(label);
    var input = el('input', 'input');
    input.type = 'number';
    input.id = 'new-limit';
    input.min = '0';
    input.max = '500';
    input.step = '1';
    input.value = String(state.settings.dailyNewLimit);
    input.dataset.role = 'new-limit';
    input.setAttribute('aria-describedby', 'new-limit-hint');
    field.appendChild(input);
    var hint = el('p', 'hint', '每天最多引入多少张新卡，复习卡不受限制。');
    hint.id = 'new-limit-hint';
    field.appendChild(hint);
    var autoSpeakField = el('div', 'field');
    var autoSpeakLabel = el('label', 'field__label', '单词发音自动播放');
    autoSpeakField.appendChild(autoSpeakLabel);
    var isAuto = state.settings.autoSpeak !== false;
    var autoBtn = actionButton(
      isAuto ? '自动朗读：已开启' : '自动朗读：已关闭',
      'toggle-auto-speak',
      null,
      'btn btn--small' + (isAuto ? ' btn--primary' : '')
    );
    autoSpeakField.appendChild(autoBtn);
    var autoHint = el('p', 'hint', '每次切换到下一个新单词时自动播放英语发音。');
    autoSpeakField.appendChild(autoHint);
    row.appendChild(autoSpeakField);

    panel.appendChild(row);

    if (!Store.storageUsable()) {
      updateStorageWarning();
    }

    var actions = el('div', 'form-actions');
    actions.appendChild(actionButton('导入内置考研英语词库', 'import-builtin-kaoyan', null, 'btn btn--small btn--primary'));
    actions.appendChild(actionButton('导出全部数据 JSON', 'export-all', null, 'btn btn--small'));
    actions.appendChild(
      actionButton(state.ui.backupOpen ? '收起导入' : '导入 JSON 备份', 'backup-open', null, 'btn btn--small')
    );
    panel.appendChild(actions);
    return panel;
  }

  function buildDeckItem(deck) {
    var item = el('li', 'deck');

    if (state.ui.editingDeckId === deck.id) {
      var form = el('form', 'form-grid');
      form.dataset.action = 'deck-rename-save';
      form.dataset.id = deck.id;
      var field = el('div', 'field');
      var label = el('label', 'field__label', '重命名卡组');
      label.setAttribute('for', 'rename-' + deck.id);
      field.appendChild(label);
      var input = el('input', 'input');
      input.type = 'text';
      input.id = 'rename-' + deck.id;
      input.name = 'name';
      input.maxLength = 80;
      input.value = deck.name;
      field.appendChild(input);
      form.appendChild(field);
      var actions = el('div', 'form-actions');
      var save = el('button', 'btn btn--primary btn--small', '保存');
      save.type = 'submit';
      actions.appendChild(save);
      actions.appendChild(actionButton('取消', 'deck-rename-cancel', null, 'btn btn--small'));
      var error = el('p', 'form-error');
      error.dataset.formError = 'true';
      actions.appendChild(error);
      form.appendChild(actions);
      item.appendChild(form);
      return item;
    }

    if (state.ui.confirmDeleteDeckId === deck.id) {
      var count = state.cards.filter(function (card) {
        return card.deckId === deck.id;
      }).length;
      var box = el('div', 'deck__main');
      box.appendChild(el('p', 'deck__name', '删除卡组「' + deck.name + '」？'));
      box.appendChild(el('p', 'deck__meta', '该卡组下的 ' + count + ' 张卡片会一起删除，无法撤销。'));
      item.appendChild(box);
      var confirmActions = el('div', 'deck__actions');
      confirmActions.appendChild(actionButton('确认删除', 'deck-delete-confirm', { id: deck.id }, 'btn btn--small btn--danger'));
      confirmActions.appendChild(actionButton('取消', 'deck-delete-cancel', null, 'btn btn--small'));
      item.appendChild(confirmActions);
      return item;
    }

    var queueSize = buildQueue(deck.id).length;
    var totalDeckCards = countCards(deck.id);
    var main = el('div', 'deck__main');
    main.appendChild(el('h3', 'deck__name', deck.name));
    var meta =
      totalDeckCards +
      ' 张卡片 · ' +
      (queueSize > 0 ? '今日待学 ' + queueSize + ' 张' : '今日已学完（随时可巩固）') +
      ' · 创建于 ' +
      fmtDate(deck.createdAt);
    if (state.settings.activeDeckId === deck.id) meta += ' · 上次学习';
    main.appendChild(el('p', 'deck__meta', meta));
    item.appendChild(main);

    var actions2 = el('div', 'deck__actions');
    var studyLabel = queueSize > 0 ? '开始学习' : '巩固复习';
    var studyAction = queueSize > 0 ? 'study' : 'study-free';
    var study = actionButton(studyLabel, studyAction, { id: deck.id }, 'btn btn--small btn--primary');
    study.disabled = totalDeckCards === 0;
    actions2.appendChild(study);
    actions2.appendChild(actionButton('打开', 'open-deck', { id: deck.id }, 'btn btn--small'));
    actions2.appendChild(actionButton('重命名', 'deck-rename', { id: deck.id }, 'btn btn--small'));
    actions2.appendChild(actionButton('删除', 'deck-delete', { id: deck.id }, 'btn btn--small btn--danger'));
    item.appendChild(actions2);
    return item;
  }

  function countCards(deckId) {
    return state.cards.filter(function (card) {
      return card.deckId === deckId;
    }).length;
  }

  function renderDecksView() {
    var fragment = document.createDocumentFragment();

    var queueAll = buildQueue('all');
    var totalCardsAll = state.cards.length;
    var overview = el('section', 'panel');
    var row = el('div', 'overview');
    var textBox = el('div');
    if (queueAll.length > 0) {
      textBox.appendChild(el('p', 'overview__text', '今日待复习 ' + queueAll.length + ' 张'));
      textBox.appendChild(
        el(
          'p',
          'overview__hint',
          state.decks.length + ' 个卡组 · ' + totalCardsAll + ' 张卡片 · 每日新卡上限 ' + state.settings.dailyNewLimit + ' 张'
        )
      );
    } else {
      textBox.appendChild(el('p', 'overview__text', '今日计划已学完 · 随时可自由巩固'));
      textBox.appendChild(
        el(
          'p',
          'overview__hint',
          state.decks.length + ' 个卡组 · ' + totalCardsAll + ' 张卡片 · 点击「复习已学卡片」可重温卡组'
        )
      );
    }
    row.appendChild(textBox);
    var startAllLabel = queueAll.length > 0 ? '开始今日学习' : '复习已学卡片';
    var startAllAction = queueAll.length > 0 ? 'study' : 'study-free';
    var startAll = actionButton(startAllLabel, startAllAction, { id: 'all' }, 'btn btn--primary');
    startAll.disabled = totalCardsAll === 0;
    row.appendChild(startAll);
    overview.appendChild(row);
    fragment.appendChild(overview);

    fragment.appendChild(buildDeckForm());
    fragment.appendChild(buildSettingsPanel());
    if (state.ui.backupOpen) {
      fragment.appendChild(buildImportPanel(null));
    }

    var listPanel = el('section', 'panel');
    listPanel.appendChild(el('h2', 'panel__title', '卡组'));
    if (state.decks.length === 0) {
      var emptyBox = el('div', 'empty');
      emptyBox.appendChild(el('p', null, '还没有卡组，先新建一个，或直接加载内置考研核心词汇：'));
      emptyBox.appendChild(actionButton('加载「考研英语核心词汇」卡组', 'import-builtin-kaoyan', null, 'btn btn--primary btn--small'));
      listPanel.appendChild(emptyBox);
    } else {
      var list = el('ul', 'deck-list');
      state.decks
        .slice()
        .reverse()
        .forEach(function (deck, index) {
          var item = buildDeckItem(deck);
          item.style.setProperty('--i', String(index));
          list.appendChild(item);
        });
      listPanel.appendChild(list);
    }
    fragment.appendChild(listPanel);

    mount(fragment);
  }

  /* ------------------------------------------------------------ 卡组详情页 */
  function buildCardForm(deckId, editingCard) {
    var panel = el('section', 'panel');
    panel.appendChild(el('h2', 'panel__title', editingCard ? '编辑卡片' : '新建卡片'));

    var form = el('form', 'form-grid');
    form.dataset.action = 'card-save';
    form.dataset.deck = deckId;

    var fields = [
      { name: 'front', label: '单词 / 正面', placeholder: 'apple', required: true, full: false },
      { name: 'back', label: '释义 / 背面', placeholder: 'n. 苹果', required: true, full: false },
      { name: 'example', label: '例句（可选）', placeholder: 'I ate an apple.', full: true },
      { name: 'tags', label: '标签（可选，逗号分隔）', placeholder: '水果, 日常', full: true }
    ];

    fields.forEach(function (config) {
      var field = el('div', 'field' + (config.full ? ' field--full' : ''));
      var label = el('label', 'field__label', config.label);
      var id = 'card-' + config.name;
      label.setAttribute('for', id);
      field.appendChild(label);
      var input = el('input', 'input');
      input.type = 'text';
      input.id = id;
      input.name = config.name;
      input.maxLength = config.name === 'tags' ? 200 : Store.MAX_FIELD;
      input.placeholder = config.placeholder || '';
      input.autocomplete = 'off';
      if (config.name === 'tags') {
        input.value = editingCard ? editingCard.tags.join(', ') : '';
      } else if (editingCard) {
        input.value = editingCard[config.name] || '';
      }
      field.appendChild(input);
      form.appendChild(field);
    });

    var actions = el('div', 'form-actions');
    var submit = el('button', 'btn btn--primary', editingCard ? '保存修改' : '添加卡片');
    submit.type = 'submit';
    actions.appendChild(submit);
    actions.appendChild(actionButton('取消', 'card-cancel', null, 'btn btn--small'));
    var error = el('p', 'form-error');
    error.dataset.formError = 'true';
    actions.appendChild(error);
    form.appendChild(actions);

    panel.appendChild(form);
    return panel;
  }

  function buildImportPanel(deckId) {
    var panel = el('section', 'panel');
    panel.appendChild(el('h2', 'panel__title', deckId ? '批量导入' : '导入 JSON 备份'));

    if (deckId) {
      panel.appendChild(
        el('p', 'hint', '每行一条，格式「单词,释义,例句(可选),标签(可选)」。也支持制表符（从 Excel 直接粘贴）和「单词 - 释义」。')
      );
    } else {
      panel.appendChild(
        el('p', 'hint', '粘贴之前「导出全部数据 JSON」得到的整份文件内容即可恢复卡组、卡片与复习进度。若粘贴的是按行的单词表，会自动建一个「导入的卡片」卡组。')
      );
    }

    var form = el('form');
    form.dataset.action = 'import-run';
    if (deckId) form.dataset.deck = deckId;

    var field = el('div', 'field');
    var label = el('label', 'field__label', deckId ? '粘贴要导入的内容' : '粘贴 JSON 备份内容');
    label.setAttribute('for', 'import-text');
    field.appendChild(label);
    var textarea = el('textarea', 'textarea');
    textarea.id = 'import-text';
    textarea.name = 'importText';
    textarea.value = state.ui.importText || '';
    textarea.dataset.role = 'import-text';
    textarea.placeholder = deckId
      ? 'apple,n. 苹果\nbanana,n. 香蕉,I like bananas.'
      : '{"app":"vocab-app","version":1,"decks":[…],"cards":[…]}';
    textarea.setAttribute('aria-describedby', 'import-hint');
    field.appendChild(textarea);
    var hint = el('p', 'hint', deckId ? '重复的单词会自动跳过。' : 'JSON 备份按 id 合并：同 id 的卡片以备份为准，但会保留进度更晚的那份复习状态。');
    hint.id = 'import-hint';
    field.appendChild(hint);
    form.appendChild(field);

    var actions = el('div', 'form-actions');
    var submit = el('button', 'btn btn--primary', '开始导入');
    submit.type = 'submit';
    actions.appendChild(submit);
    actions.appendChild(actionButton('取消', 'import-cancel', null, 'btn btn--small'));
    form.appendChild(actions);
    panel.appendChild(form);
    return panel;
  }

  function renderDeckView() {
    var deck = findDeck(state.route.deckId);
    if (!deck) {
      var missing = el('section', 'panel');
      missing.appendChild(el('p', 'empty', '找不到这个卡组，可能已被删除。'));
      var back = el('div', 'form-actions');
      back.appendChild(actionButton('返回卡组列表', 'go-decks', null, 'btn btn--primary'));
      missing.appendChild(back);
      mount(missing);
      return;
    }

    var fragment = document.createDocumentFragment();

    var head = el('section', 'panel');
    var backRow = el('div', 'row');
    var backLink = el('a', 'btn btn--small', '← 卡组列表');
    backLink.href = '#/decks';
    backRow.appendChild(backLink);
    head.appendChild(backRow);

    var head2 = el('div', 'panel__head');
    var titleBox = el('div');
    titleBox.appendChild(el('h2', 'panel__title', deck.name));
    var dueCount = buildQueue(deck.id).length;
    var totalDeckCount = countCards(deck.id);
    var dueText = dueCount > 0 ? ('今日待学 ' + dueCount + ' 张') : '今日已学完（随时可巩固）';
    titleBox.appendChild(
      el('p', 'deck__meta', totalDeckCount + ' 张卡片 · ' + dueText + ' · 已学 ' + learnedCount(deck.id) + ' 张')
    );
    head2.appendChild(titleBox);
    var actions = el('div', 'deck__actions');
    var studyBtnLabel = dueCount > 0 ? '开始学习' : '巩固复习';
    var studyBtnAction = dueCount > 0 ? 'study' : 'study-free';
    var studyBtn = actionButton(studyBtnLabel, studyBtnAction, { id: deck.id }, 'btn btn--small btn--primary');
    studyBtn.disabled = totalDeckCount === 0;
    actions.appendChild(studyBtn);
    actions.appendChild(actionButton(state.ui.cardFormOpen && !state.ui.editingCardId ? '收起新建' : '新建卡片', 'card-new', null, 'btn btn--small'));
    actions.appendChild(actionButton(state.ui.importOpen ? '收起导入' : '批量导入', 'import-open', null, 'btn btn--small'));
    actions.appendChild(actionButton('导出 JSON', 'export-deck', { id: deck.id }, 'btn btn--small'));
    actions.appendChild(actionButton('重命名', 'deck-rename', { id: deck.id }, 'btn btn--small'));
    actions.appendChild(actionButton('删除', 'deck-delete', { id: deck.id }, 'btn btn--small btn--danger'));
    head2.appendChild(actions);
    head.appendChild(head2);

    if (state.ui.confirmDeleteDeckId === deck.id) {
      var confirmBox = el('div', 'deck');
      var box = el('div', 'deck__main');
      box.appendChild(el('p', 'deck__name', '确认删除卡组「' + deck.name + '」？'));
      box.appendChild(el('p', 'deck__meta', countCards(deck.id) + ' 张卡片会一起删除，无法撤销。'));
      confirmBox.appendChild(box);
      var confirmActions = el('div', 'deck__actions');
      confirmActions.appendChild(actionButton('确认删除', 'deck-delete-confirm', { id: deck.id }, 'btn btn--small btn--danger'));
      confirmActions.appendChild(actionButton('取消', 'deck-delete-cancel', null, 'btn btn--small'));
      confirmBox.appendChild(confirmActions);
      head.appendChild(confirmBox);
    }
    fragment.appendChild(head);

    if (state.ui.cardFormOpen) {
      fragment.appendChild(buildCardForm(deck.id, state.ui.editingCardId ? findCard(state.ui.editingCardId) : null));
    }

    if (state.ui.importOpen) {
      fragment.appendChild(buildImportPanel(deck.id));
    }

    var listPanel = el('section', 'panel');
    var searchBar = el('div', 'search-bar');
    var searchLabel = el('label', 'sr-only', '搜索卡片');
    searchLabel.setAttribute('for', 'card-search');
    searchBar.appendChild(searchLabel);
    var searchInput = el('input', 'input');
    searchInput.type = 'search';
    searchInput.id = 'card-search';
    searchInput.placeholder = '搜索单词、释义、例句或标签';
    searchInput.value = state.ui.search;
    searchInput.dataset.role = 'search';
    searchBar.appendChild(searchInput);
    listPanel.appendChild(searchBar);

    var host = el('div');
    host.id = 'card-list-host';
    listPanel.appendChild(host);
    fragment.appendChild(listPanel);

    mount(fragment);
    dom.cardListHost = document.getElementById('card-list-host');
    renderCardList();
  }

  function learnedCount(deckId) {
    return state.cards.filter(function (card) {
      return card.deckId === deckId && card.srs.reps > 0;
    }).length;
  }

  function matchesSearch(card, query) {
    if (!query) return true;
    var haystack = (card.front + ' ' + card.back + ' ' + card.example + ' ' + card.tags.join(' ')).toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function renderCardList() {
    var host = dom.cardListHost;
    if (!host) return;
    clear(host);

    var deckId = state.route.deckId;
    var query = state.ui.search.trim().toLowerCase();
    var cards = state.cards
      .filter(function (card) {
        return card.deckId === deckId;
      })
      .reverse()
      .filter(function (card) {
        return matchesSearch(card, query);
      });

    if (cards.length === 0) {
      host.appendChild(
        el('p', 'empty', query ? '没有匹配的卡片。' : '这个卡组还没有卡片，先添加一张吧。')
      );
      return;
    }

    var list = el('ul', 'card-list');
    cards.forEach(function (card, index) {
      var item = buildCardItem(card);
      item.style.setProperty('--i', String(index));
      list.appendChild(item);
    });
    host.appendChild(list);
  }

  function buildCardItem(card) {
    var item = el('li', 'card-item');

    var main = el('div', 'card-item__main');
    main.appendChild(el('p', 'card-item__front', card.front));
    main.appendChild(el('p', 'card-item__back', card.back));
    if (card.example) main.appendChild(el('p', 'card-item__example', card.example));

    var meta = el('div', 'card-item__meta');
    var label = Store.dueLabel(card.srs, Date.now());
    var badgeClass = card.srs.reps === 0 ? 'badge badge--new' : card.srs.due <= Store.endOfToday() ? 'badge badge--due' : 'badge';
    meta.appendChild(el('span', badgeClass, label));
    meta.appendChild(el('span', 'badge', '复习 ' + card.srs.reps + ' 次 · 忘记 ' + card.srs.lapses + ' 次'));
    meta.appendChild(el('span', 'badge', '间隔 ' + card.srs.interval + ' 天 · 难度 ' + card.srs.ease));
    if (card.tags.length) {
      var tags = el('div', 'tags');
      card.tags.forEach(function (tag) {
        tags.appendChild(el('span', 'tag', tag));
      });
      meta.appendChild(tags);
    }
    main.appendChild(meta);
    item.appendChild(main);

    var actions = el('div', 'card-item__actions');
    if (speechSupported()) {
      actions.appendChild(actionButton('朗读', 'speak', { text: card.front }, 'btn btn--small btn--speak'));
    }
    actions.appendChild(actionButton('编辑', 'card-edit', { id: card.id }, 'btn btn--small'));
    actions.appendChild(actionButton('删除', 'card-delete', { id: card.id }, 'btn btn--small btn--danger'));
    item.appendChild(actions);
    return item;
  }

  /* -------------------------------------------------------------- 学习页 */
  function startStudy(deckId, forceFree) {
    state.study = null;
    if (deckId && deckId !== 'all') {
      state.settings.activeDeckId = deckId;
      saveSettings();
    }
    state.forceFreeStudy = !!forceFree;
    navigate('#/study/' + (deckId || 'all'));
  }

  function createSession(deckId, forceFree) {
    var queue = buildQueue(deckId);
    var isFreeReview = false;
    // 如果没有到期或新卡待学，或者显式触发巩固复习，则加载已学卡片进行自由巩固
    if (forceFree || queue.length === 0) {
      var freeQueue = buildFreeQueue(deckId);
      if (freeQueue.length > 0) {
        queue = freeQueue;
        isFreeReview = true;
      }
    }
    return {
      deckId: deckId,
      queue: queue,
      uniqueTotal: pendingUniqueCount(queue),
      flipped: false,
      rated: 0,
      correct: 0,
      requeued: {},
      lastSpokenCardId: null,
      isFreeReview: isFreeReview
    };
  }

  function renderStudyView() {
    var deckId = state.route.deckId || 'all';
    if (!state.study || state.study.deckId !== deckId) {
      var forceFree = !!state.forceFreeStudy;
      state.forceFreeStudy = false;
      state.study = createSession(deckId, forceFree);
    }
    var study = state.study;

    var fragment = document.createDocumentFragment();
    var panel = el('section', 'panel study');

    var top = el('div', 'study__top');
    top.appendChild(actionButton('← 退出（Esc）', 'study-exit', null, 'btn btn--small'));
    var isAuto = state.settings.autoSpeak !== false;
    top.appendChild(
      actionButton(
        isAuto ? '自动朗读：开' : '自动朗读：关',
        'toggle-auto-speak',
        null,
        'btn btn--small' + (isAuto ? ' btn--primary' : '')
      )
    );
    var deck = deckId === 'all' ? null : findDeck(deckId);
    var deckLabel = deck ? deck.name : '全部卡组';
    if (study.isFreeReview) {
      deckLabel += '（巩固复习）';
    }
    top.appendChild(el('p', 'study__counter', deckLabel));
    panel.appendChild(top);

    if (study.queue.length === 0) {
      if (study.rated > 0) {
        var accuracy = Math.round((study.correct / study.rated) * 100);
        panel.appendChild(el('h2', 'panel__title', '本轮完成'));
        panel.appendChild(
          el('p', 'overview__text', '共评分 ' + study.rated + ' 次，覆盖 ' + study.uniqueTotal + ' 张卡片，正确率 ' + accuracy + '%。')
        );
        launchConfetti();
      } else {
        panel.appendChild(el('h2', 'panel__title', '卡组暂无卡片'));
        panel.appendChild(el('p', 'overview__text', '该卡组暂无可供学习的卡片，请先添加或导入卡片。'));
      }
      var doneActions = el('div', 'form-actions');
      var hasAnyCards = (deckId === 'all' ? state.cards.length : countCards(deckId)) > 0;
      if (hasAnyCards) {
        doneActions.appendChild(actionButton('再来一轮（巩固复习）', 'study-refresh-free', null, 'btn btn--small btn--primary'));
      }
      doneActions.appendChild(actionButton('查看统计', 'go-stats', null, 'btn btn--small'));
      doneActions.appendChild(actionButton('返回卡组', 'go-decks', null, 'btn btn--small'));
      panel.appendChild(doneActions);
      fragment.appendChild(panel);
      mount(fragment);
      return;
    }

    var currentId = study.queue[0];
    var card = findCard(currentId);
    if (!card) {
      study.queue.shift();
      renderStudyView();
      return;
    }

    // 每次切换到下一个新单词时自动播放一次朗读
    if (state.settings.autoSpeak !== false && study.lastSpokenCardId !== card.id) {
      study.lastSpokenCardId = card.id;
      setTimeout(function () {
        speak(card.front);
      }, 120);
    }

    var remaining = pendingUniqueCount(study.queue);
    var done = Math.max(0, study.uniqueTotal - remaining);
    var percent = study.uniqueTotal ? Math.round((done / study.uniqueTotal) * 100) : 0;

    var counter = el('div', 'study__top');
    counter.appendChild(el('p', 'study__counter', '剩余 ' + remaining + ' 张 · 已评 ' + study.rated + ' 次'));
    counter.appendChild(el('p', 'study__counter', done + ' / ' + study.uniqueTotal));
    panel.appendChild(counter);

    var progress = el('div', 'progress');
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.setAttribute('aria-valuenow', String(percent));
    progress.setAttribute('aria-label', '本轮学习进度');
    var bar = el('div', 'progress__bar');
    bar.style.width = percent + '%';
    progress.appendChild(bar);
    panel.appendChild(progress);

    var flashcard = el('div', 'flashcard');
    flashcard.dataset.action = 'flip';
    flashcard.setAttribute('role', 'button');
    flashcard.tabIndex = 0;
    flashcard.setAttribute('aria-label', study.flipped ? '卡片背面，按空格或点击翻回正面' : '卡片正面，按空格或点击查看释义');
    flashcard.appendChild(el('p', 'flashcard__front', card.front));

    if (study.flipped) {
      flashcard.appendChild(el('p', 'flashcard__back', card.back));
      if (card.example) flashcard.appendChild(el('p', 'flashcard__example', card.example));
      flashcard.appendChild(el('p', 'flashcard__hint', '空格 / 点击翻回正面'));
    } else {
      flashcard.appendChild(el('p', 'flashcard__hint', '空格 / 点击翻面'));
    }
    panel.appendChild(flashcard);

    var tools = el('div', 'study__tools');
    var flipBtn = actionButton(
      study.flipped ? '翻回正面（空格）' : '翻面看释义（空格）',
      'flip',
      null,
      'btn ' + (study.flipped ? 'btn--ghost' : 'btn--primary')
    );
    tools.appendChild(flipBtn);
    if (speechSupported()) {
      tools.appendChild(actionButton('朗读单词', 'speak', { text: card.front }, 'btn btn--small btn--speak'));
    }
    panel.appendChild(tools);

    var rateGrid = el('div', 'rate-grid');
    Store.RATINGS.forEach(function (rating, index) {
      var button = el('button', 'rate-btn rate-btn--' + rating);
      button.type = 'button';
      button.dataset.action = 'rate';
      button.dataset.id = rating;
      button.disabled = !study.flipped;
      button.appendChild(el('span', null, Store.RATING_LABELS[rating]));
      button.appendChild(el('span', 'rate-btn__key', '按 ' + (index + 1)));
      button.setAttribute('aria-label', Store.RATING_LABELS[rating] + '（快捷键 ' + (index + 1) + '）');
      rateGrid.appendChild(button);
    });
    panel.appendChild(rateGrid);

    if (!study.flipped) {
      panel.appendChild(el('p', 'hint', '指引：先点击「翻面看释义」或按空格键，随后点击 1-4 评分即可自动进入下一个卡片（也支持直接按键盘 1-4 快速评分切词）。'));
    } else {
      panel.appendChild(el('p', 'hint', '请选择记忆程度，点击任意评分将自动进入下一个单词（快捷键 1-4）：'));
    }

    fragment.appendChild(panel);
    mount(fragment);
  }

  function flipCard() {
    if (!state.study || state.study.queue.length === 0) return;
    state.study.flipped = !state.study.flipped;
    renderStudyView();
  }

  function rateCard(rating) {
    var study = state.study;
    if (!study || study.queue.length === 0) return;
    if (Store.RATINGS.indexOf(rating) === -1) return;

    var id = study.queue.shift();
    var card = findCard(id);
    if (!card) {
      renderStudyView();
      return;
    }

    var now = Date.now();
    var prevInterval = card.srs.interval;
    var next = Store.review(card.srs, rating, now);
    card.srs = next;

    state.log.push({
      cardId: card.id,
      rating: rating,
      at: now,
      prevInterval: prevInterval,
      nextInterval: next.interval
    });
    if (state.log.length > Store.MAX_LOG) {
      state.log = state.log.slice(-Store.MAX_LOG);
    }

    saveCards();
    saveLog();

    study.rated += 1;
    if (rating === 'good' || rating === 'easy') study.correct += 1;
    // 「忘记」的卡片本轮再出现一次（每次学习最多补一次，保证能结束）
    if (rating === 'again' && !study.requeued[id]) {
      study.requeued[id] = true;
      study.queue.push(id);
    }
    study.flipped = false;
    renderStudyView();
  }

  function exitStudy() {
    var deckId = state.study ? state.study.deckId : null;
    state.study = null;
    navigate(deckId && deckId !== 'all' ? '#/deck/' + encodeURIComponent(deckId) : '#/decks');
  }

  /* -------------------------------------------------------------- 统计页 */
  function renderStatsView() {
    var now = Date.now();
    var from = Store.todayStart();
    var to = Store.endOfToday();

    var todayLog = state.log.filter(function (entry) {
      return entry.at >= from && entry.at <= to;
    });
    var reviewedSet = {};
    todayLog.forEach(function (entry) {
      reviewedSet[entry.cardId] = true;
    });
    var correct = todayLog.filter(function (entry) {
      return entry.rating === 'good' || entry.rating === 'easy';
    }).length;
    var accuracy = todayLog.length ? Math.round((correct / todayLog.length) * 100) : 0;
    var queue = buildQueue('all');
    var learned = state.cards.filter(function (card) {
      return card.srs.reps > 0;
    }).length;

    var fragment = document.createDocumentFragment();

    var todayPanel = el('section', 'panel');
    todayPanel.appendChild(el('h2', 'panel__title', '今日'));
    var grid = el('div', 'stat-grid');
    grid.appendChild(buildStat('待复习', queue.length + ' 张', '含新卡，受每日上限约束'));
    grid.appendChild(buildStat('已复习', todayLog.length + ' 次', '涉及 ' + Object.keys(reviewedSet).length + ' 张卡片'));
    grid.appendChild(buildStat('正确率', accuracy + '%', '记得 + 简单 / 总评分'));
    grid.appendChild(buildStat('连续打卡', computeStreak() + ' 天', '每天至少复习一次'));
    todayPanel.appendChild(grid);
    fragment.appendChild(todayPanel);

    var forecast = el('section', 'panel');
    forecast.appendChild(el('h2', 'panel__title', '未来 7 天到期分布'));
    var counts = [];
    for (var i = 0; i < 7; i += 1) {
      var start = from + i * DAY_MS;
      var end = start + DAY_MS - 1;
      var count = state.cards.filter(function (card) {
        if (card.srs.reps === 0) return false;
        if (i === 0) return card.srs.due <= end;
        return card.srs.due >= start && card.srs.due <= end;
      }).length;
      counts.push({ label: i === 0 ? '今天' : i === 1 ? '明天' : fmtShortDate(start), count: count });
    }
    var max = counts.reduce(function (acc, item) {
      return Math.max(acc, item.count);
    }, 1);
    var bars = el('div', 'bars');
    counts.forEach(function (item) {
      var row = el('div', 'bar-row');
      row.appendChild(el('span', 'bar-row__label', item.label));
      var track = el('div', 'bar-track');
      var fill = el('div', 'bar-fill');
      fill.style.width = Math.round((item.count / max) * 100) + '%';
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el('span', 'bar-row__value', String(item.count)));
      bars.appendChild(row);
    });
    forecast.appendChild(bars);
    forecast.appendChild(el('p', 'hint', '已学卡片按到期日分布；新卡不计入。'));
    fragment.appendChild(forecast);

    var all = el('section', 'panel');
    all.appendChild(el('h2', 'panel__title', '累计'));
    var grid2 = el('div', 'stat-grid');
    grid2.appendChild(buildStat('卡组', state.decks.length + ' 个', ''));
    grid2.appendChild(buildStat('卡片', state.cards.length + ' 张', '新卡 ' + (state.cards.length - learned) + ' 张'));
    grid2.appendChild(buildStat('已学', learned + ' 张', '至少复习过一次'));
    grid2.appendChild(buildStat('总评分', state.log.length + ' 次', '日志上限 ' + Store.MAX_LOG + ' 条'));
    all.appendChild(grid2);
    fragment.appendChild(all);

    mount(fragment);
  }

  function buildStat(label, value, sub) {
    var box = el('div', 'stat');
    box.appendChild(el('p', 'stat__label', label));
    box.appendChild(el('p', 'stat__value', value));
    if (sub) box.appendChild(el('p', 'stat__sub', sub));
    return box;
  }

  /* -------------------------------------------------------------- 行为动作 */
  function setFormError(form, message) {
    var box = form.querySelector('[data-form-error]');
    if (box) box.textContent = message;
  }

  function focusImportTextarea() {
    var textarea = dom.view.querySelector('textarea[name="importText"]');
    if (textarea) textarea.focus();
  }

  function openCardForm(cardId) {
    state.ui.editingCardId = cardId || null;
    state.ui.cardFormOpen = true;
    state.ui.importOpen = false;
    render();
    focusInput('form[data-action="card-save"] input[name="front"]');
    var form = dom.view.querySelector('form[data-action="card-save"]');
    if (form && form.scrollIntoView) form.scrollIntoView({ block: 'nearest' });
  }

  function closeCardForm() {
    state.ui.cardFormOpen = false;
    state.ui.editingCardId = null;
    render();
  }

  function saveCardForm(form) {
    var deckId = form.dataset.deck || state.route.deckId;
    var elements = form.elements;
    var front = Store.clean(elements.namedItem('front').value);
    var back = Store.clean(elements.namedItem('back').value);
    if (!front || !back) {
      setFormError(form, '单词和释义都要填写。');
      return;
    }
    var example = Store.clean(elements.namedItem('example').value);
    var tags = Store.clean(elements.namedItem('tags').value, 200)
      .split(/[,，;；、\s]+/)
      .map(function (tag) {
        return tag.trim();
      })
      .filter(Boolean)
      .slice(0, 10);

    if (state.ui.editingCardId) {
      var card = findCard(state.ui.editingCardId);
      if (!card) {
        setFormError(form, '卡片不存在，可能已被删除。');
        return;
      }
      card.front = front;
      card.back = back;
      card.example = example;
      card.tags = tags;
      state.ui.editingCardId = null;
      state.ui.cardFormOpen = false;
      saveCards();
      render();
      notifySaved('卡片已更新');
    } else {
      state.cards.push(Store.createCard(deckId, { front: front, back: back, example: example, tags: tags }, Date.now()));
      state.ui.cardFormOpen = false;
      saveCards();
      render();
      notifySaved('已添加「' + front + '」');
    }
  }

  function deleteCard(id) {
    var index = cardIndex(id);
    if (index === -1) return;
    var card = state.cards.splice(index, 1)[0];
    if (state.ui.editingCardId === id) {
      state.ui.editingCardId = null;
      state.ui.cardFormOpen = false;
    }
    saveCards();
    render();
    showToast('已删除「' + card.front + '」', function () {
      state.cards.splice(Math.min(index, state.cards.length), 0, card);
      saveCards();
      render();
      notifySaved('已撤销删除');
    });
  }

  function deleteDeck(id) {
    var deck = findDeck(id);
    if (!deck) return;
    var removedCards = state.cards.filter(function (card) {
      return card.deckId === id;
    }).length;
    state.decks = state.decks.filter(function (item) {
      return item.id !== id;
    });
    state.cards = state.cards.filter(function (card) {
      return card.deckId !== id;
    });
    state.ui.confirmDeleteDeckId = null;
    if (state.settings.activeDeckId === id) state.settings.activeDeckId = null;
    saveDecks();
    saveCards();
    saveSettings();
    if (state.route.name === 'deck' && state.route.deckId === id) navigate('#/decks');
    else render();
    notifySaved('已删除卡组「' + deck.name + '」及其 ' + removedCards + ' 张卡片');
  }

  /** 文本导入没有卡组上下文时（卡组页导入），落到一个「导入的卡片」卡组。 */
  function resolveImportDeckId(deckId) {
    if (deckId && findDeck(deckId)) return deckId;
    var existing = state.decks.filter(function (deck) {
      return deck.name === IMPORT_DECK_NAME;
    })[0];
    if (existing) return existing.id;
    var created = Store.createDeck(IMPORT_DECK_NAME, Date.now());
    state.decks.push(created);
    saveDecks();
    return created.id;
  }

  /** 合并复习日志：按 cardId + at 去重，按时间排序并截断到上限。 */
  function mergeLog(rawEntries) {
    if (!rawEntries || rawEntries.length === 0) return false;
    var known = {};
    state.log.forEach(function (entry) {
      known[entry.cardId + '@' + entry.at] = true;
    });

    var added = 0;
    rawEntries.forEach(function (raw) {
      var entry = Store.normalizeLog(raw);
      if (!entry) return;
      var key = entry.cardId + '@' + entry.at;
      if (known[key]) return;
      known[key] = true;
      state.log.push(entry);
      added += 1;
    });

    if (added === 0) return false;
    state.log.sort(function (a, b) {
      return a.at - b.at;
    });
    if (state.log.length > Store.MAX_LOG) state.log = state.log.slice(-Store.MAX_LOG);
    return true;
  }

  /**
   * 导入 JSON 备份（Q1）：按 id 合并卡组与卡片。
   * 同 id 冲突时以导入文件为准，但保留 due 更晚的那份 srs（不倒退复习进度）。
   */
  function mergeJsonImport(payload, fallbackDeckId) {
    var importedDecks = payload.decks.map(Store.normalizeDeck).filter(Boolean);
    var newDecks = 0;
    importedDecks.forEach(function (deck) {
      if (!findDeck(deck.id)) {
        state.decks.push(deck);
        newDecks += 1;
      }
    });

    var validDeckIds = state.decks.map(function (deck) {
      return deck.id;
    });
    var usableFallback = fallbackDeckId && validDeckIds.indexOf(fallbackDeckId) !== -1 ? fallbackDeckId : null;

    var prepared = payload.cards
      .filter(function (card) {
        return card && typeof card === 'object';
      })
      .map(function (card) {
        var copy = {};
        Object.keys(card).forEach(function (key) {
          copy[key] = card[key];
        });
        if (!copy.deckId && usableFallback) copy.deckId = usableFallback;
        return copy;
      });

    var cards = prepared
      .map(function (card) {
        return Store.normalizeCard(card, validDeckIds);
      })
      .filter(Boolean);
    var skipped = prepared.length - cards.length;

    var added = 0;
    var updated = 0;
    cards.forEach(function (card) {
      var local = findCard(card.id);
      if (!local) {
        state.cards.push(card);
        added += 1;
        return;
      }
      local.deckId = card.deckId;
      local.front = card.front;
      local.back = card.back;
      local.example = card.example;
      local.tags = card.tags;
      if (!local.srs || card.srs.due > local.srs.due) local.srs = card.srs;
      updated += 1;
    });

    var logMerged = mergeLog(payload.reviewlog) || 0;

    state.ui.importOpen = false;
    state.ui.backupOpen = false;
    state.ui.importText = '';
    saveDecks();
    saveCards();
    if (logMerged) saveLog();
    render();
    notifySaved(
      'JSON 导入完成：新增卡组 ' + newDecks + ' 个 · 新增卡片 ' + added + ' 张 · 更新 ' + updated + ' 张' +
        (skipped ? ' · 跳过无效 ' + skipped + ' 张' : '')
    );
  }

  function runImport(text, deckId) {
    var payload = Store.parseJsonImport(text);
    if (payload) {
      mergeJsonImport(payload, deckId);
      return;
    }

    var parsed = Store.parseImportText(text);
    if (parsed.items.length === 0) {
      showToast('没有解析到有效行：可以粘贴导出的 JSON 备份，或每行「单词,释义」');
      return;
    }

    var targetDeckId = resolveImportDeckId(deckId);
    var existing = {};
    state.cards.forEach(function (card) {
      if (card.deckId === targetDeckId) existing[card.front.toLowerCase()] = true;
    });

    var added = 0;
    var duplicate = 0;
    parsed.items.forEach(function (item) {
      var key = item.front.toLowerCase();
      if (existing[key]) {
        duplicate += 1;
        return;
      }
      existing[key] = true;
      state.cards.push(Store.createCard(targetDeckId, item, Date.now()));
      added += 1;
    });

    state.ui.importOpen = false;
    state.ui.backupOpen = false;
    state.ui.importText = '';
    saveCards();
    render();
    notifySaved(
      '导入 ' + added + ' 张 · 跳过重复 ' + duplicate + ' 张 · 格式无效 ' + parsed.invalid + ' 行'
    );
  }

  function seedBuiltinDeckIfEmpty() {
    if (state.decks.length === 0) {
      importBuiltinKaoyanDeck(false);
    }
  }

  function importBuiltinKaoyanDeck(showNotification) {
    var deckId = 'deck_kaoyan_core';
    var deck = findDeck(deckId);
    if (!deck) {
      deck = {
        id: deckId,
        name: '考研英语核心词汇',
        createdAt: Date.now()
      };
      state.decks.push(deck);
      saveDecks();
    }

    var now = Date.now();
    var added = 0;
    KAOYAN_VOCAB_DATA.forEach(function (item, index) {
      var exists = state.cards.some(function (c) {
        return c.deckId === deckId && c.front.toLowerCase() === item.front.toLowerCase();
      });
      if (!exists) {
        var card = {
          id: 'card_kaoyan_' + (index + 1) + '_' + String(now).slice(-6),
          deckId: deckId,
          front: item.front,
          back: item.back,
          example: item.example,
          tags: item.tags.slice(),
          srs: Store.createSrs(now),
          createdAt: now
        };
        state.cards.push(card);
        added += 1;
      }
    });

    if (added > 0) {
      saveCards();
    }

    if (showNotification) {
      render();
      notifySaved('已成功导入「考研英语核心词汇」卡组（' + (added > 0 ? '新增 ' + added + ' 张' : '已包含全部 36 张卡片') + '）');
    }
  }

  function speechSupported() {
    return typeof window.SpeechSynthesisUtterance === 'function' && !!window.speechSynthesis;
  }

  function speak(text, trigger) {
    if (!text) return;
    if (!speechSupported()) {
      showToast('当前浏览器不支持语音朗读');
      return;
    }
    try {
      window.speechSynthesis.cancel();
      var utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = /[\u4e00-\u9fa5]/.test(text) ? 'zh-CN' : 'en-US';
      utterance.rate = 0.95;
      if (trigger) {
        trigger.classList.add('is-speaking');
        utterance.onend = function () {
          trigger.classList.remove('is-speaking');
        };
        utterance.onerror = function () {
          trigger.classList.remove('is-speaking');
        };
      }
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      if (trigger) trigger.classList.remove('is-speaking');
      showToast('语音朗读失败：' + error.message);
    }
  }

  function exportJson(deckId) {
    var text = Store.buildExport(
      { decks: state.decks, cards: state.cards, settings: state.settings, log: state.log },
      deckId
    );
    var deck = deckId ? findDeck(deckId) : null;
    var safeName = (deck ? deck.name : 'vocab-all').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40);
    var filename = 'vocab-' + safeName + '-' + new Date().toISOString().slice(0, 10) + '.json';
    try {
      var blob = new Blob([text], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 2000);
      showToast('已导出 ' + filename);
    } catch (error) {
      showToast('导出失败：' + error.message);
    }
  }

  /* -------------------------------------------------------------- 提示条 */
  function showToast(message, undoHandler, duration) {
    dom.toastText.textContent = message;
    state.undoHandler = undoHandler || null;
    dom.undoBtn.hidden = !undoHandler;
    dom.toast.classList.add('is-visible');
    if (state.toastTimer) window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(function () {
      dom.toast.classList.remove('is-visible');
      state.undoHandler = null;
      dom.undoBtn.hidden = true;
    }, duration || 4000);
  }

  function hideToast() {
    dom.toast.classList.remove('is-visible');
    dom.undoBtn.hidden = true;
    if (state.toastTimer) {
      window.clearTimeout(state.toastTimer);
      state.toastTimer = null;
    }
  }

  function runUndo() {
    var handler = state.undoHandler;
    state.undoHandler = null;
    hideToast();
    if (typeof handler === 'function') handler();
  }

  /* -------------------------------------------------------------- 主题 */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    var isDark = theme === 'dark';
    dom.themeToggle.textContent = isDark ? '☀️ 浅色' : '🌙 深色';
    dom.themeToggle.setAttribute('aria-pressed', String(isDark));
  }

  function toggleTheme() {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.settings.theme);
    saveSettings();
  }

  /* -------------------------------------------------------------- 事件 */
  function handleClick(event) {
    var trigger = event.target.closest ? event.target.closest('[data-action]') : null;
    if (!trigger) return;
    var action = trigger.dataset.action;
    var id = trigger.dataset.id || '';
    var deckId = trigger.dataset.deck || state.route.deckId;

    switch (action) {
      case 'theme-toggle':
        toggleTheme();
        break;
      case 'undo':
        runUndo();
        break;
      case 'go-decks':
        state.study = null;
        navigate('#/decks');
        break;
      case 'go-stats':
        state.study = null;
        navigate('#/stats');
        break;
      case 'study':
        startStudy(id || 'all', false);
        break;
      case 'study-free':
        startStudy(id || 'all', true);
        break;
      case 'study-exit':
        exitStudy();
        break;
      case 'study-refresh':
        startStudy(state.route.deckId || 'all', false);
        break;
      case 'study-refresh-free':
        startStudy(state.route.deckId || 'all', true);
        break;
      case 'open-deck':
        navigate('#/deck/' + encodeURIComponent(id));
        break;
      case 'deck-rename':
        state.ui.editingDeckId = id;
        render();
        focusInput('form[data-action="deck-rename-save"] input[name="name"]');
        break;
      case 'deck-rename-cancel':
        state.ui.editingDeckId = null;
        render();
        break;
      case 'deck-delete':
        state.ui.confirmDeleteDeckId = id;
        render();
        break;
      case 'deck-delete-cancel':
        state.ui.confirmDeleteDeckId = null;
        render();
        break;
      case 'deck-delete-confirm':
        deleteDeck(id);
        break;
      case 'card-new':
        if (state.ui.cardFormOpen && !state.ui.editingCardId) {
          state.ui.cardFormOpen = false;
          render();
        } else {
          openCardForm(null);
        }
        break;
      case 'card-edit':
        openCardForm(id);
        break;
      case 'card-cancel':
        closeCardForm();
        break;
      case 'card-delete':
        deleteCard(id);
        break;
      case 'import-open':
        state.ui.importOpen = !state.ui.importOpen;
        state.ui.backupOpen = false;
        state.ui.cardFormOpen = false;
        state.ui.editingCardId = null;
        render();
        if (state.ui.importOpen) focusImportTextarea();
        break;
      case 'backup-open':
        state.ui.backupOpen = !state.ui.backupOpen;
        state.ui.importOpen = false;
        render();
        if (state.ui.backupOpen) focusImportTextarea();
        break;
      case 'storage-retry':
        if (Store.retryStorage()) {
          saveDecks();
          saveCards();
          saveSettings();
          saveLog();
          updateStorageWarning();
          showToast('已恢复本地存储，当前数据已写入');
        } else {
          updateStorageWarning();
          showToast('仍然写入失败：' + (Store.storageStatus().lastError || '未知原因'), null, 7000);
        }
        break;
      case 'import-cancel':
        state.ui.importOpen = false;
        state.ui.backupOpen = false;
        state.ui.importText = '';
        render();
        break;
      case 'export-deck':
        exportJson(id);
        break;
      case 'export-all':
        exportJson(null);
        break;
      case 'speak':
        speak(trigger.dataset.text || '', trigger);
        break;
      case 'flip':
        flipCard();
        break;
      case 'rate':
        rateCard(id);
        break;
      case 'toggle-auto-speak':
        state.settings.autoSpeak = state.settings.autoSpeak === false ? true : false;
        saveSettings();
        render();
        notifySaved('单词自动朗读已' + (state.settings.autoSpeak ? '开启' : '关闭'));
        break;
      case 'import-builtin-kaoyan':
        importBuiltinKaoyanDeck(true);
        break;
      default:
        break;
    }
  }

  function handleSubmit(event) {
    var form = event.target.closest ? event.target.closest('form[data-action]') : null;
    if (!form) return;
    event.preventDefault();
    var action = form.dataset.action;
    var elements = form.elements;

    if (action === 'deck-create') {
      var name = Store.clean(elements.namedItem('name').value, 80);
      if (!name) {
        setFormError(form, '卡组名称不能为空。');
        return;
      }
      var duplicated = state.decks.some(function (deck) {
        return deck.name === name;
      });
      if (duplicated) {
        setFormError(form, '已存在同名卡组。');
        return;
      }
      state.decks.push(Store.createDeck(name, Date.now()));
      saveDecks();
      render();
      notifySaved('已创建卡组「' + name + '」');
      return;
    }

    if (action === 'deck-rename-save') {
      var deck = findDeck(form.dataset.id);
      var newName = Store.clean(elements.namedItem('name').value, 80);
      if (!deck) return;
      if (!newName) {
        setFormError(form, '卡组名称不能为空。');
        return;
      }
      deck.name = newName;
      state.ui.editingDeckId = null;
      saveDecks();
      render();
      notifySaved('卡组已重命名');
      return;
    }

    if (action === 'card-save') {
      saveCardForm(form);
      return;
    }

    if (action === 'import-run') {
      runImport(elements.namedItem('importText').value, form.dataset.deck || state.route.deckId);
    }
  }

  function handleInput(event) {
    var target = event.target;
    if (target.dataset.role === 'search') {
      state.ui.search = target.value;
      renderCardList();
    } else if (target.dataset.role === 'import-text') {
      state.ui.importText = target.value;
    }
  }

  function handleChange(event) {
    var target = event.target;
    if (target.dataset.role === 'new-limit') {
      var value = Math.max(0, Math.min(500, Math.round(Number(target.value) || 0)));
      state.settings.dailyNewLimit = value;
      saveSettings();
      render();
      notifySaved('每日新卡上限已设为 ' + value + ' 张');
    }
  }

  function handleKeydown(event) {
    if (state.route.name !== 'study') return;
    var target = event.target;
    var tag = target && target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (event.key === 'Escape') {
      exitStudy();
      return;
    }
    if (!state.study || state.study.queue.length === 0) return;

    if (event.key === ' ' || event.key === 'Spacebar' || event.code === 'Space' || event.key === 'Enter') {
      event.preventDefault();
      flipCard();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (!state.study.flipped) {
        flipCard();
      } else {
        rateCard('good');
      }
      return;
    }
    var index = ['1', '2', '3', '4'].indexOf(event.key);
    if (index !== -1) {
      event.preventDefault();
      rateCard(Store.RATINGS[index]);
    }
  }

  /* -------------------------------------------------------------- 启动 */
  function init() {
    dom.view = document.getElementById('view');
    dom.toast = document.getElementById('toast');
    dom.toastText = document.getElementById('toast-text');
    dom.undoBtn = document.getElementById('undo-btn');
    dom.themeToggle = document.getElementById('theme-toggle');
    dom.storageWarning = document.getElementById('storage-warning');
    dom.storageWarningText = document.getElementById('storage-warning-text');

    var loaded = Store.loadAll();
    state.decks = loaded.decks;
    state.cards = loaded.cards;
    state.log = loaded.log;
    state.settings = {
      theme: loaded.settings.theme || document.documentElement.dataset.theme || 'light',
      dailyNewLimit: loaded.settings.dailyNewLimit,
      activeDeckId: loaded.settings.activeDeckId,
      autoSpeak: loaded.settings.autoSpeak !== false
    };

    seedBuiltinDeckIfEmpty();

    applyTheme(state.settings.theme);

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);
    document.addEventListener('keydown', handleKeydown);
    window.addEventListener('hashchange', render);

    if (!location.hash) location.hash = '#/decks';
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
