// Caches the whole course on first visit so it works offline. Bumps automatically on every build.
const CACHE = 'bfa-fb8e48beb69c';
const FILES = ["./", "index.html", "app.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-180.png", "curriculum.js", "practice.js", "week01.js", "week01x.js", "app.js", "audio/w01-day-1.mp3", "audio/w01-day-2.mp3", "audio/w01-day-3.mp3", "audio/w01-day-4.mp3", "audio/w01-day-5.mp3"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k.startsWith('bfa-')).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.origin === location.origin) {
    const range = e.request.headers.get('range');
    if (range && url.pathname.endsWith('.mp3')) {
      // Safari plays audio through Range requests: answer them from the cache with 206 responses
      e.respondWith(caches.match(url.pathname.replace(/^.*\/audio\//, 'audio/'), {ignoreSearch: true}).then(async r => {
        if (!r) r = await caches.match(e.request, {ignoreSearch: true});
        if (!r) return fetch(e.request);
        const buf = await r.arrayBuffer(), m = /bytes=(\d*)-(\d*)/.exec(range) || [];
        const start = +m[1] || 0, end = m[2] ? Math.min(+m[2], buf.byteLength - 1) : buf.byteLength - 1;
        return new Response(buf.slice(start, end + 1), {status: 206, headers: {'Content-Type': 'audio/mpeg',
          'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`, 'Content-Length': String(end - start + 1), 'Accept-Ranges': 'bytes'}});
      }));
      return;
    }
    e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request)));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open('bfa-fonts').then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))));
  }
});
