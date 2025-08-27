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
