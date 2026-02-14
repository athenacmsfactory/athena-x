import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../../'); // athena-2/
const sitesDir = path.join(root, 'sites');

const STYLE_INJECTOR_CONTENT = "import React, { useLayoutEffect } from 'react';\n\n" +
"/**\n * StyleInjector (Auto-upgraded)\n * Synchronizes Athena JSON settings with CSS Custom Properties (Variables).\n */\n" +
"const StyleInjector = ({ siteSettings }) => {\n" +
"  const settings = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : (siteSettings || {});\n\n" +
"  useLayoutEffect(() => {\n" +
"    const root = document.documentElement;\n" +
"    const isDark = settings.theme === 'dark';\n\n" +
"    // 1. Theme Toggle\n" +
"    if (isDark) {\n" +
"      root.classList.add('dark');\n" +
"      root.style.colorScheme = 'dark';\n" +
"    } else {\n" +
"      root.classList.remove('dark');\n" +
"      root.style.colorScheme = 'light';\n" +
"    }\n\n" +
"    // 2. Map Settings to CSS Variables\n" +
"    const prefix = isDark ? 'dark_' : 'light_';\n" +
"    \n" +
"    const mappings = {\n" +
"      'primary_color': ['--color-primary', '--primary-color'],\n" +
"      'title_color': ['--color-title'],\n" +
"      'heading_color': ['--color-heading'],\n" +
"      'accent_color': ['--color-accent'],\n" +
"      'button_color': ['--color-button', '--color-button-bg', '--btn-bg'],\n" +
"      'card_color': ['--color-card', '--bg-surface', '--color-card-bg', '--card-bg', '--surface', '--color-surface'],\n" +
"      'header_color': ['--color-header', '--bg-header', '--color-header-bg', '--nav-bg'],\n" +
"      'bg_color': ['--color-background', '--bg-site'],\n" +
"      'text_color': ['--color-text']\n" +
"    };\n\n" +
"    Object.entries(mappings).forEach(([key, vars]) => {\n" +
"      const val = settings[prefix + key] || settings[key];\n" +
"      if (val) {\n" +
"        vars.forEach(v => root.style.setProperty(v, val));\n" +
"      }\n" +
"    });\n\n" +
"    if (settings.global_radius) root.style.setProperty('--radius-custom', settings.global_radius);\n\n" +
"    // Hero overlay: convert opacity to rgba values used by Section.jsx gradient\n" +
"    if (settings.hero_overlay_opacity !== undefined) {\n" +
"      let opacity = parseFloat(settings.hero_overlay_opacity);\n" +
"      if (isNaN(opacity)) opacity = 0.8;\n" +
"      root.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);\n" +
"      root.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);\n" +
"    }\n\n" +
"    if (settings.content_top_offset !== undefined) root.style.setProperty('--content-top-offset', settings.content_top_offset + 'px');\n" +
"    if (settings.header_height !== undefined) root.style.setProperty('--header-height', settings.header_height + 'px');\n\n" +
"    // Header transparency\n" +
"    if (settings.header_transparent === true) {\n" +
"      root.style.setProperty('--header-bg', 'transparent');\n" +
"      root.style.setProperty('--header-blur', 'none');\n" +
"      root.style.setProperty('--header-border', 'none');\n" +
"    } else if (settings.header_transparent === false) {\n" +
"      root.style.removeProperty('--header-bg');\n" +
"      root.style.removeProperty('--header-blur');\n" +
"      root.style.removeProperty('--header-border');\n" +
"    }\n\n" +
"  }, [settings]);\n\n" +
"  return null;\n" +
"};\n\nexport default StyleInjector;";

