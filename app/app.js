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
    if (i === -1) done.push(todayS);
    else done.splice(i, 1);
    saveDone(done);
    refresh();
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

  refresh();
})();
