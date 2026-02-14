import React from 'react';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';
import EditableLink from './EditableLink';
import { Link } from 'react-router-dom';

function Header({ siteSettings = {} }) {
  const settings = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : (siteSettings || {});
  const siteName = settings.site_name || 'urban-soles';
  const logoChar = (settings.logo_text || siteName).charAt(0).toUpperCase();
  
  // Use a reliable default logo if site_logo_image is missing
  const displayLogo = settings.site_logo_image || "athena-icon.svg";

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/10 px-6 py-5 transition-all duration-500"
      style={{ backgroundColor: 'var(--color-header-bg, rgba(255,255,255,0.9))', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo & Identity */}
        <Link to="/" className="flex items-center gap-4 group">
          
          <div className="relative w-12 h-12 overflow-hidden transition-transform duration-500">
             <EditableMedia 
               src={displayLogo} 
               cmsBind={{file: 'site_settings', index: 0, key: 'site_logo_image'}} 
               className="w-full h-full object-contain" 
               fallback={logoChar}
             />
          </div>
          
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-black tracking-tight text-primary leading-none mb-1">
              <EditableText value={siteName} cmsBind={{file: 'site_settings', index: 0, key: 'site_name'}} />
            </span>
            {settings.tagline && (
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold opacity-80">
                <EditableText value={settings.tagline} cmsBind={{file: 'site_settings', index: 0, key: 'tagline'}} />
              </span>
            )}
          </div>
        </Link>

        {/* Action Menu */}
        <div className="hidden md:flex items-center gap-8">
            <EditableLink 
              label={settings.header_cta_label || "Contact"}
              url={settings.header_cta_url || "#contact"}
              table="site_settings"
              field="header_cta"
              id={0}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-accent transition-colors"
            />
        </div>
      </div>
    </nav>
  );
}

export default Header;