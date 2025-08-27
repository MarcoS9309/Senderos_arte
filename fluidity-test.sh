#!/bin/bash

# Fluidity Test Script for Senderos de Tinta
# Tests visual performance, loading speed, and user interaction fluidity

echo "🚀 Iniciando Pruebas de Fluidez - Senderos de Tinta"
echo "=================================================="

# Create test results directory
mkdir -p test-results

# Performance Score
echo "📊 Ejecutando pruebas de rendimiento..."
npm run test:performance

# Check if performance results exist
if [ -f "performance-test-results.json" ]; then
    SCORE=$(node -p "JSON.parse(require('fs').readFileSync('performance-test-results.json', 'utf8')).summary.passed / JSON.parse(require('fs').readFileSync('performance-test-results.json', 'utf8')).tests.length * 100")
    echo "🎯 Puntuación de Rendimiento: ${SCORE}%"
else
    echo "❌ No se pudieron obtener resultados de rendimiento"
    SCORE=0
fi

# File size checks
echo ""
echo "📏 Verificando tamaños de archivos críticos..."

# Main files size check
INDEX_SIZE=$(stat -c%s "index.html" 2>/dev/null || echo "0")
CSS_SIZE=$(stat -c%s "css/main.css" 2>/dev/null || echo "0")
CHAT_SIZE=$(stat -c%s "CHAT_TERAPEUTICO_INTERACTIVO.html" 2>/dev/null || echo "0")

echo "   📄 index.html: $(echo "scale=2; $INDEX_SIZE/1024" | bc)KB"
echo "   🎨 main.css: $(echo "scale=2; $CSS_SIZE/1024" | bc)KB"
echo "   💬 chat.html: $(echo "scale=2; $CHAT_SIZE/1024" | bc)KB"

# Critical path size (index + main CSS)
CRITICAL_PATH_SIZE=$((INDEX_SIZE + CSS_SIZE))
CRITICAL_PATH_KB=$(echo "scale=2; $CRITICAL_PATH_SIZE/1024" | bc)

echo "   🚀 Ruta crítica total: ${CRITICAL_PATH_KB}KB"

# Load time simulation
echo ""
echo "⏱️  Simulando tiempos de carga en diferentes conexiones..."

# 3G simulation (750KB/s)
LOAD_3G=$(echo "scale=0; $CRITICAL_PATH_SIZE / 768000 * 1000" | bc)
echo "   📱 3G (750KB/s): ${LOAD_3G}ms"

# 4G simulation (3MB/s)  
LOAD_4G=$(echo "scale=0; $CRITICAL_PATH_SIZE / 3145728 * 1000" | bc)
echo "   📶 4G (3MB/s): ${LOAD_4G}ms"

# WiFi simulation (10MB/s)
LOAD_WIFI=$(echo "scale=0; $CRITICAL_PATH_SIZE / 10485760 * 1000" | bc)
echo "   🏠 WiFi (10MB/s): ${LOAD_WIFI}ms"

# Asset optimization check
echo ""
echo "🔧 Verificando optimizaciones de recursos..."

OPTIMIZATIONS=0
TOTAL_CHECKS=6

# Check for minified CSS
if [ -f "css/main.min.css" ]; then
    echo "   ✅ CSS minificado encontrado"
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
else
    echo "   ❌ CSS minificado no encontrado"
fi

# Check for minified JS
if [ -f "js/security.min.js" ]; then
    echo "   ✅ JavaScript minificado encontrado"
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
else
    echo "   ❌ JavaScript minificado no encontrado"
fi

# Check for service worker
if [ -f "service-worker.js" ]; then
    echo "   ✅ Service Worker implementado"
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
else
    echo "   ❌ Service Worker no encontrado"
fi

# Check for manifest
if [ -f "manifest.json" ]; then
    echo "   ✅ PWA Manifest configurado"
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
else
    echo "   ❌ PWA Manifest no encontrado"
fi

# Check for .htaccess
if [ -f ".htaccess.performance" ]; then
    echo "   ✅ Configuración de servidor optimizada"
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
else
    echo "   ❌ Configuración de servidor no optimizada"
fi

# Check for WebP images (if any exist)
WEBP_COUNT=$(find . -name "*.webp" 2>/dev/null | wc -l)
if [ $WEBP_COUNT -gt 0 ]; then
    echo "   ✅ Imágenes WebP optimizadas ($WEBP_COUNT encontradas)"
    OPTIMIZATIONS=$((OPTIMIZATIONS + 1))
else
    echo "   ⚠️  No se encontraron imágenes WebP"
fi

# Accessibility check
echo ""
echo "♿ Verificando características de accesibilidad..."

ACCESSIBILITY_SCORE=0
ACCESSIBILITY_TOTAL=4

# Check for aria-live regions in chat
if grep -q "aria-live" CHAT_TERAPEUTICO_INTERACTIVO.html; then
    echo "   ✅ Regiones ARIA live implementadas"
    ACCESSIBILITY_SCORE=$((ACCESSIBILITY_SCORE + 1))
else
    echo "   ❌ Regiones ARIA live no encontradas"
fi

# Check for sr-only class
if grep -q "sr-only" CHAT_TERAPEUTICO_INTERACTIVO.html; then
    echo "   ✅ Soporte para lectores de pantalla"
    ACCESSIBILITY_SCORE=$((ACCESSIBILITY_SCORE + 1))
else
    echo "   ❌ Soporte para lectores de pantalla incompleto"
fi

# Check for semantic HTML
if grep -q "<main" index.html && grep -q "<footer" index.html; then
    echo "   ✅ HTML semántico implementado"
    ACCESSIBILITY_SCORE=$((ACCESSIBILITY_SCORE + 1))
else
    echo "   ❌ HTML semántico incompleto"
