import React, { useState, useCallback, useEffect } from 'react';

/**
 * DesignControls for Athena Dock
 * Sidebar component for live color editing via PostMessage
 */
export default function DesignControls({ onColorChange, siteStructure }) {
  const [localColors, setLocalColors] = useState({
    light_primary_color: '#0f172a',
    light_title_color: '#0f172a',
    light_heading_color: '#0f172a',
    light_accent_color: '#3b82f6',
    light_button_color: '#3b82f6',
    light_card_color: '#ffffff',
    light_header_color: '#ffffff',
    light_bg_color: '#ffffff',
    light_text_color: '#0f172a',
    dark_primary_color: '#ffffff',
    dark_title_color: '#ffffff',
    dark_heading_color: '#ffffff',
    dark_accent_color: '#60a5fa',
    dark_button_color: '#60a5fa',
    dark_card_color: '#1e293b',
    dark_header_color: '#0f172a',
    dark_bg_color: '#0f172a',
    dark_text_color: '#f8fafc',
    theme: 'light',
    global_radius: '1rem',
    global_shadow: 'soft',
    hero_overlay_opacity: 0.8,
    content_top_offset: 0,
    hero_height: '85vh',
    hero_max_height: '150vh',
    hero_aspect_ratio: '16/9',
    header_visible: true,
    header_transparent: false,
    header_height: 80,
    header_show_logo: true,
    header_show_title: true,
    header_show_tagline: true,
    header_show_button: true
  });

  // Sync met de werkelijke data van de site bij het laden of switchen
  useEffect(() => {
    if (siteStructure?.data?.site_settings) {
      const settings = Array.isArray(siteStructure.data.site_settings)
        ? (siteStructure.data.site_settings[0] || {})
        : siteStructure.data.site_settings;

      console.log("🎨 Loading site settings into Design Editor:", settings);

      setLocalColors(prev => ({
        ...prev,
        ...settings
      }));
    }
  }, [siteStructure]);

  // Preview mode (live in iframe)
  const handlePreview = (key, value, forceSync = false) => {
    setLocalColors(prev => {
      const newState = { ...prev, [key]: value };

      if (key === 'theme' || forceSync) {
        const modePrefix = newState.theme === 'dark' ? 'dark_' : 'light_';
        onColorChange('theme', newState.theme, false);
        Object.keys(newState).forEach(k => {
          // Send theme colors, global vars, and the new layout/header controls
          if (k.startsWith(modePrefix) || k.startsWith('global_') || k.startsWith('header_') || k === 'content_top_offset' || k === 'hero_overlay_opacity') {
            onColorChange(k, newState[k], false);
          }
        });
      } else {
        onColorChange(key, value, false);
      }

      return newState;
    });
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
    onColorChange(key, value, true);
  };

  const handleStyleChange = async (styleName) => {
    if (!window.confirm(`Weet je zeker dat je wilt wisselen naar ${styleName}? Dit herlaadt de site.`)) return;
    // FIX: Dynamically derive port/origin from the connected site's URL
    let baseUrl = 'http://localhost:3000';
    if (siteStructure?.url) {
      try {
        const u = new URL(siteStructure.url);
        baseUrl = u.origin;
      } catch (e) {
        console.error("Invalid site URL", siteStructure.url);
      }
    }

    const siteName = siteStructure?.url?.split('/')[3] || 'dock-test-site';
    // Remove potential double slashes if siteName is empty or malformed, but keep standard structure
    const url = `${baseUrl}/${siteName}/__athena/update-json`;
    try {
      await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'swap-style', value: styleName }) });
      const iframe = document.querySelector('iframe');
      if (iframe) iframe.contentWindow.postMessage({ type: 'DOCK_SWAP_STYLE', value: styleName }, '*');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Design Editor</h3>
        <p className="text-xs text-slate-500 mt-1">Live design updates via Dock</p>
      </div>

      <div className="space-y-8">
        {/* GLOBAL STYLE */}
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-3">Global Theme Stijl</label>
          <div className="grid grid-cols-1 gap-2">
            {['modern.css', 'classic.css', 'modern-dark.css', 'bold.css', 'corporate.css', 'warm.css'].map(style => (
              <button
                key={style}
                onClick={() => handleStyleChange(style)}
                className="flex items-center justify-between px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition-colors border border-slate-200"
              >
                {style.replace('.css', '').toUpperCase()}
                <i className="fa-solid fa-palette text-slate-300"></i>
              </button>
            ))}
          </div>
        </div>

        {/* GLOBAL THEME SETTINGS */}
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <i className="fa-solid fa-sliders text-accent"></i> Global Theme Settings
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

            {/* HERO OVERLAY SLIDER */}
            <div className="pt-2 border-t border-slate-50 mt-2">
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

            {/* HEADER SETTINGS */}
            <div className="pt-4 border-t border-slate-50 mt-2 space-y-4">
              <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-2 flex items-center gap-2">
                <i className="fa-solid fa-window-maximize text-blue-500"></i> Header Controls
              </h5>

              <div className="flex items-center justify-between">
                <label className="text-[9px] font-bold uppercase text-slate-400">Visible</label>
                <input
                  type="checkbox"
                  checked={localColors.header_visible !== false}
                  onChange={(e) => { handlePreview('header_visible', e.target.checked); handleSave('header_visible', e.target.checked); }}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[9px] font-bold uppercase text-slate-400">Transparent Background</label>
                <input
                  type="checkbox"
                  checked={localColors.header_transparent === true}
                  onChange={(e) => { handlePreview('header_transparent', e.target.checked); handleSave('header_transparent', e.target.checked); }}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400 block">Header Height</label>
                  <span className="text-[9px] font-bold text-blue-500">{localColors.header_height || 80}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="150"
                  step="1"
                  value={localColors.header_height || 80}
                  onInput={(e) => handlePreview('header_height', e.target.value)}
                  onChange={(e) => handleSave('header_height', e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400 block">Content Top Offset (Overlap Fix)</label>
                  <span className="text-[9px] font-bold text-blue-500">{localColors.content_top_offset || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={localColors.content_top_offset || 0}
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

            {/* HERO DIMENSIONS */}
            <div className="pt-4 border-t border-slate-50 mt-2 space-y-3">
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
        </div>

        {/* THEME TOGGLE */}
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
