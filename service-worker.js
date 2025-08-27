const CACHE_NAME = 'senderos-tinta-v2.0';
const THERAPEUTIC_CACHE = 'senderos-therapeutic-v2.0';

// Archivos esenciales para funcionamiento offline
const ESSENTIAL_FILES = [
    '/',
    '/index.html',
    '/CHAT_TERAPEUTICO_INTERACTIVO.html',
    '/paleta-colores.html',
    '/css/main.css',
    '/css/poem.css',
    '/js/security.js',
    '/manifest.json'
];

// Archivos de contenido terapéutico
const THERAPEUTIC_FILES = [
    '/poems/blog-post.html',
    '/poems/senderos-de-tinta-v2.html',
    '/poems/senderos-de-tinta-v3.html',
    '/poems/senderos-de-tinta-v4.html',
    '/poems/senderos-de-tinta-v5.html'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                console.log('🔧 Cacheando archivos esenciales');
                return cache.addAll(ESSENTIAL_FILES);
            }),
            caches.open(THERAPEUTIC_CACHE).then(cache => {
                console.log('💚 Cacheando contenido terapéutico');
                return cache.addAll(THERAPEUTIC_FILES);
            })
        ])
    );
    self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== THERAPEUTIC_CACHE) {
                        console.log('🗑️ Eliminando cache obsoleto:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estrategia de cache: Network First para HTML, Cache First para assets
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo manejar requests del mismo origen
    if (url.origin !== location.origin) return;
    
    // Estrategia para archivos HTML (siempre intentar red primero)
    if (request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cachear la respuesta exitosa
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Si falla la red, usar cache
                    return caches.match(request);
                })
        );
        return;
    }
    
    // Estrategia para CSS, JS y otros assets (cache primero)
    if (request.destination === 'style' || 
        request.destination === 'script' || 
        request.destination === 'image') {
        event.respondWith(
            caches.match(request).then(response => {
                return response || fetch(request).then(fetchResponse => {
                    const responseClone = fetchResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return fetchResponse;
                });
            })
        );
        return;
    }
});

// Notificaciones de estado offline/online
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
