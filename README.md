# GPS Kids Daily

A tiny no-login daily game app for parents: one 5-minute speaking game at the
dinner table, every night. Live at
https://register.joingpskids.com/app/?ref=GK-SHARE

## Layout

- `app/` — the PWA itself (`index.html`, `app.js`, `styles.css`, `sw.js`,
  `prompts.js`, `history.js`, `leaderboard.json`, `manifest.json`).
- `tools/` — Node builders (see below). They run from any checkout; app files
  are resolved from `app/` in a fresh clone.
- `games-archive/` — one file per past week (`YYYY-MM-DD.js`), each exporting a
  `GAMES` array. The Monday cron adds the outgoing week here.

## Data model

Anonymous usage pings go to a Google Form, mirrored hourly-ish into the
`plays` tab of the GPS Kids sheet by the challenge mailer:

| Col | Header     | Contents                                              |
|-----|------------|-------------------------------------------------------|
| A   | Timestamp  | form submission time                                  |
| B   | Game       | game title, or `__nickname__:<nick>`, or `__undo__:<title>` |
| C   | RefCode    | device referral code (`GK-XXXXXX`)                    |
| D   | ResponseId | form response id (dedupe key)                         |
| E   | Referrer   | `?ref=` code that brought this family, if any         |
| F   | ClientDate | `YYYY-MM-DD` on the player's device                   |

Rules the builders enforce:

- `__nickname__:` rows are leaderboard registrations. Latest per RefCode wins;
  nicknames are first-come, first-served (case-insensitive). Test nicks never
  publish. The public `leaderboard.json` holds nick + streak + total only.
- `__undo__:` rows retract one matching play (same code, day, game), so an
  un-tapped "We did it" never over-counts.
- Streak day = ClientDate when present, else the sheet timestamp (ET).
- Totals count unique days, not taps.
- The app queues pings offline in `localStorage` and flushes on reconnect, so
  a dead zone never eats a play.

## Commands

```sh
# Rebuild the family leaderboard from the plays sheet.
# Without --deploy: writes leaderboard.json and prints a summary.
# With --deploy: also pushes app/leaderboard.json to GitHub if it changed.
node tools/build-leaderboard.js [--deploy]

# Regenerate app/history.js from games-archive/ (run after the Monday drop).
node tools/build-history.js
```

Both scripts need the `hatch_gws_cli` Google Workspace CLI on PATH for the
`--deploy` / sheet reads.

## Monday games drop

The `gps-kids-monday-games` cron (Mondays ~6:08 AM ET) picks seven new games,
archives the outgoing week to `games-archive/`, regenerates `history.js`, and
bumps the service-worker cache. One-Word Story stays archived.

## CI note (human step)

The hourly leaderboard rebuild currently runs on one machine. Moving it to a
GitHub Action needs a Google Cloud service account with Sheets read access and
its key stored as a repo secret. That setup is a human-only step; the scripts
above are already portable and ready for it.
