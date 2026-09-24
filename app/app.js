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
  // ---- Step-through player: one cue per screen, no reading ahead ----
  var playCues = game.cues || game.steps || [];
  var playFlow = document.getElementById("play-flow");
  var playStart = document.getElementById("play-start");
  var playStep = document.getElementById("play-step");
  var playCount = document.getElementById("play-count");
  var playCue = document.getElementById("play-cue");
  var playNext = document.getElementById("play-next");
  var winBox = document.getElementById("win-box");
  var stepIdx = -1;
  function showStep(i) {
    stepIdx = i;
    playStart.hidden = true;
    playStep.hidden = false;
    playCount.textContent = (i + 1) + " of " + playCues.length;
    playCue.textContent = playCues[i];
    playNext.textContent = i === playCues.length - 1 ? "We did it" : "Next";
  }
  playStart.addEventListener("click", function () { showStep(0); });
  playNext.addEventListener("click", function () {
    if (stepIdx < playCues.length - 1) showStep(stepIdx + 1);
    else doneBtn.click();
  });
  document.getElementById("today-win").textContent = game.win;

  // Doodles: glanceable cards, minimal reading.
  function setDoodle(id, svg) {
    var el = document.getElementById(id);
    if (el && svg) el.innerHTML = svg;
  }
  if (typeof DOODLES !== "undefined") {
    setDoodle("today-doodle", DOODLES.game[gameIndex]);
    setDoodle("streak-doodle", DOODLES.streak);
    setDoodle("leaders-doodle", DOODLES.leaders);
    setDoodle("draw-doodle", DOODLES.draw);
    setDoodle("pitch-doodle", DOODLES.mic);
  }

  var doneBtn = document.getElementById("done-btn");
  var streakLine = document.getElementById("streak-line");

  // ---- Speaker levels: progression titles by total games played ----
  var LEVELS = [
    { at: 1, name: "Rookie Voice" },
    { at: 3, name: "Table Talker" },
    { at: 7, name: "Week Warrior" },
    { at: 14, name: "Confident Speaker" },
    { at: 30, name: "Dinner Table Champion" },
    { at: 60, name: "Legend in the Making" }
  ];
  function levelFor(total) {
    var idx = -1, next = null, i;
    for (i = 0; i < LEVELS.length; i++) {
      if (total >= LEVELS[i].at) idx = i;
      else { next = LEVELS[i]; break; }
    }
    return { idx: idx, name: idx >= 0 ? LEVELS[idx].name : "", next: next };
  }

  var WIN_MSGS = [
    "Your voice just got braver.",
    "Confidence rep banked.",
    "Louder, prouder, stronger.",
    "Your kid just out-spoke yesterday.",
    "That's how leaders are made.",
    "One more rep. The mic fears you now."
  ];
  var COACH_TWIST = "Twist for tomorrow: let your kid run the game. Coaches learn fastest.";

  function celebrate() {
    var layer = document.getElementById("confetti-layer");
    if (!layer) return;
    var colors = ["#ffd166", "#ffffff", "#7bdff2", "#ffb3c7", "#f4f6ff"];
    for (var i = 0; i < 70; i++) {
      (function () {
        var p = document.createElement("div");
        p.className = "confetti-piece";
        var size = 6 + Math.random() * 8;
        p.style.left = (Math.random() * 100) + "vw";
        p.style.width = size + "px";
        p.style.height = (size * 0.6) + "px";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (1.8 + Math.random() * 1.6) + "s";
        layer.appendChild(p);
        setTimeout(function () { p.remove(); }, 3600);
      })();
    }
  }

  function refresh() {
    var done = loadDone();
    var info = streakInfo(done);
    var isDone = info.set[todayS] === true;

    doneBtn.textContent = isDone ? "Done for today. Nice work." : "We did it";
    doneBtn.classList.toggle("done", isDone);
    // Player visible while playing; celebration (win line) after done.
    playFlow.hidden = isDone;
    winBox.hidden = !isDone;
    doneBtn.hidden = !isDone;
    document.getElementById("share-nudge").hidden = !isDone;
    document.getElementById("board-nudge").hidden = !isDone || !!getNick();
    if (typeof lbData !== "undefined" && lbData) updateRecruitLine(lbData);

    if (info.streak > 0) {
      streakLine.innerHTML = "<strong>" + info.streak + "</strong> day" +
        (info.streak === 1 ? "" : "s") + " in a row. Keep it going.";
    } else {
      streakLine.textContent = "Tap We did it after tonight's game to start your streak.";
    }

    document.getElementById("streak-num").textContent = info.streak;
    document.getElementById("streak-word").textContent = info.streak === 1 ? "day streak" : "day streak";
    document.getElementById("total-num").textContent = info.total;

    var lvl = levelFor(info.total);
    var badge = document.getElementById("level-badge");
    if (badge) {
      badge.hidden = false;
      if (lvl.idx >= 0) {
        document.getElementById("level-name").textContent = lvl.name;
        document.getElementById("level-next").textContent = lvl.next
          ? (lvl.next.at - info.total) + " more game" + ((lvl.next.at - info.total) === 1 ? "" : "s") + " to " + lvl.next.name
          : "Max level. Absolute legend.";
      } else {
        document.getElementById("level-name").textContent = "No title yet";
        document.getElementById("level-next").textContent = "Play tonight's game to earn your first title.";
      }
    }

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
    var beforeLevel = levelFor(done.length).idx;
    if (markingDone) {
      done.push(todayS);
      pingUsage(currentGameTitle);
    } else {
      done.splice(i, 1);
      pingUndo(currentGameTitle);
    }
    saveDone(done);
    refresh();
    if (markingDone) {
      celebrate();
      var afterLevel = levelFor(done.length).idx;
      if (afterLevel > beforeLevel) {
        toast("LEVEL UP! " + LEVELS[afterLevel].name + "!");
      } else if (done.length % 3 === 0) {
        toast(COACH_TWIST);
      } else {
        toast(WIN_MSGS[Math.floor(Math.random() * WIN_MSGS.length)]);
      }
    }
    maybeShowLead();
  });

  // ---- Library tab ----
  function addGameCard(container, title, sub, g, doodle) {
    var card = document.createElement("div");
    card.className = "lib-card";

    var head = document.createElement("button");
    head.className = "lib-head";
    head.innerHTML = '<span class="lib-doodle" aria-hidden="true">' + (doodle || "") + "</span>" +
      '<span class="lib-text"><span class="t">' + title + '</span><div class="d">' +
      sub + "</div></span>" + '<span class="chev">+</span>';

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
    container.appendChild(card);
  }

  function prettyWeek(ymd) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var parts = ymd.split("-");
    return months[parseInt(parts[1], 10) - 1] + " " + parseInt(parts[2], 10);
  }

  var lib = document.getElementById("library-list");
  GAMES.forEach(function (g, i) {
    addGameCard(lib, g.title, DAY_NAMES[i] + " &middot; " + g.time, g,
      (typeof DOODLES !== "undefined") ? DOODLES.game[i % 7] : "");
  });

  // ---- Past weeks (auto-filled every Monday by tools/build-history.js) ----
  if (typeof GAME_HISTORY !== "undefined" && GAME_HISTORY.length) {
    var hBrow = document.getElementById("history-eyebrow");
    if (hBrow) hBrow.hidden = false;
    var hList = document.getElementById("history-list");
    GAME_HISTORY.slice().reverse().forEach(function (week) {
      var wdiv = document.createElement("div");
      wdiv.className = "lib-week";
      wdiv.textContent = "Week of " + prettyWeek(week.week);
      hList.appendChild(wdiv);
      week.games.forEach(function (g, i) {
        addGameCard(hList, g.title, DAY_NAMES[i] + " &middot; " + g.time, g,
          (typeof DOODLES !== "undefined") ? DOODLES.game[i % 7] : "");
      });
    });
  }

  // ---- Family leaderboard ----
  var NICK_KEY = "gpsk_nick_v1";
  var NICK_PREFIX = "__nickname__:";
  var lbLoaded = false;

  function getNick() {
    try { return localStorage.getItem(NICK_KEY) || ""; } catch (e) { return ""; }
  }
  function setNick(n) {
    try { localStorage.setItem(NICK_KEY, n); } catch (e) {}
  }

  function renderBoard(data) {
    var list = document.getElementById("lb-list");
    var mine = getNick().toLowerCase();
    list.innerHTML = "";
    var leaders = (data && data.leaders) || [];
    if (!leaders.length) {
      var p = document.createElement("p");
      p.className = "muted center";
      p.textContent = "No families on the board yet. Be the first.";
      list.appendChild(p);
    }
    var medals = ["\uD83E\uDD47", "\uD83E\uDD48", "\uD83E\uDD49"];
    leaders.forEach(function (e, i) {
      var row = document.createElement("div");
      row.className = "lb-row" + (e.nick.toLowerCase() === mine && mine ? " lb-mine" : "");
      var rank = document.createElement("span");
      rank.className = "lb-rank";
      rank.textContent = i < 3 ? medals[i] : (i + 1);
      var nick = document.createElement("span");
      nick.className = "lb-nick";
      nick.textContent = e.nick;
      var stat = document.createElement("span");
      stat.className = "lb-stat";
      stat.textContent = e.streak + " day streak \u00B7 " + e.total + " games";
      row.appendChild(rank); row.appendChild(nick); row.appendChild(stat);
      list.appendChild(row);
    });
    var upd = document.getElementById("lb-updated");
    if (data && data.updated) {
      var d = new Date(data.updated);
      upd.textContent = "Updated " + d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " \u00B7 refreshes hourly";
    }

    // recruiters board: nicknames whose links brought new families in
    var recList = document.getElementById("rec-list");
    recList.innerHTML = "";
    var recs = (data && data.recruiters) || [];
    if (!recs.length) {
      var rp = document.createElement("p");
      rp.className = "muted center";
      rp.textContent = "No recruiters yet. Share your link and be the first.";
      recList.appendChild(rp);
    }
    recs.forEach(function (e, i) {
      var row = document.createElement("div");
      row.className = "lb-row" + (e.nick.toLowerCase() === mine && mine ? " lb-mine" : "");
      var rank = document.createElement("span");
      rank.className = "lb-rank";
      rank.textContent = i < 3 ? medals[i] : (i + 1);
      var nick = document.createElement("span");
      nick.className = "lb-nick";
      nick.textContent = e.nick;
      var stat = document.createElement("span");
      stat.className = "lb-stat";
      stat.textContent = "brought " + e.brought + " famil" + (e.brought === 1 ? "y" : "ies");
      row.appendChild(rank); row.appendChild(nick); row.appendChild(stat);
      recList.appendChild(row);
    });
    updateRecruitLine(data);
  }

  // Personal referral credit in the share nudge: "your link brought N families"
  function updateRecruitLine(data) {
    var line = document.getElementById("recruit-line");
    var mine = getNick().toLowerCase();
    var recs = (data && data.recruiters) || [];
    var found = null;
    if (mine) {
      for (var i = 0; i < recs.length; i++) {
        if ((recs[i].nick || "").toLowerCase() === mine) { found = recs[i]; break; }
      }
    }
    if (found && found.brought > 0) {
      line.textContent = "Your link has brought " + found.brought +
        " famil" + (found.brought === 1 ? "y" : "ies") + " into the club. Keep going.";
      line.hidden = false;
    } else {
      line.hidden = true;
    }
  }

  function refreshBoardUI() {
    var mine = getNick();
    var joinCard = document.getElementById("lb-join");
    var member = document.getElementById("lb-member");
    if (mine) {
      joinCard.hidden = true;
      member.hidden = false;
      member.textContent = "You're on the board as " + mine + ".";
    } else {
      joinCard.hidden = false;
      member.hidden = true;
    }
  }

  var lbData = null;

  function fetchBoard() {
    return fetch("leaderboard.json?v=" + Date.now()).then(function (r) {
      if (!r.ok) throw new Error("no board");
      return r.json();
    }).then(function (data) {
      lbData = data;
      renderBoard(data);
      return data;
    }).catch(function () {
      renderBoard(null);
      return null;
    });
  }

  function loadBoard() {
    if (lbLoaded) { refreshBoardUI(); return; }
    lbLoaded = true;
    refreshBoardUI();
    fetchBoard();
  }

  function nickTaken(nick, data) {
    var mine = getNick().toLowerCase();
    var want = nick.toLowerCase();
    if (mine && mine === want) return false;
    var leaders = (data && data.leaders) || [];
    return leaders.some(function (e) { return (e.nick || "").toLowerCase() === want; });
  }

  function joinBoard() {
    var input = document.getElementById("lb-nick");
    var msg = document.getElementById("lb-join-msg");
    var nick = input.value.replace(/\s+/g, " ").trim();
    if (nick.length < 2) { msg.textContent = "Pick a nickname at least 2 characters long."; return; }
    if (/^test/i.test(nick)) { msg.textContent = "That nickname is reserved. Pick another."; return; }
    var btn = document.getElementById("lb-join-btn");
    btn.disabled = true;
    btn.textContent = "Joining...";
    msg.textContent = "";
    var ready = lbData ? Promise.resolve(lbData) : fetchBoard();
    ready.then(function (data) {
      if (nickTaken(nick, data)) {
        btn.disabled = false;
        btn.textContent = "Join";
        msg.textContent = "That nickname is taken. Pick another.";
        return;
      }
      var fields = {};
      fields[PING_ENTRY.game] = NICK_PREFIX + nick;
      fields[PING_ENTRY.refcode] = getRefCode();
      return postFormTimeout(PING_URL, fields, 12000).then(function () {
        setNick(nick);
        refreshBoardUI();
        var bn = document.getElementById("board-nudge");
        if (bn) bn.hidden = true;
        msg.textContent = "You're in. Your family shows up on the board within the hour.";
        btn.textContent = "Joined";
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = "Join";
        msg.textContent = "Couldn't reach the server. Check your connection and try again.";
      });
    });
  }

  document.getElementById("lb-join-btn").addEventListener("click", joinBoard);

  // ---- Tab bar ----
  var tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabBtns.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
      document.getElementById("tab-" + btn.getAttribute("data-tab")).classList.add("active");
      if (btn.getAttribute("data-tab") === "leaders") loadBoard();
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
  var PING_ENTRY = {
    game: "entry.796797999",
    refcode: "entry.1576147400",
    clientdate: "entry.2028108120",
    refby: "entry.1135809654"
  };
  var PINGQ_KEY = "gpsk_pingq_v1";
  var UNDO_PREFIX = "__undo__:";

  function todayLocalStr(d) {
    d = d || new Date();
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function loadPingQ() {
    try {
      var q = JSON.parse(localStorage.getItem(PINGQ_KEY) || "[]");
      return Array.isArray(q) ? q : [];
    } catch (e) { return []; }
  }
  function savePingQ(q) {
    try { localStorage.setItem(PINGQ_KEY, JSON.stringify(q.slice(-50))); } catch (e) {}
  }

  function sendPing(ping) {
    var fields = {};
    fields[PING_ENTRY.game] = ping.game;
    fields[PING_ENTRY.refcode] = ping.refcode;
    fields[PING_ENTRY.clientdate] = ping.date;
    if (ping.refby) fields[PING_ENTRY.refby] = ping.refby;
    return postFormTimeout(PING_URL, fields, 12000);
  }

  // Flush oldest-first. A failed send keeps the queue; the next
  // load or reconnect retries. Nothing is ever silently dropped.
  function flushPingQ() {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return;
    var q = loadPingQ();
    if (!q.length) return;
    sendPing(q[0]).then(function () {
      savePingQ(q.slice(1));
      flushPingQ();
    }).catch(function () { /* retry on next load or reconnect */ });
  }

  function queuePing(gameTitle, isUndo) {
    var q = loadPingQ();
    q.push({
      game: (isUndo ? UNDO_PREFIX : "") + gameTitle,
      refcode: getRefCode(),
      date: todayLocalStr(),
      refby: getReferredBy() || ""
    });
    savePingQ(q);
    flushPingQ();
  }

  // Anonymous usage ping: one per "We did it" tap. No personal data.
  // Queued when offline and flushed later, so a dead zone never eats a play.
  function pingUsage(gameTitle) {
    if (!gameTitle) return;
    try { queuePing(gameTitle, false); } catch (e) {}
  }
  // Un-tap sends a retraction so the server never over-counts.
  function pingUndo(gameTitle) {
    if (!gameTitle) return;
    try { queuePing(gameTitle, true); } catch (e) {}
  }
  flushPingQ();
  if (typeof window !== "undefined" && window.addEventListener) {
    window.addEventListener("online", flushPingQ);
  }

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
      if (/^GK-[A-Z0-9]{5,8}$/.test(inbound) && inbound !== getRefCode() && !getReferredBy()) {
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
    doShare("We've been playing one 3-5 minute speaking game a night from this little app. My kid actually asks for it now. Thought yours might like it too:");
  });

  // Share nudge: fires right at the "We did it" win, with tonight's game in the text.
  document.getElementById("share-win-btn").addEventListener("click", function () {
    doShare("We just played '" + currentGameTitle + "' at dinner. 3-5 minutes, no prep, my kid loved it. Free game every night here:");
  });

  // Board nudge: one tap from the win moment to the leaderboard join card.
  document.getElementById("board-nudge-btn").addEventListener("click", function () {
    var tab = document.querySelector('.tab-btn[data-tab="leaders"]');
    if (tab) tab.click();
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
