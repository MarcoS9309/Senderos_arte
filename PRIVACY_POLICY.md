# Política de Privacidad - Senderos de Tinta

**Última actualización:** Enero 2025

## Introducción

Senderos de Tinta se compromete a proteger su privacidad y datos personales. Esta aplicación de terapia digital está diseñada con principios de privacidad desde el diseño.

## Información que Recopilamos

### Datos de Sesión Local
- **Conversaciones terapéuticas**: Almacenadas localmente en su navegador
- **Preferencias de color**: Guardadas para personalizar su experiencia
- **Progreso emocional**: Registrado únicamente en su dispositivo local

### Datos NO Recopilados
- ❌ No recopilamos datos personales identificables
- ❌ No transmitimos conversaciones a servidores externos
- ❌ No utilizamos cookies de seguimiento
- ❌ No compartimos información con terceros

## Cómo Usamos Su Información

### Procesamiento Local
- Todas las conversaciones se procesan en su navegador
- Los algoritmos terapéuticos funcionan completamente offline
- Su información permanece en su dispositivo

### Personalización
- Adaptamos las respuestas según su estado emocional detectado
- Ajustamos la cromoterapia según sus preferencias
- Recordamos su progreso entre sesiones (localmente)

## Almacenamiento y Seguridad

### Almacenamiento Local
- Utilizamos `localStorage` del navegador para persistir datos
- Los datos están encriptados en su dispositivo
- Puede borrar todos los datos desde la configuración del navegador

### Medidas de Seguridad
- **Encriptación**: Todos los datos sensibles están encriptados
- **Validación de entrada**: Prevención de ataques XSS
- **CSP (Content Security Policy)**: Protección contra scripts maliciosos
- **Sin transmisión externa**: Ningún dato sale de su dispositivo

## Sus Derechos

### Control de Datos
- **Acceso**: Puede revisar todos sus datos desde la consola del navegador
- **Borrado**: Puede eliminar todos los datos locales en cualquier momento
- **Portabilidad**: Puede exportar sus datos en formato JSON
- **Rectificación**: Puede modificar o corregir información almacenada

### Exportación de Datos
```javascript
// Comando para exportar sus datos terapéuticos
const exportarDatos = () => {
    const datos = {
        conversaciones: localStorage.getItem('senderos_conversaciones'),
        preferencias: localStorage.getItem('senderos_preferencias'),
        progreso: localStorage.getItem('senderos_progreso')
    };
    console.log('Sus datos terapéuticos:', datos);
    return datos;
};
```

## Menores de Edad

- Esta aplicación está diseñada para usuarios mayores de 18 años
- Para menores, se requiere supervisión de un adulto responsable
- Los datos de menores reciben protección adicional según COPPA

## Cumplimiento Normativo

### GDPR (Reglamento General de Protección de Datos)
- ✅ Consentimiento explícito para el procesamiento
- ✅ Derecho al olvido implementado
- ✅ Portabilidad de datos garantizada
- ✅ Privacidad desde el diseño

### HIPAA (Health Insurance Portability and Accountability Act)
- ✅ No hay transmisión de datos de salud
- ✅ Procesamiento local cumple con estándares de seguridad
- ✅ Acceso controlado por el usuario

## Cambios en la Política

### Notificación de Cambios
- Le notificaremos sobre cambios significativos
- La fecha de "última actualización" se modificará
- Los cambios se implementarán con 30 días de antelación

### Historial de Versiones
- **v2.0 (Enero 2025)**: Política inicial completa
- **v1.0 (Agosto 2024)**: Versión preliminar

## Contacto

### Preguntas sobre Privacidad
- **Email**: privacy@senderosdetinta.com
- **Teléfono**: +1-800-SENDEROS (solo para consultas de privacidad)
- **Correo postal**: Senderos de Tinta Privacy Office, [Dirección]

### Oficial de Protección de Datos
- **Nombre**: Marco Vinicio
- **Email**: dpo@senderosdetinta.com
- **Función**: Responsable de cumplimiento de privacidad

## Tecnología y Seguridad Técnica

### Medidas Implementadas
```html
<!-- Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">

<!-- Protección adicional -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
```

### Algoritmos de Encriptación
- **AES-256**: Para datos sensibles locales
- **SHA-256**: Para verificación de integridad
- **PBKDF2**: Para derivación de claves

## Transparencia Algorítmica

### Funcionamiento del Sistema
- Los algoritmos de detección emocional son determinísticos
- No utilizamos aprendizaje automático que requiera datos externos
- El código fuente está disponible para auditoría

### Sesgo y Equidad
- Nuestros algoritmos son auditados regularmente
- No utilizamos datos biométricos discriminatorios
- Garantizamos tratamiento equitativo independientemente de características personales

---

**© 2025 Senderos de Tinta**  
*Comprometidos con su privacidad y bienestar digital*

**Última revisión:** Enero 15, 2025  
**Próxima revisión programada:** Julio 15, 2025