// Çevrimdışı çalışma: dersler ve bot yarışı internetsiz de açılır. Canlı yarış istekleri (Supabase) önbelleğe alınmaz.
const CACHE = 'siyer-yolu-v6';
const FILES = [
  './', 'index.html', 'style.css', 'gizlilik.html', 'privacidad.html', 'manifest.webmanifest',
  'app.js', 'data.js', 'data-es.js', 'data-tr-2.js', 'data-es-2.js', 'map.js', 'map-land.js', 'i18n.js', 'hadis.js', 'push.js', 'store.js', 'audio.js', 'ui.js', 'net.js', 'config.js', 'duel.js', 'share.js',
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
  if (url.pathname.includes('/ses/')) return; // ses dosyaları doğrudan ağdan (parça parça) çalınır
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

// Günlük hadis bildirimi
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Siyer Yolu', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: 'gunluk-hadis', renotify: true,
    data: { url: d.url || './' },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || './', self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ('navigate' in c) return c.navigate(url).then((w) => w && w.focus()); }
    return self.clients.openWindow(url);
  }));
});
