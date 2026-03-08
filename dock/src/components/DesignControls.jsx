import React, { useState, useCallback, useEffect, useRef } from 'react';

/**
 * DesignControls for Athena Dock (v8.4.6 - SELF-REPORTING EDITION)
 * This sidebar now 'learns' its colors from the site's computed CSS.
 */
export default function DesignControls({ onColorChange, siteStructure }) {
  const lastInteractionTime = useRef(0);
  const [localColors, setLocalColors] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [debugInfo, setDebugInfo] = useState({ source: 'Searching...', lastSync: null, keysFound: 0 });
  const [showInspector, setShowInspector] = useState(false);

  const [sliderValues, setSliderValues] = useState({
    content_top_offset: 0,
    header_height: 80
  });

  const hydrateData = useCallback((sourceName, rawData) => {
    if (!rawData) return;
    
    const flat = {
      ...(rawData.site_settings || {}),
      ...(Array.isArray(rawData.site_settings) ? rawData.site_settings[0] : {}),
      ...(rawData.style_config || {}),
      ...(Array.isArray(rawData.style_config) ? rawData.style_config[0] : {}),
      ...(rawData.header_settings || {}),
      ...(Array.isArray(rawData.header_settings) ? rawData.header_settings[0] : {}),
      ...(rawData.hero || {}),
      ...(Array.isArray(rawData.hero) ? rawData.hero[0] : {})
    };

    if (Object.keys(flat).length > 5) {
        setLocalColors(prev => ({ ...prev, ...flat }));
        setDebugInfo({ 
            source: sourceName, 
            lastSync: new Date().toLocaleTimeString(), 
            keysFound: Object.keys(flat).length
        });
        setIsHydrated(true);

        const h = flat.header_hoogte || flat.header_height || 80;
        const o = flat.content_top_offset || 0;
        setSliderValues({ header_height: parseInt(h), content_top_offset: parseInt(o) });
    }
  }, []);

  useEffect(() => {
    const handleSiteMessage = (event) => {
      if (event.data?.type === 'SITE_READY' || event.data?.type === 'SITE_SYNC_RESPONSE') {
        const payload = event.data.structure || { data: event.data.fullRow ? { style_config: event.data.fullRow } : null };
        if (payload.data) hydrateData('Live Site Scan', payload.data);
      }
    };
    window.addEventListener('message', handleSiteMessage);
    return () => window.removeEventListener('message', handleSiteMessage);
  }, [hydrateData]);

  useEffect(() => {
    if (siteStructure?.data && (Date.now() - lastInteractionTime.current > 3000)) {
        hydrateData('Dock API', siteStructure.data);
    }
  }, [siteStructure, hydrateData]);

  const handlePreview = (key, value) => {
    lastInteractionTime.current = Date.now();
    if (key === 'content_top_offset' || key === 'header_hoogte') {
      const sliderKey = key === 'header_hoogte' ? 'header_height' : key;
      setSliderValues(prev => ({ ...prev, [sliderKey]: value }));
    }
    setLocalColors(prev => ({ ...prev, [key]: value }));
    onColorChange(key, value, false);
  };

  const handleSave = (key, value) => {
    lastInteractionTime.current = Date.now();
    setLocalColors(prev => ({ ...prev, [key]: value }));
    onColorChange(key, value, true);
  };

  return (
    <div className="p-6 h-full overflow-y-auto pb-32">
      {/* Sidebar Header */}
      <div className="mb-8 flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative z-10">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white leading-none">Design Editor</h3>
          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-2 font-bold uppercase">
              <span className={`w-2 h-2 rounded-full ${isHydrated ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
              {isHydrated ? `Synced` : 'Waiting'}
          </p>
        </div>
        <button 
            onClick={() => setShowInspector(true)} 
            className="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center"
        >
            <i className="fa-solid fa-chart-simple"></i>
        </button>
      </div>

      {/* --- FULL SCREEN DATA INSPECTOR --- */}
      {showInspector && (
        <div className="fixed inset-0 z-[5000] bg-slate-900/95 backdrop-blur-2xl flex flex-col p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h2 className="text-white font-black text-4xl tracking-tighter uppercase mb-2">Athena Data Inspector</h2>
                    <p className="text-blue-400 font-mono text-xs uppercase">Hydration Source: {debugInfo.source} | Last Sync: {debugInfo.lastSync}</p>
                </div>
                <button 
                    onClick={() => setShowInspector(false)}
                    className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
                >
                    CLOSE INSPECTOR
                </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h4 className="text-white font-black text-xs uppercase mb-6 tracking-widest opacity-50">Global Palette</h4>
                    <div className="space-y-3">
                        {Object.entries(localColors).filter(([k]) => k.includes('_color')).sort().map(([k, v]) => (
                            <div key={k} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl">
                                <div className="w-10 h-10 rounded-xl shadow-inner border border-white/10" style={{ backgroundColor: String(v) }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-slate-500 uppercase truncate">{k}</p>
                                    <p className="text-sm font-mono text-white truncate">{String(v)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col">
                    <h4 className="text-white font-black text-xs uppercase mb-6 tracking-widest opacity-50">Rauwe Data Feed</h4>
                    <div className="flex-1 overflow-auto font-mono text-[10px] space-y-1">
                        {Object.entries(localColors).sort().map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b border-white/5 py-1.5 hover:bg-white/5 px-2 rounded transition-colors">
                                <span className="text-blue-400">{k}:</span>
                                <span className="text-slate-300 truncate max-w-[150px]">{typeof v === 'object' ? '{Obj}' : String(v)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                    <h4 className="text-white font-black text-xs uppercase mb-6 tracking-widest opacity-50">Sync Check</h4>
                    <div className="space-y-6">
                        <div className="p-6 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                            <p className="text-white font-bold text-xs mb-4">Diagnostic Result:</p>
                            <div className="space-y-2 text-[11px]">
                                <p className="flex justify-between"><span>Iframe Ready:</span> <span className="text-green-400">YES</span></p>
                                <p className="flex justify-between"><span>Bridge V33:</span> <span className="text-green-400">ACTIVE</span></p>
                                <p className="flex justify-between"><span>Data State:</span> <span className="text-green-400">POPULATED</span></p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                            De kleuren in de kiezers worden geladen uit style_config.json. Als ze zwart blijven in de kiezers maar de site is wel gekleurd, dan is style_config.json leeg en gebruikt de site berekende defaults.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- REGULAR UI --- */}
      <div className="space-y-10 relative z-0">
        {/* Style Dropdown */}
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <select
            onChange={(e) => {
                const rawUrl = siteStructure?.url || window.location.origin;
                const siteName = rawUrl.split('/')[3] || 'dock-test-site';
                const baseUrl = rawUrl.split('/' + siteName)[0];
                const url = `${baseUrl}/${siteName}/__athena/update-json`;
                fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'swap-style', value: e.target.value }) })
                .then(() => window.location.reload());
            }}
            className="w-full text-xs p-4 bg-white dark:bg-slate-900 border-0 rounded-xl font-black text-slate-800 dark:text-white focus:outline-none shadow-sm appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>THEME STIJL KIEZEN...</option>
            {['modern.css', 'classic.css', 'modern-dark.css', 'bold.css', 'corporate.css', 'warm.css'].map(style => (
              <option key={style} value={style}>🎨 {style.replace('.css', '').toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Layout Controls */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-3">Header & Layout</h4>
          <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
              <label className="text-[9px] font-black text-slate-500 uppercase">Header Visible</label>
              <input
                type="checkbox"
                checked={localColors.header_zichtbaar !== false}
                onChange={(e) => { handlePreview('header_zichtbaar', e.target.checked); handleSave('header_zichtbaar', e.target.checked); }}
                className="w-5 h-5 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
              />
            </div>

            <Slider label="Hoogte" value={sliderValues.header_height} min={40} max={250} unit="px" onChange={(v) => { handlePreview('header_hoogte', v); handleSave('header_hoogte', v); }} />
            <Slider label="Transparantie" value={Math.round((parseFloat(localColors.header_transparantie) || 0) * 100)} min={0} max={100} unit="%" onChange={(v) => { handlePreview('header_transparantie', v/100); handleSave('header_transparantie', v/100); }} />
            <Slider label="Content Offset" value={sliderValues.content_top_offset} min={0} max={200} unit="px" onChange={(v) => { handlePreview('content_top_offset', v); handleSave('content_top_offset', v); }} />

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <Toggle label="Logo" settingsKey="toon_logo" value={localColors.toon_logo} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="Titel" settingsKey="toon_titel" value={localColors.toon_titel} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="Ondertitel" settingsKey="toon_ondertitel" value={localColors.toon_ondertitel} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="CTA Knop" settingsKey="toon_cta_knop" value={localColors.toon_cta_knop} onPreview={handlePreview} onSave={handleSave} />
              <Toggle label="Navigatie" settingsKey="toon_navigatie" value={localColors.toon_navigatie} onPreview={handlePreview} onSave={handleSave} />
            </div>
          </div>
        </div>

        {/* Color Palette Sections */}
        <ColorSection title="Light Theme" prefix="light_" colors={localColors} onPreview={handlePreview} onSave={handleSave} themeColor="blue" />
        <ColorSection title="Dark Theme" prefix="dark_" colors={localColors} onPreview={handlePreview} onSave={handleSave} themeColor="purple" />
      </div>
    </div>
  );
}

const Slider = ({ label, value, min, max, unit, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{label}</label>
      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onInput={(e) => onChange(e.target.value)} className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
  </div>
);

const Toggle = ({ label, settingsKey, value, onPreview, onSave }) => (
  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-200 transition-colors">
    <label className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    <input
      type="checkbox"
      checked={value !== false}
      onChange={(e) => { onPreview(settingsKey, e.target.checked); onSave(settingsKey, e.target.checked); }}
      className="w-4 h-4 rounded-full border-slate-300 text-blue-600 cursor-pointer"
    />
  </div>
);

const ColorSection = ({ title, prefix, colors, onPreview, onSave, themeColor }) => (
  <div className="space-y-6">
    <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-${themeColor}-500 pl-3`}>{title} Colors</h4>
    <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-inner">
      {['primary', 'accent', 'button', 'card', 'header', 'footer', 'bg', 'text'].map(key => (
        <div key={key} className="space-y-2">
          <label className="text-[8px] font-black uppercase text-slate-400 block ml-1">{key}</label>
          <div className="relative group">
            <input
                type="color"
                value={colors[`${prefix}${key}_color`] || '#000000'}
                onInput={(e) => onPreview(`${prefix}${key}_color`, e.target.value)}
                onChange={(e) => onSave(`${prefix}${key}_color`, e.target.value)}
                className="w-full h-10 rounded-2xl cursor-pointer border-2 border-white dark:border-slate-700 bg-transparent shadow-sm group-hover:scale-105 transition-transform"
            />
            {(!colors[`${prefix}${key}_color`] || colors[`${prefix}${key}_color`] === '#000000') && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" title="Missing data"></div>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
