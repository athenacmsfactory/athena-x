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
        light: {
            'light_primary_color': ['--color-primary', '--primary-color'],
            'light_title_color': ['--color-title'],
            'light_heading_color': ['--color-heading'],
            'light_accent_color': ['--color-accent'],
            'light_button_color': ['--color-button-bg', '--btn-bg'],
            'light_card_color': ['--color-card-bg', '--card-bg', '--surface', '--color-surface'],
            'light_header_color': ['--color-header-bg', '--nav-bg'],
            'light_bg_color': ['--color-background', '--bg-site'],
            'light_text_color': ['--color-text'],
            'global_radius': ['--radius-custom', '--radius-main'], // GLOBALE VARS
            'global_shadow': ['--shadow-main']                    // GLOBALE VARS
        },
        dark: {
            'dark_primary_color': ['--color-primary'],
            'dark_title_color': ['--color-title'],
            'dark_heading_color': ['--color-heading'],
            'dark_accent_color': ['--color-accent'],
            'dark_button_color': ['--color-button-bg', '--btn-bg'],
            'dark_card_color': ['--color-card-bg', '--card-bg', '--surface', '--color-surface'],
            'dark_header_color': ['--color-header-bg', '--nav-bg'],
            'dark_bg_color': ['--color-background', '--bg-site'],
            'dark_text_color': ['--color-text'],
            'global_radius': ['--radius-custom', '--radius-main'],
            'global_shadow': ['--shadow-main']
        }
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
            const isDark = document.documentElement.classList.contains('dark');
            const currentTheme = isDark ? 'dark' : 'light';
            
            if (key === 'theme') {
                if (value === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                }
                return;
            }

            // Global settings mapping
            let finalValue = value;
            if (key === 'global_shadow') {
                if (value === 'soft') finalValue = '0 4px 20px -2px rgba(0, 0, 0, 0.05)';
                else if (value === 'strong') finalValue = '0 20px 50px -5px rgba(0, 0, 0, 0.15)';
                else if (value === 'none') finalValue = 'none';
            }

            const targetTheme = key.startsWith('dark') ? 'dark' : 'light';
            const isGlobal = key.startsWith('global_');

            if (key === 'hero_overlay_opacity') {
                let opacity = parseFloat(value);
                if (isNaN(opacity)) opacity = 0.8;
                document.documentElement.style.setProperty('--hero-overlay-start', `rgba(0, 0, 0, ${opacity})`);
                document.documentElement.style.setProperty('--hero-overlay-end', `rgba(0, 0, 0, ${opacity * 0.4})`);
                return;
            }

            if (isGlobal || targetTheme === currentTheme) {
                const vars = themeMappings[currentTheme][key];
                if (vars) {
                    vars.forEach(v => document.documentElement.style.setProperty(v, finalValue));
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
                const isMedia = el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.hasAttribute('data-dock-current');
                
                if (isMedia) {
                    const src = (value && !value.startsWith('http') && !value.startsWith('/') && !value.startsWith('data:'))
                        ? `${baseUrl}images/${value}`.replace(/\/+/g, '/')
                        : (value || "");
                    
                    // Update <img> or <video> (either the element itself or a child)
                    const mediaEl = (el.tagName === 'IMG' || el.tagName === 'VIDEO') ? el : el.querySelector('img, video');
                    if (mediaEl) {
                        mediaEl.src = src;
                    }
                    
                    // Also update the current value attribute if present
                    if (el.hasAttribute('data-dock-current')) {
                        el.setAttribute('data-dock-current', value || "");
                    }
                } else {
                    el.innerText = value || "";
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
