#!/usr/bin/env node

/**
 * Performance Test Suite for Senderos de Tinta
 * Tests loading times, resource optimization, and user experience fluidity
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class PerformanceTestSuite {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {
                passed: 0,
                failed: 0,
                warnings: 0
            }
        };
    }

    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',     // Cyan
            success: '\x1b[32m',  // Green
            warning: '\x1b[33m',  // Yellow
            error: '\x1b[31m',    // Red
            reset: '\x1b[0m'      // Reset
        };
        
        console.log(`${colors[type]}${message}${colors.reset}`);
    }

    addResult(test, passed, message, metrics = {}) {
        const result = {
            test,
            passed,
            message,
            metrics,
            timestamp: Date.now()
        };
        
        this.results.tests.push(result);
        
        if (passed) {
            this.results.summary.passed++;
            this.log(`✅ ${test}: ${message}`, 'success');
        } else {
            this.results.summary.failed++;
            this.log(`❌ ${test}: ${message}`, 'error');
        }
        
        if (metrics.warning) {
            this.results.summary.warnings++;
            this.log(`⚠️  Warning: ${metrics.warning}`, 'warning');
        }
    }

    async testFileSize() {
        this.log('\n📊 Testing file sizes for optimal loading...', 'info');
        
        const files = [
            { path: 'index.html', maxSize: 50000, critical: true },
            { path: 'css/main.css', maxSize: 100000, critical: true },
            { path: 'css/poem.css', maxSize: 50000, critical: false },
            { path: 'js/security.js', maxSize: 50000, critical: true },
            { path: 'js/accessibility.js', maxSize: 75000, critical: false },
            { path: 'CHAT_TERAPEUTICO_INTERACTIVO.html', maxSize: 200000, critical: true }
        ];

        for (const file of files) {
            try {
                const filePath = path.join(process.cwd(), file.path);
                const stats = fs.statSync(filePath);
                const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
                const maxSizeKB = Math.round(file.maxSize / 1024 * 100) / 100;
                
                const passed = stats.size <= file.maxSize;
                const message = `${sizeKB}KB (limit: ${maxSizeKB}KB)`;
                
                let warning = null;
                if (!passed && !file.critical) {
                    warning = `Non-critical file ${file.path} exceeds recommended size`;
                }
                
                this.addResult(
                    `File Size: ${file.path}`,
                    passed || !file.critical,
                    message,
                    { size: stats.size, sizeKB, warning }
                );
            } catch (error) {
                this.addResult(
                    `File Size: ${file.path}`,
                    false,
                    `File not found or unreadable: ${error.message}`
                );
            }
        }
    }

    async testCSSOptimization() {
        this.log('\n🎨 Testing CSS optimization...', 'info');
        
        try {
            const cssContent = fs.readFileSync('css/main.css', 'utf8');
            
            // Test for CSS variables usage
            const cssVariables = (cssContent.match(/var\(--[^)]+\)/g) || []).length;
            this.addResult(
                'CSS Variables Usage',
                cssVariables > 10,
                `Found ${cssVariables} CSS variable uses`,
                { cssVariables }
            );
            
            // Test for modern CSS features
            const hasFlexbox = cssContent.includes('display: flex') || cssContent.includes('display:flex');
            const hasGrid = cssContent.includes('display: grid') || cssContent.includes('display:grid');
            
            this.addResult(
                'Modern CSS Features',
                hasFlexbox || hasGrid,
                `Flexbox: ${hasFlexbox}, Grid: ${hasGrid}`,
                { hasFlexbox, hasGrid }
            );
            
            // Test for animations/transitions
            const transitions = (cssContent.match(/transition/gi) || []).length;
            this.addResult(
                'CSS Transitions',
                transitions > 0,
                `Found ${transitions} transition declarations`,
                { transitions }
            );
            
        } catch (error) {
            this.addResult(
                'CSS Analysis',
                false,
                `Could not analyze CSS: ${error.message}`
            );
        }
    }

    async testHTMLStructure() {
        this.log('\n📄 Testing HTML structure and SEO...', 'info');
        
        const htmlFiles = ['index.html', 'CHAT_TERAPEUTICO_INTERACTIVO.html', 'paleta-colores.html'];
        
        for (const htmlFile of htmlFiles) {
            try {
                const content = fs.readFileSync(htmlFile, 'utf8');
                
                // Test for meta viewport
                const hasViewport = content.includes('meta name="viewport"');
                this.addResult(
                    `Responsive Meta Tag: ${htmlFile}`,
                    hasViewport,
                    hasViewport ? 'Viewport meta tag found' : 'Missing viewport meta tag'
                );
                
                // Test for meta description
                const hasDescription = content.includes('meta name="description"');
                this.addResult(
                    `SEO Meta Description: ${htmlFile}`,
                    hasDescription,
                    hasDescription ? 'Description meta tag found' : 'Missing description meta tag'
                );
                
                // Test for semantic HTML
                const semanticTags = ['main', 'section', 'article', 'header', 'footer', 'nav'];
                const foundSemantic = semanticTags.filter(tag => content.includes(`<${tag}`));
                
                this.addResult(
                    `Semantic HTML: ${htmlFile}`,
                    foundSemantic.length >= 3,
                    `Found ${foundSemantic.length} semantic tags: ${foundSemantic.join(', ')}`,
                    { semanticTags: foundSemantic }
                );
                
            } catch (error) {
                this.addResult(
                    `HTML Analysis: ${htmlFile}`,
                    false,
                    `Could not analyze HTML: ${error.message}`
                );
            }
        }
    }

    async testAccessibility() {
        this.log('\n♿ Testing accessibility features...', 'info');
        
        try {
            const accessibilityJS = fs.readFileSync('js/accessibility.js', 'utf8');
            
            // Test for ARIA support
            const hasARIA = accessibilityJS.includes('aria-') || accessibilityJS.includes('ARIA');
            this.addResult(
                'ARIA Support',
                hasARIA,
                hasARIA ? 'ARIA implementation found' : 'No ARIA implementation detected'
            );
            
            // Test for keyboard navigation
            const hasKeyboardNav = accessibilityJS.includes('keyboard') || accessibilityJS.includes('keydown');
            this.addResult(
                'Keyboard Navigation',
                hasKeyboardNav,
                hasKeyboardNav ? 'Keyboard navigation implemented' : 'No keyboard navigation detected'
            );
            
            // Test for screen reader support
            const hasScreenReader = accessibilityJS.includes('screen-reader') || accessibilityJS.includes('sr-only') || accessibilityJS.includes('aria-live');
            this.addResult(
                'Screen Reader Support',
                hasScreenReader,
                hasScreenReader ? 'Screen reader support found' : 'No screen reader support detected'
            );
            
        } catch (error) {
            this.addResult(
                'Accessibility Analysis',
                false,
                `Could not analyze accessibility: ${error.message}`
            );
        }
    }

    async testPerformanceAssets() {
        this.log('\n⚡ Testing performance assets...', 'info');
        
        // Test for service worker
        const hasServiceWorker = fs.existsSync('service-worker.js');
        this.addResult(
            'Service Worker',
            hasServiceWorker,
            hasServiceWorker ? 'Service worker file found' : 'No service worker detected'
        );
        
        // Test for manifest.json
        const hasManifest = fs.existsSync('manifest.json');
        this.addResult(
            'PWA Manifest',
            hasManifest,
            hasManifest ? 'PWA manifest found' : 'No PWA manifest detected'
        );
        
        // Test for .htaccess optimization
        const hasHTAccess = fs.existsSync('.htaccess.performance');
        this.addResult(
            'Server Optimization',
            hasHTAccess,
            hasHTAccess ? '.htaccess.performance configuration found' : 'No server optimization config'
        );
        
        // Test for minified assets
        const hasMinifiedCSS = fs.existsSync('css/main.min.css');
        const hasMinifiedJS = fs.existsSync('js/security.min.js');
        
        this.addResult(
            'Asset Minification',
            hasMinifiedCSS || hasMinifiedJS,
            `CSS minified: ${hasMinifiedCSS}, JS minified: ${hasMinifiedJS}`,
            { hasMinifiedCSS, hasMinifiedJS }
        );
    }

    async runLoadTimeSimulation() {
        this.log('\n⏱️  Simulating load times...', 'info');
        
        const files = [
            'index.html',
            'css/main.css',
            'js/security.js',
            'CHAT_TERAPEUTICO_INTERACTIVO.html'
        ];
        
        let totalSize = 0;
        let criticalPathSize = 0;
        
        for (const file of files) {
            try {
                const stats = fs.statSync(file);
                totalSize += stats.size;
                
                if (file.includes('index.html') || file.includes('main.css')) {
                    criticalPathSize += stats.size;
                }
            } catch (error) {
                // File might not exist, skip
            }
        }
        
        // Simulate load times for different connection speeds
        const connectionSpeeds = {
            '3G': 750 * 1024,      // 750 KB/s
            '4G': 3 * 1024 * 1024, // 3 MB/s
            'WiFi': 10 * 1024 * 1024 // 10 MB/s
        };
        
        for (const [connection, speed] of Object.entries(connectionSpeeds)) {
            const loadTime = (criticalPathSize / speed) * 1000; // in milliseconds
            const passed = loadTime < 3000; // Under 3 seconds
            
            this.addResult(
                `Load Time (${connection})`,
                passed,
                `${Math.round(loadTime)}ms (critical path: ${Math.round(criticalPathSize/1024)}KB)`,
                { loadTime, criticalPathSize, connection }
            );
        }
    }

    async runAllTests() {
        this.log('🚀 Starting Performance Test Suite for Senderos de Tinta', 'info');
        this.log('='.repeat(60), 'info');
        
        const startTime = performance.now();
        
        await this.testFileSize();
        await this.testCSSOptimization();
        await this.testHTMLStructure();
        await this.testAccessibility();
        await this.testPerformanceAssets();
        await this.runLoadTimeSimulation();
        
        const endTime = performance.now();
        const duration = Math.round(endTime - startTime);
        
        this.results.testDuration = duration;
        
        this.log('\n' + '='.repeat(60), 'info');
        this.log('📊 Performance Test Results Summary', 'info');
        this.log('='.repeat(60), 'info');
        this.log(`✅ Passed: ${this.results.summary.passed}`, 'success');
        this.log(`❌ Failed: ${this.results.summary.failed}`, 'error');
        this.log(`⚠️  Warnings: ${this.results.summary.warnings}`, 'warning');
        this.log(`⏱️  Test Duration: ${duration}ms`, 'info');
        
        const score = Math.round((this.results.summary.passed / this.results.tests.length) * 100);
        this.log(`🎯 Performance Score: ${score}%`, score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error');
        
        // Save detailed results
        const resultsPath = 'performance-test-results.json';
        fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
        this.log(`📁 Detailed results saved to: ${resultsPath}`, 'info');
        
        return score >= 70; // Return true if score is acceptable
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new PerformanceTestSuite();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = PerformanceTestSuite;