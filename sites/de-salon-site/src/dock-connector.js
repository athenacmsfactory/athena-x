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
        // Universal mappings that apply regardless of current theme prefix
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

    // --- 3. SECTION SCANNER ---
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
        
        const structure = {
            sections: scanSections(),
            layouts: lastKnownData?.layout_settings?.[0] || lastKnownData?.layout_settings || {},
            data: lastKnownData || {},
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

            // Specific layout/design handlers
            if (key === 'content_top_offset') {
                root.style.setProperty('--content-top-offset', value + 'px');
                return;
            }

            if (key === 'header_height') {
                root.style.setProperty('--header-height', value + 'px');
                return;
            }

            if (key === 'header_transparent') {
                if (value === true) {
                    root.style.setProperty('--header-bg', 'transparent');
                    root.style.setProperty('--header-blur', 'none');
                    root.style.setProperty('--header-border', 'none');
                } else {
                    root.style.removeProperty('--header-bg');
                    root.style.removeProperty('--header-blur');
                    root.style.removeProperty('--header-border');
                }
                return;
            }

            if (key === 'header_visible') {
                const nav = document.querySelector('nav.fixed.top-0');
                if (nav) nav.style.display = value ? 'flex' : 'none';
                return;
            }

            if (key.startsWith('header_show_')) {
                const elementMap = {
                    'header_show_logo': '.relative.w-12.h-12',
                    'header_show_title': 'span.text-2xl.font-serif',
                    'header_show_tagline': 'span.text-\\[10px\\]',
                    'header_show_button': 'button, .bg-primary'
                };
                const selector = elementMap[key];
                if (selector) {
                    const els = document.querySelectorAll(selector);
                    els.forEach(el => el.style.display = value ? '' : 'none');
                }
                return;
            }

            if (key === 'hero_overlay_opacity') {
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

        // Style Swap (Requires full reload to apply new CSS imports)
        if (type === 'DOCK_SWAP_STYLE') {
            console.log("🎨 Swapping global style to:", value);
            // We doen een kleine delay zodat de API call van de Dock eerst klaar kan zijn
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
                    el.innerText = value;
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

    // --- 7. DRAG & DROP (VIDEOS & IMAGES) ---
    const isMediaBind = (bind) => {
        if (!bind || !bind.key) return false;
        const k = bind.key.toLowerCase();
        return k.includes('foto') || k.includes('image') || k.includes('img') || k.includes('afbeelding') || k.includes('hero_image') || k.includes('video');
    };

    // Global Drag Tracking
    let dragEnterCount = 0;
    window.addEventListener('dragenter', (e) => {
        dragEnterCount++;
        if (dragEnterCount === 1) document.body.classList.add('dock-dragging-active');
    });

    window.addEventListener('dragleave', (e) => {
        dragEnterCount--;
        if (dragEnterCount <= 0) {
            dragEnterCount = 0;
            document.body.classList.remove('dock-dragging-active');
        }
    });

    window.addEventListener('dragover', (e) => { e.preventDefault(); });

    window.addEventListener('drop', async (e) => {
        const target = e.target.closest('[data-dock-bind]');
        dragEnterCount = 0;
        document.body.classList.remove('dock-dragging-active');

        if (!target) return;
        const bind = JSON.parse(target.getAttribute('data-dock-bind'));
        if (!isMediaBind(bind)) return;

        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) return;

        try {
            const uploadRes = await fetch(getApiUrl('__athena/upload'), {
                method: 'POST',
                headers: { 'x-filename': file.name },
                body: file
            });
            const uploadData = await uploadRes.json();
            
            if (uploadData.success) {
                await fetch(getApiUrl('__athena/update-json'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file: bind.file, index: bind.index, key: bind.key, value: uploadData.filename })
                });
                window.parent.postMessage({ type: 'DOCK_TRIGGER_REFRESH' }, '*');
            }
        } catch (err) { console.error(err); }
    }, true);

    // Click selection
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-dock-bind]');
        if (target && window.parent !== window) {
            if (e.shiftKey) return;

            e.preventDefault();
            e.stopPropagation();

            const binding = JSON.parse(target.getAttribute('data-dock-bind'));
            const dockType = target.getAttribute('data-dock-type') || (
                (binding.key && (binding.key.toLowerCase().includes('foto') || 
                                 binding.key.toLowerCase().includes('image') || 
                                 binding.key.toLowerCase().includes('img') || 
                                 binding.key.toLowerCase().includes('afbeelding') || 
                                 binding.key.toLowerCase().includes('video'))) ? 'media' : 'text'
            );

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
