import React, { useState, useEffect, useCallback } from 'react';

/**
 * DesignControls
 * Zwevend paneel om de 'vibe' van de site aan te passen.
 * NU: Zonder flitsen, met live preview!
 */
export default function DesignControls({ settings: initialSettings }) {
  if (!import.meta.env.DEV) return null;

  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('athena_design_open') === 'true');
  const [localSettings, setLocalSettings] = useState(initialSettings);

  // Onthoud of de editor open was
  useEffect(() => {
    localStorage.setItem('athena_design_open', isOpen);
  }, [isOpen]);

  useEffect(() => {
    setLocalSettings(initialSettings);
  }, [initialSettings]);

  // Live preview functie: past CSS variabelen direct toe voor onmiddellijke feedback
  const applyLivePreview = useCallback((settings) => {
    const root = document.documentElement;
    
    // Light mode
    root.style.setProperty('--primary-color-light', settings.light_primary_color || '#0f172a');
    root.style.setProperty('--accent-color-light', settings.light_accent_color || '#3b82f6');
    root.style.setProperty('--bg-site-light', settings.light_bg_color || '#ffffff');
    root.style.setProperty('--text-color-light', settings.light_text_color || '#0f172a');

    // Dark mode
    root.style.setProperty('--primary-color-dark', settings.dark_primary_color || '#ffffff');
    root.style.setProperty('--accent-color-dark', settings.dark_accent_color || '#60a5fa');
    root.style.setProperty('--bg-site-dark', settings.dark_bg_color || '#0f172a');
    root.style.setProperty('--text-color-dark', settings.dark_text_color || '#f8fafc');

    if (settings.theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Forceer browser voorkeur gelijk aan editor
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  // Update alleen de lokale staat en preview (voor onInput)
  const handleLiveUpdate = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    applyLivePreview(newSettings);
  };

  // Sla de data daadwerkelijk op (voor onChange)
  const saveStyle = async (key, value) => {
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      const apiUrl = `${baseUrl}__athena/update-json`.replace(/\/+/g, '/');
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: 'site_settings', index: 0, key, value })
      });
    } catch (err) { console.error("❌ Opslaan mislukt:", err); }
  };

  // Helper die beide doet (handig voor knoppen)
  const updateStyle = async (key, value) => {
    handleLiveUpdate(key, value);
    await saveStyle(key, value);
  };

  const ColorPicker = ({ label, settingsKey, defaultValue }) => (
    <div className="flex-1">
        <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">{label}</label>
        <input 
            type="color" 
            value={localSettings[settingsKey] || defaultValue} 
            onInput={(e) => handleLiveUpdate(settingsKey, e.target.value)}
            onChange={(e) => saveStyle(settingsKey, e.target.value)}
            className="w-full h-8 rounded-lg cursor-pointer border border-slate-100 dark:border-slate-700 bg-transparent overflow-hidden"
        />
    </div>
  );

  return (
    <div className="fixed bottom-6 left-6 z-[1000] flex flex-col items-start gap-4">
      {isOpen && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-80 animate-in slide-in-from-bottom-4 duration-300 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Design Editor</h3>
            <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">MODE-AWARE</span>
          </div>
          
          <div className="space-y-8">
            {/* THEMA TOGGLE */}
            <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-3">Live Preview Mode</label>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-full">
                    <button 
                        onClick={() => updateStyle('theme', 'light')}
                        className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all ${localSettings.theme !== 'dark' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                    >Light</button>
                    <button 
                        onClick={() => updateStyle('theme', 'dark')}
                        className={`flex-1 py-1.5 rounded-full text-[10px] font-bold transition-all ${localSettings.theme === 'dark' ? 'bg-white/10 shadow-sm text-white' : 'text-slate-400'}`}
                    >Dark</button>
                </div>
            </div>

            {/* LIGHT MODE COLORS */}
            <div>
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-tighter mb-4 border-b border-blue-50 pb-2">Light Mode Kleuren</h4>
                <div className="grid grid-cols-2 gap-4">
                    <ColorPicker label="Primary" settingsKey="light_primary_color" defaultValue="#0f172a" />
                    <ColorPicker label="Accent" settingsKey="light_accent_color" defaultValue="#3b82f6" />
                    <ColorPicker label="Background" settingsKey="light_bg_color" defaultValue="#ffffff" />
                    <ColorPicker label="Text" settingsKey="light_text_color" defaultValue="#0f172a" />
                </div>
            </div>

            {/* DARK MODE COLORS */}
            <div>
                <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-tighter mb-4 border-b border-purple-50 pb-2">Dark Mode Kleuren</h4>
                <div className="grid grid-cols-2 gap-4">
                    <ColorPicker label="Primary" settingsKey="dark_primary_color" defaultValue="#ffffff" />
                    <ColorPicker label="Accent" settingsKey="dark_accent_color" defaultValue="#60a5fa" />
                    <ColorPicker label="Background" settingsKey="dark_bg_color" defaultValue="#0f172a" />
                    <ColorPicker label="Text" settingsKey="dark_text_color" defaultValue="#f8fafc" />
                </div>
            </div>
          </div>
          
          <p className="mt-8 text-[9px] text-slate-400 italic leading-tight border-t border-slate-50 dark:border-white/5 pt-4">
            Kleuren worden direct gesynchroniseerd met site_settings.json
          </p>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-blue-600 text-white hover:scale-110 active:scale-95'}`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-palette'} text-xl`}></i>
      </button>
    </div>
  );
}
