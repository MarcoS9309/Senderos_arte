# Configuración de Rendimiento - Senderos de Tinta
# Optimizaciones para mejorar la experiencia terapéutica

# =============================================================================
# Service Worker para Funcionalidad Offline
# =============================================================================

# Crear service-worker.js
cat > service-worker.js << 'EOF'
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
EOF

# =============================================================================
# Configuración de Compresión
# =============================================================================

# Para servidores que soporten compresión Brotli
echo "# Configuración Brotli (si está disponible)
<IfModule mod_brotli.c>
    BrotliCompressionQuality 6
    BrotliFilterNote Input instream
    BrotliFilterNote Output outstream
    BrotliFilterNote Ratio ratio
    
    AddOutputFilterByType BROTLI_COMPRESS text/plain
    AddOutputFilterByType BROTLI_COMPRESS text/html
    AddOutputFilterByType BROTLI_COMPRESS text/xml
    AddOutputFilterByType BROTLI_COMPRESS text/css
    AddOutputFilterByType BROTLI_COMPRESS text/javascript
    AddOutputFilterByType BROTLI_COMPRESS application/javascript
    AddOutputFilterByType BROTLI_COMPRESS application/json
</IfModule>" >> .htaccess.performance

# =============================================================================
# Preload de Recursos Críticos
# =============================================================================

echo "# Preload de recursos críticos
<FilesMatch \"\.(html)$\">
    Header add Link \"</css/main.css>; rel=preload; as=style\"
    Header add Link \"</css/poem.css>; rel=preload; as=style\"
    Header add Link \"</js/security.js>; rel=preload; as=script\"
</FilesMatch>

# DNS Prefetch para dominios externos (si se usan)
<FilesMatch \"\.(html)$\">
    Header add Link \"<//fonts.googleapis.com>; rel=dns-prefetch\"
    Header add Link \"<//cdnjs.cloudflare.com>; rel=dns-prefetch\"
</FilesMatch>" >> .htaccess.performance

# =============================================================================
# Optimización de Imágenes
# =============================================================================

# Configuración para servir WebP cuando esté disponible
echo "# Servir WebP cuando esté soportado
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Verificar soporte WebP
    RewriteCond %{HTTP_ACCEPT} image/webp
    RewriteCond %{REQUEST_FILENAME} \.(jpe?g|png)$
    RewriteCond %{REQUEST_FILENAME}\.webp -f
    RewriteRule (.+)\.(jpe?g|png)$ \$1.\$2.webp [T=image/webp,E=accept:1]
</IfModule>

# Headers para imágenes WebP
<FilesMatch \"\.(webp)$\">
    Header set Vary Accept
</FilesMatch>" >> .htaccess.performance

# =============================================================================
# Configuración de HTTP/2 Push
# =============================================================================

echo "# HTTP/2 Server Push (si está disponible)
<IfModule mod_http2.c>
    # Push de recursos críticos
    <LocationMatch \"^/$\">
        Header add Link \"</css/main.css>; rel=preload; as=style; nopush\"
        Header add Link \"</css/poem.css>; rel=preload; as=style; nopush\"
    </LocationMatch>
    
    <LocationMatch \"^/CHAT_TERAPEUTICO_INTERACTIVO.html$\">
        Header add Link \"</js/security.js>; rel=preload; as=script; nopush\"
    </LocationMatch>
</IfModule>" >> .htaccess.performance

# =============================================================================
# Script de Optimización de Performance
# =============================================================================

cat > optimize-performance.sh << 'EOF'
#!/bin/bash

echo "🚀 Optimizando Rendimiento - Senderos de Tinta"
echo "==============================================="

# Verificar herramientas necesarias
command -v jpegoptim >/dev/null 2>&1 || { echo "❌ jpegoptim no instalado"; }
command -v optipng >/dev/null 2>&1 || { echo "❌ optipng no instalado"; }
command -v webp >/dev/null 2>&1 || { echo "❌ webp tools no instaladas"; }

# Optimizar imágenes JPEG
echo "📸 Optimizando imágenes JPEG..."
find . -name "*.jpg" -o -name "*.jpeg" | while read img; do
    jpegoptim --size=80% "$img"
    echo "✅ Optimizado: $img"