fi

# Check for viewport meta
if grep -q "viewport" index.html; then
    echo "   ✅ Meta viewport configurado"
    ACCESSIBILITY_SCORE=$((ACCESSIBILITY_SCORE + 1))
else
    echo "   ❌ Meta viewport no encontrado"
fi

# Calculate scores
OPTIMIZATION_SCORE=$(echo "scale=0; $OPTIMIZATIONS * 100 / $TOTAL_CHECKS" | bc)
ACCESSIBILITY_PERCENTAGE=$(echo "scale=0; $ACCESSIBILITY_SCORE * 100 / $ACCESSIBILITY_TOTAL" | bc)

# Overall fluidity assessment
echo ""
echo "=================================================="
echo "📊 RESUMEN DE FLUIDEZ DE SENDEROS DE TINTA"
echo "=================================================="

# Performance analysis
if [ $(echo "$SCORE >= 90" | bc) -eq 1 ]; then
    echo "🎯 Rendimiento: EXCELENTE (${SCORE}%)"
elif [ $(echo "$SCORE >= 75" | bc) -eq 1 ]; then
    echo "🎯 Rendimiento: BUENO (${SCORE}%)"
elif [ $(echo "$SCORE >= 60" | bc) -eq 1 ]; then
    echo "🎯 Rendimiento: ACEPTABLE (${SCORE}%)"
else
    echo "🎯 Rendimiento: NECESITA MEJORAS (${SCORE}%)"
fi

# Load time analysis
if [ $LOAD_3G -lt 3000 ]; then
    echo "⚡ Velocidad de Carga: RÁPIDA ($LOAD_3G ms en 3G)"
elif [ $LOAD_3G -lt 5000 ]; then
    echo "⚡ Velocidad de Carga: MODERADA ($LOAD_3G ms en 3G)"
else
    echo "⚡ Velocidad de Carga: LENTA ($LOAD_3G ms en 3G)"
fi

# Optimization analysis
echo "🔧 Optimizaciones: $OPTIMIZATION_SCORE% ($OPTIMIZATIONS/$TOTAL_CHECKS implementadas)"
echo "♿ Accesibilidad: $ACCESSIBILITY_PERCENTAGE% ($ACCESSIBILITY_SCORE/$ACCESSIBILITY_TOTAL características)"

# Critical path analysis
if [ $(echo "$CRITICAL_PATH_KB < 50" | bc) -eq 1 ]; then
    echo "📦 Ruta Crítica: OPTIMIZADA (${CRITICAL_PATH_KB}KB)"
elif [ $(echo "$CRITICAL_PATH_KB < 100" | bc) -eq 1 ]; then
    echo "📦 Ruta Crítica: ACEPTABLE (${CRITICAL_PATH_KB}KB)"
else
    echo "📦 Ruta Crítica: PESADA (${CRITICAL_PATH_KB}KB)"
fi

# Calculate overall fluidity score
OVERALL_SCORE=$(echo "scale=0; ($SCORE + $OPTIMIZATION_SCORE + $ACCESSIBILITY_PERCENTAGE) / 3" | bc)

echo ""
echo "🌟 PUNTUACIÓN GENERAL DE FLUIDEZ: $OVERALL_SCORE%"

if [ $(echo "$OVERALL_SCORE >= 85" | bc) -eq 1 ]; then
    echo "🎉 ¡FLUIDEZ EXCELENTE! La experiencia terapéutica es fluida y optimizada."
    FLUIDITY_STATUS="EXCELENTE"
elif [ $(echo "$OVERALL_SCORE >= 70" | bc) -eq 1 ]; then
    echo "✅ FLUIDEZ BUENA. La experiencia es sólida con algunas áreas de mejora."
    FLUIDITY_STATUS="BUENA"
elif [ $(echo "$OVERALL_SCORE >= 55" | bc) -eq 1 ]; then
    echo "⚠️  FLUIDEZ ACEPTABLE. Se recomiendan optimizaciones adicionales."
    FLUIDITY_STATUS="ACEPTABLE"
else
    echo "❌ FLUIDEZ NECESITA MEJORAS. Se requieren optimizaciones significativas."
    FLUIDITY_STATUS="NECESITA MEJORAS"
fi

# Generate JSON report
cat > test-results/fluidity-report.json << EOF
{
  "timestamp": "$(date -Iseconds)",
  "overall_score": $OVERALL_SCORE,
  "fluidity_status": "$FLUIDITY_STATUS",
  "performance": {
    "score": $SCORE,
    "critical_path_kb": $CRITICAL_PATH_KB,
    "load_times": {
      "3g_ms": $LOAD_3G,
      "4g_ms": $LOAD_4G,
      "wifi_ms": $LOAD_WIFI
    }
  },
  "optimization": {
    "score": $OPTIMIZATION_SCORE,
    "implemented": $OPTIMIZATIONS,
    "total": $TOTAL_CHECKS
  },
  "accessibility": {
    "score": $ACCESSIBILITY_PERCENTAGE,
    "implemented": $ACCESSIBILITY_SCORE,
    "total": $ACCESSIBILITY_TOTAL
  },
  "file_sizes": {
    "index_html_kb": $(echo "scale=2; $INDEX_SIZE/1024" | bc),
    "main_css_kb": $(echo "scale=2; $CSS_SIZE/1024" | bc),
    "chat_html_kb": $(echo "scale=2; $CHAT_SIZE/1024" | bc)
  }
}
EOF

echo ""
echo "📁 Reporte detallado guardado en: test-results/fluidity-report.json"
echo "📄 Reporte de rendimiento en: performance-test-results.json"

# Exit with appropriate code
if [ $(echo "$OVERALL_SCORE >= 70" | bc) -eq 1 ]; then
    exit 0
else
    exit 1
fi