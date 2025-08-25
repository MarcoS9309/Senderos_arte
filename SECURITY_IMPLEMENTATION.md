# Guía de Implementación de Seguridad - Senderos de Tinta

## 🔐 Introducción

Esta guía proporciona instrucciones detalladas para implementar las medidas de seguridad agregadas al proyecto Senderos de Tinta sin modificar el código existente.

## 📋 Lista de Verificación de Seguridad

### ✅ Archivos de Seguridad Agregados

- [ ] `.gitignore` - Protección de archivos sensibles
- [ ] `SECURITY.md` - Política de seguridad
- [ ] `PRIVACY_POLICY.md` - Política de privacidad
- [ ] `.well-known/security.txt` - Información de contacto de seguridad
- [ ] `.htaccess` - Configuración de seguridad del servidor
- [ ] `js/security.js` - Utilidades de seguridad JavaScript
- [ ] `404.html` y `500.html` - Páginas de error personalizadas
- [ ] `manifest.json` - Configuración PWA segura
- [ ] `robots.txt` y `sitemap.xml` - SEO y rastreo controlado

## 🚀 Implementación por Etapas

### Etapa 1: Seguridad Básica (Inmediata)

#### 1.1 Configuración del Servidor Web

**Para Apache:**
```bash
# El archivo .htaccess ya está configurado
# Verificar que mod_headers esté habilitado
sudo a2enmod headers
sudo a2enmod rewrite
sudo systemctl reload apache2
```

**Para Nginx:**
```nginx
# Agregar a la configuración del servidor
server {
    # Headers de seguridad
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; frame-src 'none';" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Bloquear archivos sensibles
    location ~ /\. {
        deny all;
    }
    
    location ~ /(node_modules|\.git|logs|user-backups)/ {
        deny all;
    }
    
    # Páginas de error personalizadas
    error_page 404 /404.html;
    error_page 500 /500.html;
}
```

#### 1.2 Verificación de SSL/TLS

```bash
# Verificar configuración SSL
openssl s_client -connect senderosdetinta.com:443 -servername senderosdetinta.com

# Verificar headers de seguridad
curl -I https://senderosdetinta.com
```

### Etapa 2: Implementación de Utilidades de Seguridad

#### 2.1 Integración Opcional de security.js

Para implementar las utilidades de seguridad sin modificar el código existente:

```html
<!-- Agregar antes del cierre de </body> en las páginas que necesiten protección -->
<script src="/js/security.js"></script>
<script>
// Ejemplo de uso opcional
document.addEventListener('DOMContentLoaded', function() {
    // Solo si se desea usar las utilidades de seguridad
    if (typeof SenderosSeguridad !== 'undefined') {
        console.log('🔐 Utilidades de seguridad disponibles');
        
        // Ejemplo: sanitizar inputs existentes automáticamente
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value) {
                    this.value = SenderosSeguridad.sanitize(this.value);
                }
            });
        });
    }
});
</script>
```

#### 2.2 Configuración de Manifest PWA

```html
<!-- Agregar al <head> de las páginas principales -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#34495e">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Senderos de Tinta">
```

### Etapa 3: Monitoreo y Mantenimiento

#### 3.1 Configuración de Logs de Seguridad

```bash
# Crear directorio de logs (fuera del documento root)
mkdir -p /var/log/senderos-security
chown www-data:www-data /var/log/senderos-security
chmod 750 /var/log/senderos-security

# Configurar logrotate
cat > /etc/logrotate.d/senderos-security << EOF
/var/log/senderos-security/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 640 www-data www-data
}
EOF
```

#### 3.2 Script de Verificación Automática

```bash
#!/bin/bash
# verificar-seguridad.sh

echo "🔍 Verificación de Seguridad - Senderos de Tinta"
echo "=============================================="

# Verificar archivos de seguridad
files=(".htaccess" "SECURITY.md" "robots.txt" "manifest.json")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file presente"
    else
        echo "❌ $file faltante"
    fi
done

# Verificar permisos
echo "📁 Verificando permisos..."
find . -name "*.php" -perm /002 -exec echo "⚠️ Archivo con permisos inseguros: {}" \;
find . -type d -perm /002 -exec echo "⚠️ Directorio con permisos inseguros: {}" \;

# Verificar headers de seguridad
echo "🌐 Verificando headers HTTP..."
curl -s -I http://localhost/ | grep -E "(X-Frame-Options|X-XSS-Protection|Content-Security-Policy)"

echo "✅ Verificación completada"
```

