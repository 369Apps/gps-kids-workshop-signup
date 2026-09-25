/* GPS Kids Daily - offline cache, v18 (network-first: first load is always fresh) */
var CACHE = "gpsk-daily-20260924-v18";
var FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./prompts.js",
  "./doodles.js",
  "./history.js",
  "./micdrop.js",
  "./doodle.js",
  "./pitch.js",
  "./leaderboard.json",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return; // let form POSTs go straight to the network
  // Network first: every open checks for fresh files, so the first load
  // after a deploy is never a stale screen. Cache is the offline fallback.
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () { return caches.match(e.request); })
  );
});
