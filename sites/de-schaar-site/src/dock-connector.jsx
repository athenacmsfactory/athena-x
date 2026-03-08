/**
 * ⚓ Athena Dock Connector v6 (Universal - Docked Track)
 * Handles communication between the generated site (iframe) and the Athena Dock (parent).
 */
(function() {
    console.log("⚓ Athena Dock Connector v6 Active");

    // --- 1. CONFIGURATION & STATE ---
    let lastKnownData = null;

    const getApiUrl = (path) => {
        const base = import.meta.env.BASE_URL || '/';
        return (base + '/' + path).replace(new RegExp('/+', 'g'), '/');
    };

    // --- 2. THEME MAPPINGS ---
    const themeMappings = {
        'primary_color': ['--color-primary', '--primary-color'],
        'title_color': ['--color-title'],
        'heading_color': ['--color-heading'],
        'accent_color': ['--color-accent'],
        'button_color': ['--color-button'],
        'card_color': ['--color-card', '--bg-surface'],
        'header_color': ['--color-header', '--bg-header'],
        'bg_color': ['--color-background', '--bg-site'],
        'text_color': ['--color-text'],
        'hero_bg_color': ['--color-hero-bg']
    };

    const globalMappings = {
        'global_radius': '--radius-custom'
    };

    // --- 3. SECTION SCANNER & STYLE CAPTURE ---
    function getComputedThemeColors() {
        try {
            const root = getComputedStyle(document.documentElement);
            const captured = {};
            const isDark = document.documentElement.classList.contains('dark');
            const prefix = isDark ? 'dark_' : 'light_';

            const map = {
                '--color-primary': 'primary_color',
                '--color-accent': 'accent_color',
                '--color-button': 'button_color',
                '--color-card': 'card_color',
                '--color-header': 'header_color',
                '--color-background': 'bg_color',
                '--color-text': 'text_color',
                '--color-title': 'title_color',
                '--color-heading': 'heading_color'
            };

            Object.entries(map).forEach(([cssVar, athenaKey]) => {
                const val = root.getPropertyValue(cssVar).trim();
                if (val && (val.startsWith('#') || val.startsWith('rgb'))) {
                    captured[`${prefix}${athenaKey}`] = val;
                }
            });

            return captured;
        } catch (e) {
            return {};
        }
    }

    function scanSections() {
        const sections = [];
        const sectionElements = document.querySelectorAll('[data-dock-section]');
        sectionElements.forEach(el => {
            sections.push(el.getAttribute('data-dock-section'));
        });
        return sections;
    }

    // --- 4. COMMUNICATION (OUTBOUND) ---
    function notifyDock(fullData = null) {
        if (fullData) lastKnownData = fullData;
        
        const computedDefaults = getComputedThemeColors();

        const structure = {
            sections: scanSections(),
            layouts: lastKnownData?.layout_settings?.[0] || lastKnownData?.layout_settings || {},
            data: {
                ...lastKnownData,
                // Merge computed defaults with actual JSON data
                site_settings: {
                    ...computedDefaults,
                    ...(Array.isArray(lastKnownData?.hero) ? lastKnownData?.hero[0] : lastKnownData?.hero),
                    ...(Array.isArray(lastKnownData?.header_settings) ? lastKnownData?.header_settings[0] : lastKnownData?.header_settings),
                    ...(lastKnownData?.style_config || {})
                }
            },
            url: window.location.href,
            timestamp: Date.now()
        };

        window.parent.postMessage({
            type: 'SITE_READY',
            structure: structure
        }, '*');
    }

    // --- 5. COMMUNICATION (INBOUND) ---
    window.addEventListener('message', async (event) => {
        const { type, key, value, section, direction, file, index } = event.data;

        // Color Update
        if (type === 'DOCK_UPDATE_COLOR') {
            const root = document.documentElement;
            const isDark = root.classList.contains('dark');
            const currentTheme = isDark ? 'dark' : 'light';
            
            if (key === 'theme') {
                if (value === 'dark') {
                    root.classList.add('dark');
                    root.style.colorScheme = 'dark';
                } else {
                    root.classList.remove('dark');
                    root.style.colorScheme = 'light';
                }
                return;
            }

            // Specific layout/design handlers (Dutch & English keys)
            if (key === 'content_top_offset') {
                root.style.setProperty('--content-top-offset', value + 'px');
                return;
            }

            if (key === 'header_hoogte' || key === 'header_height') {
                root.style.setProperty('--header-height', value + 'px');
                return;
            }

            if (key === 'header_transparantie' || key === 'header_transparent') {
                const transparency = parseFloat(value);
                if (!isNaN(transparency) && transparency > 0) {
                    const opacity = 1 - transparency;
                    root.style.setProperty('--header-bg', `rgba(var(--color-header-rgb, 255, 255, 255), ${opacity})`);
                    root.style.setProperty('--header-blur', transparency > 0.5 ? 'none' : 'blur(16px)');
                    root.style.setProperty('--header-border', 'none');
                } else {
                    root.style.removeProperty('--header-bg');
                    root.style.removeProperty('--header-blur');
                    root.style.removeProperty('--header-border');
                }
                return;
            }

            if (key === 'header_zichtbaar' || key === 'header_visible') {
                const els = document.querySelectorAll('[data-dock-element="header-nav"]');
                els.forEach(el => el.style.display = value ? 'flex' : 'none');
                return;
            }

            if (key.startsWith('header_show_') || key.startsWith('toon_')) {
                const elementMap = {
                    'header_show_logo': '[data-dock-element="header-logo"]',
                    'toon_logo': '[data-dock-element="header-logo"]',
                    'header_show_title': '[data-dock-element="header-title"]',
                    'toon_titel': '[data-dock-element="header-title"]',
                    'header_show_tagline': '[data-dock-element="header-tagline"]',
                    'toon_ondertitel': '[data-dock-element="header-tagline"]',
                    'header_show_button': '[data-dock-element="header-button"]',
                    'toon_cta_knop': '[data-dock-element="header-button"]',
                    'header_show_navbar': '[data-dock-element="header-navbar"]',
                    'toon_navigatie': '[data-dock-element="header-navbar"]'
                };
                const selector = elementMap[key];
                if (selector) {
                    const els = document.querySelectorAll(selector);
                    els.forEach(el => el.style.display = value ? '' : 'none');
                }
                return;
            }

            if (key === 'hero_overlay_transparantie' || key === 'hero_overlay_opacity') {
                let opacity = parseFloat(value);
                if (isNaN(opacity)) opacity = 0.8;
                root.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);
                root.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);
                return;
            }

            // Global numeric/string variables
            if (globalMappings[key]) {
                root.style.setProperty(globalMappings[key], value);
                return;
            }

            // Theme-prefixed colors (light_... or dark_...)
            const targetTheme = key.startsWith('dark') ? 'dark' : 'light';
            const cleanKey = key.replace('light_', '').replace('dark_', '');
            
            // Only apply if the change matches the current visible theme
            if (targetTheme === currentTheme) {
                const vars = themeMappings[cleanKey];
                if (vars) {
                    vars.forEach(v => root.style.setProperty(v, value));
                }
            }
        }

        // Section Padding Update (Live)
        if (type === 'DOCK_UPDATE_SECTION_PADDING') {
            const el = document.getElementById(section);
            if (el) {
                const px = value * 4;
                el.style.paddingTop = px + 'px';
                el.style.paddingBottom = px + 'px';
            }
        }

        // Section Visibility Update (Live)
        if (type === 'DOCK_UPDATE_SECTION_VISIBILITY') {
            const el = document.getElementById(section);
            if (el) {
                const badge = el.querySelector('.athena-hidden-badge');
                if (value === false) {
                    el.classList.add('opacity-40', 'grayscale-[50%]');
                    if (!badge) {
                        const b = document.createElement('div');
                        b.className = 'athena-hidden-badge absolute top-4 right-4 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold uppercase z-50';
                        b.innerText = 'Hidden Section';
                        el.appendChild(b);
                    }
                } else {
                    el.classList.remove('opacity-40', 'grayscale-[50%]');
                    if (badge) badge.remove();
                }
            }
        }

        // Style Swap (Requires full reload to apply new CSS imports)
        if (type === 'DOCK_SWAP_STYLE') {
            console.log("🎨 Swapping global style to:", value);
            setTimeout(() => window.location.reload(), 500);
        }

        // Text Update (Live Preview)
        if (type === 'DOCK_UPDATE_TEXT') {
            const bindStr = JSON.stringify({ file, index, key });
            const elements = document.querySelectorAll(`[data-dock-bind='${bindStr}']`);
            const baseUrl = import.meta.env.BASE_URL || '/';

            elements.forEach(el => {
                if (el.tagName === 'IMG') {
                    const src = (value && !value.startsWith('http') && !value.startsWith('/') && !value.startsWith('data:'))
                        ? `${baseUrl}images/${value}`.replace(/\/+/g, '/')
                        : value;
                    el.src = src;
                } else {
                    // Robust text extraction for style-objects
                    const text = (typeof value === 'object' && value !== null) 
                        ? (value.text || value.title || value.label || value.value || '') 
                        : value;
                    el.innerText = text;
                }
            });
        }
    });

    // --- 6. INITIALIZATION ---
    if (document.readyState === 'complete') {
        setTimeout(notifyDock, 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(notifyDock, 1000);
        });
    }

    window.athenaScan = notifyDock;

    // --- Click selection ---
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-dock-bind]');
        if (target && window.parent !== window) {
            if (!e.shiftKey) return; // v8: Shift+Click to edit

            e.preventDefault();
            e.stopPropagation();

            const binding = JSON.parse(target.getAttribute('data-dock-bind'));
            const dockType = target.getAttribute('data-dock-type') || 'text';

            let currentValue = target.getAttribute('data-dock-current') || target.innerText;
            
            if (dockType === 'link') {
                currentValue = {
                    label: target.getAttribute('data-dock-label') || target.innerText,
                    url: target.getAttribute('data-dock-url') || ""
                };
            } else if (!currentValue || dockType === 'media') {
                const img = target.tagName === 'IMG' ? target : target.querySelector('img');
                if (img) {
                    const src = img.getAttribute('src');
                    if (src && src.includes('/images/')) {
                        currentValue = src.split('/images/').pop().split('?')[0];
                    } else {
                        currentValue = src;
                    }
                }
            }

            window.parent.postMessage({
                type: 'SITE_CLICK',
                binding: binding,
                currentValue: currentValue || "",
                tagName: target.tagName,
                dockType: dockType
            }, '*');
        }
    }, true);

})();
