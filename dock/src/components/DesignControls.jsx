import React, { useState, useCallback, useEffect, useRef } from 'react';

/**
 * DesignControls for Athena Dock
 * Sidebar component for live color editing via PostMessage
 */
export default function DesignControls({ onColorChange, siteStructure }) {
  // Lock mechanism to prevent slider jump-back
  const lastInteractionTime = useRef(0);

  const [localColors, setLocalColors] = useState({
    // ... rest of state
    content_top_offset: 0,
    // ...
  });

  // NEW: Dedicated local state for high-frequency sliders to prevent jump-back
  const [sliderValues, setSliderValues] = useState({
    content_top_offset: 0,
    header_height: 80
  });

  // Sync met de werkelijke data van de site bij het laden of switchen
  useEffect(() => {
    // LOCK: Als we net handmatig iets hebben aangepast, negeren we de inkomende sync even
    // Dit voorkomt het "terugspringen" van sliders
    if (Date.now() - lastInteractionTime.current < 2000) {
      return;
    }

    if (siteStructure?.data?.site_settings) {
      const settings = Array.isArray(siteStructure.data.site_settings)
        ? (siteStructure.data.site_settings[0] || {})
        : siteStructure.data.site_settings;

      console.log("🎨 Loading site settings into Design Editor:", settings);

      setLocalColors(prev => ({
        ...prev,
        ...settings
      }));

      // Also sync our decoupled slider values if not currently dragging
      setSliderValues(prev => ({
        ...prev,
        content_top_offset: settings.content_top_offset || 0,
        header_height: settings.header_height || 80
      }));
    }
  }, [siteStructure]);

  // Preview mode (live in iframe)
  const handlePreview = (key, value, forceSync = false) => {
    lastInteractionTime.current = Date.now(); // LOCK ACTIVEREN

    // Update decoupled state immediately for smoothness
    if (key === 'content_top_offset' || key === 'header_height') {
      setSliderValues(prev => ({ ...prev, [key]: value }));
    }

    setLocalColors(prev => {
      const newState = { ...prev, [key]: value };
      // ... rest of existing logic

      if (key === 'theme' || forceSync) {
        const modePrefix = newState.theme === 'dark' ? 'dark_' : 'light_';
        onColorChange('theme', newState.theme, false);
        Object.keys(newState).forEach(k => {
          if (k.startsWith(modePrefix) || k.startsWith('global_') || k.startsWith('header_') || k === 'content_top_offset' || k === 'hero_overlay_opacity') {
            // NEW: If it's a color, also generate and send the RGB variant
            if (newState[k] && typeof newState[k] === 'string' && newState[k].startsWith('#')) {
              const rgb = hexToRgb(newState[k]);
              // Map local key to the actual CSS variable name
              const cssVar = k.replace('light_', '--color-').replace('dark_', '--color-').replace('_color', '');
              onColorChange(`${cssVar}-rgb`, rgb, false);
            }
            onColorChange(k, newState[k], false);
          }
        });
      } else {
        // Handle single color change
        if (value && typeof value === 'string' && value.startsWith('#')) {
          const rgb = hexToRgb(value);
          const cssVar = key.replace('light_', '--color-').replace('dark_', '--color-').replace('_color', '');
          onColorChange(`${cssVar}-rgb`, rgb, false);
        }
        onColorChange(key, value, false);
      }

      return newState;
    });
  };

  const hexToRgb = (hex) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return isNaN(r) ? "0 0 0" : `${r} ${g} ${b}`;
  };

  // Re-sync listener
  useEffect(() => {
    const handleResync = () => {
      handlePreview('theme', localColors.theme, true);
    };
    window.addEventListener('athena-resync-colors', handleResync);
    return () => window.removeEventListener('athena-resync-colors', handleResync);
  }, [localColors.theme]);

  // Save mode (persistent)
  const handleSave = (key, value) => {
    lastInteractionTime.current = Date.now(); // LOCK ACTIVEREN

    // Update local state immediately to keep UI in sync
    setLocalColors(prev => ({ ...prev, [key]: value }));

    onColorChange(key, value, true);
    // Also save RGB variant if color
    if (value && typeof value === 'string' && value.startsWith('#')) {
      const rgb = hexToRgb(value);
      const cssVar = key.replace('light_', '--color-').replace('dark_', '--color-').replace('_color', '');
      onColorChange(`${cssVar}-rgb`, rgb, true);
    }
  };

  const handleStyleChange = async (styleName) => {
    if (!window.confirm(`Weet je zeker dat je wilt wisselen naar ${styleName}? Dit herlaadt de site.`)) return;
    // FIX: Dynamically derive port/origin from the connected site's URL
    let baseUrl = 'http://localhost:5000';
    if (siteStructure?.url) {
      try {
        const u = new URL(siteStructure.url);
        baseUrl = u.origin;
      } catch (e) {
        console.error("Invalid site URL", siteStructure.url);
      }
    }

    const siteName = siteStructure?.url?.split('/')[3] || 'dock-test-site';
    const url = `${baseUrl}/${siteName}/__athena/update-json`;
    try {
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'swap-style', value: styleName }) });
      const iframe = document.querySelector('iframe');
      if (iframe) iframe.contentWindow.postMessage({ type: 'DOCK_SWAP_STYLE', value: styleName }, '*');
    } catch (err) { console.error(err); }
  };

  const handleSaveToDisk = async () => {
    const btn = document.getElementById('save-to-disk-btn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SAVING...';

    try {
      const rawUrl = siteStructure?.url || window.location.origin;
      const cleanBase = rawUrl.split('?')[0].replace(/\/$/, '');
      const apiUrl = `${cleanBase}/__athena/update-json`;

      console.log("🚀 Initializing Layout & Color Save to:", apiUrl);

      // We splitsen de data op naar de relevante bestanden
      const heroData = {};
      const headerData = {
          content_top_offset: sliderValues.content_top_offset,
          header_height: sliderValues.header_height
      };
      const siteData = {};

      Object.keys(localColors).forEach(key => {
        if (typeof localColors[key] === 'object') return;

        if (key.startsWith('header_') || key === 'content_top_offset' || key === 'header_height') {
            headerData[key] = localColors[key];
        } else if (key.startsWith('hero_') || key === 'title') {
            heroData[key] = localColors[key];
        } else if (key.includes('color') || key.includes('global_') || key.includes('footer_')) {
            siteData[key] = localColors[key];
        }
      });

      const saveFile = async (fileName, data) => {
          if (Object.keys(data).length === 0) return true;
          const res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file: fileName, index: 0, data })
          });
          return res.ok;
      };

      const results = await Promise.all([
          saveFile('hero', heroData),
          saveFile('header_settings', headerData),
          saveFile('site_settings', siteData)
      ]);

      if (results.every(r => r)) {
        btn.style.background = 'var(--success, #22c55e)';
        btn.innerHTML = '<i class="fa-solid fa-check"></i> SAVED TO DISK';
        setTimeout(() => {
          btn.disabled = false;
          btn.style.background = '';
          btn.innerHTML = originalText;
        }, 2000);
      } else {
        throw new Error("One or more saves failed");
      }
    } catch (e) {
      console.error("Save failed:", e);
      btn.style.background = 'var(--error, #ef4444)';
      btn.innerHTML = '<i class="fa-solid fa-xmark"></i> ERROR SAVING';
      setTimeout(() => {
        btn.disabled = false;
        btn.style.background = '';
        btn.innerHTML = originalText;
      }, 3000);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Design Editor</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Live design updates via Dock</p>

        <button
          id="save-to-disk-btn"
          onClick={handleSaveToDisk}
          title="Schrijft alle visuele wijzigingen (kleuren, layout-hoogtes en afstanden) definitief weg naar de server bestanden. Zonder dit gaan je wijzigingen verloren bij herladen."
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-floppy-disk"></i> SAVE CHANGES TO DISK
        </button>
      </div>

      <div className="space-y-8">
        {/* GLOBAL STYLE DROPDOWN */}
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-3">Global Theme Stijl</label>
          <select
            onChange={(e) => handleStyleChange(e.target.value)}
            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1rem'
            }}
            defaultValue=""
          >
            <option value="" disabled>Selecteer een stijl...</option>
            {['modern.css', 'classic.css', 'modern-dark.css', 'bold.css', 'corporate.css', 'warm.css'].map(style => (
              <option key={style} value={style}>
                🎨 {style.replace('.css', '').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* HEADER CONTROLS */}
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <i className="fa-solid fa-window-maximize text-blue-500"></i> Header Controls
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-bold uppercase text-slate-400">Visible</label>
              <input
                type="checkbox"
                checked={localColors.header_visible !== false}
                onChange={(e) => { handlePreview('header_visible', e.target.checked); handleSave('header_visible', e.target.checked); }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-bold uppercase text-slate-400 block">Header Transparency</label>
                <span className="text-[9px] font-bold text-blue-500">{((parseFloat(localColors.header_transparent) || 0) * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={localColors.header_transparent || 0}
                onInput={(e) => handlePreview('header_transparent', e.target.value)}
                onChange={(e) => handleSave('header_transparent', e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-bold uppercase text-slate-400 block">Header Height</label>
                <span className="text-[9px] font-bold text-blue-500">{sliderValues.header_height || 80}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                step="1"
                value={sliderValues.header_height || 80}
                onInput={(e) => handlePreview('header_height', e.target.value)}
                onChange={(e) => handleSave('header_height', e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-bold uppercase text-slate-400 block">Content Top Offset (Overlap Fix)</label>
                <span className="text-[9px] font-bold text-blue-500">{sliderValues.content_top_offset || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={sliderValues.content_top_offset || 0}
                onInput={(e) => handlePreview('content_top_offset', e.target.value)}
                onChange={(e) => handleSave('content_top_offset', e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Toggle label="Logo" settingsKey="header_show_logo" value={localColors.header_show_logo} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="Title" settingsKey="header_show_title" value={localColors.header_show_title} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="Tagline" settingsKey="header_show_tagline" value={localColors.header_show_tagline} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="Button" settingsKey="header_show_button" value={localColors.header_show_button} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="Navbar" settingsKey="header_show_navbar" value={localColors.header_show_navbar} onPreview={handlePreview} onSave={handleSave} />
            </div>
          </div>
        </div>

        {/* HERO CONTROLS */}
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <i className="fa-solid fa-rocket text-accent"></i> Hero Controls
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-bold uppercase text-slate-400 block">Hero Overlay Opacity</label>
                <span className="text-[9px] font-bold text-blue-500">{((parseFloat(localColors.hero_overlay_opacity) ?? 0.8) * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={localColors.hero_overlay_opacity ?? 0.8}
                onInput={(e) => handlePreview('hero_overlay_opacity', e.target.value)}
                onChange={(e) => handleSave('hero_overlay_opacity', e.target.value)}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Hero Min Hoogte (bv. 85vh)</label>
              <input
                type="text"
                value={localColors.hero_height || '85vh'}
                onChange={(e) => { handlePreview('hero_height', e.target.value); handleSave('hero_height', e.target.value); }}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Hero Max Hoogte (bv. 150vh)</label>
              <input
                type="text"
                value={localColors.hero_max_height || '150vh'}
                onChange={(e) => { handlePreview('hero_max_height', e.target.value); handleSave('hero_max_height', e.target.value); }}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Beeldverhouding (bv. 16/9 of 21/9)</label>
              <input
                type="text"
                value={localColors.hero_aspect_ratio || '16/9'}
                onChange={(e) => { handlePreview('hero_aspect_ratio', e.target.value); handleSave('hero_aspect_ratio', e.target.value); }}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PREVIEW THEME TOGGLE */}
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-3">Preview Mode</label>
          <div className="flex bg-slate-100 p-1 rounded-full">
            <button
              onClick={() => handlePreview('theme', 'light')}
              className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all ${localColors.theme !== 'dark' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              Light
            </button>
            <button
              onClick={() => handlePreview('theme', 'dark')}
              className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all ${localColors.theme === 'dark' ? 'bg-slate-800 shadow-sm text-white' : 'text-slate-400'}`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* LIGHT MODE COLORS */}
        <div>
          <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-4 border-b border-blue-50 pb-2">
            Light Mode Colors
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="Title (H1)" settingsKey="light_title_color" value={localColors['light_title_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Primary" settingsKey="light_primary_color" value={localColors['light_primary_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Section Header" settingsKey="light_heading_color" value={localColors['light_heading_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Accent" settingsKey="light_accent_color" value={localColors['light_accent_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Button BG" settingsKey="light_button_color" value={localColors['light_button_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Card BG" settingsKey="light_card_color" value={localColors['light_card_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Header BG" settingsKey="light_header_color" value={localColors['light_header_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Footer BG" settingsKey="light_footer_color" value={localColors['light_footer_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Hero BG" settingsKey="light_hero_bg_color" value={localColors['light_hero_bg_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Background" settingsKey="light_bg_color" value={localColors['light_bg_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Text" settingsKey="light_text_color" value={localColors['light_text_color']} onPreview={handlePreview} onSave={handleSave} />
          </div>
        </div>

        {/* DARK MODE COLORS */}
        <div>
          <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-tighter mb-4 border-b border-purple-50 pb-2">
            Dark Mode Colors
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker label="Title (H1)" settingsKey="dark_title_color" value={localColors['dark_title_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Primary" settingsKey="dark_primary_color" value={localColors['dark_primary_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Section Header" settingsKey="dark_heading_color" value={localColors['dark_heading_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Accent" settingsKey="dark_accent_color" value={localColors['dark_accent_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Button BG" settingsKey="dark_button_color" value={localColors['dark_button_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Card BG" settingsKey="dark_card_color" value={localColors['dark_card_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Header BG" settingsKey="dark_header_color" value={localColors['dark_header_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Footer BG" settingsKey="dark_footer_color" value={localColors['dark_footer_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Hero BG" settingsKey="dark_hero_bg_color" value={localColors['dark_hero_bg_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Background" settingsKey="dark_bg_color" value={localColors['dark_bg_color']} onPreview={handlePreview} onSave={handleSave} />
            <ColorPicker label="Text" settingsKey="dark_text_color" value={localColors['dark_text_color']} onPreview={handlePreview} onSave={handleSave} />
          </div>
        </div>

        {/* PER-SECTION BACKGROUNDS */}
        {siteStructure?.sections && (
          <div>
            <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-tighter mb-4 border-b border-orange-50 pb-2 flex items-center gap-2">
              <i className="fa-solid fa-layer-group"></i> Section Backgrounds
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {siteStructure.sections.filter(s => s !== 'site_settings').map(sectionName => {
                const sectionSettings = siteStructure.data?.section_settings?.[sectionName] || {};
                const currentVal = sectionSettings.backgroundColor || '';

                return (
                  <div key={sectionName} className="flex-1">
                    <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1 truncate" title={sectionName}>
                      {sectionName.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="color"
                      value={currentVal || '#ffffff'}
                      onInput={(e) => {
                        const val = e.target.value;
                        const iframe = document.querySelector('iframe');
                        if (iframe) {
                          iframe.contentWindow.postMessage({
                            type: 'DOCK_UPDATE_SECTION_STYLE',
                            section: sectionName,
                            key: 'backgroundColor',
                            value: val
                          }, '*');
                        }
                      }}
                      onChange={async (e) => {
                        const val = e.target.value;
                        const sitePort = import.meta.env.VITE_SITE_PORT || '3000';
                        const siteName = siteStructure?.url?.split('/')[3] || 'dock-test-site';
                        const url = `http://localhost:${sitePort}/${siteName}/__athena/update-json`;
                        try {
                          await fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              file: 'section_settings',
                              key: `${sectionName}.backgroundColor`,
                              value: val
                            })
                          });
                        } catch (err) { console.error(err); }
                      }}
                      className="w-full h-8 rounded-lg cursor-pointer border border-slate-200 bg-transparent overflow-hidden"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GLOBAL THEME SETTINGS (RADIUS/SHADOW) - NOW AT THE BOTTOM */}
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-blue-500"></i> Global Theme Settings
          </h4>
          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Corner Radius</label>
              <select
                value={localColors.global_radius}
                onChange={(e) => { handlePreview('global_radius', e.target.value); handleSave('global_radius', e.target.value); }}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
              >
                <option value="0px">Sharp (0px)</option>
                <option value="0.5rem">Rounded (8px)</option>
                <option value="1rem">Modern (16px)</option>
                <option value="2rem">Pill (32px)</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Shadow Intensity</label>
              <select
                value={localColors.global_shadow}
                onChange={(e) => { handlePreview('global_shadow', e.target.value); handleSave('global_shadow', e.target.value); }}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 focus:outline-none"
              >
                <option value="none">Flat</option>
                <option value="soft">Soft</option>
                <option value="strong">Deep</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-[9px] text-slate-400 italic leading-tight border-t border-slate-100 pt-4">
        Changes are sent to the docked site via PostMessage
      </p>
    </div>
  );
}

const ColorPicker = ({ label, settingsKey, value, onPreview, onSave }) => (
  <div className="flex-1">
    <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">{label}</label>
    <input
      type="color"
      value={value || '#000000'}
      onInput={(e) => onPreview(settingsKey, e.target.value)}
      onChange={(e) => onSave(settingsKey, e.target.value)}
      className="w-full h-8 rounded-lg cursor-pointer border border-slate-200 bg-transparent overflow-hidden"
    />
  </div>
);

const Toggle = ({ label, settingsKey, value, onPreview, onSave }) => (
  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
    <label className="text-[8px] font-bold uppercase text-slate-500">{label}</label>
    <input
      type="checkbox"
      checked={value !== false}
      onChange={(e) => { onPreview(settingsKey, e.target.checked); onSave(settingsKey, e.target.checked); }}
      className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
    />
  </div>
);