done

# Optimizar imágenes PNG
echo "🖼️ Optimizando imágenes PNG..."
find . -name "*.png" | while read img; do
    optipng -o2 "$img"
    echo "✅ Optimizado: $img"
done

# Generar versiones WebP
echo "🌐 Generando versiones WebP..."
find . -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read img; do
    cwebp -q 80 "$img" -o "${img%.*}.webp"
    echo "✅ WebP generado: ${img%.*}.webp"
done

# Minificar CSS (simple)
echo "🎨 Minificando CSS..."
find ./css -name "*.css" ! -name "*.min.css" | while read css; do
    # Minificación básica
    sed 's/[[:space:]]*{[[:space:]]/{/g; s/[[:space:]]*}[[:space:]]*/}/g; s/;[[:space:]]*/;/g' "$css" > "${css%.*}.min.css"
    echo "✅ CSS minificado: ${css%.*}.min.css"
done

# Verificar tamaños de archivos
echo "📊 Resumen de tamaños:"
echo "CSS original: $(du -sh css/*.css | grep -v "\.min\." | awk '{print $1}' | paste -sd+ | bc)KB"
echo "CSS minificado: $(du -sh css/*.min.css 2>/dev/null | awk '{print $1}' | paste -sd+ | bc)KB"

echo "✅ Optimización completada"
EOF

chmod +x optimize-performance.sh

# =============================================================================
# Configuración de Monitoring
# =============================================================================

