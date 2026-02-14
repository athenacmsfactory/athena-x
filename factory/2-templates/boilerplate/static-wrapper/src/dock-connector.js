/**
 * ⚓ Athena Dock Connector v7 (Universal)
 * Handles communication between the generated site (iframe) and the Athena Dock (parent).
 */
(function() {
    console.log("⚓ Athena Dock Connector v7 Active");

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
        'button_color': ['--color-button-bg', '--btn-bg', '--color-button'],
        'card_color': ['--color-card-bg', '--card-bg', '--surface', '--color-surface', '--color-card'],
        'header_color': ['--color-header-bg', '--nav-bg', '--color-header'],
        'bg_color': ['--color-background', '--bg-site'],
        'text_color': ['--color-text']
    };

    const globalMappings = {
        'global_radius': '--radius-custom',
        'hero_overlay_opacity': '--hero-overlay-opacity',
        'header_height': '--header-height',
        'content_top_offset': '--content-top-offset'
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

            // Global variables
            if (globalMappings[key]) {
                const finalVal = (key === 'header_height' || key === 'content_top_offset') 
                    ? `${value}px` 
                    : value;
                root.style.setProperty(globalMappings[key], finalVal);
                return;
            }

            // Theme-prefixed colors (light_... or dark_...)
            const targetTheme = key.startsWith('dark') ? 'dark' : 'light';
            const cleanKey = key.replace('light_', '').replace('dark_', '');
            
            if (targetTheme === currentTheme) {
                const vars = themeMappings[cleanKey];
                if (vars) {
                    vars.forEach(v => root.style.setProperty(v, value));
                }
            }
        }

        // Section Movement
        if (type === 'DOCK_MOVE_SECTION') {
            console.log(`↔️ Moving section: ${section} (${direction})`);
        }

        // Text Update (Live Preview)
        if (type === 'DOCK_UPDATE_TEXT') {
            const bindStr = JSON.stringify({ file, index, key });
            const elements = document.querySelectorAll(`[data-dock-bind='${bindStr}']`);
            elements.forEach(el => {
                el.innerText = value;
            });
        }

        // Navigation (MPA Support)
        if (type === 'ATHENA_NAVIGATE') {
            const { path } = event.data.payload;
            console.log("✈️ Navigating to:", path);
            
            // Construct full URL respecting Base Path
            const base = import.meta.env.BASE_URL || '/';
            // Clean join of base and path
            const targetPath = (base + '/' + path).replace(new RegExp('/+', 'g'), '/');
            
            window.location.href = targetPath;
        }
    });

    // --- 5. INITIALIZATION ---
    if (document.readyState === 'complete') {
        setTimeout(notifyDock, 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(notifyDock, 1000);
        });
    }

    window.athenaScan = notifyDock;

    // --- 6. DRAG & DROP FUNCTIONALITY ---
    
    // Inject CSS for Drop Zones
    const style = document.createElement('style');
    style.innerHTML = `
        [data-dock-bind] { cursor: context-menu; }
        
        /* Global Drag State: Disable generic pointers to allow drop-through */
        body.dock-dragging-active * {
            pointer-events: none !important;
        }
        
        /* Highlight Targets & Re-enable pointers */
        /* Increased specificity to override body.dock-dragging-active * */
        body.dock-dragging-active .dock-image-drop-target {
            outline: 4px dashed #3b82f6 !important;
            outline-offset: -4px;
            position: relative; 
            z-index: 9999 !important;
            pointer-events: auto !important; /* Make sure we can drop on it */
            transition: all 0.2s;
        }
        
        .dock-image-drop-target::after {
            content: 'Drop Image';
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #3b82f6; color: white; padding: 4px 12px; border-radius: 999px;
            font-size: 12px; font-weight: bold; pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .dock-image-drop-target:hover {
            background-color: rgba(59, 130, 246, 0.1);
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(style);

    const isImageBind = (bind) => {
        if (!bind || !bind.key) return false;
        const k = bind.key.toLowerCase();
        return k.includes('foto') || k.includes('image') || k.includes('img') || k.includes('afbeelding') || k.includes('hero_image');
    };

    let dragEnterCount = 0;

    const toggleDropZones = (active) => {
        if (active) document.body.classList.add('dock-dragging-active');
        else document.body.classList.remove('dock-dragging-active');

        const elements = document.querySelectorAll('[data-dock-bind]');
        elements.forEach(el => {
            try {
                const bind = JSON.parse(el.getAttribute('data-dock-bind'));
                if (isImageBind(bind)) {
                    if (active) el.classList.add('dock-image-drop-target');
                    else el.classList.remove('dock-image-drop-target');
                }
            } catch(e) {}
        });
    };

    // Global Drag Tracking
    window.addEventListener('dragenter', (e) => {
        // Simplified check
        dragEnterCount++;
        if (dragEnterCount === 1) {
            toggleDropZones(true);
        }
    });

    window.addEventListener('dragleave', (e) => {
        dragEnterCount--;
        if (dragEnterCount <= 0) {
            dragEnterCount = 0;
            toggleDropZones(false);
        }
    });

    window.addEventListener('dragover', (e) => {
        // Necessary to allow dropping
        if (document.body.classList.contains('dock-dragging-active')) {
            e.preventDefault();
        }
    });

    window.addEventListener('drop', async (e) => {
        const target = e.target.closest('[data-dock-bind]');
        
        // Reset state
        dragEnterCount = 0;
        toggleDropZones(false);

        if (!target) return; // Drop outside target

        const bind = JSON.parse(target.getAttribute('data-dock-bind'));
        if (!isImageBind(bind)) return;

        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files[0];
        if (!file || !file.type.startsWith('image/')) {
            alert("Only image files are allowed.");
            return;
        }

        console.log("⚓ Dock Drop: Uploading", file.name);

        const originalOpacity = target.style.opacity;
        target.style.opacity = '0.5';
        
        try {
            // 1. Upload File
            const uploadRes = await fetch(getApiUrl('__athena/upload'), {
                method: 'POST',
                headers: { 'x-filename': file.name },
                body: file
            });
            const uploadData = await uploadRes.json();
            
            if (uploadData.success) {
                console.log("✅ Upload success:", uploadData.filename);
                
                // 2. Update JSON
                await fetch(getApiUrl('__athena/update-json'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        file: bind.file,
                        index: bind.index,
                        key: bind.key,
                        value: uploadData.filename
                    })
                });

                // 3. Update DOM (Optimistic UI)
                if (target.tagName === 'IMG') {
                    target.src = getApiUrl(`images/${uploadData.filename}?t=${Date.now()}`);
                } else {
                    target.style.backgroundImage = `url(${getApiUrl(`images/${uploadData.filename}`)})`;
                }
                
                // 4. Trigger Dock Refresh
                window.parent.postMessage({ type: 'DOCK_TRIGGER_REFRESH' }, '*');
            }
        } catch (err) {
            console.error("❌ Drop upload failed:", err);
            alert("Upload failed.");
        } finally {
            target.style.opacity = originalOpacity || '1';
        }

    }, true);

    // Click event for selection (Inline Editing)
    document.addEventListener('click', (e) => {
        // Prevent clicking when dragging (though pointer-events handles most of it)
        if (document.body.classList.contains('dock-dragging-active')) return;

        const target = e.target.closest('[data-dock-bind]');
        if (target && window.parent !== window) {
            e.preventDefault();
            e.stopPropagation();
            
            const bindData = JSON.parse(target.getAttribute('data-dock-bind'));
            console.log("🖱️ Element selected for Dock:", bindData);
            
            window.parent.postMessage({
                type: 'SITE_CLICK',
                binding: bindData,
                currentValue: target.innerText,
                tagName: target.tagName
            }, '*');
        }
    }, true);

})();