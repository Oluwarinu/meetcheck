
const CACHE_NAME = 'meetcheck-v2';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
];

// Security headers for cached responses
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.filter(url => {
          // Validate URLs before caching
          try {
            new URL(url, self.location.origin);
            return true;
          } catch {
            console.warn('Invalid URL skipped:', url);
            return false;
          }
        }));
      })
      .catch(function(error) {
        console.error('Cache installation failed:', error);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP(S) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response with security headers
        if (response) {
          const newResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
              ...Object.fromEntries(response.headers.entries()),
              ...SECURITY_HEADERS
            }
          });
          return newResponse;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Don't cache responses with sensitive data
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              // Only cache safe JSON responses
              const url = new URL(event.request.url);
              if (url.pathname.includes('/api/')) {
                return response; // Don't cache API responses
              }
            }

            // Clone the response for caching
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              })
              .catch(function(error) {
                console.error('Cache put failed:', error);
              });

            return response;
          }
        ).catch(function(error) {
          console.error('Fetch failed:', error);
          
          // Return offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html') || 
                   new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
          }
          
          throw error;
        });
      })
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).catch(function(error) {
      console.error('Cache cleanup failed:', error);
    })
  );
});

// Handle background sync for offline form submissions
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise(function(resolve) {
    // Handle queued offline actions
    console.log('Background sync triggered');
    resolve();
  });
}

// Security: Handle only same-origin messages
self.addEventListener('message', function(event) {
  if (event.origin !== self.location.origin) {
    return;
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