cat > performance-monitor.html << 'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitor de Rendimiento - Senderos de Tinta</title>
    <style>
        body { 
            font-family: 'Georgia', serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .metric {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        .metric h3 { margin: 0 0 0.5rem 0; color: #e8b4cb; }
        .metric-value { font-size: 1.5rem; font-weight: bold; }
        .good { color: #2ecc71; }
        .warning { color: #f39c12; }
        .error { color: #e74c3c; }
        button {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        button:hover { background: rgba(255,255,255,0.3); }
    </style>
</head>
<body>
    <h1>🚀 Monitor de Rendimiento Terapéutico</h1>
    
    <div class="metric">
        <h3>⚡ Core Web Vitals</h3>
        <div id="cwv-results">Midiendo...</div>
        <button onclick="measureCWV()">Medir Nuevamente</button>
    </div>
    
    <div class="metric">
        <h3>💾 Uso de Memoria</h3>
        <div id="memory-info">Calculando...</div>
    </div>
    
    <div class="metric">
        <h3>🌐 Estado de Conectividad</h3>
        <div id="network-info">Verificando...</div>
    </div>
    
    <div class="metric">
        <h3>📱 Información del Dispositivo</h3>
        <div id="device-info">Detectando...</div>
    </div>
    
    <div class="metric">
        <h3>🔧 Service Worker</h3>
        <div id="sw-status">Verificando...</div>
        <button onclick="updateSW()">Actualizar SW</button>
    </div>

    <script>
        // Core Web Vitals
        async function measureCWV() {
            const cwvResults = document.getElementById('cwv-results');
            cwvResults.innerHTML = 'Midiendo...';
            
            try {
                // Simular mediciones de CWV
                const paintEntries = performance.getEntriesByType('paint');
                const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
                const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
                
                let html = '';
                if (fcp) {
                    const fcpValue = fcp.startTime;
                    const fcpClass = fcpValue < 1800 ? 'good' : fcpValue < 3000 ? 'warning' : 'error';
                    html += `<div class="${fcpClass}">FCP: ${Math.round(fcpValue)}ms</div>`;
                }
                
                // LCP usando PerformanceObserver
                if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        const lcpValue = lastEntry.startTime;
                        const lcpClass = lcpValue < 2500 ? 'good' : lcpValue < 4000 ? 'warning' : 'error';
                        html += `<div class="${lcpClass}">LCP: ${Math.round(lcpValue)}ms</div>`;
                        cwvResults.innerHTML = html;
                    });
                    observer.observe({entryTypes: ['largest-contentful-paint']});
                }
                
                // FID y CLS requieren interacción real del usuario
                html += '<div>FID: Requiere interacción del usuario</div>';
                html += '<div>CLS: Midiendo durante navegación</div>';
                
                cwvResults.innerHTML = html || 'No hay datos disponibles';
            } catch (e) {
                cwvResults.innerHTML = `Error: ${e.message}`;
            }
        }
        
        // Información de memoria
        function updateMemoryInfo() {
            const memoryInfo = document.getElementById('memory-info');
            
            if ('memory' in performance) {
                const mem = performance.memory;
                const used = Math.round(mem.usedJSHeapSize / 1048576);
                const total = Math.round(mem.totalJSHeapSize / 1048576);
                const limit = Math.round(mem.jsHeapSizeLimit / 1048576);
                
                const usage = (used / total) * 100;
                const usageClass = usage < 50 ? 'good' : usage < 80 ? 'warning' : 'error';
                
                memoryInfo.innerHTML = `
                    <div class="${usageClass}">Uso: ${used}MB / ${total}MB (${Math.round(usage)}%)</div>
                    <div>Límite: ${limit}MB</div>
                `;
            } else {
                memoryInfo.innerHTML = 'Información de memoria no disponible';
            }
        }
        
        // Estado de red
        function updateNetworkInfo() {
            const networkInfo = document.getElementById('network-info');
            
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            let html = `<div class="${navigator.onLine ? 'good' : 'error'}">
                ${navigator.onLine ? '🟢 Conectado' : '🔴 Desconectado'}
            </div>`;
            
            if (connection) {
                html += `
                    <div>Tipo: ${connection.effectiveType || 'Desconocido'}</div>
                    <div>Velocidad estimada: ${connection.downlink || 'N/A'} Mbps</div>
                    <div>RTT: ${connection.rtt || 'N/A'} ms</div>
                `;
            }
            
            networkInfo.innerHTML = html;
        }
        
        // Información del dispositivo
        function updateDeviceInfo() {
            const deviceInfo = document.getElementById('device-info');
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768;
            
            deviceInfo.innerHTML = `
                <div>Tipo: ${isMobile ? '📱 Móvil' : isTablet ? '📋 Tablet' : '🖥️ Escritorio'}</div>
                <div>Resolución: ${screen.width}x${screen.height}</div>
                <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
                <div>Ratio de píxeles: ${window.devicePixelRatio || 1}</div>
                <div>Orientación: ${screen.orientation ? screen.orientation.type : 'N/A'}</div>
            `;
        }
        
        // Estado del Service Worker
        function updateSWStatus() {
            const swStatus = document.getElementById('sw-status');
            
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg) {
                        const state = reg.active ? reg.active.state : 'No activo';
                        swStatus.innerHTML = `<div class="good">✅ Registrado (${state})</div>`;
                    } else {
                        swStatus.innerHTML = '<div class="warning">⚠️ No registrado</div>';
                    }
                });
            } else {
                swStatus.innerHTML = '<div class="error">❌ No soportado</div>';
            }
        }
        
        // Actualizar Service Worker
        function updateSW() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg) {
                        reg.update().then(() => {
                            alert('Service Worker actualizado');
                            updateSWStatus();
                        });
                    }
                });
            }
        }
        
        // Inicialización
        document.addEventListener('DOMContentLoaded', () => {
            measureCWV();
            updateMemoryInfo();
            updateNetworkInfo();
            updateDeviceInfo();
            updateSWStatus();
            
            // Actualizar cada 30 segundos
            setInterval(() => {
                updateMemoryInfo();
                updateNetworkInfo();
            }, 30000);
        });
        
        // Listeners para cambios de red
        window.addEventListener('online', updateNetworkInfo);
        window.addEventListener('offline', updateNetworkInfo);
        
        console.log('🚀 Monitor de rendimiento iniciado');
    </script>
</body>
</html>
EOF

echo "✅ Configuración de rendimiento completada"
echo "📁 Archivos creados:"
echo "   - service-worker.js"
echo "   - .htaccess.performance"
echo "   - optimize-performance.sh"
echo "   - performance-monitor.html"
echo ""
echo "🔧 Para implementar:"
echo "1. Revisar SECURITY_IMPLEMENTATION.md"
echo "2. Ejecutar ./optimize-performance.sh"
echo "3. Registrar service worker en las páginas principales"
echo "4. Configurar servidor web con .htaccess.performance"