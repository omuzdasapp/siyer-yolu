// Çevrimdışı çalışma: dersler ve bot yarışı internetsiz de açılır. Canlı yarış istekleri (Supabase) önbelleğe alınmaz.
const CACHE = 'siyer-yolu-v2';
const FILES = [
  './', 'index.html', 'style.css', 'gizlilik.html', 'privacidad.html', 'manifest.webmanifest',
  'app.js', 'data.js', 'data-es.js', 'i18n.js', 'store.js', 'audio.js', 'ui.js', 'net.js', 'config.js', 'duel.js', 'share.js',
  'manrope-latin-400-normal.woff2', 'manrope-latin-ext-400-normal.woff2',
  'manrope-latin-600-normal.woff2', 'manrope-latin-ext-600-normal.woff2',
  'manrope-latin-700-normal.woff2', 'manrope-latin-ext-700-normal.woff2',
  'unbounded-latin-700-normal.woff2', 'unbounded-latin-ext-700-normal.woff2',
  'icon-192.png', 'icon-512.png',
];

const clean = (res) => (res && res.redirected
  ? res.blob().then((body) => new Response(body, { status: 200, headers: res.headers }))
  : res);

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // sunucu istekleri doğrudan ağa gider
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match(e.request, { ignoreSearch: true })
      .then((hit) => hit || fetch(e.request.url, { redirect: 'follow' }))
      .then(clean)
      .catch(() => caches.match('index.html').then(clean)));
    return;
  }
  // Önce ağ, olmazsa önbellek: güncellemeler hemen gelsin, internet yoksa yine çalışsın.
  e.respondWith(fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request)));
});
