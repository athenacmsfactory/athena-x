import React from 'react';
import EditableText from './EditableText';

import { Link } from 'react-router-dom';

function Header({ primaryTable, siteSettings = {} }) {
  
  const info = Array.isArray(primaryTable) ? (primaryTable[0] || {}) : (primaryTable || {});
  const siteName = siteSettings.title || siteSettings.naam || info.site_naam || info.naam || 'Tand News';
  
  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[1000] border-b border-slate-100 px-6 py-4 transition-colors duration-500"
      style={{ backgroundColor: 'var(--color-header-bg, rgba(255,255,255,0.8))', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Naam */}
        <Link to="/" className="flex items-center gap-3 group">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: 'var(--color-accent, #3b82f6)', boxShadow: '0 8px 20px -4px var(--color-accent)' }}
          >
            {siteName.charAt(0)}
          </div>
          <span className="text-xl font-serif font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
            <EditableText value={siteName} cmsBind={{file: 'site_settings', index: 0, key: 'title'}} />
          </span>
        </Link>

        {/* Navigatie & Cart */}
        <div className="flex items-center gap-8">
          {}
        </div>
      </div>
    </nav>
  );
}

export default Header;
