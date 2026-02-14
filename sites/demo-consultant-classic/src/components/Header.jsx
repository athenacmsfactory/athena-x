import React from 'react';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';
import EditableLink from './EditableLink';
import { Link } from 'react-router-dom';

function Header({ siteSettings = {} }) {
  const settings = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : (siteSettings || {});
  const siteName = settings.site_name || 'demo-consultant';
  const logoChar = (settings.logo_text || siteName).charAt(0).toUpperCase();
  
  // Use a reliable default logo if site_logo_image is missing
  const displayLogo = settings.site_logo_image || "athena-icon.svg";

  const handleScroll = (e) => {
    const url = settings.header_cta_url || "#contact";
    if (url.startsWith('#')) {
      e.preventDefault();
      const targetId = url.substring(1);
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-[1000] border-b border-white/10 px-6 transition-all duration-500 flex items-center"
      style={{ 
        display: settings.header_visible === false ? 'none' : 'flex',
        backgroundColor: 'var(--header-bg, var(--color-header-bg, rgba(255,255,255,0.9)))', 
        backdropFilter: 'var(--header-blur, blur(16px))',
        height: 'var(--header-height, 80px)',
        borderBottom: 'var(--header-border, 1px solid rgba(255,255,255,0.1))'
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo & Identity */}
        {(settings.header_show_logo !== false || settings.header_show_title !== false) && (
          <Link to="/" className="flex items-center gap-4 group">
            
            {settings.header_show_logo !== false && (
              <div className="relative w-12 h-12 overflow-hidden transition-transform duration-500">
                 <EditableMedia 
                   src={displayLogo} 
                   cmsBind={{file: 'site_settings', index: 0, key: 'site_logo_image'}} 
                   className="w-full h-full object-contain" 
                   fallback={logoChar}
                 />
              </div>
            )}
            
            <div className="flex flex-col">
              {settings.header_show_title !== false && (
                <span className="text-2xl font-serif font-black tracking-tight text-primary leading-none mb-1">
                  <EditableText value={siteName} cmsBind={{file: 'site_settings', index: 0, key: 'site_name'}} />
                </span>
              )}
              {settings.header_show_tagline !== false && settings.tagline && (
                <span className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold opacity-80">
                  <EditableText value={settings.tagline} cmsBind={{file: 'site_settings', index: 0, key: 'tagline'}} />
                </span>
              )}
            </div>
          </Link>
        )}

        {/* Action Menu */}
        <div className="flex items-center gap-8">
            {settings.header_show_button !== false && (
              <EditableLink 
                as="button"
                label={settings.header_cta_label || "Contact"}
                url={settings.header_cta_url || "#contact"}
                table="site_settings"
                field="header_cta"
                id={0}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-accent transition-colors"
                onClick={handleScroll}
              />
            )}
        </div>
      </div>
    </nav>
  );
}

export default Header;