const DOCK_CONNECTOR_CONTENT = "(function() {\n" +
"    console.log('⚓ Athena Dock Connector v7 Active');\n\n" +
"    let lastKnownData = null;\n" +
"    const getApiUrl = (path) => {\n" +
"        const base = import.meta.env.BASE_URL || '/';\n" +
"        return (base + '/' + path).replace(new RegExp('/+', 'g'), '/');\n" +
"    };\n\n" +
"    const themeMappings = {\n" +
"        'primary_color': ['--color-primary', '--primary-color'],\n" +
"        'title_color': ['--color-title'],\n" +
"        'heading_color': ['--color-heading'],\n" +
"        'accent_color': ['--color-accent'],\n" +
"        'button_color': ['--color-button', '--color-button-bg', '--btn-bg'],\n" +
"        'card_color': ['--color-card', '--bg-surface', '--color-card-bg', '--card-bg', '--surface', '--color-surface'],\n" +
"        'header_color': ['--color-header', '--bg-header', '--color-header-bg', '--nav-bg'],\n" +
"        'bg_color': ['--color-background', '--bg-site'],\n" +
"        'text_color': ['--color-text']\n" +
"    };\n\n" +
"    const globalMappings = {\n" +
"        'global_radius': '--radius-custom'\n" +
"    };\n\n" +
"    function scanSections() {\n" +
"        const sections = [];\n" +
"        document.querySelectorAll('[data-dock-section]').forEach(el => {\n" +
"            sections.push(el.getAttribute('data-dock-section'));\n" +
"        });\n" +
"        return sections;\n" +
"    }\n\n" +
"    function notifyDock(fullData = null) {\n" +
"        if (fullData) lastKnownData = fullData;\n" +
"        const structure = {\n" +
"            sections: scanSections(),\n" +
"            layouts: lastKnownData?.layout_settings?.[0] || lastKnownData?.layout_settings || {},\n" +
"            data: lastKnownData || {},\n" +
"            url: window.location.href,\n" +
"            timestamp: Date.now()\n" +
"        };\n" +
"        window.parent.postMessage({ type: 'SITE_READY', structure }, '*');\n" +
"    }\n\n" +
"    window.addEventListener('message', async (event) => {\n" +
"        const { type, key, value, section, direction, file, index } = event.data;\n\n" +
"        if (type === 'DOCK_UPDATE_COLOR') {\n" +
"            const root = document.documentElement;\n" +
"            const isDark = root.classList.contains('dark');\n" +
"            const currentTheme = isDark ? 'dark' : 'light';\n" +
"            \n" +
"            if (key === 'theme') {\n" +
"                if (value === 'dark') { root.classList.add('dark'); root.style.colorScheme = 'dark'; }\n" +
"                else { root.classList.remove('dark'); root.style.colorScheme = 'light'; }\n" +
"                return;\n" +
"            }\n\n" +
"            if (key === 'content_top_offset') {\n" +
"                root.style.setProperty('--content-top-offset', value + 'px');\n" +
"                return;\n" +
"            }\n\n" +
"            if (key === 'header_height') {\n" +
"                root.style.setProperty('--header-height', value + 'px');\n" +
"                return;\n" +
"            }\n\n" +
"            if (key === 'header_transparent') {\n" +
"                if (value === true) {\n" +
"                    root.style.setProperty('--header-bg', 'transparent');\n" +
"                    root.style.setProperty('--header-blur', 'none');\n" +
"                    root.style.setProperty('--header-border', 'none');\n" +
"                } else {\n" +
"                    root.style.removeProperty('--header-bg');\n" +
"                    root.style.removeProperty('--header-blur');\n" +
"                    root.style.removeProperty('--header-border');\n" +
"                }\n" +
"                return;\n" +
"            }\n\n" +
"            if (key === 'header_visible') {\n" +
"                const nav = document.querySelector('nav.fixed.top-0');\n" +
"                if (nav) nav.style.display = value ? 'flex' : 'none';\n" +
"                return;\n" +
"            }\n\n" +
"            if (key.startsWith('header_show_')) {\n" +
"                const elementMap = {\n" +
"                    'header_show_logo': '.relative.w-12.h-12',\n" +
"                    'header_show_title': 'span.text-2xl.font-serif',\n" +
"                    'header_show_tagline': 'span.text-\\\\[10px\\\\]',\n" +
"                    'header_show_button': 'button, .bg-primary'\n" +
"                };\n" +
"                const selector = elementMap[key];\n" +
"                if (selector) {\n" +
"                    const els = document.querySelectorAll(selector);\n" +
"                    els.forEach(el => el.style.display = value ? '' : 'none');\n" +
"                }\n" +
"                return;\n" +
"            }\n\n" +
"            if (key === 'hero_overlay_opacity') {\n" +
"                let opacity = parseFloat(value);\n" +
"                if (isNaN(opacity)) opacity = 0.8;\n" +
"                root.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);\n" +
"                root.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);\n" +
"                return;\n" +
"            }\n\n" +
"            if (globalMappings[key]) {\n" +
"                root.style.setProperty(globalMappings[key], value);\n" +
"                return;\n" +
"            }\n\n" +
"            const targetTheme = key.startsWith('dark') ? 'dark' : 'light';\n" +
"            const cleanKey = key.replace('light_', '').replace('dark_', '');\n" +
"            \n" +
"            if (targetTheme === currentTheme && themeMappings[cleanKey]) {\n" +
"                themeMappings[cleanKey].forEach(v => root.style.setProperty(v, value));\n" +
"            }\n" +
"        }\n\n" +
"        if (type === 'DOCK_SWAP_STYLE') setTimeout(() => window.location.reload(), 500);\n\n" +
"        if (type === 'DOCK_UPDATE_TEXT') {\n" +
"            const bindStr = JSON.stringify({ file, index, key });\n" +
"            const elements = document.querySelectorAll('[data-dock-bind]');\n" +
"            const baseUrl = import.meta.env.BASE_URL || '/';\n\n" +
"            elements.forEach(el => {\n" +
"                try {\n" +
"                    const elBind = JSON.parse(el.getAttribute('data-dock-bind'));\n" +
"                    if (elBind.file !== file || elBind.index !== index || elBind.key !== key) return;\n\n" +
"                    const dockType = el.getAttribute('data-dock-type') || (el.tagName === 'IMG' ? 'media' : 'text');\n" +
"                    if (dockType === 'media') {\n" +
"                        const src = (value && !value.startsWith('http') && !value.startsWith('/') && !value.startsWith('data:'))\n" +
"                            ? `${baseUrl}images/${value}`.replace(/\\/+/g, '/')\n" +
"                            : value;\n" +
"                        const mediaEl = (el.tagName === 'IMG' || el.tagName === 'VIDEO') ? el : el.querySelector('img, video');\n" +
"                        if (mediaEl) mediaEl.src = src;\n" +
"                    } else if (dockType === 'link') {\n" +
"                        const { label, url } = (typeof value === 'object' && value !== null) ? value : { label: value, url: '' };\n" +
"                        el.innerText = label || '';\n" +
"                        el.setAttribute('data-dock-label', label || '');\n" +
"                        el.setAttribute('data-dock-url', url || '');\n" +
"                    } else {\n" +
"                        el.innerText = value;\n" +
"                    }\n" +
"                } catch(e) {}\n" +
"            });\n" +
"        }\n" +
"    });\n\n" +
"    if (document.readyState === 'complete') setTimeout(notifyDock, 1000);\n" +
"    else window.addEventListener('load', () => setTimeout(notifyDock, 1000));\n\n" +
"    window.athenaScan = notifyDock;\n" +
"})();";

