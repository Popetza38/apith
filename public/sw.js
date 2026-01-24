// ============================================
// DramaBox PWA Service Worker
// ============================================
// Service Worker untuk cache strategies, offline support, dan background sync

const CACHE_NAME = 'dramabox-v1';
const RUNTIME_CACHE = 'dramabox-runtime-v1';

// Static assets untuk pre-cache
const PRECACHE_ASSETS = [
  '/',
  '/in',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// API endpoints untuk caching
const API_CACHE_PATTERN = /\/api\/dramabox\/.*/;

// ============================================
// Cache Strategies
// ============================================
const STRATEGIES = {
  cacheFirst: async (request: Request, cache: Cache) => {
    const cached = await cache.match(request);
    return cached ?? await fetch(request);
  },

  networkFirst: async (request: Request, cache: Cache) => {
    try {
      const network = await fetch(request);
      if (network.ok) {
        cache.put(request, network.clone());
      }
      return network;
    } catch {
      const cached = await cache.match(request);
      return cached;
    }
  },

  staleWhileRevalidate: async (request: Request, cache: Cache) => {
    const cached = await cache.match(request);
    const network = fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    });
    return cached ?? network;
  }
};

// ============================================
// Install Event
// ============================================
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

// ============================================
// Activate Event
// ============================================
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ============================================
// Fetch Event
// ============================================
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (api.megawe.net, images, etc)
  if (url.origin !== self.location.origin) return;

  // API requests - stale while revalidate (60s cache)
  if (API_CACHE_PATTERN.test(url.pathname)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        STRATEGIES.staleWhileRevalidate(request, cache)
      )
    );
    return;
  }

  // Static assets - cache first
  if (request.url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2)$/)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) =>
        STRATEGIES.cacheFirst(request, cache)
      )
    );
    return;
  }

  // Pages - network first with fallback
  event.respondWith(
    caches.open(RUNTIME_CACHE).then((cache) =>
      STRATEGIES.networkFirst(request, cache)
    )
  );
});

// ============================================
// Background Sync
// ============================================
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-episodes') {
    event.waitUntil(syncEpisodes());
  }
});

async function syncEpisodes() {
  // Sync episode updates di background
  const clients = await self.clients.matchAll();
  clients.forEach((client: Client) => {
    client.postMessage({
      type: 'EPISODES_SYNCED',
      data: { timestamp: Date.now() }
    });
  });
}

// ============================================
// Push Notification Handler
// ============================================
self.addEventListener('push', (event: PushEvent) => {
  const options: NotificationOptions = {
    body: event.data ? event.data.text() : 'Episode baru tersedia!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/in/terbaru'
    },
    actions: [
      {
        action: 'view',
        title: 'Lihat Episode',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(self.registration.showNotification('DramaBox', options));
});

// ============================================
// Notification Click Handler
// ============================================
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/in/terbaru')
    );
  }
});

// ============================================
// Message Handler
// ============================================
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
