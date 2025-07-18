const CACHE_NAME = 'tsurigaki-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './tsurigaki_index.json',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// インストール：キャッシュ登録
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('[ServiceWorker] Caching files');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 有効化：古いキャッシュ削除
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (name) {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ処理：キャッシュ優先で取得
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