async function upgradeSite(siteName) {
    const sitePath = path.join(sitesDir, siteName);
    const srcPath = path.join(sitePath, 'src');
    
    if (!fs.existsSync(srcPath)) return;

    process.stdout.write(`🚀 Upgrading site: ${siteName}... `);

    try {
        const componentsDir = path.join(srcPath, 'components');
        if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
        fs.writeFileSync(path.join(componentsDir, 'StyleInjector.jsx'), STYLE_INJECTOR_CONTENT);

        const connectorPath = path.join(srcPath, 'dock-connector.js');
        if (fs.existsSync(connectorPath)) {
            fs.writeFileSync(connectorPath, DOCK_CONNECTOR_CONTENT);
        }

        const appPath = path.join(srcPath, 'App.jsx');
        if (fs.existsSync(appPath)) {
            let appContent = fs.readFileSync(appPath, 'utf8');
            if (!appContent.includes('StyleInjector')) {
                appContent = "import StyleInjector from './components/StyleInjector';\n" + appContent;
            }
            if (!appContent.includes('<StyleInjector')) {
                const divMatch = appContent.match(/<div[^>]*className=['"][^'"]*min-h-screen[^'"]*['"][^>]*>/);
                if (divMatch) {
                    appContent = appContent.replace(divMatch[0], divMatch[0] + "\n      <StyleInjector siteSettings={data['site_settings']} />");
                }
            }
            if (appContent.includes('DESIGN & THEMING ENGINE') || appContent.includes('mappings = {')) {
                appContent = appContent.replace(/\/\/ --- DESIGN & THEMING ENGINE ---[\s\S]*?}, \[data\.site_settings\]\);/, '/* Old Design Engine Removed */');
                appContent = appContent.replace(/useMemo\(\(\) => \{[\s\S]*?mappings = \{[\s\S]*?\}, \[data\.site_settings\]\);/, '/* Old Design Engine Removed */');
            }
            fs.writeFileSync(appPath, appContent);
        }
        console.log("✅");
    } catch (e) {
        console.log("❌ Error: " + e.message);
    }
}

async function run() {
    const sites = fs.readdirSync(sitesDir).filter(f => fs.statSync(path.join(sitesDir, f)).isDirectory());
    for (const site of sites) {
        if (site === 'de-salon-site') continue; 
        await upgradeSite(site);
    }
    console.log("\n✨ All sites upgraded successfully!");
}

run();
