import React, { useState } from 'react';

const SectionToolbar = ({ sectionTitle, tableName, onConfigChange }) => {
  const isDev = import.meta.env.DEV;
  const isDocked = window.parent !== window;

  if (!isDev && !isDocked) return null;

  const [isVisible, setIsVisible] = useState(false);

  const getApiUrl = (path) => {
    const base = import.meta.env.BASE_URL || '/';
    return (base + '/' + path).replace(new RegExp('/+', 'g'), '/');
  };

  const handleAction = async (action) => {
    try {
      const res = await fetch(getApiUrl('__athena/update-json'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          file: 'section_order', 
          value: tableName,
          action: action 
        })
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      }
    } catch (err) {
      console.error(`Section action ${action} failed:`, err);
    }
  };

  return (
    <div 
      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[100] m-4"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="flex gap-2 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-2 border border-blue-100 dark:bg-slate-800 dark:border-white/10">
        <button
          className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all text-blue-600"
          title="Omhoog verplaatsen"
          onClick={() => handleAction('move-up')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
        </button>
        
        <button
          className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all text-blue-600"
          title="Omlaag verplaatsen"
          onClick={() => handleAction('move-down')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        <button
          className="p-3 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all text-red-500"
          title="Sectie verbergen"
          onClick={() => handleAction('hide')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SectionToolbar;
