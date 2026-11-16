/* Sryaestart · 手机端底部导航 + 上滑面板 */
(function () {
  "use strict";
  try {
  var icons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.6 12 3l9 7.6V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z"/></svg>',
    dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/></svg>',
    news: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2z"/><path d="M19 8h1.5a1.5 1.5 0 0 1 1.5 1.5V18a2 2 0 0 1-2 2"/><path d="M8 9h6M8 13h6M8 17h3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.9-3.6 3.9-5.6 7.5-5.6s6.6 2 7.5 5.6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6v12M6 12h12"/></svg>',
    checkin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3.4" y="5.2" width="17.2" height="15.4" rx="3.2"/><path d="M8 2.9v4.2M16 2.9v4.2M3.4 10h17.2"/><path d="M8.9 15.5l2.1 2.1 4.1-4.3"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 .8C5.73.8.5 6.03.5 12.3c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12.3C23.5 6.03 18.27.8 12 .8Z"/></svg>',
  };
  var page = document.body.getAttribute("data-mnav") || "";
  var activeKey = page;

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  /* 只看元素自身状态：父容器可能被本样式表隐藏（header 在手机端整块藏起来），
     用 offsetParent 判断会把「已登录 / 有管理权限」全判成 false。 */
  function on(n) {
    if (!n || n.hidden) return false;
    if (n.classList && n.classList.contains("hidden")) return false;
    var s = getComputedStyle(n);
    return s.display !== "none" && s.visibility !== "hidden";
  }
  function isShown(sel) { return on(document.querySelector(sel)); }

  /* ---------- 底栏 ---------- */
  var nav = el("div", "mnav");
  var bar = el("div", "mnav-bar");

  function item(key, href, label, icon, onClick, ext) {
    var tag = href ? "a" : "button";
    var n = el(tag, "mnav-item" + (activeKey === key ? " is-active" : ""));
    n.innerHTML = icons[icon] + "<span>" + label + "</span>";
    if (href) {
      n.href = href;
      if (ext) { n.target = "_blank"; n.rel = "noopener noreferrer"; }
    } else { n.type = "button"; n.addEventListener("click", onClick); }
    return n;
  }

  bar.appendChild(item("home", "home.html", "首页", "home"));
  bar.appendChild(item("checkin", "checkin.html", "签到", "checkin"));
  bar.appendChild(item("news", "news.html", "资讯", "news"));

  var plus = el("button", "mnav-plus", icons.plus);
  plus.type = "button";
  plus.setAttribute("aria-label", "接入游戏");
  plus.addEventListener("click", function () {
    var add = document.getElementById("btn-add-game");
    if (page === "dashboard" && on(add)) { add.click(); return; }
    location.href = "index.html";
  });
  bar.appendChild(plus);

  bar.appendChild(item("dashboard", "index.html", "看板", "dash"));
  bar.appendChild(item("me", null, "我的", "user", function () { openSheet(); }));
  bar.appendChild(item("github", "https://github.com/Sryae07/starwaves", "GitHub", "github", null, true));
  nav.appendChild(bar);
  document.body.appendChild(nav);

  /* ---------- 上滑面板 ---------- */
  var sheet = el("div", "mnav-sheet");
  sheet.innerHTML = '<div class="mnav-sheet-bg"></div><div class="mnav-sheet-panel" role="dialog" aria-modal="true" aria-label="更多操作">' +
    '<div class="mnav-sheet-grip"></div><button class="mnav-close" aria-label="关闭">✕</button><div class="mnav-body"></div></div>';
  document.body.appendChild(sheet);
  var body = sheet.querySelector(".mnav-body");
  var bg = sheet.querySelector(".mnav-sheet-bg");
  sheet.querySelector(".mnav-close").addEventListener("click", closeSheet);
  bg.addEventListener("click", closeSheet);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  function row(opts) {
    var n = el(opts.href ? "a" : "button", "mnav-row" + (opts.primary ? " mnav-row-primary" : ""));
    if (opts.href) n.href = opts.href;
    else n.type = "button";
    n.innerHTML = '<span class="mnav-row-ico">' + opts.icon + "</span><span>" + opts.label + "</span>" +
      (opts.extra ? '<span class="mnav-row-extra">' + opts.extra + "</span>" : "");
    if (opts.click) n.addEventListener("click", function () { closeSheet(); setTimeout(opts.click, 120); });
    return n;
  }
  function clickOn(id) {
    return function () { var b = document.getElementById(id); if (b) b.click(); };
  }
  function buildSheet() {
    body.innerHTML = "";
    var userBox = document.getElementById("auth-userbox");
    var name = document.getElementById("auth-user");
    var title = el("div", "mnav-sheet-title", on(userBox)
      ? "已登录 · " + (name ? name.textContent : "")
      : "账号");
    body.appendChild(title);
    if (on(userBox)) {
      body.appendChild(row({ icon: "🚪", label: "退出登录", click: clickOn("btn-logout") }));
    } else if (isShown("#btn-login")) {
      body.appendChild(row({ icon: "👤", label: "登录 / 注册", primary: true, click: clickOn("btn-login") }));
    }
    body.appendChild(row({ icon: "📅", label: "签到中心", href: "checkin.html", extra: "连续天数 / 时长统计" }));
    body.appendChild(row({ icon: "🗂", label: "数据看板", href: "index.html" }));
    body.appendChild(row({ icon: "📡", label: "资讯中心", href: "news.html" }));

    var acts = [
      ["🔄", "刷新", "btn-refresh"],
      ["🧹", "强制刷新", "btn-force-refresh"],
      ["➕", "接入游戏", "btn-add-game"],
      ["🖼", "背景", "btn-bg"],
      ["🔗", "分享主页", "btn-share"],
      ["⬆", "更新数据", "btn-update"],
      ["⏻", "远程关机", "btn-shutdown"],
    ];
    var any = false;
    var wrap = el("div", "mnav-sheet-title", "快捷操作");
    var rows = [];
    acts.forEach(function (a) {
      var b = document.getElementById(a[2]);
      if (!b) return;
      // 手机上 header 整块 display:none，用 on() 判断会把所有按钮误判为"不存在"，
      // 所以这里只看按钮自身的 hidden 类（app.js 用 hidden 控制可用性/机主权限）。
      var ok = !b.classList.contains("hidden");
      // 关机按钮由「机主」权限控制，个别情况下 hidden 类没被摘掉，用用户名上的 👑 兜底。
      if (!ok && a[2] === "btn-shutdown") {
        var who = document.getElementById("auth-user");
        if (who && who.textContent.indexOf("👑") >= 0) ok = true;
      }
      if (ok) rows.push(row({ icon: a[0], label: a[1], click: clickOn(a[2]) }));
    });
    if (rows.length) { body.appendChild(wrap); rows.forEach(function (r) { body.appendChild(r); }); any = true; }
    if (!any && page === "home") body.appendChild(row({ icon: "🚀", label: "进入启动器", href: "index.html", primary: true }));
    body.appendChild(row({ icon: "💻", label: "GitHub", href: "https://github.com/Sryae07/starwaves" }));
  }
  function openSheet() {
    buildSheet();
    sheet.classList.add("open");
    document.documentElement.style.overflow = "hidden";
  }
  function closeSheet() {
    sheet.classList.remove("open");
    document.documentElement.style.overflow = "";
  }
  window.SWMNav = { open: openSheet, close: closeSheet };
  } catch (e) {
    window.__mnavErr = (e && e.stack) || String(e);
  }
})();
