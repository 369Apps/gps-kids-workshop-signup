/* GPS Kids Daily - v1 */
(function () {
  "use strict";

  var STORE_KEY = "gpsk_done_v1";
  var DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var DAY_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

  function todayStr(d) {
    var y = d.getFullYear();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    return y + "-" + m + "-" + day;
  }

  function loadDone() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveDone(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function streakInfo(done) {
    var set = {};
    done.forEach(function (d) { set[d] = true; });
    var total = done.length;
    var cursor = new Date();
    var todayS = todayStr(cursor);
    // streak counts back from today, or from yesterday if today not done yet
    if (!set[todayS]) cursor.setDate(cursor.getDate() - 1);
    var streak = 0;
    while (set[todayStr(cursor)]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return { streak: streak, total: total, set: set };
  }

  // Monday = game 0 ... Sunday = game 6
  var now = new Date();
  var gameIndex = (now.getDay() + 6) % 7;
  var game = GAMES[gameIndex];
  var todayS = todayStr(now);

  // ---- Today tab ----
  document.getElementById("today-dayname").textContent = DAY_NAMES[gameIndex] + "'s game";
  document.getElementById("today-time").textContent = game.time;
  document.getElementById("today-title").textContent = game.title;
  var currentGameTitle = game.title;
  document.getElementById("today-tagline").textContent = game.tagline;
  var stepsEl = document.getElementById("today-steps");
  game.steps.forEach(function (s) {
    var li = document.createElement("li");
    li.textContent = s;
    stepsEl.appendChild(li);
  });
  document.getElementById("today-win").textContent = game.win;

  var doneBtn = document.getElementById("done-btn");
  var streakLine = document.getElementById("streak-line");

  function refresh() {
    var done = loadDone();
    var info = streakInfo(done);
    var isDone = info.set[todayS] === true;

    doneBtn.textContent = isDone ? "Done for today. Nice work." : "We did it";
    doneBtn.classList.toggle("done", isDone);
    document.getElementById("share-nudge").hidden = !isDone;

    if (info.streak > 0) {
      streakLine.innerHTML = "<strong>" + info.streak + "</strong> day" +
        (info.streak === 1 ? "" : "s") + " in a row. Keep it going.";
    } else {
      streakLine.textContent = "Tap We did it after tonight's game to start your streak.";
    }

    document.getElementById("streak-num").textContent = info.streak;
    document.getElementById("streak-word").textContent = info.streak === 1 ? "day streak" : "day streak";
    document.getElementById("total-num").textContent = info.total;

    var note = document.getElementById("streak-note");
    if (info.streak >= 7) note.textContent = "A full week of speaking up. Most adults can't do that.";
    else if (info.streak >= 3) note.textContent = "Three days in a row. Your kid is building a real habit.";
    else if (info.streak >= 1) note.textContent = "One day down. Come back tomorrow for the next game.";
    else note.textContent = "Play tonight's game, tap We did it, and your streak starts here.";

    // week dots: last 7 days
    var dots = document.getElementById("week-dots");
    dots.innerHTML = "";
    for (var i = 6; i >= 0; i--) {
      var d = new Date(now);
      d.setDate(d.getDate() - i);
      var s = todayStr(d);
      var dot = document.createElement("div");
      dot.className = "dot" + (info.set[s] ? " hit" : "") + (s === todayS ? " today" : "");
      dot.textContent = DAY_SHORT[(d.getDay() + 6) % 7];
      dot.title = s;
      dots.appendChild(dot);
    }
  }

  doneBtn.addEventListener("click", function () {
    var done = loadDone();
    var i = done.indexOf(todayS);
    var markingDone = (i === -1);
    if (markingDone) {
      done.push(todayS);
      pingUsage(currentGameTitle);
    } else {
      done.splice(i, 1);
    }
    saveDone(done);
    refresh();
    maybeShowLead();
  });

  // ---- Library tab ----
  var lib = document.getElementById("library-list");
  GAMES.forEach(function (g, i) {
    var card = document.createElement("div");
    card.className = "lib-card";

    var head = document.createElement("button");
    head.className = "lib-head";
    head.innerHTML = '<span><span class="t">' + g.title + '</span><div class="d">' +
      DAY_NAMES[i] + " &middot; " + g.time + "</div></span>" + '<span class="chev">+</span>';

    var body = document.createElement("div");
    body.className = "lib-body";
    var p = document.createElement("p");
    p.textContent = g.tagline;
    body.appendChild(p);
    var ol = document.createElement("ol");
    g.steps.forEach(function (s) {
      var li = document.createElement("li");
      li.textContent = s;
      ol.appendChild(li);
    });
    body.appendChild(ol);
    var win = document.createElement("p");
    win.innerHTML = "<strong>Win to watch for:</strong> ";
    win.appendChild(document.createTextNode(g.win));
    body.appendChild(win);

    head.addEventListener("click", function () {
      card.classList.toggle("open");
    });

    card.appendChild(head);
    card.appendChild(body);
    lib.appendChild(card);
  });

  // ---- Tab bar ----
  var tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
      document.getElementById("tab-" + btn.getAttribute("data-tab")).classList.add("active");
      window.scrollTo(0, 0);
    });
  });

  // ---- Install hint ----
  var banner = document.getElementById("install-banner");
  var dismissed = false;
  try { dismissed = localStorage.getItem("gpsk_install_dismissed") === "1"; } catch (e) {}
  var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (!dismissed && !isStandalone) {
    if (isIOS) {
      document.getElementById("install-text").textContent =
        "iPhone tip: tap Share, then Add to Home Screen for one-tap games.";
    }
    banner.hidden = false;
  }
  document.getElementById("install-close").addEventListener("click", function () {
    banner.hidden = true;
    try { localStorage.setItem("gpsk_install_dismissed", "1"); } catch (e) {}
  });

  var PING_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe2s_ZhuHrEBCeh708tqdRFt2JwERroPEIPQXIY3OYSwuFczA/formResponse";
  var PING_ENTRY = { game: "entry.796797999", refcode: "entry.1576147400" };

  // POST a Google Form the honest way: fetch with no-cors. The promise
  // resolves when the request is actually sent and rejects on real network
  // failure (offline, blocked). No fake success states.
  function postForm(url, fields) {
    var body = Object.keys(fields).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(fields[k]);
    }).join("&");
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
      keepalive: true
    });
  }
  function postFormTimeout(url, fields, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; reject(new Error("timeout")); } }, ms);
      postForm(url, fields).then(
        function () { if (!done) { done = true; clearTimeout(t); resolve(); } },
        function (e) { if (!done) { done = true; clearTimeout(t); reject(e); } });
    });
  }

  // Anonymous usage ping: one per "We did it" tap. No personal data.
  function pingUsage(gameTitle) {
    if (!gameTitle || navigator.onLine === false) return;
    try {
      var fields = {};
      fields[PING_ENTRY.game] = gameTitle;
      fields[PING_ENTRY.refcode] = getRefCode();
      postForm(PING_URL, fields).catch(function () {});
    } catch (e) {}
  }

  // ---- Referral codes, sharing, lead capture (v2) ----
  var REF_KEY = "gpsk_refcode_v1";
  var REFBY_KEY = "gpsk_referred_by_v1";
  var LEAD_KEY = "gpsk_lead_v1";
  var APP_URL = "https://register.joingpskids.com/app/";
  var FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfasXtI7ylt7MWxhmz8UU9yj84jyyhxqngrOkWL0Rftjrcl2A/formResponse";
  var ENTRY = {
    name: "entry.915876472",
    email: "entry.298491126",
    refby: "entry.762823434",
    refcode: "entry.962628300"
  };

  function getRefCode() {
    var c = null;
    try { c = localStorage.getItem(REF_KEY); } catch (e) {}
    if (!/^GK-[A-Z0-9]{6}$/.test(c || "")) {
      var chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
      c = "GK-";
      var rnd = [];
      var i;
      if (window.crypto && crypto.getRandomValues) {
        var buf = new Uint32Array(6);
        crypto.getRandomValues(buf);
        for (i = 0; i < 6; i++) rnd.push(buf[i]);
      } else {
        for (i = 0; i < 6; i++) rnd.push(Math.floor(Math.random() * 4294967296));
      }
      for (i = 0; i < 6; i++) c += chars[rnd[i] % chars.length];
      try { localStorage.setItem(REF_KEY, c); } catch (e) {}
    }
    return c;
  }

  function getReferredBy() {
    try { return localStorage.getItem(REFBY_KEY) || ""; } catch (e) { return ""; }
  }

  // Capture ?ref= on load. First touch wins; never overwrite.
  (function () {
    var m = /[?&]ref=([A-Za-z0-9-]+)/.exec(location.search);
    if (m) {
      var inbound = decodeURIComponent(m[1]).toUpperCase();
      if (/^GK-[A-Z0-9]{6}$/.test(inbound) && inbound !== getRefCode() && !getReferredBy()) {
        try { localStorage.setItem(REFBY_KEY, inbound); } catch (e) {}
      }
      try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) {}
    }
  })();

  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.hidden = false;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); t.hidden = true; }, 3000);
  }

  function doShare(text) {
    var link = APP_URL + "?ref=" + getRefCode();
    if (navigator.share) {
      navigator.share({ title: "GPS Kids Daily", text: text, url: link }).catch(function () {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text + " " + link).then(
        function () { toast("Link copied. Paste it to a parent."); },
        function () { toast("Copy this link: " + link); });
    } else {
      window.prompt("Copy this link and send it to a parent:", link);
    }
  }

  document.getElementById("share-btn").addEventListener("click", function () {
    doShare("We've been playing one 5-minute speaking game a night from this little app. My kid actually asks for it now. Thought yours might like it too:");
  });

  // Share nudge: fires right at the "We did it" win, with tonight's game in the text.
  document.getElementById("share-win-btn").addEventListener("click", function () {
    doShare("We just played '" + currentGameTitle + "' at dinner. 5 minutes, no prep, my kid loved it. Free game every night here:");
  });

  // ---- Soft lead capture: ask once after the first "We did it" ----
  var leadCard = document.getElementById("lead-card");
  function leadState() {
    try { return localStorage.getItem(LEAD_KEY) || "none"; } catch (e) { return "done"; }
  }
  function setLeadState(s) { try { localStorage.setItem(LEAD_KEY, s); } catch (e) {} }

  function maybeShowLead() {
    var st = leadState();
    if (st === "done") return;
    var done = loadDone();
    if ((st === "none" && done.length >= 1) ||
        (st === "later" && done.length >= 3)) {
      leadCard.hidden = false;
    }
  }

  document.getElementById("lead-dismiss").addEventListener("click", function () {
    leadCard.hidden = true;
    setLeadState(leadState() === "later" ? "done" : "later");
  });

  document.getElementById("lead-submit").addEventListener("click", function () {
    var nameEl = document.getElementById("lead-name");
    var emailEl = document.getElementById("lead-email");
    var msg = document.getElementById("lead-msg");
    var name = nameEl.value.trim();
    var email = emailEl.value.trim().toLowerCase();
    if (!name) {
      msg.hidden = false;
      msg.textContent = "Please add your name so we know what to call you.";
      nameEl.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.hidden = false;
      msg.textContent = "Please enter a valid email address.";
      emailEl.focus();
      return;
    }
    var btn = document.getElementById("lead-submit");
    btn.disabled = true;
    btn.textContent = "Joining...";

    // POST to Google Form with fetch (no-cors). "You are in." shows only
    // after the request is actually sent. A real failure keeps the form
    // usable with a retry message instead of a fake confirmation.
    var fields = {};
    fields[ENTRY.name] = name;
    fields[ENTRY.email] = email;
    fields[ENTRY.refby] = getReferredBy();
    fields[ENTRY.refcode] = getRefCode();
    postFormTimeout(FORM_URL, fields, 15000).then(function () {
      setLeadState("done");
      leadCard.innerHTML = '<div class="lead-title">You are in.</div>' +
        '<p class="lead-sub">Tomorrow\'s game lands in your inbox at 7 AM.</p>';
    }, function () {
      btn.disabled = false;
      btn.textContent = "Send me tomorrow's game";
      msg.hidden = false;
      msg.textContent = "Hmm, that didn't go through. Check your connection and try again.";
    });
  });

  refresh();
  maybeShowLead();
})();
