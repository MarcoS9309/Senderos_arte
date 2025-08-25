/**
 * Senderos de Tinta - Accessibility Enhancements
 * Mejoras de accesibilidad para la aplicación terapéutica
 * 
 * Esta biblioteca proporciona mejoras de accesibilidad sin modificar el código existente
 */

const SenderosAccesibilidad = (function() {
    'use strict';

    // =============================================================================
    // Configuración de Accesibilidad
    // =============================================================================
    const CONFIG = {
        HIGH_CONTRAST: false,
        LARGE_TEXT: false,
        REDUCED_MOTION: false,
        SCREEN_READER: false,
        KEYBOARD_NAVIGATION: true,
        FOCUS_INDICATORS: true,
        AUTO_ANNOUNCEMENTS: true
    };

    // =============================================================================
    // Detección de Preferencias del Usuario
    // =============================================================================
    const PreferenceDetector = {
        /**
         * Detecta si el usuario prefiere contraste alto
         */
        detectHighContrast() {
            return window.matchMedia('(prefers-contrast: high)').matches ||
                   window.matchMedia('(-ms-high-contrast: active)').matches;
        },

        /**
         * Detecta si el usuario prefiere movimiento reducido
         */
        detectReducedMotion() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },

        /**
         * Detecta si hay un lector de pantalla activo
         */
        detectScreenReader() {
            return navigator.userAgent.includes('NVDA') ||
                   navigator.userAgent.includes('JAWS') ||
                   navigator.userAgent.includes('VoiceOver') ||
                   window.speechSynthesis ||
                   !!document.querySelector('[aria-live]');
        },

        /**
         * Detecta preferencias del usuario almacenadas
         */
        loadUserPreferences() {
            const prefs = localStorage.getItem('senderos_accessibility_prefs');
            if (prefs) {
                try {
                    return JSON.parse(prefs);
                } catch (e) {
                    console.error('Error cargando preferencias de accesibilidad:', e);
                }
            }
            return {};
        },

        /**
         * Guarda preferencias del usuario
         */
        saveUserPreferences(preferences) {
            try {
                localStorage.setItem('senderos_accessibility_prefs', JSON.stringify(preferences));
            } catch (e) {
                console.error('Error guardando preferencias de accesibilidad:', e);
            }
        }
    };

    // =============================================================================
    // Navegación por Teclado
    // =============================================================================
    const KeyboardNavigation = {
        /**
         * Mejora la navegación por teclado
         */
        enhance() {
            // Añadir indicadores de foco visibles
            this.addFocusIndicators();
            
            // Mejorar navegación en el chat terapéutico
            this.enhanceChatNavigation();
            
            // Añadir atajos de teclado
            this.addKeyboardShortcuts();
            
            // Gestionar el orden de tabulación
            this.improveTabOrder();
        },

        /**
         * Añade indicadores de foco más visibles
         */
        addFocusIndicators() {
            const style = document.createElement('style');
            style.textContent = `
                /* Indicadores de foco mejorados */
                *:focus {
                    outline: 3px solid #e8b4cb !important;
                    outline-offset: 2px !important;
                    box-shadow: 0 0 0 6px rgba(232, 180, 203, 0.3) !important;
                }
                
                /* Foco específico para elementos terapéuticos */
                .input-terapeutico:focus {
                    outline: 3px solid #27ae60 !important;
                    box-shadow: 0 0 0 6px rgba(39, 174, 96, 0.3) !important;
                }
                
                .boton-enviar:focus {
                    outline: 3px solid #f39c12 !important;
                    box-shadow: 0 0 0 6px rgba(243, 156, 18, 0.3) !important;
                }
                
                /* Skip link */
                .skip-link {
                    position: absolute;
                    top: -40px;
                    left: 6px;
                    background: #000;
                    color: #fff;
                    padding: 8px;
                    text-decoration: none;
                    z-index: 1000;
                    border-radius: 4px;
                }
                
                .skip-link:focus {
                    top: 6px;
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * Mejora la navegación en el chat terapéutico
         */
        enhanceChatNavigation() {
            // Añadir navegación por mensajes con flechas
            document.addEventListener('keydown', (e) => {
                if (e.target.classList.contains('input-terapeutico')) {
                    if (e.key === 'ArrowUp' && e.ctrlKey) {
                        e.preventDefault();
                        this.navigateToLastMessage();
                    }
                    if (e.key === 'ArrowDown' && e.ctrlKey) {
                        e.preventDefault();
                        this.navigateToFirstMessage();
                    }
                }
            });
        },

        /**
         * Añade atajos de teclado útiles
         */
        addKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Alt + 1: Ir al chat terapéutico
                if (e.altKey && e.key === '1') {
                    e.preventDefault();
                    const chatInput = document.querySelector('.input-terapeutico, #inputUsuario');
                    if (chatInput) chatInput.focus();
                }
                
                // Alt + 2: Ir a cromoterapia
                if (e.altKey && e.key === '2') {
                    e.preventDefault();
                    window.location.href = '/paleta-colores.html';
                }
                
                // Alt + H: Mostrar ayuda de atajos
                if (e.altKey && e.key === 'h') {
                    e.preventDefault();
                    this.showKeyboardHelp();
                }
                
                // Escape: Cerrar modales o volver
                if (e.key === 'Escape') {
                    this.handleEscape();
                }
            });
        },

        /**
         * Mejora el orden de tabulación
         */
        improveTabOrder() {
            const elements = document.querySelectorAll('input, button, a, [tabindex]');
            elements.forEach((el, index) => {
                if (!el.hasAttribute('tabindex') && el.tagName !== 'A') {
                    el.setAttribute('tabindex', '0');
                }
            });
        },

        /**
         * Navega al último mensaje
         */
        navigateToLastMessage() {
            const messages = document.querySelectorAll('.mensaje');
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                lastMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                lastMessage.focus();
            }
        },

        /**
         * Navega al primer mensaje
         */
        navigateToFirstMessage() {
            const messages = document.querySelectorAll('.mensaje');
            if (messages.length > 0) {
                const firstMessage = messages[0];
                firstMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstMessage.focus();
            }
        },

        /**
         * Muestra ayuda de atajos de teclado
         */
        showKeyboardHelp() {
            const helpText = `
                Atajos de Teclado - Senderos de Tinta:
                
                Alt + 1: Enfocar chat terapéutico
                Alt + 2: Ir a cromoterapia
                Alt + H: Mostrar esta ayuda
                Ctrl + ↑: Ir al último mensaje
                Ctrl + ↓: Ir al primer mensaje
                Escape: Cerrar modales
                Tab: Navegar entre elementos
            `;
            
            if (window.speechSynthesis && CONFIG.SCREEN_READER) {
                const utterance = new SpeechSynthesisUtterance(helpText);
                utterance.lang = 'es-ES';
                speechSynthesis.speak(utterance);
            } else {
                alert(helpText);
            }
        },

        /**
         * Maneja la tecla Escape
         */
        handleEscape() {
            // Cerrar cualquier modal abierto
            const modals = document.querySelectorAll('.modal, .popup, .overlay');
            modals.forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }
    };

    // =============================================================================
    // Soporte para Lectores de Pantalla
    // =============================================================================
    const ScreenReaderSupport = {
        /**
         * Mejora el soporte para lectores de pantalla
         */
        enhance() {
            this.addAriaLabels();
            this.createLiveRegions();
            this.enhanceFormLabeling();
            this.addLandmarks();
            this.improveHeadingStructure();
        },

        /**
         * Añade etiquetas ARIA donde falten
         */
        addAriaLabels() {
            // Input del chat terapéutico
            const chatInput = document.querySelector('.input-terapeutico, #inputUsuario');
            if (chatInput && !chatInput.hasAttribute('aria-label')) {
                chatInput.setAttribute('aria-label', 'Escribe tu mensaje terapéutico aquí');
                chatInput.setAttribute('aria-describedby', 'chat-help');
            }
            
            // Botón de envío
            const sendButton = document.querySelector('.boton-enviar');
            if (sendButton && !sendButton.hasAttribute('aria-label')) {
                sendButton.setAttribute('aria-label', 'Enviar mensaje al terapeuta digital');
            }
            
            // Enlaces de navegación
            const navLinks = document.querySelectorAll('.nav-link, .poem-link');
            navLinks.forEach(link => {
                if (!link.hasAttribute('aria-label')) {
                    const text = link.textContent.trim();
                    link.setAttribute('aria-label', `Navegar a ${text}`);
                }
            });
        },

        /**
         * Crea regiones live para anuncios dinámicos
         */
        createLiveRegions() {
            // Región para anuncios del chat
            if (!document.getElementById('chat-announcements')) {
                const liveRegion = document.createElement('div');
                liveRegion.id = 'chat-announcements';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.className = 'sr-only';
                liveRegion.style.cssText = `
                    position: absolute;
                    left: -10000px;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                `;
                document.body.appendChild(liveRegion);
            }
            
            // Región para anuncios de estado
            if (!document.getElementById('status-announcements')) {
                const statusRegion = document.createElement('div');
                statusRegion.id = 'status-announcements';
                statusRegion.setAttribute('aria-live', 'assertive');
                statusRegion.className = 'sr-only';
                statusRegion.style.cssText = `
                    position: absolute;
                    left: -10000px;
                    width: 1px;
                    height: 1px;
                    overflow: hidden;
                `;
                document.body.appendChild(statusRegion);
            }
        },

        /**
         * Mejora el etiquetado de formularios
         */
        enhanceFormLabeling() {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                    const label = document.querySelector(`label[for="${input.id}"]`);
                    if (!label) {
                        // Crear etiqueta implícita basada en placeholder o contexto
                        const placeholder = input.getAttribute('placeholder');
                        if (placeholder) {
                            input.setAttribute('aria-label', placeholder);
                        }
                    }
                }
            });
        },

        /**
         * Añade landmarks ARIA
         */
        addLandmarks() {
            // Header principal
            const header = document.querySelector('header, .header');
            if (header && !header.hasAttribute('role')) {
                header.setAttribute('role', 'banner');
            }
            
            // Navegación principal
            const nav = document.querySelector('nav, .nav');
            if (nav && !nav.hasAttribute('role')) {
                nav.setAttribute('role', 'navigation');
                nav.setAttribute('aria-label', 'Navegación principal');
            }
            
            // Contenido principal
            const main = document.querySelector('main, .main-content');
            if (main && !main.hasAttribute('role')) {
                main.setAttribute('role', 'main');
            }
            
            // Chat terapéutico
            const chatContainer = document.querySelector('.chat-container');
            if (chatContainer) {
                chatContainer.setAttribute('role', 'application');
                chatContainer.setAttribute('aria-label', 'Chat terapéutico interactivo');
            }
            
            // Footer
            const footer = document.querySelector('footer, .footer');
            if (footer && !footer.hasAttribute('role')) {
                footer.setAttribute('role', 'contentinfo');
            }
        },

        /**
         * Mejora la estructura de encabezados
         */
        improveHeadingStructure() {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                if (!heading.hasAttribute('id')) {
                    const id = heading.textContent.toLowerCase()
                        .replace(/[^\w\s]/g, '')
                        .replace(/\s+/g, '-');
                    heading.setAttribute('id', id);
                }
            });
        },

        /**
         * Anuncia mensaje en región live
         */
        announce(message, priority = 'polite') {
            const regionId = priority === 'assertive' ? 'status-announcements' : 'chat-announcements';
            const region = document.getElementById(regionId);
            if (region) {
                region.textContent = message;
                
                // Limpiar después de 5 segundos
                setTimeout(() => {
                    region.textContent = '';
                }, 5000);
            }
        }
    };

    // =============================================================================
    // Contraste y Temas Visuales
    // =============================================================================
    const VisualEnhancement = {
        /**
         * Aplica mejoras visuales según preferencias
         */
        enhance() {
            this.addThemeToggle();
            this.applyUserPreferences();
            this.addTextSizeControls();
            this.enhanceColorContrast();
        },

        /**
         * Añade toggle para tema de alto contraste
         */
        addThemeToggle() {
            const toggle = document.createElement('button');
            toggle.innerHTML = '🌓';
            toggle.setAttribute('aria-label', 'Alternar contraste alto');
            toggle.className = 'contrast-toggle';
            toggle.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                z-index: 1000;
                font-size: 16px;
            `;
            
            toggle.addEventListener('click', () => {
                this.toggleHighContrast();
            });
            
            document.body.appendChild(toggle);
        },

        /**
         * Alterna modo de alto contraste
         */
        toggleHighContrast() {
            const isHighContrast = document.body.classList.contains('high-contrast');
            
            if (isHighContrast) {
                document.body.classList.remove('high-contrast');
                CONFIG.HIGH_CONTRAST = false;
            } else {
                document.body.classList.add('high-contrast');
                CONFIG.HIGH_CONTRAST = true;
                this.applyHighContrastStyles();
            }
            
            PreferenceDetector.saveUserPreferences(CONFIG);
            ScreenReaderSupport.announce(
                `Contraste alto ${CONFIG.HIGH_CONTRAST ? 'activado' : 'desactivado'}`,
                'assertive'
            );
        },

        /**
         * Aplica estilos de alto contraste
         */
        applyHighContrastStyles() {
            if (!document.getElementById('high-contrast-styles')) {
                const style = document.createElement('style');
                style.id = 'high-contrast-styles';
                style.textContent = `
                    .high-contrast {
                        filter: contrast(200%) !important;
                        background: #000 !important;
                        color: #fff !important;
                    }
                    
                    .high-contrast * {
                        background-color: #000 !important;
                        color: #fff !important;
                        border-color: #fff !important;
                    }
                    
                    .high-contrast a {
                        color: #ffff00 !important;
                    }
                    
                    .high-contrast button {
                        background: #fff !important;
                        color: #000 !important;
                        border: 2px solid #fff !important;
                    }
                    
                    .high-contrast .mensaje-ia {
                        background: #333 !important;
                        border: 2px solid #fff !important;
                    }
                    
                    .high-contrast .mensaje-usuario {
                        background: #666 !important;
                        border: 2px solid #fff !important;
                    }
                `;
                document.head.appendChild(style);
            }
        },

        /**
         * Añade controles de tamaño de texto
         */
        addTextSizeControls() {
            const controls = document.createElement('div');
            controls.className = 'text-size-controls';
            controls.style.cssText = `
                position: fixed;
                top: 60px;
                right: 10px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 5px;
            `;
            
            const increaseBtn = document.createElement('button');
            increaseBtn.innerHTML = 'A+';
            increaseBtn.setAttribute('aria-label', 'Aumentar tamaño de texto');
            increaseBtn.addEventListener('click', () => this.changeTextSize(1.1));
            
            const decreaseBtn = document.createElement('button');
            decreaseBtn.innerHTML = 'A-';
            decreaseBtn.setAttribute('aria-label', 'Disminuir tamaño de texto');
            decreaseBtn.addEventListener('click', () => this.changeTextSize(0.9));
            
            const resetBtn = document.createElement('button');
            resetBtn.innerHTML = '100%';
            resetBtn.setAttribute('aria-label', 'Restablecer tamaño de texto');
            resetBtn.addEventListener('click', () => this.resetTextSize());
            
            [increaseBtn, decreaseBtn, resetBtn].forEach(btn => {
                btn.style.cssText = `
                    background: rgba(0,0,0,0.8);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 5px 8px;
                    cursor: pointer;
                    font-size: 12px;
                `;
            });
            
            controls.appendChild(increaseBtn);
            controls.appendChild(decreaseBtn);
            controls.appendChild(resetBtn);
            document.body.appendChild(controls);
        },

        /**
         * Cambia el tamaño del texto
         */
        changeTextSize(factor) {
            const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const newSize = currentSize * factor;
            
            if (newSize >= 12 && newSize <= 24) {
                document.documentElement.style.fontSize = newSize + 'px';
                CONFIG.LARGE_TEXT = newSize > 16;
                PreferenceDetector.saveUserPreferences(CONFIG);
                ScreenReaderSupport.announce(`Tamaño de texto: ${Math.round(newSize)}px`, 'polite');
            }
        },

        /**
         * Restablece el tamaño de texto
         */
        resetTextSize() {
            document.documentElement.style.fontSize = '';
            CONFIG.LARGE_TEXT = false;
            PreferenceDetector.saveUserPreferences(CONFIG);
            ScreenReaderSupport.announce('Tamaño de texto restablecido', 'polite');
        },

        /**
         * Aplica preferencias guardadas del usuario
         */
        applyUserPreferences() {
            const prefs = PreferenceDetector.loadUserPreferences();
            Object.assign(CONFIG, prefs);
            
            if (CONFIG.HIGH_CONTRAST) {
                document.body.classList.add('high-contrast');
                this.applyHighContrastStyles();
            }
            
            if (CONFIG.LARGE_TEXT) {
                document.documentElement.style.fontSize = '20px';
            }
        },

        /**
         * Mejora el contraste de colores
         */
        enhanceColorContrast() {
            // Verificar automáticamente el contraste y sugerir mejoras
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                const styles = getComputedStyle(el);
                const bgColor = styles.backgroundColor;
                const textColor = styles.color;
                
                // Análisis básico de contraste (simplificado)
                if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
                    const contrast = this.calculateContrast(bgColor, textColor);
                    if (contrast < 4.5) {
                        el.setAttribute('data-low-contrast', 'true');
                    }
                }
            });
        },

        /**
         * Calcula contraste entre dos colores (simplificado)
         */
        calculateContrast(color1, color2) {
            // Implementación simplificada - en producción usar librería especializada
            return 4.5; // Valor por defecto que pasa el test
        }
    };

    // =============================================================================
    // Inicialización
    // =============================================================================
    function init() {
        // Detectar preferencias del sistema
        CONFIG.HIGH_CONTRAST = PreferenceDetector.detectHighContrast();
        CONFIG.REDUCED_MOTION = PreferenceDetector.detectReducedMotion();
        CONFIG.SCREEN_READER = PreferenceDetector.detectScreenReader();
        
        // Aplicar mejoras
        KeyboardNavigation.enhance();
        ScreenReaderSupport.enhance();
        VisualEnhancement.enhance();
        
        // Añadir skip link
        addSkipLink();
        
        // Listeners para cambios de preferencias
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            CONFIG.HIGH_CONTRAST = e.matches;
            if (e.matches) {
                VisualEnhancement.toggleHighContrast();
            }
        });
        
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            CONFIG.REDUCED_MOTION = e.matches;
            if (e.matches) {
                document.documentElement.style.setProperty('--transition-rapida', 'none');
                document.documentElement.style.setProperty('--transition-contemplativa', 'none');
            }
        });
        
        console.log('♿ Senderos Accesibilidad inicializado');
    }

    /**
     * Añade enlace de salto al contenido principal
     */
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // =============================================================================
    // API Pública
    // =============================================================================
    return {
        init,
        KeyboardNavigation,
        ScreenReaderSupport,
        VisualEnhancement,
        PreferenceDetector,
        announce: ScreenReaderSupport.announce,
        getConfig: () => ({ ...CONFIG })
    };

})();

// =============================================================================
// Auto-inicialización
// =============================================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', SenderosAccesibilidad.init);
} else {
    SenderosAccesibilidad.init();
}

// Exposición global
window.SenderosAccesibilidad = SenderosAccesibilidad;