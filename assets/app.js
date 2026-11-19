/* ============================================================
   回声层：第七页 — application
   ============================================================ */
(function () {
  "use strict";
  const D = window.DATA;
  const SAVE_KEY = "echo-layer-save-v1";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const clueTotal = D.clues.length;

  /* ---------------------------------------------------------- icons */
  const ICONS = {
    pc: '<svg viewBox="0 0 48 48"><rect x="6" y="9" width="36" height="25" rx="2" fill="#d8d2bf" stroke="#6c6759"/><rect x="9" y="12" width="30" height="18" fill="#173a4d"/><path d="M11 13h26v15H11z" fill="#1f4e66"/><path d="M19 20h10v5H19z" fill="#7fd8c0" opacity=".5"/><path d="M19 34h10l2 5H17z" fill="#b6b09d" stroke="#6c6759"/><rect x="15" y="39" width="18" height="3" fill="#c9c3b0" stroke="#6c6759"/><circle cx="38" cy="31" r="1.2" fill="#8ce3b7"/></svg>',
    forum: '<svg viewBox="0 0 48 48"><rect x="8" y="6" width="32" height="36" rx="2" fill="#f1e9d6" stroke="#6f6857"/><rect x="8" y="6" width="32" height="10" fill="#2b567f"/><circle cx="32" cy="29" r="8" fill="#7fb6d8" stroke="#2b567f" stroke-width="1.4"/><path d="M24 29h16M32 21c4 5 4 11 0 16M32 21c-4 5-4 11 0 16" stroke="#2b567f" fill="none"/><path d="M13 20h10M13 24h7M13 28h9M13 32h6" stroke="#8a8371" stroke-width="1.6"/></svg>',
    backup: '<svg viewBox="0 0 48 48"><path d="M5 14h15l4 4h19v22a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" fill="#d8b45f" stroke="#6e5a2e"/><path d="M5 14h15l4 4h19v4H5z" fill="#e7c97e"/><rect x="17" y="25" width="14" height="12" rx="1.5" fill="#5b4a33"/><path d="M20 25v-3a4 4 0 0 1 8 0v3" stroke="#5b4a33" fill="none" stroke-width="2.4"/><circle cx="24" cy="30" r="2" fill="#e7c97e"/><rect x="23.2" y="31" width="1.6" height="4" fill="#e7c97e"/></svg>',
    chat: '<svg viewBox="0 0 48 48"><path d="M5 9h25a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H15l-7 6v-6H5a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z" fill="#e8e1d0" stroke="#6f6857"/><path d="M18 19h28a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4v5l-6-5H18a2 2 0 0 1-2-2V21a2 2 0 0 1 2-2z" fill="#a9c8dc" stroke="#3f6680"/><circle cx="26" cy="27" r="1.4" fill="#35576d"/><circle cx="32" cy="27" r="1.4" fill="#35576d"/><circle cx="38" cy="27" r="1.4" fill="#35576d"/></svg>',
    txt: '<svg viewBox="0 0 48 48"><path d="M10 4h20l8 8v32H10z" fill="#fdfaf0" stroke="#77705e"/><path d="M30 4v8h8" fill="#ded7c4" stroke="#77705e"/><path d="M15 18h18M15 23h18M15 28h18M15 33h11" stroke="#8d8674" stroke-width="1.5"/><path d="M7 9h5v30H7z" fill="#b9b2a0"/></svg>',
    last: '<svg viewBox="0 0 48 48"><path d="M10 4h20l8 8v32H10z" fill="#fff7ee" stroke="#7a5a4e"/><path d="M30 4v8h8" fill="#e0d3c4" stroke="#7a5a4e"/><path d="M15 18h18M15 23h18M15 28h18M15 33h11" stroke="#a08878" stroke-width="1.5"/><rect x="5" y="12" width="4" height="26" fill="#b53a2b"/></svg>',
    folder: '<svg viewBox="0 0 48 48"><path d="M4 12h16l4 4h20v26H4z" fill="#dfbc68" stroke="#77622f"/><path d="M4 12h16l4 4h20v6H4z" fill="#efd28a"/></svg>',
    email: '<svg viewBox="0 0 48 48"><rect x="6" y="12" width="36" height="26" fill="#f4eedf" stroke="#716a58"/><path d="M6 12l18 15 18-15" fill="none" stroke="#716a58"/><path d="M6 38l13-14M42 38L29 24" stroke="#a49c86"/></svg>',
    search: '<svg viewBox="0 0 48 48"><circle cx="21" cy="20" r="12" fill="none" stroke="#d8c48c" stroke-width="4"/><circle cx="21" cy="20" r="8" fill="#8fb3c9" opacity=".55"/><path d="M30 29l10 11" stroke="#d8c48c" stroke-width="6"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" fill="#d8b45f" stroke="#5d4a24"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="#5d4a24" stroke-width="2"/><circle cx="12" cy="15" r="1.6" fill="#5d4a24"/></svg>'
  };

  /* ---------------------------------------------------------- state */
  function defaultState() {
    return {
      v: 1,
      started: false,
      startedAt: null,
      ending: null,
      flags: {
        readme: false, forumVisited: false, archiveUnlocked: false, deepVisited: false,
        p7Admin: false, truth: false, records: false, lastNote: false, stopped: false,
        readEmail: false, hintsUsed: 0
      },
      clues: {},
      visits: { forum: 0, archive: 0, deep: 0, p7: 0, pages: 0 },
      online: 6,
      sound: false,
      lastLogin: "2014-09-07 02:17"
    };
  }
  let state = defaultState();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.v === 1) state = Object.assign(defaultState(), parsed, {
        flags: Object.assign(defaultState().flags, parsed.flags || {}),
        visits: Object.assign(defaultState().visits, parsed.visits || {}),
        clues: parsed.clues || {}
      });
    }
  } catch (e) { /* ignore */ }
  let hasSave = !!state.started;

  const ui = {
    win: null,
    tab: "forum",
    hist: { forum: ["forum/index"], archive: ["archive/login"] },
    idx: { forum: 0, archive: 0 },
    last: { forum: "forum/index", archive: "archive/login" },
    chats: "wind",
    chatView: "list",
    startOpen: false,
    modal: null,
    drawer: false,
    lightbox: null,
    endingShown: false,
    titleActive: false,
    replyAttempts: 0
  };

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function clueCount() { return Object.keys(state.clues).length; }

  /* ---------------------------------------------------------- sound */
  const Sound = {
    ctx: null, gain: null, hum: null,
    init() {
      if (this.ctx) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ctx = new AC();
        this.gain = this.ctx.createGain();
        this.gain.gain.value = 0.0001;
        this.gain.connect(this.ctx.destination);
        const o1 = this.ctx.createOscillator(), o2 = this.ctx.createOscillator();
        o1.type = "sine"; o1.frequency.value = 52;
        o2.type = "triangle"; o2.frequency.value = 78.5;
        const f = this.ctx.createBiquadFilter();
        f.type = "lowpass"; f.frequency.value = 240;
        const g2 = this.ctx.createGain(); g2.gain.value = 0.5;
        o1.connect(f); o2.connect(g2); g2.connect(f); f.connect(this.gain);
        o1.start(); o2.start(); this.hum = [o1, o2];
      } catch (e) { /* ignore */ }
    },
    set(on) {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();
      this.gain.gain.setTargetAtTime(on ? 0.05 : 0.0001, this.ctx.currentTime, 0.8);
    },
    blip(freq, dur, type, vol) {
      if (!state.sound) return;
      this.init(); if (!this.ctx) return;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type || "square"; o.frequency.value = freq || 440;
      g.gain.value = vol || 0.02;
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + (dur || 0.05));
      o.connect(g); g.connect(this.ctx.destination);
      o.start(); o.stop(this.ctx.currentTime + (dur || 0.05));
    },
    click() { this.blip(280, 0.04, "square", 0.012); },
    unlock() { this.blip(520, 0.09, "sine", 0.03); setTimeout(() => this.blip(780, 0.13, "sine", 0.025), 90); },
    glitch() {
      if (!state.sound) return;
      this.blip(60, 0.18, "sawtooth", 0.03);
      setTimeout(() => this.blip(130, 0.1, "square", 0.02), 110);
    }
  };

  /* ---------------------------------------------------------- boot */
  const bootLines = [
    "JIANGTING-07 BIOS v1.07  (C) 1999-2014",
    "Main Processor : Pentium(R) Dual-Core  E5200 @ 2.50GHz",
    "Memory Testing : 2097152K OK",
    "",
    "Detecting IDE drives ...",
    "  Primary Master   : ST3160815AS",
    "  Primary Slave    : None",
    "  Secondary Master : HL-DT-ST DVDRAM",
    "",
    "Mounting local archive ........ OK",
    "Reading system clock .......... OK",
    "",
    "SYSTEM TIME  : 2014-09-07 02:17",
    "BACKUP CLOCK : 2014-09-07 02:30",
    "WARNING      : local time differs from backup time",
    "               (+13:00)",
    "",
    "Loading desktop ..."
  ];
  let bootTimer = null, bootDone = false;

  function runBoot() {
    const log = $("#bootLog"), face = $("#bootFace"), boot = $("#boot");
    let line = 0, char = 0, text = "";
    bootDone = false;
    function step() {
      if (bootDone) return;
      if (line >= bootLines.length) { finishBoot(); return; }
      const cur = bootLines[line];
      if (char < cur.length) {
        char += 2;
        text = bootLines.slice(0, line).join("\n") + "\n" + cur.slice(0, char);
        log.textContent = text;
        bootTimer = setTimeout(step, cur.length ? 9 : 40);
      } else {
        text = bootLines.slice(0, line + 1).join("\n") + "\n";
        log.textContent = text;
        line++; char = 0;
        bootTimer = setTimeout(step, 70);
      }
    }
    step();
    boot.addEventListener("click", function onSkip(e) {
      if (e.target.closest("#bootEnter")) return;
      if (!bootDone) {
        bootDone = true;
        clearTimeout(bootTimer);
        log.textContent = bootLines.join("\n");
        finishBoot(true);
      }
    });
    $("#bootEnter").addEventListener("click", (e) => {
      e.stopPropagation();
      boot.classList.add("hidden");
      showTitle();
    });
  }
  function finishBoot() {
    bootDone = true;
    $("#bootFace").classList.remove("hidden");
    $("#bootFace").classList.add("fade-up");
  }

  /* ---------------------------------------------------------- title screen */
  function showTitle() {
    closeDrawer();
    ui.titleActive = true;
    const cont = hasSave && state.started;
    const mins = state.started && state.startedAt ? Math.max(1, Math.round((Date.now() - state.startedAt) / 60000)) : 0;
    const root = $("#overlay");
    root.classList.remove("hidden");
    root.innerHTML = `
      <div class="title-screen" style="position:fixed;inset:0;z-index:9410">
        <div class="title-inner">
          <div class="title-kicker">AN ORIGINAL NETWORK MYSTERY / 2014</div>
          <h1 class="title-main">回声层</h1>
          <div class="title-sub">第 七 页 &nbsp;/&nbsp; ECHO LAYER · PAGE SEVEN</div>
          <p class="title-desc">2014年9月7日凌晨，一台名为 <b>JIANGTING-07</b> 的旧电脑重新启动。论坛已经关闭，但还有一些回复在继续出现。</p>
          <div class="title-actions">
            ${cont ? '<button class="title-btn primary" data-act="title-continue">继续调查<small>RESUME</small></button>' : ""}
            <button class="title-btn ${cont ? "" : "primary"}" data-act="title-start">${cont ? "重新开始" : "开始调查"}<small>${cont ? "NEW SESSION" : "START"}</small></button>
            <button class="title-btn" data-act="title-help">操作与提示<small>HOW TO PLAY</small></button>
          </div>
          ${cont ? `<div class="title-save">本地存档：${state.ending ? "已抵达结局 " + state.ending : "调查进行中"} · 线索 ${clueCount()}/${clueTotal} · ${mins} 分钟</div>` : ""}
          <div class="title-warn">本作包含轻微惊悚、失踪与死亡暗示，没有突然出现的惊吓画面。建议佩戴耳机。所有人物、论坛与事件均为虚构。</div>
          <div class="title-meta">
            <span>约 20–40 分钟</span><span>单机 · 自动存档</span><span>建议使用 Chrome / Safari</span><span>v1.0</span>
          </div>
        </div>
      </div>`;
  }
  function hideTitle() {
    const root = $("#overlay");
    root.classList.add("hidden");
    root.innerHTML = "";
  }
  function startGame(fresh) {
    ui.titleActive = false;
    if (fresh) {
      state = defaultState();
      ui.hist = { forum: ["forum/index"], archive: ["archive/login"] };
      ui.idx = { forum: 0, archive: 0 };
      ui.last = { forum: "forum/index", archive: "archive/login" };
      ui.chats = "wind";
      ui.tab = "forum";
      hasSave = false;
    }
    state.started = true;
    if (!state.startedAt) state.startedAt = Date.now();
    save();
    hideTitle();
    $("#desktop").classList.remove("hidden");
    renderDesktop();
    updateChrome();
    if (state.sound) Sound.set(true);
    if (fresh) {
      setTimeout(() => toast("系统已从休眠恢复", "本地时间 2014/09/07 02:17 · 桌面有 1 个未读文件", 4200), 700);
    } else {
      setTimeout(() => toast("已恢复上次调查", "线索 " + clueCount() + "/" + clueTotal, 3200), 300);
    }
  }

  /* ---------------------------------------------------------- desktop */
  function renderDesktop() {
    const icons = [
      { app: "explorer", label: "我的电脑", icon: "pc" },
      { app: "forum", label: "江汀街坊论坛", icon: "forum" },
      { app: "backup", label: "论坛备份", icon: "backup", locked: !state.flags.stopped },
      { app: "chat", label: "聊天记录", icon: "chat" },
      { app: "readme", label: "请先阅读.txt", icon: "txt" }
    ];
    if (state.flags.records || state.ending === "A") icons.push({ app: "last", label: "最后一条.txt", icon: "last" });
    const wrap = $("#icons");
    wrap.innerHTML = icons.map((it) => `
      <button class="icon ${it.locked ? "locked" : ""}" data-app="${it.app}" title="${esc(it.label)}">
        <span class="icon-glyph">${ICONS[it.icon] || ICONS.folder}</span>
        <span class="icon-label">${esc(it.label)}</span>
        ${it.locked ? '<span class="lockmark">•</span>' : ""}
      </button>`).join("");
    updateChrome();
  }

  function updateChrome() {
    $("#clueCount").textContent = clueCount();
    $("#soundBtn").textContent = state.sound ? "声音：开" : "声音：关";
    const mins = state.startedAt ? String(Math.floor((Date.now() - state.startedAt) / 60000)).padStart(2, "0") : "00";
    $("#clockMain").textContent = "02:17";
    $("#clockDate").textContent = state.ending === "A" ? "已关机" : "2014/09/07";
    if (state.ending === "A") $("#clockDate").textContent = "2014/09/08";
  }

  /* ---------------------------------------------------------- window manager */
  const WIN_TITLES = {
    browser: () => "江汀街坊论坛 - Microsoft Internet Explorer",
    notepad: () => "记事本",
    chat: () => "聊天记录 - 顾南",
    explorer: () => "我的电脑"
  };
  const WIN_ICONS = { browser: ICONS.forum, notepad: ICONS.txt, chat: ICONS.chat, explorer: ICONS.pc };

  function openWindow(type, data) {
    ui.win = { type: type, data: data || {} };
    renderWindow();
    buildTaskbar();
    if (type === "browser") {
      if (data && data.tab) ui.tab = data.tab;
      renderBrowser();
    }
    Sound.click();
  }
  function closeWindow() {
    ui.win = null;
    $("#winLayer").innerHTML = "";
    buildTaskbar();
    closeDrawer();
  }
  function renderWindow() {
    if (!ui.win) { $("#winLayer").innerHTML = ""; return; }
    const type = ui.win.type;
    const title = type === "notepad" ? "记事本 - " + (ui.win.data.email ? D.chat.email.subject : (ui.win.data.file && D.notes[ui.win.data.file] ? D.notes[ui.win.data.file].title : "无标题")) : WIN_TITLES[type]();
    const icon = type === "notepad" && ui.win.data.file === "last" ? ICONS.last : (WIN_ICONS[type] || ICONS.folder);
    document.body.dataset.win = type;
    $("#winLayer").innerHTML = `
      <div class="win" id="mainWin">
        <div class="win-bar">
          <span class="wico">${icon}</span>
          <span class="win-title">${esc(title)}</span>
          <div class="win-btns">
            <button data-act="win-min" title="最小化">–</button>
            <button data-act="win-max" title="最大化">□</button>
            <button data-act="win-close" title="关闭">×</button>
          </div>
        </div>
        <div class="win-body" id="winBody"></div>
      </div>`;
    const body = $("#winBody");
    if (type === "browser") {
      renderBrowser();
    } else if (type === "notepad") {
      renderNotepad(body);
    } else if (type === "chat") {
      renderChat(body);
    } else if (type === "explorer") {
      renderExplorer(body);
    }
    buildTaskbar();
  }
  function buildTaskbar() {
    const items = $("#taskItems");
    if (!ui.win) { items.innerHTML = ""; return; }
    const type = ui.win.type;
    const title = type === "notepad" ? (ui.win.data.email ? "2014-09-08_邮件备份.eml" : (ui.win.data.file && D.notes[ui.win.data.file] ? D.notes[ui.win.data.file].title : "记事本")) : (type === "browser" ? (ui.tab === "archive" ? "JIANGTING ARCHIVE" : "江汀街坊论坛") : WIN_TITLES[type]().split(" - ")[0]);
    const icon = WIN_ICONS[type] || ICONS.folder;
    items.innerHTML = `<button class="task-item active" data-act="win-focus"><span class="wico" style="width:14px;height:14px">${icon}</span>${esc(title)}</button>`;
  }

  /* ---------------------------------------------------------- notepad */
  function openNotepad(file) {
    openWindow("notepad", { file: file });
    if (file === "readme" && !state.flags.readme) {
      state.flags.readme = true;
      unlockClue("readme");
      save();
    }
    if (file === "last") {
      const first = !state.flags.lastNote;
      state.flags.lastNote = true;
      unlockClue("lastnote");
      save();
      if (first && !state.ending) {
        setTimeout(() => toast("第 7 页不再只读", "回到深层备份，做出你的选择。", 4600), 900);
      }
    }
  }
  function renderNotepad(body) {
    const file = ui.win.data.file;
    const n = D.notes[file] || { title: "无标题", text: "", foot: "" };
    const mail = ui.win.data.email;
    if (mail) {
      body.innerHTML = `
        <div class="notepad">
          <div class="np-menu"><span>文件</span><span>编辑</span><span>格式</span><span>查看</span><span>帮助</span></div>
          <div class="np-body np-email">
            <div class="field"><b>发件人</b><span>顾晚 &lt;guwan0917@163.com&gt;</span></div>
            <div class="field"><b>收件人</b><span>顾南 &lt;gunan_jiangting@163.com&gt;</span></div>
            <div class="field"><b>日期</b><span>2014-09-08 07:12</span></div>
            <div class="field"><b>主题</b><span>${esc(D.chat.email.subject)}</span></div>
            <div class="mailbody">${D.chat.email.body}</div>
            <p class="faint" style="margin-top:22px;font-family:var(--sans);font-size:10px;color:#98a39b">附件：无　·　此邮件已保存至本地</p>
          </div>
          <div class="np-status"><span>${esc(n.foot || "C:\\Users\\Administrator\\Desktop\\2014-09-08_邮件备份.eml")}</span><span>只读</span></div>
        </div>`;
      return;
    }
    body.innerHTML = `
      <div class="notepad">
        <div class="np-menu"><span>文件</span><span>编辑</span><span>格式</span><span>查看</span><span>帮助</span></div>
        <div class="np-body"><pre class="${file === "last" ? "small" : ""}">${esc(n.text)}</pre></div>
        <div class="np-status"><span>${esc(n.foot)}</span><span>${file === "last" ? "只读" : "UTF-8"}</span></div>
      </div>`;
  }

  /* ---------------------------------------------------------- explorer */
  function renderExplorer(body) {
    const files = [
      { name: "我的文档", type: "文件夹", meta: "2008/11/03 09:12", icon: "folder", dim: true },
      { name: "聊天记录", type: "文件夹", meta: "2014/09/08 07:12", icon: "chat", app: "chat" },
      { name: "论坛备份", type: "文件", meta: "2014/09/08 02:30", icon: "backup", app: "backup", locked: !state.flags.stopped },
      { name: "请先阅读.txt", type: "文本文档", meta: "2014/09/07 02:15", icon: "txt", app: "readme" },
      { name: "最后一条.txt", type: "文本文档", meta: "2014/09/08 03:21", icon: "last", app: "last", hidden: !(state.flags.records || state.ending === "A") }
    ].filter((f) => !f.hidden);
    body.innerHTML = `
      <div class="explorer">
        <div class="exp-bar">
          <span>后退</span><span>前进</span><span>向上</span>
          <div class="path">C:\\Documents and Settings\\Administrator\\桌面</div>
        </div>
        <div class="exp-main">
          <div class="exp-side">
            <div class="lbl">文件夹</div>
            <div class="on">📁 桌面</div>
            <div>📁 我的文档</div>
            <div>💾 本地磁盘 (C:)</div>
            <div>💿 档案备份 (D:)</div>
            <div style="opacity:.45">🖨 打印机</div>
          </div>
          <div class="exp-files">
            ${files.map((f) => `
              <button class="exp-file ${f.dim ? "dim" : ""}" ${f.app ? `data-app="${f.app}"` : "disabled"}>
                <span class="fico">${ICONS[f.icon]}</span>
                <span class="fname">${esc(f.name)}</span>
                <span class="fmeta">${esc(f.type)}　${esc(f.meta)}</span>
              </button>`).join("")}
          </div>
        </div>
        <div class="exp-status">${files.length} 个对象　·　${state.flags.stopped ? "数据同步已停止" : "本地磁盘可用空间 1.24 GB"}</div>
      </div>`;
  }

  /* ---------------------------------------------------------- chat */
  function renderChat(body) {
    const list = [
      { id: "wind", name: "顾晚", sub: "最后在线 02:17", time: "02:17" },
      { id: "zhou", name: "老周", sub: "二楼的灯别修", time: "昨天" },
      { id: "man", name: "小满", sub: "晚风姐是不是出事了", time: "00:26" }
    ];
    const c = D.chat[ui.chats] || D.chat.wind;
    const mailAvailable = !state.flags.records;
    body.innerHTML = `
      <div class="chat-app">
        <div class="chat-list">
          <div class="cl-head">历史会话</div>
          ${list.map((x) => `
            <button class="chat-item ${ui.chats === x.id ? "on" : ""}" data-act="chat-select" data-chat="${x.id}">
              <div class="ci-name">${esc(x.name)}<span>${esc(x.time)}</span></div>
              <div class="ci-sub">${esc(x.sub)}</div>
            </button>`).join("")}
          ${mailAvailable ? `
          <button class="chat-item file" data-act="open-email">
            <div class="ci-name">2014-09-08_邮件备份<span>.eml</span></div>
            <div class="ci-sub">发件人：顾晚　未读</div>
          </button>` : `
          <button class="chat-item file" data-act="open-email">
            <div class="ci-name">2014-09-08_邮件备份<span>.eml</span></div>
            <div class="ci-sub">已读</div>
          </button>`}
        </div>
        <div class="chat-main">
          <div class="chat-title"><span class="dotlive"></span><b>${esc(c.title)}</b><span>${esc(c.sub)}</span></div>
          ${mailAvailable ? `<button class="chat-mail" data-act="open-email"><span>✉</span><b>1 封未读邮件</b><span class="cm-sub">2014-09-08_邮件备份.eml</span><span class="cm-open">打开 ›</span></button>` : ""}
          <div class="chat-scroll">
            ${c.messages.map((m) => {
              if (m.day) return `<div class="chat-day">${esc(m.day)}</div>`;
              if (m.system) return `<div class="chat-day" style="color:#a06f5f;border-color:#e2cfc6">${esc(m.text)}</div>`;
              const me = m.by === "顾南";
              return `<div class="msg ${me ? "me" : ""}">
                <div class="mh"><span>${esc(m.by)}</span><span>${esc(m.time)}</span></div>
                <div class="mb">${esc(m.text)}</div>
              </div>`;
            }).join("")}
          </div>
          <div class="chat-compose"><span>输入消息…</span><span>对方已离线 · 无法发送</span></div>
        </div>
      </div>`;
  }
  function openEmail() {
    if (!state.flags.readEmail) {
      state.flags.readEmail = true;
      state.flags.truth = true;
      unlockClue("windGone");
      save();
    }
    openWindow("notepad", { file: "email", email: true });
    setTimeout(() => {
      if (!state.ending && state.flags.deepVisited) {
        toast("第 7 页可以查看原始记录了", "如果你已经进入过深层备份。", 4000);
      }
    }, 700);
  }

  /* ---------------------------------------------------------- browser */
  function urlOf(path) {
    const map = {
      "forum/index": "http://jiangting.local/forum/index.html",
      "forum/photos": "http://jiangting.local/forum/photos.html",
      "forum/search": "http://jiangting.local/forum/search.html",
      "archive/login": "http://jiangting.local/archive/login.html",
      "archive/index": "http://jiangting.local/archive/index.html",
      "archive/delayed": "http://jiangting.local/archive/delayed.html",
      "archive/deleted": "http://jiangting.local/archive/deleted.html",
      "archive/conversations": "http://jiangting.local/archive/conversations.html",
      "archive/page7": "http://jiangting.local/archive/page7.html?p=7"
    };
    if (map[path]) return map[path];
    if (path.indexOf("forum/section/") === 0) return "http://jiangting.local/forum/" + path.split("/").pop() + ".html";
    if (path.indexOf("forum/thread/") === 0) return "http://jiangting.local/forum/thread-" + path.split("/").pop() + ".html";
    if (path.indexOf("forum/profile/") === 0) return "http://jiangting.local/forum/profile-" + path.split("/").pop() + ".html";
    return "http://jiangting.local/404.html";
  }
  function curPath() { return ui.tab === "archive" ? ui.hist.archive[ui.idx.archive] : ui.hist.forum[ui.idx.forum]; }
  function setPath(tab, path, push) {
    ui.tab = tab;
    if (push === false) {
      if (tab === "forum") { ui.hist.forum[ui.idx.forum] = path; ui.last.forum = path; }
      else { ui.hist.archive[ui.idx.archive] = path; ui.last.archive = path; }
      return;
    }
    const h = ui.hist[tab], i = ui.idx[tab];
    if (h[i] === path) return;
    h.splice(i + 1);
    h.push(path);
    ui.idx[tab] = h.length - 1;
    ui.last[tab] = path;
  }
  function navigate(path, opts) {
    opts = opts || {};
    let tab = path.indexOf("archive/") === 0 ? "archive" : "forum";
    if (tab === "archive" && !state.flags.archiveUnlocked) path = "archive/login";
    if (tab === "archive" && state.flags.stopped && path !== "archive/login") {
      setPath("archive", path, opts.push !== false);
      renderBrowser();
      return;
    }
    setPath(tab, path, opts.push !== false);
    if (!ui.win || ui.win.type !== "browser") openWindow("browser");
    else renderBrowser();
    onView(path);
    state.visits.pages++;
    save();
    if (opts.scrollTop !== false) {
      const v = $("#browserView"); if (v) v.scrollTop = 0;
    }
  }
  function openBrowser(tab, path) {
    tab = tab || "forum";
    if (tab === "archive" && !state.flags.archiveUnlocked) { tab = "forum"; path = "archive/login"; }
    const fresh = !ui.win || ui.win.type !== "browser";
    if (fresh && tab === "forum" && !path && state.flags.archiveUnlocked && !state.flags.stopped && !state.ending && state.online > 1) {
      state.online--;
      save();
    }
    ui.tab = tab;
    if (path) setPath(tab, path, true);
    if (!ui.win || ui.win.type !== "browser") {
      openWindow("browser", { tab: tab });
    } else {
      renderBrowser();
    }
    onView(curPath());
  }
  function renderBrowser() {
    if (!ui.win || ui.win.type !== "browser") return;
    const path = curPath();
    if (path.indexOf("forum/") === 0) state.flags.forumVisited = true;
    if (ui.tab === "forum" && path === "forum/index" && !state.flags.stopped) {
      // online count drifts down after each re-entry; set on boot only
    }
    if (path === "archive/index" || path === "archive/delayed" || path === "archive/deleted" || path === "archive/conversations" || path === "archive/page7") {
      state.flags.deepVisited = true;
    }
    const archiveUnlocked = state.flags.archiveUnlocked;
    const tabs = `
      <div class="browser-tabs">
        <div class="btab ${ui.tab === "forum" ? "active" : ""}" data-act="switch-tab" data-tab="forum"><span class="fav"></span>江汀街坊论坛</div>
        ${archiveUnlocked || state.flags.stopped ? `<div class="btab ${ui.tab === "archive" ? "active" : ""}" data-act="switch-tab" data-tab="archive"><span class="fav"></span>${state.flags.stopped ? "JIANGTING ARCHIVE (OFFLINE)" : "JIANGTING ARCHIVE"}</div>` : ""}
      </div>`;
    const h = ui.hist[ui.tab], i = ui.idx[ui.tab];
    const bar = `
      <form class="browser-bar" data-form="addr" autocomplete="off">
        <button type="button" class="nav-btn" data-act="nav-back" ${i <= 0 ? "disabled" : ""} title="后退">◀</button>
        <button type="button" class="nav-btn" data-act="nav-fwd" ${i >= h.length - 1 ? "disabled" : ""} title="前进">▶</button>
        <button type="button" class="nav-btn" data-act="nav-refresh" title="刷新">⟳</button>
        <button type="button" class="nav-btn" data-act="nav-home" title="主页">⌂</button>
        <div class="addr"><span class="addr-lock">🔒</span><input id="addrInput" value="${esc(urlOf(path))}" spellcheck="false" aria-label="地址栏"></div>
        <button type="submit" class="go-btn">转到</button>
      </form>`;
    let content = "";
    try {
      content = renderPage(path);
    } catch (err) {
      content = `<div class="error-page"><h2>页面无法显示</h2><p>${esc(String(err && err.message ? err.message : err))}</p></div>`;
    }
    const win = $("#mainWin");
    if (win) {
      const t = win.querySelector(".win-title");
      if (t) t.textContent = (ui.tab === "archive" ? "JIANGTING ARCHIVE" : "江汀街坊论坛") + " - Microsoft Internet Explorer";
      const wico = win.querySelector(".wico");
      if (wico) wico.innerHTML = ui.tab === "archive" ? ICONS.backup : ICONS.forum;
    }
    $("#winBody").innerHTML = `
      <div class="browser">
        ${tabs}
        ${bar}
        <div class="browser-view" id="browserView">${content}</div>
        <div class="browser-status">
          <span>完成</span>
          <span class="st-right"><span>受信任站点 | 本地 Intranet</span><span>2014/09/07 02:17</span></span>
        </div>
      </div>`;
    buildTaskbar();
    afterPageMount(path);
  }

  /* ---------------------------------------------------------- page router */
  function renderPage(path) {
    if (ui.tab === "archive" && state.flags.stopped) return errorPage("备份区已归档", "该页面在数据同步停止后不再可用。", "forum/index", "返回论坛");
    if (path === "forum/index") return forumHome();
    if (path === "forum/photos") return forumPhotos();
    if (path === "forum/search") return forumSearch();
    if (path.indexOf("forum/section/") === 0) return forumSection(path.split("/").pop());
    if (path.indexOf("forum/thread/") === 0) return forumThread(path.split("/").pop());
    if (path.indexOf("forum/profile/") === 0) return forumProfile(path.split("/").pop());
    if (path === "archive/login") return archiveLogin();
    if (path === "archive/index") return archiveIndex();
    if (path === "archive/delayed") return archiveDelayed();
    if (path === "archive/deleted") return archiveDeleted();
    if (path === "archive/conversations") return archiveConversations();
    if (path === "archive/page7") return archivePage7();
    return errorPage("无法访问此页面", "请检查地址是否输入正确。", "forum/index", "返回论坛首页");
  }
  function onView(path) {
    if (path === "forum/index" && !state.flags.stopped) {
      state.flags.forumVisited = true;
    }
    if (path.indexOf("forum/thread/") === 0) {
      const tid = path.split("/").pop();
      if (tid === "n1") unlockClue("lastLogin");
      if (tid === "n2" || tid === "r3") unlockClue("shift7");
      if (tid === "n4") unlockClue("key07");
      if (tid === "p1") unlockClue("photo6");
      if (tid === "n3") unlockClue("windSilent");
    }
    if (path === "forum/profile/wind") unlockClue("lastLogin");
    if (path === "archive/index" || path === "archive/delayed" || path === "archive/deleted" || path === "archive/conversations" || path === "archive/page7") {
      if (!state.flags.deepVisited) {
        state.flags.deepVisited = true;
        toast("已进入旧站备份系统", "注意页面上的两处时间。", 3800);
      }
      state.visits.deep++;
      unlockClue("offset13");
      save();
    }
    save();
  }
  function afterPageMount(path) {
    if (path === "archive/login") {
      const input = $("#loginPwd");
      if (input) setTimeout(() => { try { input.focus(); } catch (e) {} }, 80);
    }
    if (path === "archive/page7") {
      const slot = $("#p7AdminSlot");
      if (slot && !state.flags.p7Admin) {
        setTimeout(() => {
          const s = $("#p7AdminSlot");
          if (!s) return;
          s.innerHTML = adminMessageHtml();
          s.className = "fade-up";
          state.flags.p7Admin = true;
          state.online = 1;
          const o = $("#p7OnlineVal");
          if (o) o.textContent = "1";
          Sound.glitch();
          save();
        }, 2300);
      }
      if (!state.flags.archiveUnlocked) return;
    }
    if (path === "forum/thread/b1") { /* ending B thread */ }
  }

  /* ---------------------------------------------------------- forum views */
  function forumShell(inner, opts) {
    opts = opts || {};
    const online = state.flags.stopped ? 0 : (state.flags.deepVisited ? Math.max(0, state.online) : D.forumStats.online);
    const updated = state.ending === "B" ? "2014-09-07 02:17" : D.forumStats.updated;
    return `
      <div class="forum">
        <div class="forum-head">
          <div class="fh-row">
            <div class="forum-brand">江汀街坊论坛<small>JIANGTING COMMUNITY BBS · EST. 2008</small></div>
            <div class="forum-stats">
              今日帖子 <b>${state.flags.stopped ? 0 : D.forumStats.today}</b> · 注册用户 <b>${D.forumStats.users}</b><br>
              当前在线 <b>${online}</b> 人 · 游客 1 人 · 最后更新 <b>${updated}</b><br>
              版主 <a data-nav="forum/profile/wind" class="hdr-link">晚风</a> · 管理员 <a data-nav="forum/profile/nan" class="hdr-link">南岸</a>
            </div>
          </div>
        </div>
        <div class="forum-nav">
          <a data-nav="forum/index">论坛首页</a>
          <a data-nav="forum/section/life">生活广场</a>
          <a data-nav="forum/section/repair">报修专区</a>
          <a data-nav="forum/section/notice">站务公告</a>
          <a data-nav="forum/photos">旧照片区</a>
          <a data-nav="forum/search">搜索</a>
          ${state.flags.stopped
            ? '<span class="nav-backup" style="padding:8px 9px;opacity:.5">备份入口已关闭</span>'
            : '<a class="nav-backup" data-nav="archive/login">旧站备份入口 →</a>'}
        </div>
        <div class="notice-strip">
          <b>${state.flags.stopped ? "已关闭" : "公告"}</b>
          <span>${state.flags.stopped ? "本论坛已停止运行。当前为只读存档，所有数据同步均已停止。" : (state.ending === "B" ? "最后更新：2014-09-07 02:17。论坛时间已停止。" : "本论坛将于 2014-09-08 02:30 停止运行。需要旧资料的用户请使用备份入口。")}</span>
        </div>
        <div class="forum-wrap">${inner}</div>
      </div>`;
  }
  function threadRow(t) {
    const p = D.people[t.author] || D.people.guest;
    let tags = "";
    if (t.pinned) tags += '<span class="tag">置顶</span>';
    if (t.warn) tags += '<span class="tag red">警告</span>';
    if (t.hot) tags += '<span class="tag red">热</span>';
    if (t.photo) tags += '<span class="tag blue">图</span>';
    const lastP = t.replies.length ? D.people[t.replies[t.replies.length - 1].by] : p;
    return `<a class="thread-row ${t.pinned ? "pinned" : ""}" data-nav="forum/thread/${t.id}">
      <span class="th-title">${tags}<span>${esc(t.title)}</span>${t.photo ? '<span class="clip">[照片]</span>' : ""}</span>
      <span class="th-author">${esc(p.name)}</span>
      <span class="th-replies"><b>${t.replies.length}</b></span>
      <span class="th-views">${t.views}</span>
      <span class="th-last"><b>${esc((t.last || t.time).slice(5, 16))}</b>${esc((lastP && lastP.name) || "")}</span>
    </a>`;
  }
  function threadTable(list) {
    return `<div class="thread-table">
      <div class="thread-head"><span>主题</span><span>作者</span><span>回复</span><span>查看</span><span style="text-align:right">最后发表</span></div>
      ${list.map(threadRow).join("")}
    </div>`;
  }
  function allThreads() {
    let list = D.threads.slice();
    if (state.ending === "B") {
      list.unshift({
        id: "b1", section: "notice", title: "这次，终于有人回答我了。", author: "wind",
        time: "2014-09-07 02:17", last: "2014-09-07 02:17", views: 1, pinned: true, virtual: true,
        body: "<p>这次，终于有人回答我了。</p>", replies: []
      });
    }
    return list;
  }
  function forumHome() {
    const list = allThreads();
    const latest = list.slice().sort((a, b) => (a.last || a.time) < (b.last || b.time) ? 1 : -1).slice(0, 8);
    const cards = D.sections.map((s) => `
      <a class="board-card" data-nav="${s.id === "photos" ? "forum/photos" : "forum/section/" + s.id}">
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.desc)}</p>
        <span class="bc-count">${s.count} 主题</span>
        <span class="bc-arrow">›</span>
      </a>`).join("");
    return forumShell(`
      <div class="crumb">江汀街坊论坛 › 论坛首页</div>
      <div class="board-grid">${cards}</div>
      <div class="section-title"><span>最新回复</span><span style="letter-spacing:0;color:#98a4ad;font-size:10px">按最后回复时间排序</span></div>
      ${threadTable(latest)}
      <div class="foot-links">
        <span>Powered by JiangtingBBS 2.6 · 页面执行时间 0.031 秒 · 当前时区 GMT+8</span>
        <span class="admin-link">${state.flags.stopped ? "服务器：已关闭" : state.ending === "B" ? "服务器：等待回答" : "管理员：南岸"}</span>
      </div>
    `);
  }
  function forumSection(id) {
    const sec = D.sections.find((s) => s.id === id);
    if (!sec) return errorPage("版块不存在", "该版块可能已被删除。", "forum/index", "返回论坛首页");
    if (id === "photos") return forumPhotos();
    const list = allThreads().filter((t) => t.section === id).sort((a, b) => {
      if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
      return (a.last || a.time) < (b.last || b.time) ? 1 : -1;
    });
    return forumShell(`
      <div class="crumb"><a data-nav="forum/index">江汀街坊论坛</a> › ${esc(sec.name)}</div>
      <div class="section-title"><span>${esc(sec.name)} · ${esc(sec.sub)}</span><span style="letter-spacing:0;color:#98a4ad;font-size:10px">版主：${id === "notice" ? "南岸" : "晚风"}</span></div>
      ${threadTable(list)}
      <div class="pager"><span class="on">1</span><span>2</span><span>3</span><span>›</span><span style="border:0;background:transparent;color:#93a0a8">共 ${Math.max(3, Math.ceil(list.length / 8))} 页</span></div>
      <div class="foot-links"><span>本版规则：请勿发布与版块无关的内容。</span><span>${state.flags.stopped ? "只读存档" : "新帖发布已关闭"}</span></div>
    `);
  }
  function postHead(p, meta, avatarSize) {
    return `<div class="post-head">
      <div class="post-avatar"><img src="assets/img/${p.avatar}" alt="${esc(p.name)}"></div>
      <div class="post-who">
        <div class="pw-name"><a data-nav="forum/profile/${p.name === "晚风" ? "wind" : p.name === "南岸" ? "nan" : p.name === "老周" ? "zhou" : p.name === "小满" ? "man" : p.name === "阿梅" ? "mei" : "chen"}">${esc(p.name)}</a>
          ${p.role ? `<span class="badge">${esc(p.role)}</span>` : ""}</div>
        <div class="pw-sub">${meta}</div>
      </div>
    </div>`;
  }
  function profileKey(name) {
    return { "南岸": "nan", "晚风": "wind", "老周": "zhou", "小满": "man", "阿梅": "mei", "小陈": "chen" }[name] || "guest";
  }
  function forumThread(id) {
    if (id === "b1" && state.ending === "B") {
      const t = allThreads().find((x) => x.id === "b1");
      return forumShell(`
        <div class="crumb"><a data-nav="forum/index">论坛首页</a> › 站务公告 › 本主题</div>
        <div class="post">
          ${postHead(D.people.wind, "发表于 2014-09-07 02:17　·　只看该作者")}
          <div class="post-body"><p class="big">这次，终于有人回答我了。</p><p class="faint">本主题由 南岸 于 2014-09-07 02:17 置顶</p></div>
          <div class="post-foot"><span>查看：1　·　回复：0</span><span>最后更新：2014-09-07 02:17</span></div>
        </div>
      `);
    }
    const t = D.threads.find((x) => x.id === id);
    if (!t) return errorPage("主题不存在", "该帖子可能已被删除或归档。", "forum/index", "返回论坛首页");
    const p = D.people[t.author];
    const photo = t.photo ? D.photos[t.photo] : null;
    const body = t.body + (photo ? `
      <div class="photo-card" style="margin:14px 0 4px;max-width:640px">
        <div class="photo-frame"><img src="${photo.src}" alt="${esc(t.caption || t.title)}" data-act="photo" data-photo="${t.photo}"></div>
        <div class="photo-cap"><b>${esc(t.title)}</b>${esc(t.caption || "")}</div>
      </div>` : "");
    const replies = t.replies.map((r) => {
      const rp = D.people[r.by];
      return `<div class="reply">
        <div class="post-avatar"><img src="assets/img/${rp.avatar}" alt="${esc(rp.name)}"></div>
        <div class="reply-main">
          <div class="reply-top"><b>${esc(rp.name)}</b><span>${esc(r.time)}</span><span>#${esc(String(t.replies.indexOf(r) + 2))}</span></div>
          <div class="reply-body">${r.body}</div>
        </div>
      </div>`;
    }).join("");
    return forumShell(`
      <div class="crumb"><a data-nav="forum/index">江汀街坊论坛</a> › <a data-nav="forum/section/${t.section}">${esc((D.sections.find((s) => s.id === t.section) || {}).name || "")}</a> › 本主题</div>
      <div class="post">
        ${postHead(p, "发表于 " + t.time + "　·　只看该作者")}
        <div class="post-body">${body}</div>
        <div class="post-foot"><span>查看：${t.views}　·　回复：${t.replies.length}</span><span>本帖最后由 ${esc(p.name)} 于 ${esc((t.last || t.time).slice(0, 16))} 编辑</span></div>
      </div>
      ${replies}
      <div class="reply-form">
        <textarea readonly placeholder="${state.flags.stopped ? "论坛已停止运行，只能查看。" : "游客（未登录）不能回复。本论坛已停止注册新用户。"}"></textarea>
        <div class="rf-row"><span>您需要登录后才能回复。${state.flags.stopped ? "服务器已关闭。" : ""}</span><button class="btn-forum" disabled>发表回复</button></div>
      </div>
      <div class="pager"><span class="on">1</span><span>2</span><span>下一页 ›</span></div>
      <div class="foot-links"><span>本主题共 ${t.replies.length + 1} 楼　·　浏览 ${t.views} 次</span><span class="admin-link" data-act="report">举报 | 申请删帖</span></div>
    `);
  }
  function forumPhotos() {
    const list = allThreads().filter((t) => t.photo);
    return forumShell(`
      <div class="crumb"><a data-nav="forum/index">江汀街坊论坛</a> › 旧照片区</div>
      <div class="section-title"><span>旧照片区 · 扫描件与翻拍</span><span style="letter-spacing:0;color:#98a4ad;font-size:10px">共 ${list.length} 张</span></div>
      <div class="photo-grid">
        ${list.map((t) => `
          <a class="photo-card" data-nav="forum/thread/${t.id}">
            <div class="photo-frame"><img src="${D.photos[t.photo].src}" alt="${esc(t.title)}"></div>
            <div class="photo-cap"><b>${esc(t.title)}</b>${esc(t.caption || "")}　<i>${esc(t.time.slice(0, 10))}</i></div>
          </a>`).join("")}
      </div>
      <div class="foot-links"><span>图片由居民上传，部分为翻拍件，清晰度有限。</span><span>版主：晚风</span></div>
    `);
  }
  function forumSearch() {
    const q = (ui.search || "").trim();
    const list = q ? allThreads().filter((t) => (t.title + " " + (t.body || "")).indexOf(q) >= 0) : [];
    return forumShell(`
      <div class="crumb"><a data-nav="forum/index">江汀街坊论坛</a> › 搜索</div>
      <div class="section-title"><span>站内搜索</span><span style="letter-spacing:0;color:#98a4ad;font-size:10px">仅检索标题与正文</span></div>
      <form data-form="search" style="display:flex;gap:6px;margin-bottom:12px;max-width:520px">
        <input name="q" value="${esc(q)}" placeholder="输入关键词，例如：晚风 / 值班 / 时间" style="flex:1;border:1px solid #b9c8d4;padding:6px 9px;font-size:12px;outline:none;background:#fff;color:#2b3a41">
        <button class="btn-forum" type="submit">搜索</button>
      </form>
      ${q ? `<div class="arc-note" style="color:#6f7d86;font-family:var(--sans)">找到 ${list.length} 条结果</div>` : `<div class="arc-note" style="color:#6f7d86;font-family:var(--sans)">输入关键词开始搜索。论坛索引建立于 2014-09-07 02:17。</div>`}
      ${list.length ? threadTable(list) : (q ? `<div class="arc-empty" style="color:#7b8790;border-color:#c8d4dd;background:#fff">没有找到相关主题。</div>` : "")}
    `);
  }
  function forumProfile(key) {
    const p = D.people[key] || D.people.guest;
    const isWind = key === "wind";
    const threads = allThreads().filter((t) => (isWind ? t.author === "wind" : t.author === key));
    if (isWind) { unlockClue("lastLogin"); }
    return forumShell(`
      <div class="crumb"><a data-nav="forum/index">江汀街坊论坛</a> › 用户资料 › ${esc(p.name)}</div>
      <div class="profile-card">
        <div class="pa"><img src="assets/img/${p.avatar}" alt="${esc(p.name)}"></div>
        <div class="pd">
          <h2>${esc(p.name)}${p.role ? ` <span style="font-size:10px;color:#6f7d86;font-family:var(--sans);font-weight:400">${esc(p.role)}</span>` : ""}</h2>
          <div class="psub">${isWind ? "该用户资料已归档。部分字段由备份系统提供。" : "该用户在线 · 最后登录 2014-09-07 " + (key === "nan" ? "02:17" : "00:26")}</div>
          <div class="kv">
            <b>注册时间</b><span>${esc(p.joined || "—")}</span>
            <b>发帖数</b><span>${isWind ? 1620 : p.posts}</span>
            <b>最后登录</b><span>${isWind ? "2014-09-07 02:17" : (key === "nan" ? "2014-09-07 02:17" : "2014-09-07 00:26")}</span>
            <b>用户组</b><span>${esc(p.role || "居民")}</span>
            ${isWind ? '<b>账号状态</b><span style="color:#a4422f">资料归档 · 暂停访问</span>' : ""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:#6f7d86">签名：${esc(p.sig || "—")}</div>
        </div>
      </div>
      ${isWind ? `<div class="profile-note">南岸：晚风的个人资料页暂时不要再打开了。最后登录时间以首页显示为准。<br><span style="color:#a4422f">（最后登录：2014-09-07 02:17）</span></div>` : ""}
      <div class="section-title"><span>该用户发表的主题</span></div>
      ${threads.length ? threadTable(threads) : `<div class="arc-empty" style="color:#7b8790;border-color:#c8d4dd;background:#fff">该用户没有公开的主题。${isWind ? "部分主题已被归档或删除。" : ""}</div>`}
      <div class="foot-links"><span>用户编号：${isWind ? "UID 0317" : "UID 1" + (Math.abs(key.charCodeAt(0) * 37) % 900 + 100)}</span><span>查询时间：2014-09-07 02:17</span></div>
    `);
  }

  /* ---------------------------------------------------------- archive views */
  function arcShell(inner, active) {
    return `
      <div class="archive">
        <div class="arc-top">
          <div class="arc-brand">JIANGTING <span>ARCHIVE</span></div>
          <div class="arc-sub">旧站备份系统 · RECOVERED MATERIALS / 2014—2014</div>
        </div>
        <div class="arc-status">
          <div><small>系统时间 / SYSTEM</small><b>02:17</b></div>
          <div class="warn"><small>备份时间 / BACKUP</small><b>02:30</b></div>
          <div class="warn"><small>时间差 / DRIFT</small><b>+13:00</b></div>
        </div>
        <div class="arc-warn">警告：部分资料可能存在时间记录异常。访问权限：已通过 · 当前用户：GUEST</div>
        <div class="arc-nav">
          <a data-nav="archive/index" class="${active === "index" ? "on" : ""}">归档首页</a>
          <a data-nav="archive/delayed" class="${active === "delayed" ? "on" : ""}">延迟记录</a>
          <a data-nav="archive/deleted" class="${active === "deleted" ? "on" : ""}">已注销成员</a>
          <a data-nav="archive/conversations" class="${active === "conversations" ? "on" : ""}">未完成的对话</a>
          <span class="spacer"></span>
          <a data-nav="forum/index" class="on" style="color:#7f9992">← 返回表面论坛</a>
        </div>
        <div class="arc-body">${inner}</div>
        <div class="arc-footer"><span>JIANGTING-07 / LOCAL ARCHIVE NODE</span><span>最后同步：<b>2014-09-07 02:30</b> · 连接状态：<b>异常</b></span></div>
      </div>`;
  }
  function archiveLogin() {
    if (state.flags.archiveUnlocked) return archiveIndex();
    return `
      <div class="arc-login">
        <div class="login-card">
          <h2>旧站备份入口</h2>
          <div class="lc-sub">JIANGTING ARCHIVE / RESTRICTED ACCESS</div>
          <form data-form="login">
            <label class="login-label" for="loginPwd">请输入四位数字口令</label>
            <input id="loginPwd" name="pwd" class="login-input" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••">
            <button class="login-btn" type="submit">验证并进入</button>
            <div class="login-msg" id="loginMsg"></div>
          </form>
          <div class="login-foot">口令来源：<b>版主「晚风」最后一次登录时间</b><br>备份数据只读。请勿在公共设备上停留过久。</div>
        </div>
      </div>`;
  }
  function archiveIndex() {
    const jumpCard = `
      <div class="arc-card future">
        <div class="ac-head">
          <h3>归档帖 #0007 · 七个人的值班记录</h3>
          <span class="ac-time">02:30 / 未完成</span>
        </div>
        <div class="ac-meta">发帖人：南岸 · 原始时间：02:17 · 备份时间：02:30 · 状态：部分可读</div>
        <div class="ac-body"><p>本主题共 6 页。最后一条回复由系统在 02:30 自动写入。</p><p class="dim">页面下方注明：最后一次备份不一定是最后一页。</p></div>
        <div class="arc-pager">
          <button disabled>1</button><button disabled>2</button><button disabled>3</button>
          <button disabled>4</button><button disabled>5</button><button disabled>6</button>
          <form class="arc-jump" data-form="p7jump">
            <span>跳至</span><input name="page" maxlength="2" inputmode="numeric" aria-label="页码"><button type="submit">GO</button>
          </form>
        </div>
        <div class="arc-hint" id="jumpMsg">共 6 页。<b>最后一次备份不一定是最后一页。</b></div>
      </div>`;
    return arcShell(`
      <div class="arc-note">ARCHIVE OVERVIEW · 共 3 个异常板块 / 4 条延迟记录 / 1 名已注销成员</div>
      <a class="arc-card" style="display:block;text-decoration:none" data-nav="archive/delayed">
        <div class="ac-head"><h3>01　延迟记录</h3><span class="ac-time">4 ENTRIES</span></div>
        <div class="ac-meta">DELAYED RECORDS · 02:30 — 03:09</div>
        <div class="ac-body"><p>这些回复在表面论坛没有对应的发帖时间。它们来自未来十三分钟。</p></div>
      </a>
      <a class="arc-card" style="display:block;text-decoration:none" data-nav="archive/deleted">
        <div class="ac-head"><h3>02　已注销成员</h3><span class="ac-time">1 MEMBER</span></div>
        <div class="ac-meta">DEREGISTERED ACCOUNTS · 最后访问 02:17</div>
        <div class="ac-body"><p>账号已经注销。但访问记录仍在增加。</p></div>
      </a>
      <a class="arc-card" style="display:block;text-decoration:none" data-nav="archive/conversations">
        <div class="ac-head"><h3>03　未完成的对话</h3><span class="ac-time">3 THREADS</span></div>
        <div class="ac-meta">UNFINISHED CONVERSATIONS · 备份中断</div>
        <div class="ac-body"><p>其中有两条对话没有结尾。第三条，正在输入。</p></div>
      </a>
      ${jumpCard}
      <div class="arc-hint">提示：备份系统与表面论坛的时间并不一致。请对照两侧页面底部的时间。</div>
    `, "index");
  }
  function archiveDelayed() {
    unlockClue("repliesOld");
    return arcShell(`
      <div class="arc-note">延迟记录 / DELAYED RECORDS — 按备份时间排序</div>
      ${D.delayed.map((d) => {
        const p = D.people[d.by];
        return `<div class="arc-card future">
          <div class="ac-head"><h3>${esc(d.title)}</h3><span class="ac-time">${esc(d.time)}</span></div>
          <div class="ac-meta">发帖人：${esc(p.name)} · 来源：${d.source ? '<a data-nav="forum/thread/' + d.source + '" style="color:#7d9c92">原始帖子 #' + d.source + '</a>' : '<span style="color:#a06f5f">无来源记录</span>'}</div>
          <div class="ac-body">${d.body}</div>
          <div class="ac-source"><span>备份偏移：+13:00</span><span>复制状态：成功</span><span>只读</span></div>
        </div>`;
      }).join("")}
      <div class="arc-note">内容缺失的主题 / 3 条（只保留标题与时间）</div>
      ${[
        ["关于二楼的钥匙", "2014-09-04 23:12", "管理员"],
        ["值班表（被删除页）", "2014-09-05 01:40", "老周"],
        ["监控，02:17", "2014-09-06 02:17", "未知"]
      ].map((x) => `<div class="arc-card">
        <div class="ac-head"><h3>${esc(x[0])}</h3><span class="ac-time">${esc(x[1])}</span></div>
        <div class="ac-meta">发帖人：${esc(x[2])} · 内容已丢失</div>
        <div class="ac-body"><p class="dim">主体内容未完成备份。只保留标题与发帖时间。</p></div>
      </div>`).join("")}
      <div class="arc-hint">这四条记录的时间都晚于表面论坛的最后更新时间（02:17）。<br>其中一条，在表面论坛里找不到任何来源。</div>
    `, "delayed");
  }
  function archiveDeleted() {
    const m = D.member;
    return arcShell(`
      <div class="arc-note">已注销成员 / DEREGISTERED MEMBERS — 共 1 人</div>
      <div class="arc-profile">
        <div class="apa">无照片<br>NO IMAGE</div>
        <div class="apd">
          <h2>${esc(m.name)} <span style="font-size:10px;color:#7f9992;letter-spacing:0">/ ${esc(m.real)}</span></h2>
          <div class="sub">账号状态：<span style="color:#c0705a">${esc(m.state)}</span>　·　注销时间：${esc(m.deleted)}</div>
          <div class="arc-kv">
            <b>注册时间</b><span>${esc(m.reg)}</span>
            <b>最后登录</b><span class="good">${esc(m.last)}</span>
            <b>发帖总数</b><span>${m.posts}</span>
            <b>注销后访问</b><span class="bad">${m.visits} 次（02:17—03:22）</span>
            <b>最后来源</b><span>GUEST / 本机</span>
            <b>头像</b><span>档案照片缺失</span>
          </div>
        </div>
      </div>
      <div class="arc-note">备注</div>
      <div class="arc-card">
        <div class="ac-body"><p>${esc(m.note)}</p><p class="dim">系统建议：不要尝试通过回复唤醒该账号。</p></div>
        <div class="ac-source"><span>记录编号 0007—0009</span><span>关联：第七页</span></div>
      </div>
      <div class="arc-hint">已注销的账号不该有新的访问记录。<br>除非访问者不是她。</div>
    `, "deleted");
  }
  function archiveConversations() {
    const locked = !state.p7Seen;
    return arcShell(`
      <div class="arc-note">未完成的对话 / UNFINISHED CONVERSATIONS — 备份中断</div>
      ${D.conversations.map((c) => {
        if (c.locked && locked) {
          return `<div class="arc-card">
            <div class="ac-head"><h3>${esc(c.title)}</h3><span class="ac-time">LOCKED</span></div>
            <div class="ac-meta">发帖人：${esc(c.by)} · 需要完成第七页的读取</div>
            <div class="ac-body"><p class="dim">该对话尚未完成备份。访问被拒绝。</p></div>
          </div>`;
        }
        return `<div class="arc-card">
          <div class="ac-head"><h3>${esc(c.title)}</h3><span class="ac-time">${esc(c.time)}</span></div>
          <div class="ac-meta">发帖人：${esc(D.people[c.by].name)} · 备份状态：${c.guest ? '<span style="color:#dfa75c">输入中</span>' : "中断"}</div>
          <div class="ac-body">${c.body}</div>
          <div class="ac-source"><span>${c.guest ? "来源：本机 / GUEST" : "来源：对话缓存"}</span><span>只读</span></div>
        </div>`;
      }).join("")}
      <div class="arc-hint">${locked ? "先找到第七页，才能读完这里的对话。" : "第三条对话的发帖人，是当前访问者。"}</div>
    `, "conversations");
  }

  /* ---------------------------------------------------------- page 7 */
  function p7Shell(inner, online) {
    return `<div class="p7">
      <div class="p7-top">
        <div class="p7-title">第 7 页</div>
        <div class="p7-online">当前在线人数：<b id="p7OnlineVal">${online}</b> · <span class="typing">正在输入……</span></div>
      </div>
      <div class="p7-crumb"><span>JIANGTING ARCHIVE · RECORD 0007 · PAGE 07</span><a data-nav="archive/index">← 返回备份系统</a></div>
      ${inner}
    </div>`;
  }
  function archivePage7() {
    const first = !state.p7Seen;
    state.p7Seen = true;
    state.visits.p7++;
    state.visits.deep++;
    unlockClue("page7");
    unlockClue("onlineAnomaly");
    if (state.flags.deepVisited && !state.ending) { state.online = 1; }
    save();
    const v = state.visits.p7;
    if (state.ending === "B") return page7AfterB();
    let extra = "";
    if (v >= 2 && !state.ending) {
      const lines = ["你刚才来过。", "我记得你。", "你也是从 02:17 开始的吗？", "你现在的回答，也在备份里。"];
      extra = `<p class="quiet">${lines[Math.min(v - 2, lines.length - 1)]}</p>`;
    }
    const adminHtml = state.flags.p7Admin ? adminMessageHtml() : "";
    const truth = state.flags.truth;
    const last = state.flags.lastNote;
    return p7Shell(`
      <div class="p7-post">
        <div class="p7-meta">主题：<b>最后一次回复</b><br>发帖人：<b>晚风</b>　发布时间：<b>2014-09-07 03:22</b></div>
        <div class="p7-body">
          <p class="fade">哥。</p>
          <p class="fade" style="animation-delay:.18s">你还在吗？</p>
          <p class="fade" style="animation-delay:.4s">如果你还在看这条消息，<br>不要再回复我了。</p>
          <p class="fade quiet" style="animation-delay:.7s">这里没有人。</p>
          ${extra}
        </div>
      </div>
      <div id="p7AdminSlot" class="${state.flags.p7Admin ? "fade-up" : "hidden"}">${adminHtml}</div>
      <div class="p7-actions">
        <button class="p7-btn" data-nav="archive/conversations">未完成的对话</button>
        ${truth ? '<button class="p7-btn" data-act="open-records">查看原始记录</button>' : '<span class="arc-hint" style="margin:0">此页为只读副本。原始记录需要更高权限。</span>'}
        ${last && !state.ending ? '<button class="p7-btn danger" data-act="stop-sync">停止同步</button>' : ""}
      </div>
      ${last && !state.ending ? `
        <form class="p7-reply" data-form="reply">
          <label for="p7Reply">以「访客」身份回复第 7 页</label>
          <textarea id="p7Reply" name="text" placeholder="输入回复……"></textarea>
          <div class="row">
            <span class="hint">任何输入都会被写入备份。发送前请再想一次。</span>
            <button class="p7-btn" type="submit">发送</button>
          </div>
          <div class="login-msg" id="replyMsg"></div>
        </form>` : ""}
      <div class="arc-footer" style="margin:24px 0 0"><span>PAGE 07 / COPY OF LOCAL RECORD</span><span>当前在线：<b>${last ? 1 : 1}</b> · 连接：<b>${last ? "等待输入" : "异常"}</b></span></div>
    `, state.ending === "A" ? 0 : 1);
  }
  function adminMessageHtml() {
    return `<div class="p7-admin">
      <div class="p7-meta">自动加载的管理员消息 · 02:31</div>
      <div class="txt">
        <p>我找到她了。</p>
        <p>不对。</p>
        <p>我找到的只是她留下的东西。</p>
        <p>我终于明白了。</p>
        <p>她早就离开了。</p>
      </div>
    </div>`;
  }
  function page7AfterB() {
    return p7Shell(`
      <div class="p7-post">
        <div class="p7-meta">主题：<b>最后一次回复</b><br>发帖人：<b>晚风</b>　发布时间：<b>2014-09-07 03:22</b></div>
        <div class="p7-body">
          <p>哥。</p>
          <p>你还在吗？</p>
          <p class="quiet">这里没有人。</p>
        </div>
      </div>
      <div class="p7-admin fade-up">
        <div class="p7-meta">访客 · 2014-09-07 02:17　回复成功</div>
        <div class="txt"><p>我在。</p></div>
      </div>
      <div class="p7-admin fade-up">
        <div class="p7-meta">晚风 · 2014-09-07 02:17</div>
        <div class="txt"><p>这次，终于有人回答我了。</p></div>
      </div>
      <div class="p7-actions">
        <button class="p7-btn" data-nav="forum/index">返回论坛首页</button>
        <span class="arc-hint" style="margin:0">页面已停止更新。在线人数：2。</span>
      </div>
      <div class="arc-footer" style="margin:24px 0 0"><span>PAGE 07 / SYNC COMPLETE</span><span>最后更新时间：<b>2014-09-07 02:17</b></span></div>
    `, 2);
  }
  function errorPage(title, desc, back, backLabel) {
    return `<div class="error-page">
      <h2>${esc(title)}</h2>
      <p>${esc(desc)}</p>
      <p style="color:#4e615b">服务器时间：2014/09/07 02:17　·　本机：JIANGTING-07</p>
      <p><a data-nav="${esc(back)}" style="color:#7fe3c4">← ${esc(backLabel || "返回")}</a></p>
    </div>`;
  }

  /* ---------------------------------------------------------- login & jump */
  function doLogin(form) {
    const input = form.querySelector("input[name='pwd']");
    const msg = $("#loginMsg");
    const val = (input.value || "").trim();
    if (val === "0217") {
      state.flags.archiveUnlocked = true;
      unlockClue("pwd");
      save();
      Sound.unlock();
      msg.style.color = "#7fe3c4";
      msg.textContent = "口令正确。正在载入备份索引……";
      setTimeout(() => {
        setPath("archive", "archive/index", true);
        renderBrowser();
        onView("archive/index");
        toast("备份系统已解锁", "深层论坛比表面论坛晚 13 分钟。", 4500);
      }, 650);
    } else {
      input.classList.add("err");
      state.loginFails = (state.loginFails || 0) + 1;
      msg.textContent = val.length !== 4 ? "口令必须为四位数字。" : "口令错误。访问记录已写入日志。";
      if (state.loginFails >= 2) msg.textContent += "（提示：晚风最后一次登录时间可在论坛首页或她的资料页找到。）";
      Sound.blip(120, 0.12, "sawtooth", 0.02);
      setTimeout(() => input.classList.remove("err"), 900);
    }
  }
  function doJump(form) {
    const input = form.querySelector("input[name='page']");
    const hint = $("#jumpMsg");
    const val = (input.value || "").trim();
    if (!state.clues.key07) {
      input.classList.add("err");
      if (hint) { hint.innerHTML = "页码超出范围。共 6 页。"; hint.style.color = "#c0705a"; }
      Sound.click();
      setTimeout(() => input.classList.remove("err"), 900);
      return;
    }
    if (val === "7") {
      setPath("archive", "archive/page7", true);
      renderBrowser();
      onView("archive/page7");
      Sound.glitch();
      return;
    }
    input.classList.add("err");
    if (hint) { hint.innerHTML = "页码超出范围。共 6 页。<b>最后一次备份不一定是最后一页。</b>"; hint.style.color = "#c0705a"; }
    setTimeout(() => input.classList.remove("err"), 900);
  }

  /* ---------------------------------------------------------- clues */
  function unlockClue(id, silent) {
    if (state.clues[id]) return;
    const def = D.clues.find((c) => c.id === id);
    if (!def) return;
    state.clues[id] = { t: Date.now() };
    save();
    updateChrome();
    if (!silent) {
      toast("线索已归档 · " + clueCount() + "/" + clueTotal, def.name, 3200);
      Sound.unlock();
    }
    if (clueCount() === clueTotal) {
      setTimeout(() => toast("全部线索已归档", "你已经看到了这个备份里的所有碎片。", 5000), 1600);
    }
    if (ui.drawer) renderDrawer();
  }

  /* ---------------------------------------------------------- drawer */
  function openDrawer() {
    ui.drawer = true;
    renderDrawer();
    $("#drawer").classList.remove("hidden");
    Sound.click();
  }
  function closeDrawer() {
    ui.drawer = false;
    const d = $("#drawer");
    if (d) { d.classList.add("hidden"); d.innerHTML = ""; }
  }
  function hintForState() {
    if (!state.flags.readme) return "先看桌面上的「请先阅读.txt」。上面写着从哪里开始。";
    if (!state.flags.forumVisited) return "双击桌面上的「江汀街坊论坛」。线索都在公开区。";
    if (!state.clues.lastLogin) return "版主晚风的最后登录时间，在论坛首页和她的个人资料里都能看到。";
    if (!state.flags.archiveUnlocked) return "打开论坛右上角的「旧站备份入口」。四位口令就是晚风最后登录时间的小时与分钟：0217。";
    if (!state.flags.deepVisited) return "进入备份系统后，先看三个板块。注意页面顶部的「系统时间」与「备份时间」。";
    if (!state.clues.offset13) return "对照一下：表面论坛停在 02:17，深层备份显示 02:30。中间差了 13 分钟。";
    if (!state.clues.key07) return "报修专区里老周的《那天的钥匙》提到一块钥匙牌，上面有一个数字。";
    if (!state.p7Seen) return "在备份首页的「七个人的值班记录」下，把那个数字填进页码跳转框。共 6 页，但最后一次备份不一定是最后一页。";
    if (!state.flags.truth) return "回到桌面，打开「聊天记录」。隐藏邮件的日期在论坛关闭之后。";
    if (!state.flags.records) return "再进入第七页。读完邮件后，页面底部会出现「查看原始记录」。";
    if (!state.flags.lastNote) return "回到桌面，打开新出现的「最后一条.txt」。";
    if (!state.ending) return "停不停止同步，回不回答，都是选择。没有正确结局，只有你愿意留下的东西。";
    return "你已经抵达结局。可以重新开始，走另一条路。";
  }
  function renderDrawer() {
    const total = clueTotal, got = clueCount();
    const discovered = D.clues.filter((c) => state.clues[c.id]);
    const list = discovered.map((c) => `<div class="clue">
        <div class="clue-head"><span class="clue-num">${String(D.clues.indexOf(c) + 1).padStart(2, "0")}</span><span class="clue-name">${esc(c.name)}</span></div>
        <div class="clue-text">${esc(c.text)}</div>
      </div>`).join("") +
      (total - got > 0 ? `<div class="clue locked">
        <div class="clue-head"><span class="clue-num">··</span><span class="clue-name">还有 ${total - got} 条线索未归档</span></div>
        <div class="clue-text">继续调查，或在提示中寻找方向。</div>
      </div>` : "");
    $("#drawer").innerHTML = `
      <div class="drawer-top"><h2>调查记录</h2><button class="drawer-close" data-act="close-drawer">×</button></div>
      <div class="drawer-prog">
        <div class="dp-row"><span>已归档线索</span><b>${got} / ${total}</b></div>
        <div class="dp-bar"><i style="width:${Math.round(got / total * 100)}%"></i></div>
        ${state.ending ? `<div class="dp-row" style="margin-top:8px"><span>已抵达结局</span><b>${state.ending === "A" ? "停止同步" : "新的回帖"}</b></div>` : ""}
      </div>
      <div class="drawer-list">${list}</div>
      <div class="drawer-foot">
        <div class="drawer-hint"><b>下一步提示</b>${esc(hintForState())}</div>
        <div class="drawer-btns">
          <button class="primary" data-act="hint">再提示一次</button>
          <button data-act="save-now">保存进度</button>
          <button data-act="reset">重新开始</button>
        </div>
      </div>`;
  }

  /* ---------------------------------------------------------- modal */
  function openModal(html, wide) {
    const root = $("#overlay");
    root.classList.remove("hidden");
    root.innerHTML = `<div class="modal ${wide ? "wide" : ""}" role="dialog">${html}</div>`;
    root.onclick = (e) => { if (e.target === root) closeModal(); };
  }
  function closeModal() {
    const root = $("#overlay");
    root.classList.add("hidden");
    root.innerHTML = "";
    root.onclick = null;
    if (ui.endingShown && state.ending) {
      setTimeout(() => {
        if (!state.ending) return;
        if (state.ending === "A") showEndingA(); else showEndingB(false);
      }, 40);
      return;
    }
    if (ui.titleActive) { showTitle(); return; }
    if (state.flags.records) renderDesktop();
  }
  function openRecords() {
    state.flags.records = true;
    unlockClue("records");
    save();
    openModal(`
      <button class="m-close" data-act="close-modal">×</button>
      <h3>原始记录 / ORIGINAL RECORDS</h3>
      <p>以下内容来自论坛后台的旧记录。原始时间与备份时间不一致。</p>
      <div class="records">
        ${D.records.map((r) => `
          <div class="record">
            <div class="rec-no">记录编号：${esc(r.no)}</div>
            <div class="kv2">
              <b>原始发帖人</b><span>${esc(r.author)}</span>
              <b>原始内容</b><span>${esc(r.content)}</span>
              <b>原始时间</b><span>${esc(r.origin)}</span>
              <b>备份时间</b><span>${esc(r.backup)}</span>
              <b>复制状态</b><span class="${r.ok ? "ok" : "pending"}">${esc(r.state)}</span>
            </div>
          </div>`).join("")}
      </div>
      <div class="record-quote">备份不是保存。备份是复制。<br>你看到的每一句“她还在”，都只是一个晚十三分钟的副本。</div>
      <p style="margin-top:12px;color:#6f857f">关闭后，桌面上会出现一个新的文件。</p>
      <div class="m-btns"><button class="m-btn pri" data-act="close-records">关闭并返回</button></div>
    `, true);
  }
  function cannotReplyModal() {
    openModal(`
      <button class="m-close" data-act="close-modal">×</button>
      <h3>无法回复</h3>
      <p>游客没有回复权限。本论坛已于 2014-09-07 02:30 停止注册与发帖。</p>
      <p class="dimtext">如果你需要留言，请使用旧站备份系统。</p>
      <div class="m-btns"><button class="m-btn pri" data-act="close-modal">知道了</button></div>
    `);
  }

  /* ---------------------------------------------------------- toasts */
  let toastTimers = [];
  function clearToasts() {
    const wrap = $("#toasts");
    if (wrap) wrap.innerHTML = "";
  }
  function toast(title, text, ms) {
    const wrap = $("#toasts");
    if (!wrap) return;
    while (wrap.children.length >= 2) wrap.removeChild(wrap.firstChild);
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<b>${esc(title)}</b>${esc(text || "")}`;
    wrap.appendChild(el);
    const t = setTimeout(() => {
      el.classList.add("out");
      setTimeout(() => el.remove(), 380);
    }, ms || 3200);
    toastTimers.push(t);
  }

  /* ---------------------------------------------------------- lightbox */
  function openLightbox(key) {
    const p = D.photos[key];
    if (!p) return;
    const thread = D.threads.find((t) => t.photo === key);
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = `<img src="${p.src}" alt="${esc(thread ? thread.title : "")}">
      <div class="lb-cap">${esc(thread ? thread.title : "")}　${esc(thread ? thread.caption : "")}<br><span style="color:#5f756e;font-size:10px">点击空白处关闭</span></div>`;
    lb.addEventListener("click", () => lb.remove());
    document.body.appendChild(lb);
    Sound.click();
  }

  /* ---------------------------------------------------------- endings */
  function stopSync() {
    openModal(`
      <h3>停止同步？</h3>
      <p>停止同步后，深层备份将不再与表面论坛连接。当前页面会关闭，并且不会再出现。</p>
      <p>已经存在的回复不会被删除。它们只是不再更新。</p>
      <div class="m-btns">
        <button class="m-btn" data-act="close-modal">取消</button>
        <button class="m-btn warn" data-act="confirm-stop">停止同步</button>
      </div>
    `);
  }
  function confirmStop() {
    closeModal();
    clearToasts();
    state.ending = "A";
    state.flags.stopped = true;
    state.online = 0;
    save();
    Sound.glitch();
    const po = $("#powerOff");
    po.classList.remove("hidden");
    po.innerHTML = "";
    setTimeout(() => {
      po.classList.add("hidden");
      renderDesktop();
      showShutdownCinematic();
    }, 700);
  }
  function showShutdownCinematic() {
    const root = $("#overlay");
    root.classList.remove("hidden");
    root.innerHTML = `<div style="position:fixed;inset:0;background:#000;display:flex;align-items:center;justify-content:center;font-family:var(--mono);color:#8fb3a8">
      <div id="shutdownLines" style="font-size:12px;line-height:2.2;letter-spacing:.08em;min-width:260px"></div>
    </div>`;
    const lines = ["正在停止数据同步……", "断开本地备份连接……", "表面论坛：已关闭", "当前在线人数：0", "数据同步：已停止", "", "正在等待计算机安全关闭……"];
    let i = 0;
    const el = $("#shutdownLines");
    const tick = setInterval(() => {
      if (i >= lines.length) { clearInterval(tick); setTimeout(showEndingA, 900); return; }
      el.innerHTML += lines[i] + "<br>"; i++;
    }, 380);
  }
  function showEndingA() {
    closeWindow();
    const mins = Math.max(1, Math.round((Date.now() - (state.startedAt || Date.now())) / 60000));
    showEnding({
      kicker: "ENDING A / SYNCHRONIZATION STOPPED",
      tag: "推荐结局",
      alt: false,
      title: "无人回复",
      text: "你关掉了那台旧电脑上仍然开着的东西。深层论坛消失了，服务器状态变成“已关闭”，在线人数归零。<br><br>顾晚没有失踪。她只是离开了。论坛里那些“晚风”的回复，是来自十三分钟后的副本在寻找一个回答。",
      quote: "有些回复，不需要等待。",
      stats: { mins: mins, clues: clueCount() + "/" + clueTotal, ending: "A" }
    });
  }
  function showEndingB(cinematic) {
    clearToasts();
    state.ending = "B";
    state.online = 2;
    save();
    const reveal = () => {
      const mins = Math.max(1, Math.round((Date.now() - (state.startedAt || Date.now())) / 60000));
      showEnding({
        kicker: "ENDING B / NEW REPLY POSTED",
        tag: "另一个选择",
        alt: true,
        title: "新的回帖",
        text: "你回复了那个问题。02:17，访客的回复显示成功，在线人数从 1 变成 2。一个新的帖子出现在论坛首页，发帖人是晚风。<br><br>论坛的最后更新时间停在 02:17。循环从这里开始，或者从来就没有结束。",
        quote: "这次，终于有人回答我了。",
        stats: { mins: mins, clues: clueCount() + "/" + clueTotal, ending: "B" }
      });
    };
    if (!cinematic) { closeWindow(); reveal(); return; }
    if (ui.win && ui.win.type === "browser") {
      ui.tab = "archive";
      setPath("archive", "archive/page7", false);
      renderBrowser();
      const v = $("#browserView"); if (v) v.scrollTop = 0;
    }
    Sound.glitch();
    setTimeout(() => {
      closeWindow();
      const po = $("#powerOff");
      po.classList.remove("hidden");
      po.innerHTML = "";
      setTimeout(() => {
        po.classList.add("hidden");
        reveal();
      }, 650);
    }, 2600);
  }
  function showEnding(o) {
    clearToasts();
    const root = $("#overlay");
    root.classList.remove("hidden");
    root.innerHTML = `
      <div class="ending">
        <div class="ending-inner">
          <div class="ending-kicker">${esc(o.kicker)}</div>
          <span class="ending-tag ${o.alt ? "alt" : ""}">${esc(o.tag)}</span>
          <h1 class="ending-title">${esc(o.title)}</h1>
          <p class="ending-text">${o.text}</p>
          <div class="ending-quote">“${esc(o.quote)}”</div>
          <div class="ending-stats">
            <div><small>调查用时 / TIME</small><b>${o.stats.mins} 分钟</b></div>
            <div><small>归档线索 / CLUES</small><b>${o.stats.clues}</b></div>
            <div><small>结局编号 / END</small><b>${o.stats.ending}</b></div>
          </div>
          <div class="ending-actions">
            <button data-act="ending-desktop">回到桌面</button>
            <button data-act="ending-restart">重新开始</button>
            <button data-act="ending-about">关于本作</button>
          </div>
          <div class="ending-foot">ECHO LAYER / PAGE SEVEN<br>2014-09-07 02:17 — 2014-09-07 03:22<br>所有人物、论坛与事件均为虚构。</div>
        </div>
      </div>`;
    ui.endingShown = true;
  }
  function endingToDesktop() {
    ui.endingShown = false;
    ui.titleActive = false;
    closeModal();
    closeWindow();
    hideTitle();
    $("#overlay").classList.add("hidden");
    $("#overlay").innerHTML = "";
    renderDesktop();
    updateChrome();
    if (state.ending === "A") {
      toast("本机时间：2014/09/08", "「论坛备份」可以打开了。", 4600);
    } else {
      toast("论坛已恢复访问", "最后更新时间：2014-09-07 02:17", 4200);
    }
  }

  /* ---------------------------------------------------------- start menu */
  function toggleStart(force) {
    const m = $("#startMenu");
    const open = typeof force === "boolean" ? force : m.classList.contains("hidden");
    ui.startOpen = open;
    m.classList.toggle("hidden", !open);
    $("#startBtn").classList.toggle("on", open);
    if (!open) return;
    const endingItem = state.ending ? `<button data-act="ending-recap"><span>${state.ending === "A" ? "结局 A · 无人回复" : "结局 B · 新的回帖"}</span><span class="mi-note">回顾</span></button>` : "";
    m.innerHTML = `
      <div class="start-banner">JIANGTING-07</div>
      <button data-app="explorer"><span style="width:18px">${ICONS.pc}</span>我的电脑</button>
      <button data-app="forum"><span style="width:18px">${ICONS.forum}</span>江汀街坊论坛</button>
      <button data-app="chat"><span style="width:18px">${ICONS.chat}</span>聊天记录</button>
      <button data-app="readme"><span style="width:18px">${ICONS.txt}</span>请先阅读.txt</button>
      <button data-act="open-clue"><span style="width:18px">${ICONS.search}</span>调查记录</button>
      <button data-act="about"><span style="width:18px">${ICONS.folder}</span>关于本机</button>
      <div class="sep"></div>
      ${endingItem}
      <button data-act="reset"><span style="width:18px">${ICONS.last}</span>重新开始</button>
      <div class="start-foot">
        <button data-act="logout">注销 Administrator</button>
        <button data-act="shutdown">关闭计算机</button>
      </div>`;
  }
  function about() {
    openModal(`
      <button class="m-close" data-act="close-modal">×</button>
      <h3>关于本机</h3>
      <div class="arc-kv" style="font-size:10.5px;line-height:1.9">
        <b>计算机名</b><span>JIANGTING-07</span>
        <b>操作系统</b><span>Microsoft Windows XP Embedded (模拟)</span>
        <b>处理器</b><span>Pentium(R) Dual-Core E5200 2.50GHz</span>
        <b>内存</b><span>2.00 GB</span>
        <b>本地时间</b><span>2014/09/07 02:17</span>
        <b>网络状态</b><span>已连接 · 本地 Intranet</span>
        <b>存档位置</b><span>本浏览器 localStorage</span>
      </div>
      <hr class="arc-rule">
      <h3 style="font-size:14px;margin-top:4px">关于本作</h3>
      <p>《回声层：第七页》是一段原创网络怪谈解谜。你用一台2014年的旧电脑，调查一个已经关闭的社区论坛。没有跳吓，没有追逐，只有一个不断等待回答的页面。</p>
      <p>所有人物、论坛、事件均为虚构。照片为程序生成或 AI 生成的虚构档案素材，不对应任何真实人物。</p>
      <p style="color:#5f756e">设计文本依据创作笔记重新编写；界面、代码与素材为本作独立实现。</p>
      <div class="m-btns"><button class="m-btn pri" data-act="close-modal">关闭</button></div>
    `, true);
  }
  function shutdownConfirm() {
    openModal(`
      <h3>关闭计算机</h3>
      <p>关闭后需要重新启动游戏。当前调查进度会自动保存。</p>
      <div class="m-btns"><button class="m-btn" data-act="close-modal">取消</button><button class="m-btn warn" data-act="shutdown-now">关机</button></div>
    `);
  }
  function shutdownNow() {
    ui.titleActive = false;
    clearToasts();
    closeModal(); closeWindow(); closeDrawer();
    $("#overlay").classList.add("hidden");
    $("#overlay").innerHTML = "";
    $("#desktop").classList.add("hidden");
    $("#boot").classList.remove("hidden");
    $("#bootFace").classList.add("hidden");
    $("#bootLog").textContent = "正在关机……\n\n正在保存系统设置……\n\n计算机已安全关闭。";
    $("#bootLog").style.color = "#7fe3c4";
    Sound.set(false);
    $("#boot").innerHTML = `<div class="boot-inner" style="text-align:center">
      <pre class="boot-log" style="color:#7fe3c4;min-height:0;text-align:left">正在关机……

正在保存系统设置……

计算机已安全关闭。</pre>
      <button class="boot-enter" data-act="power-on" style="margin-top:34px">重新启动</button>
      <div class="boot-note">JIANGTING-07 / 2014-09-07 02:17</div>
    </div>`;
  }

  /* ---------------------------------------------------------- reset */
  function resetGame() {
    openModal(`
      <h3>重新开始？</h3>
      <p>当前存档、已归档线索和结局记录都会被清除。这个操作无法撤销。</p>
      <div class="m-btns"><button class="m-btn" data-act="close-modal">取消</button><button class="m-btn warn" data-act="reset-now">清除存档并重新开始</button></div>
    `);
  }
  function resetNow() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    location.reload();
  }

  /* ---------------------------------------------------------- forms */
  function handleSubmit(e) {
    const form = e.target.closest("form[data-form]");
    if (!form) return;
    e.preventDefault();
    const kind = form.dataset.form;
    if (kind === "login") return doLogin(form);
    if (kind === "p7jump") return doJump(form);
    if (kind === "search") {
      const q = (form.querySelector("input[name='q']").value || "").trim();
      ui.search = q;
      return navigate("forum/search");
    }
    if (kind === "addr") {
      const raw = (form.querySelector("#addrInput").value || "").trim();
      return followAddress(raw);
    }
    if (kind === "reply") return sendReply(form);
  }
  function followAddress(raw) {
    let s = raw.replace(/^https?:\/\//i, "").replace(/^jiangting\.local/i, "").replace(/^\/+/, "").replace(/\.html?$/i, "").replace(/\?.*$/, "");
    if (!s || s === "index") s = ui.tab === "archive" ? "archive/index" : "forum/index";
    s = s.replace(/^forum\//, "forum/");
    if (s === "forum" || s === "forum/index") return navigate("forum/index");
    if (s === "archive" || s === "archive/index") return navigate(state.flags.archiveUnlocked ? "archive/index" : "archive/login");
    if (s === "archive/login" || s === "archive/delayed" || s === "archive/deleted" || s === "archive/conversations" || s === "archive/page7" ||
        s === "forum/photos" || s === "forum/search" ||
        /^forum\/section\/(life|repair|notice|photos)$/.test(s) ||
        /^forum\/thread\/[a-z0-9]+$/.test(s) ||
        /^forum\/profile\/(nan|wind|zhou|man|mei|chen)$/.test(s)) {
      if (s.indexOf("archive/") === 0 && !state.flags.archiveUnlocked) return navigate("archive/login");
      return navigate(s);
    }
    const err = `<div class="error-page"><h2>无法访问此页面</h2><p>Internet Explorer 无法显示该网页。地址可能已失效，或该页面位于已关闭的服务器上。</p><p><b>${esc(raw)}</b></p><p><a data-nav="forum/index" style="color:#7fe3c4">返回论坛首页</a></p></div>`;
    $("#browserView").innerHTML = err;
  }
  function sendReply(form) {
    const ta = form.querySelector("textarea");
    const msg = $("#replyMsg");
    const val = (ta.value || "").trim();
    if (!state.flags.lastNote || state.ending) return;
    if (!val) { if (msg) msg.textContent = "回复不能为空。"; return; }
    if (val === "我在。" || val === "我在" || val === "我在！" || val === "我在!") {
      if (msg) { msg.style.color = "#7fe3c4"; msg.textContent = "正在发送……"; }
      Sound.unlock();
      setTimeout(() => {
        state.flags.replySent = val;
        save();
        ui.replyAttempts = 0;
        showEndingB(true);
      }, 700);
    } else {
      ui.replyAttempts++;
      if (msg) {
        msg.style.color = "#c0705a";
        msg.textContent = ui.replyAttempts >= 2
          ? "没有回应。页面上的光标仍在闪。最后一条.txt 已经说得很清楚。"
          : "没有回应。页面上的光标仍在闪。";
      }
      Sound.glitch();
    }
  }

  /* ---------------------------------------------------------- actions */
  function openApp(app) {
    switch (app) {
      case "explorer": openWindow("explorer"); return;
      case "forum":
        if (state.ending === "B") { openBrowser("forum", "forum/index"); }
        else { openBrowser("forum"); }
        return;
      case "chat": openWindow("chat"); return;
      case "readme": openNotepad("readme"); return;
      case "last":
        if (!(state.flags.records || state.ending === "A")) { cannotReplyModal(); return; }
        openNotepad("last"); return;
      case "backup":
        if (state.flags.stopped) {
          openNotepad("backup");
        } else {
          openModal(`
            <button class="m-close" data-act="close-modal">×</button>
            <h3>文件正在被使用</h3>
            <p>无法打开「论坛备份」。文件正在被另一个程序使用，或尚未完成同步。</p>
            <p class="dimtext">错误 0x00000007 · 磁盘上的数据可能不完整。</p>
            <div class="m-btns"><button class="m-btn pri" data-act="close-modal">关闭</button></div>
          `);
        }
        return;
      case "clues": openDrawer(); return;
    }
  }
  function clickAction(act, el) {
    switch (act) {
      case "win-close": closeWindow(); return;
      case "win-min": closeWindow(); return;
      case "win-max": Sound.click(); return;
      case "win-focus": Sound.click(); return;
      case "switch-tab": ui.tab = el.dataset.tab; renderBrowser(); return;
      case "nav-back":
        if (ui.idx[ui.tab] > 0) {
          ui.idx[ui.tab]--; renderBrowser(); onView(curPath());
        }
        return;
      case "nav-fwd":
        if (ui.idx[ui.tab] < ui.hist[ui.tab].length - 1) {
          ui.idx[ui.tab]++; renderBrowser(); onView(curPath());
        }
        return;
      case "nav-refresh":
        if (ui.tab === "archive" && curPath() === "archive/page7" && !state.flags.truth) {
          toast("不要再刷新页面。", "页面上的时间可能不会回来。", 3600);
          Sound.glitch();
        }
        renderBrowser();
        onView(curPath());
        return;
      case "nav-home":
        navigate(ui.tab === "archive" ? (state.flags.stopped ? "archive/login" : "archive/index") : "forum/index");
        return;
      case "tab": ui.tab = el.dataset.tab; renderBrowser(); return;
      case "open-clue": openDrawer(); return;
      case "close-drawer": closeDrawer(); return;
      case "hint":
        state.flags.hintsUsed++;
        save();
        renderDrawer();
        toast("提示", hintForState(), 5200);
        return;
      case "save-now":
        save();
        toast("调查记录已保存", "存档保存在本浏览器中。", 2600);
        return;
      case "reset": resetGame(); return;
      case "reset-now": resetNow(); return;
      case "about": toggleStart(false); about(); return;
      case "close-modal": closeModal(); return;
      case "close-records":
        closeModal();
        renderDesktop();
        setTimeout(() => toast("桌面出现了一个新文件", "最后一条.txt", 4200), 350);
        return;
      case "open-records":
        openRecords();
        return;
      case "stop-sync": stopSync(); return;
      case "confirm-stop": confirmStop(); return;
      case "photo": openLightbox(el.dataset.photo); return;
      case "report": cannotReplyModal(); return;
      case "chat-select":
        ui.chats = el.dataset.chat;
        renderChat($("#winBody"));
        return;
      case "open-email": openEmail(); return;
      case "title-continue": startGame(false); return;
      case "title-start": startGame(true); return;
      case "title-help":
        openModal(`
          <button class="m-close" data-act="close-modal">×</button>
          <h3>操作与提示</h3>
          <p>点击桌面图标打开程序。论坛和备份系统在浏览器里，左下角可以后退。</p>
          <p>所有密码都能在故事里找到明确来源，不需要猜。线索会自动归档，点击状态栏的「线索簿」查看。</p>
          <p>游戏会自动保存。关闭浏览器后再打开，深层备份的标签页仍在。</p>
          <p>有声音开关，默认关闭。建议在安静环境里读完每一段文字。</p>
          <div class="m-btns"><button class="m-btn pri" data-act="close-modal">开始</button></div>
        `);
        return;
      case "ending-desktop": endingToDesktop(); return;
      case "ending-restart": resetGame(); return;
      case "ending-about": about(); return;
      case "ending-recap":
        toggleStart(false);
        if (state.ending === "A") showEndingA();
        else showEndingB(false);
        return;
      case "shutdown": toggleStart(false); shutdownConfirm(); return;
      case "shutdown-now": shutdownNow(); return;
      case "power-on": location.reload(); return;
      case "logout":
        toggleStart(false);
        openModal(`<h3>注销当前用户</h3><p>当前用户 Administrator 无法注销。系统只有一个本地账户。</p><div class="m-btns"><button class="m-btn pri" data-act="close-modal">关闭</button></div>`);
        return;
      case "open-backup": openApp("backup"); return;
    }
  }

  /* ---------------------------------------------------------- global events */
  document.addEventListener("click", (e) => {
    const appEl = e.target.closest("[data-app]");
    if (appEl) {
      e.preventDefault();
      toggleStart(false);
      openApp(appEl.dataset.app);
      return;
    }
    const navEl = e.target.closest("[data-nav]");
    if (navEl) {
      e.preventDefault();
      const p = navEl.dataset.nav;
      if (p.indexOf("archive/") === 0 && !state.flags.archiveUnlocked) navigate("archive/login");
      else navigate(p);
      return;
    }
    const actEl = e.target.closest("[data-act]");
    if (actEl) {
      e.preventDefault();
      if (actEl.dataset.act === "start-menu") { toggleStart(); return; }
      clickAction(actEl.dataset.act, actEl);
      return;
    }
    if (!e.target.closest("#startMenu") && !e.target.closest("#startBtn")) toggleStart(false);
  });
  document.addEventListener("submit", handleSubmit);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ($("#overlay").classList.contains("hidden") === false && !ui.endingShown) closeModal();
      if (ui.drawer) closeDrawer();
      if ($("#startMenu") && !$("#startMenu").classList.contains("hidden")) toggleStart(false);
      const lb = $(".lightbox"); if (lb) lb.remove();
    }
    if (e.key === "Enter" && e.target && e.target.id === "bootEnter") { e.preventDefault(); $("#bootEnter").click(); }
  });
  $("#boot").addEventListener("pointerdown", () => {}, { passive: true });

  /* ---------------------------------------------------------- boot wiring */
  $("#startBtn").addEventListener("click", (e) => { e.stopPropagation(); toggleStart(); });
  $("#clueBtn").addEventListener("click", (e) => { e.stopPropagation(); openDrawer(); });
  $("#soundBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    state.sound = !state.sound;
    Sound.set(state.sound);
    updateChrome(); save();
    toast(state.sound ? "环境音已开启" : "环境音已关闭", state.sound ? "一种很低的电流声。" : "", 2200);
  });
  $("#overlay").addEventListener("click", (e) => {
    if (e.target.id === "overlay" && !ui.endingShown) closeModal();
  });

  /* ---------------------------------------------------------- init */
  runBoot();
  updateChrome();
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") save(); });
  window.addEventListener("beforeunload", save);
})();
