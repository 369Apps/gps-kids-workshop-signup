// tools/build-leaderboard.js — rebuild the family leaderboard from the plays sheet.
//
// Data model (single source of truth: the plays tab of the GPS Kids sheet):
//   - A row whose Game starts with "__nickname__:" is a leaderboard registration:
//     the rest of the Game value is the family nickname for that row's RefCode.
//     Latest registration per RefCode wins.
//   - All other rows are plays. Streak = consecutive days with >= 1 play,
//     counting back from today (or yesterday if today has no play yet),
//     mirroring the app's own streak logic. Timestamps are America/New_York.
//   - Nicknames starting with "test" (any case) are never published (test hook).
//   - Nicknames are first-come, first-served per normalized (lowercased) name.
//   - The public leaderboard.json contains nicknames + streaks + totals only.
//     Player codes are NEVER published.
//
// Usage: node tools/build-leaderboard.js [--deploy]
//   Without --deploy: writes leaderboard.json locally and prints a summary.
//   With --deploy: also pushes app/leaderboard.json to GitHub if it changed.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const SHEET_ID = "1MVjJz_xl4sFSw6EkZn51PMkm-nLi7R_kO-Q5RfteQmk";
const NICK_PREFIX = "__nickname__:";
const UNDO_PREFIX = "__undo__:";
const MAX_BOARD = 25;
const validDay = (s) => (/^\d{4}-\d{2}-\d{2}$/.test(s || "") ? s : null);

function cli(...args) {
  return execFileSync("hatch_gws_cli", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
}

// "2026-09-17 19:20:09" -> "2026-09-17" (sheet timestamps are America/New_York)
function dayOf(ts) {
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(ts || "");
  return m ? m[1] : null;
}
function todayNY() {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" });
  return fmt.format(new Date()); // YYYY-MM-DD
}
function shiftDay(ymd, delta) {
  const d = new Date(ymd + "T12:00:00");
  d.setDate(d.getDate() + delta);
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function streakOf(daySet) {
  let cursor = todayNY();
  if (!daySet.has(cursor)) cursor = shiftDay(cursor, -1);
  let s = 0;
  while (daySet.has(cursor)) { s++; cursor = shiftDay(cursor, -1); }
  return s;
}
function cleanNick(raw) {
  let n = (raw || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (n.length > 24) n = n.slice(0, 24).trim();
  return n;
}

function main() {
  const raw = cli("sheets", "spreadsheets", "values", "get", "--params",
    JSON.stringify({ spreadsheetId: SHEET_ID, range: "plays!A:F" }));
  const rows = JSON.parse(raw).values || [];
  const data = rows.slice(1); // drop header

  const registrations = []; // {code, nick, ts}
  const plays = [];         // {code, day, game}
  const undos = [];         // {code, day, game}
  for (const r of data) {
    const ts = r[0] || "", game = r[1] || "", code = (r[2] || "").trim();
    if (!/^GK-[A-Z0-9]{6}$/.test(code)) continue;
    if (game.indexOf(NICK_PREFIX) === 0) {
      const nick = cleanNick(game.slice(NICK_PREFIX.length));
      if (nick && !/^test/i.test(nick)) registrations.push({ code, nick, ts });
    } else if (game.indexOf(UNDO_PREFIX) === 0) {
      // un-tap retraction: cancels one matching play
      const day = validDay(r[5]) || dayOf(ts);
      if (day) undos.push({ code, day, game: game.slice(UNDO_PREFIX.length) });
    } else if (game && game !== "Verify Game") {
      // prefer the date on the player's device; fall back to sheet timestamp
      const day = validDay(r[5]) || dayOf(ts);
      if (day) plays.push({ code, day, game });
    }
  }
  // apply retractions: each undo removes one matching play (same family, day, game)
  for (const u of undos) {
    const i = plays.findIndex((p) => p.code === u.code && p.day === u.day && p.game === u.game);
    if (i !== -1) plays.splice(i, 1);
  }
  // latest registration per code wins
  registrations.sort((a, b) => (a.ts < b.ts ? -1 : 1));
  const nickByCode = {};
  registrations.forEach((r) => { nickByCode[r.code] = r.nick; });

  // plays per code; total counts unique days, not taps
  const daysByCode = {};
  plays.forEach((p) => {
    (daysByCode[p.code] = daysByCode[p.code] || new Set()).add(p.day);
  });

  // first-come nickname wins on collision
  const seenNick = new Set();
  const board = [];
  Object.keys(nickByCode).sort().forEach((code) => {
    const nick = nickByCode[code];
    const key = nick.toLowerCase();
    if (seenNick.has(key)) return;
    seenNick.add(key);
    const days = daysByCode[code] || new Set();
    board.push({ nick, streak: streakOf(days), total: days.size });
  });
  board.sort((a, b) => (b.streak - a.streak) || (b.total - a.total) || (a.nick < b.nick ? -1 : 1));

  const out = {
    updated: new Date().toISOString(),
    leaders: board.slice(0, MAX_BOARD),
  };
  const json = JSON.stringify(out, null, 2) + "\n";
  const localPath = path.join(ROOT, "leaderboard.json");
  const prev = fs.existsSync(localPath) ? fs.readFileSync(localPath, "utf8") : null;
  // compare ignoring the timestamp line
  const strip = (s) => s.replace(/"updated": "[^"]*",?\n?/, "");
  const changed = !prev || strip(prev) !== strip(json);
  if (changed) fs.writeFileSync(localPath, json);

  console.log("registrations: " + registrations.length + ", players with plays: " +
    Object.keys(daysByCode).length + ", board entries: " + board.length +
    ", changed: " + changed);
  board.slice(0, 10).forEach((b, i) =>
    console.log("  " + (i + 1) + ". " + b.nick + " — " + b.streak + "d streak, " + b.total + " games"));

  if (changed && process.argv.includes("--deploy")) {
    execFileSync(path.join(process.env.HOME, "workspace/skills/github/bin/gh.py"),
      ["put-file", "369Apps/gps-kids-workshop-signup", "app/leaderboard.json", localPath],
      { encoding: "utf8" });
    console.log("deployed app/leaderboard.json");
  } else if (!changed) {
    console.log("no change, deploy skipped");
  }
  return changed;
}

main();
