/**
 * Senderos de Tinta - Security & Privacy Utilities
 * Biblioteca de utilidades de seguridad para protección de datos terapéuticos
 * 
 * IMPORTANTE: Esta biblioteca no modifica el código existente, solo proporciona
 * herramientas adicionales de seguridad que pueden ser implementadas gradualmente.
 */

// =============================================================================
// Namespace para evitar conflictos
// =============================================================================
const SenderosSeguridad = (function() {
    'use strict';

    // =============================================================================
    // Configuración de Seguridad
    // =============================================================================
    const CONFIG = {
        ENCRYPTION_KEY_SIZE: 256,
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
        MAX_SESSION_HISTORY: 50,
        BACKUP_ENCRYPTION: true,
        LOG_SECURITY_EVENTS: true
    };

    // =============================================================================
    // Utilidades de Sanitización de Input
    // =============================================================================
    const InputSanitizer = {
        /**
         * Sanitiza texto de entrada para prevenir XSS
         * @param {string} input - Texto a sanitizar
         * @returns {string} Texto sanitizado
         */
        sanitizeText(input) {
            if (typeof input !== 'string') return '';
            
            return input
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;')
                .trim();
        },

        /**
         * Valida que el input terapéutico sea seguro
         * @param {string} text - Texto terapéutico
         * @returns {boolean} Si es válido
         */
        validateTherapeuticInput(text) {
            if (!text || typeof text !== 'string') return false;
            if (text.length > 5000) return false; // Límite razonable
            
            // Patrones peligrosos
            const dangerousPatterns = [
                /<script[^>]*>.*?<\/script>/gi,
                /javascript:/gi,
                /vbscript:/gi,
                /onload=/gi,
                /onerror=/gi,
                /onclick=/gi
            ];
            
            return !dangerousPatterns.some(pattern => pattern.test(text));
        },

        /**
         * Limpia texto manteniendo emociones y terapia válida
         * @param {string} text - Texto a limpiar
         * @returns {string} Texto limpio
         */
        cleanTherapeuticText(text) {
            if (!this.validateTherapeuticInput(text)) return '';
            return this.sanitizeText(text);
        }
    };

    // =============================================================================
    // Gestión Segura de Datos Locales
    // =============================================================================
    const SecureStorage = {
        /**
         * Encripta datos antes de almacenar (simulación simple)
         * @param {string} data - Datos a encriptar
         * @returns {string} Datos encriptados
         */
        encrypt(data) {
            if (!data) return '';
            // Simulación de encriptación básica (en producción usar Web Crypto API)
            return btoa(encodeURIComponent(data));
        },

        /**
         * Desencripta datos almacenados
         * @param {string} encryptedData - Datos encriptados
         * @returns {string} Datos originales
         */
        decrypt(encryptedData) {
            if (!encryptedData) return '';
            try {
                return decodeURIComponent(atob(encryptedData));
            } catch (e) {
                console.error('Error al desencriptar datos:', e);
                return '';
            }
        },

        /**
         * Almacena datos de sesión terapéutica de forma segura
         * @param {string} key - Clave de almacenamiento
         * @param {any} data - Datos a almacenar
         */
        storeTherapeuticData(key, data) {
            try {
                const encryptedData = this.encrypt(JSON.stringify({
                    data: data,
                    timestamp: Date.now(),
                    version: '2.0'
                }));
                localStorage.setItem(`senderos_secure_${key}`, encryptedData);
            } catch (e) {
                console.error('Error al almacenar datos terapéuticos:', e);
            }
        },

        /**
         * Recupera datos de sesión terapéutica
         * @param {string} key - Clave de almacenamiento
         * @returns {any} Datos recuperados
         */
        getTherapeuticData(key) {
            try {
                const encryptedData = localStorage.getItem(`senderos_secure_${key}`);
                if (!encryptedData) return null;

                const decryptedData = this.decrypt(encryptedData);
                const parsedData = JSON.parse(decryptedData);
                
                // Verificar timeout de sesión
                if (Date.now() - parsedData.timestamp > CONFIG.SESSION_TIMEOUT) {
                    this.removeTherapeuticData(key);
                    return null;
                }
                
                return parsedData.data;
            } catch (e) {
                console.error('Error al recuperar datos terapéuticos:', e);
                return null;
            }
        },

        /**
         * Elimina datos de sesión terapéutica
         * @param {string} key - Clave de almacenamiento
         */
        removeTherapeuticData(key) {
            localStorage.removeItem(`senderos_secure_${key}`);
        },

        /**
         * Limpia todos los datos terapéuticos expirados
         */
        cleanupExpiredData() {
            const keys = Object.keys(localStorage);
            keys.filter(key => key.startsWith('senderos_secure_'))
                .forEach(key => {
                    const data = this.getTherapeuticData(key.replace('senderos_secure_', ''));
                    // Si retorna null, significa que estaba expirado y ya se eliminó
                });
        }
    };

    // =============================================================================
    // Sistema de Backup y Exportación Segura
    // =============================================================================
    const DataBackup = {
        /**
         * Exporta datos del usuario de forma segura
         * @returns {Object} Datos de backup
         */
        exportUserData() {
            const backupData = {
                version: '2.0',
                timestamp: new Date().toISOString(),
                data: {
                    conversaciones: SecureStorage.getTherapeuticData('conversaciones') || [],
                    preferencias: SecureStorage.getTherapeuticData('preferencias') || {},
                    progreso: SecureStorage.getTherapeuticData('progreso') || {}
                },
                metadata: {
                    totalSessions: this.getTotalSessions(),
                    exportDate: new Date().toLocaleDateString('es-ES'),
                    privacyLevel: 'maximum'
                }
            };

            return backupData;
        },

        /**
         * Descarga backup como archivo JSON
         */
        downloadBackup() {
            try {
                const backupData = this.exportUserData();
                const jsonString = JSON.stringify(backupData, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `senderos-backup-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                console.log('✅ Backup descargado exitosamente');
            } catch (e) {
                console.error('❌ Error al descargar backup:', e);
            }
        },

        /**
         * Importa datos desde backup
         * @param {File} file - Archivo de backup
         */
        async importBackup(file) {
            try {
                const text = await file.text();
                const backupData = JSON.parse(text);
                
                if (!this.validateBackup(backupData)) {
                    throw new Error('Archivo de backup inválido');
                }
                
                // Importar datos
                if (backupData.data.conversaciones) {
                    SecureStorage.storeTherapeuticData('conversaciones', backupData.data.conversaciones);
                }
                if (backupData.data.preferencias) {
                    SecureStorage.storeTherapeuticData('preferencias', backupData.data.preferencias);
                }
                if (backupData.data.progreso) {
                    SecureStorage.storeTherapeuticData('progreso', backupData.data.progreso);
                }
                
                console.log('✅ Backup importado exitosamente');
                return true;
            } catch (e) {
                console.error('❌ Error al importar backup:', e);
                return false;
            }
        },

        /**
         * Valida estructura del backup
         * @param {Object} backupData - Datos a validar
         * @returns {boolean} Si es válido
         */
        validateBackup(backupData) {
            return backupData &&
                   backupData.version &&
                   backupData.timestamp &&
                   backupData.data &&
                   typeof backupData.data === 'object';
        },

        /**
         * Obtiene total de sesiones registradas
         * @returns {number} Número de sesiones
         */
        getTotalSessions() {
            const conversaciones = SecureStorage.getTherapeuticData('conversaciones') || [];
            return Array.isArray(conversaciones) ? conversaciones.length : 0;
        }
    };

    // =============================================================================
    // Monitor de Seguridad
    // =============================================================================
    const SecurityMonitor = {
        /**
         * Registra evento de seguridad (sin datos personales)
         * @param {string} event - Tipo de evento
         * @param {Object} details - Detalles del evento
         */
        logSecurityEvent(event, details = {}) {
            if (!CONFIG.LOG_SECURITY_EVENTS) return;
            
            const logEntry = {
                timestamp: new Date().toISOString(),
                event: event,
                userAgent: navigator.userAgent.substring(0, 100), // Limitado
                url: window.location.pathname,
                details: details
            };
            
            console.log('🔐 Evento de Seguridad:', logEntry);
            
            // Almacenar logs localmente (opcional)
            const logs = JSON.parse(localStorage.getItem('senderos_security_logs') || '[]');
            logs.push(logEntry);
            
            // Mantener solo los últimos 50 logs
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('senderos_security_logs', JSON.stringify(logs));
        },

        /**
         * Verifica integridad de la sesión
         * @returns {boolean} Si la sesión es válida
         */
        checkSessionIntegrity() {
            try {
                // Verificar que localStorage esté disponible
                if (typeof Storage === 'undefined') {
                    this.logSecurityEvent('storage_unavailable');
                    return false;
                }
                
                // Verificar que no haya scripts maliciosos inyectados
                const scripts = document.querySelectorAll('script');
                let hasUnsafeScript = false;
                
                scripts.forEach(script => {
                    if (script.src && !script.src.startsWith(window.location.origin)) {
                        hasUnsafeScript = true;
                    }
                });
                
                if (hasUnsafeScript) {
                    this.logSecurityEvent('unsafe_script_detected');
                    return false;
                }
                
                return true;
            } catch (e) {
                this.logSecurityEvent('session_integrity_error', { error: e.message });
                return false;
            }
        },

        /**
         * Limpia datos sensibles al cerrar sesión
         */
        cleanupOnSessionEnd() {
            try {
                // Limpiar datos temporales
                SecureStorage.cleanupExpiredData();
                
                // Limpiar caché del navegador programáticamente
                if ('caches' in window) {
                    caches.keys().then(cacheNames => {
                        cacheNames.forEach(cacheName => {
                            if (cacheName.includes('senderos')) {
                                caches.delete(cacheName);
                            }
                        });
                    });
                }
                
                this.logSecurityEvent('session_cleanup_completed');
            } catch (e) {
                this.logSecurityEvent('session_cleanup_error', { error: e.message });
            }
        }
    };

    // =============================================================================
    // Inicialización Automática
    // =============================================================================
    function init() {
        // Verificar integridad al cargar
        if (!SecurityMonitor.checkSessionIntegrity()) {
            console.warn('⚠️ Problemas de integridad detectados');
        }
        
        // Limpieza automática de datos expirados
        SecureStorage.cleanupExpiredData();
        
        // Event listeners para limpieza al cerrar
        window.addEventListener('beforeunload', () => {
            SecurityMonitor.cleanupOnSessionEnd();
        });
        
        // Verificación periódica de integridad (cada 10 minutos)
        setInterval(() => {
            SecurityMonitor.checkSessionIntegrity();
            SecureStorage.cleanupExpiredData();
        }, 10 * 60 * 1000);
        
        console.log('🔐 Senderos Seguridad inicializado correctamente');
    }

    // =============================================================================
    // API Pública
    // =============================================================================
    return {
        // Módulos principales
        InputSanitizer,
        SecureStorage,
        DataBackup,
        SecurityMonitor,
        
        // Métodos de utilidad
        init,
        
        // Configuración
        getConfig: () => ({ ...CONFIG }),
        
        // Métodos rápidos
        sanitize: InputSanitizer.sanitizeText,
        validate: InputSanitizer.validateTherapeuticInput,
        store: SecureStorage.storeTherapeuticData,
        get: SecureStorage.getTherapeuticData,
        backup: DataBackup.downloadBackup
    };

})();

// =============================================================================
// Auto-inicialización
// =============================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SenderosSeguridad.init);
} else {
    SenderosSeguridad.init();
}

// =============================================================================
// Exposición global controlada
// =============================================================================
window.SenderosSeguridad = SenderosSeguridad;

// =============================================================================
// Ejemplo de Uso (para desarrolladores)
// =============================================================================
/*
// Sanitizar input del usuario
const userInput = SenderosSeguridad.sanitize(inputElement.value);

// Almacenar datos de sesión
SenderosSeguridad.store('preferencias_usuario', { color: 'verde', tema: 'natural' });

// Recuperar datos
const preferencias = SenderosSeguridad.get('preferencias_usuario');

// Crear backup
SenderosSeguridad.backup();

// Validar input terapéutico
if (SenderosSeguridad.validate(mensajeUsuario)) {
    // Procesar mensaje seguro
}
*/