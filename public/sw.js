const CACHE_NAME = 'snob-cache-v2';
const MAX_CACHE_ENTRIES = 100;
const ASSETS_TO_CACHE = [
  '/',
  '/logo.png',
  '/favicon.ico'
];

// === INSTALL ===
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// === ACTIVATE ===
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// === HELPERS ===

// Limite la taille du cache à MAX_CACHE_ENTRIES (supprime les plus anciennes)
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    const toDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}

// Vérifie si la requête est un asset statique
function isStaticAsset(url) {
  return /\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|css|js)(\?.*)?$/i.test(url.pathname);
}

// Vérifie si la requête est une API
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Vérifie si la requête est une page HTML (navigation)
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// === STRATÉGIES DE CACHE ===

// Cache-first : pour les assets statiques (images, fonts, CSS, JS)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
    }
    return networkResponse;
  } catch (error) {
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

// Network-first : pour les requêtes API
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Stale-while-revalidate : pour les pages HTML
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      const cache = caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, networkResponse.clone());
        trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
      });
    }
    return networkResponse;
  }).catch(() => null);

  // Retourner le cache immédiatement si disponible, sinon attendre le réseau
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }

  // Fallback navigation offline vers '/'
  if (isNavigationRequest(request)) {
    return caches.match('/');
  }

  return new Response('', { status: 408, statusText: 'Offline' });
}

// === FETCH ===
self.addEventListener('fetch', (event) => {
  // Exclure les requêtes POST et non-GET
  if (event.request.method !== 'GET') return;

  // Exclure les requêtes non-HTTP (chrome-extension://, etc.)
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Stratégie selon le type de requête
  if (isApiRequest(url)) {
    // Network-first pour les API
    event.respondWith(networkFirst(event.request));
  } else if (isStaticAsset(url)) {
    // Cache-first pour les assets statiques
    event.respondWith(cacheFirst(event.request));
  } else {
    // Stale-while-revalidate pour les pages HTML et le reste
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