## 🔍 Verificación de Implementación

### Pruebas de Seguridad Automatizadas

```bash
# Instalar herramientas de prueba (opcional)
npm install -g security-checker

# Verificar vulnerabilidades conocidas
security-checker --path .

# Verificar headers de seguridad
curl -s -D- https://senderosdetinta.com/ | head -20
```

### Checklist de Verificación Manual

#### Navegador
- [ ] Verificar que CSP bloquea scripts inline no autorizados
- [ ] Comprobar que localStorage funciona correctamente
- [ ] Verificar que las páginas de error 404/500 se muestran
- [ ] Comprobar que la PWA se puede instalar

#### Servidor
- [ ] Verificar que archivos sensibles están bloqueados (/.git, /node_modules)
- [ ] Comprobar redirección HTTP a HTTPS
- [ ] Verificar compresión de archivos estáticos
- [ ] Comprobar headers de seguridad

#### Funcionalidad
- [ ] Chat terapéutico funciona sin errores
- [ ] Cromoterapia se carga correctamente
- [ ] Poemas son accesibles
- [ ] Backup/exportación funciona (si se implementa)

## 🚨 Respuesta a Incidentes

### Procedimiento de Emergencia

1. **Detección de Problema:**
   ```bash
   # Verificar logs inmediatamente
   tail -f /var/log/apache2/error.log
   tail -f /var/log/senderos-security/security.log
   ```

2. **Aislamiento:**
   ```bash
   # Activar página de mantenimiento
   cp maintenance.html index.html
   ```

3. **Análisis:**
   ```bash
   # Revisar accesos recientes
   grep "$(date '+%d/%b/%Y')" /var/log/apache2/access.log | grep -v "200"
   ```

4. **Recuperación:**
   ```bash
   # Restaurar desde backup
   git checkout HEAD -- .
   ```

### Contactos de Emergencia

- **Desarrollador Principal:** Marco Vinicio
- **Email de Seguridad:** security@senderosdetinta.com
- **Documentación:** [SECURITY.md](SECURITY.md)

## 📈 Métricas de Seguridad

### KPIs a Monitorear

1. **Disponibilidad:** > 99.9%
2. **Tiempo de respuesta:** < 2 segundos
3. **Errores 4xx/5xx:** < 1% del tráfico
4. **Intentos de acceso a archivos bloqueados:** Monitoreado
5. **Uso de HTTPS:** 100%

### Herramientas de Monitoreo Recomendadas

- **Uptime:** UptimeRobot, Pingdom
- **Seguridad:** OWASP ZAP, Mozilla Observatory
- **Performance:** Google PageSpeed, GTmetrix
- **SSL:** SSL Labs, Qualys SSL Checker

## 🔄 Actualizaciones y Mantenimiento

### Rutina Semanal
- [ ] Verificar logs de seguridad
- [ ] Comprobar disponibilidad del sitio
- [ ] Revisar intentos de acceso a archivos bloqueados
- [ ] Verificar certificados SSL (30 días antes del vencimiento)

### Rutina Mensual
- [ ] Actualizar dependencias de seguridad
- [ ] Revisar políticas de seguridad
- [ ] Verificar backups de datos
- [ ] Comprobar configuración de headers

### Rutina Trimestral
- [ ] Auditoria completa de seguridad
- [ ] Revisión de políticas de privacidad
- [ ] Pruebas de penetración básicas
- [ ] Actualización de documentación

## 📚 Recursos Adicionales

### Documentación de Referencia
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [CSP Reference](https://content-security-policy.com/)

### Herramientas Útiles
- [CSP Generator](https://report-uri.com/home/generate)
- [SSL Test](https://www.ssllabs.com/ssltest/)
- [Security Headers](https://securityheaders.com/)

---

**© 2025 Senderos de Tinta**  
*Implementación de seguridad sin comprometer la funcionalidad terapéutica*