import React from 'react';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';

/**
 * Header (Docked Track)
 * Robust Hero section with support for Title Color and detached Header Image.
 */
function Header({ primaryTable, tableName, siteSettings = {}, navData = [] }) {
  const info = Array.isArray(primaryTable) ? (primaryTable[0] || {}) : (primaryTable || {});
  
  // Ensure siteSettings is treated as an object (might be array from JSON)
  const settings = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : siteSettings;
  
  // Look for fields in primary table for fallbacks
  const keys = Object.keys(info);
  const fallbackTitleKey = keys.find(k => /naam|titel|header|kop|bedrijfsnaam/i.test(k)) || keys[0];
  const fallbackTaglineKey = keys.find(k => /slogan|tagline|ondertitel|subtitle/i.test(k));
  
  // Values: Site Settings > Primary Table > Default
  const title = settings.title || info[fallbackTitleKey] || 'Welcome';
  const tagline = settings.tagline || (fallbackTaglineKey ? info[fallbackTaglineKey] : '');

  const sortedNav = [...navData].sort((a, b) => (a.menu_positie || 0) - (b.menu_positie || 0));

  return (
    <header id="home" className="relative min-h-[85vh] flex flex-col overflow-hidden bg-primary text-white">
      {/* Navigation Bar */}
      <nav className="relative z-50 w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-2xl">
            <i className="fa-solid fa-scissors text-white"></i>
          </div>
          <EditableText 
            tagName="span"
            value={title}
            className="font-serif font-bold text-2xl tracking-tighter uppercase"
            table="basisgegevens"
            id={0}
            field={fallbackTitleKey}
          />
        </div>

        <div className="hidden md:flex items-center gap-8">
          {sortedNav.map((item, idx) => (
            <a 
              key={idx} 
              href={`#${item.slug}`} 
              className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-accent ${item.is_call_to_action ? 'px-6 py-2 bg-accent text-white rounded-full shadow-lg shadow-accent/20' : 'text-white/70'}`}
            >
              <EditableText 
                value={item.titel_navigatie} 
                cmsBind={{ file: 'paginastructuur', index: idx, key: 'titel_navigatie' }} 
              />
            </a>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center text-center px-6">
        {/* Background Media Overlay */}
        <div className="absolute inset-0 opacity-40">
          <EditableMedia 
            src={settings.hero_image}
            alt={title}
            className="w-full h-full"
            cmsBind={{ file: 'site_settings', index: 0, key: 'hero_image' }}
            dataItem={settings}
            data-dock-bind={JSON.stringify({ file: 'site_settings', index: 0, key: 'hero_image' })}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto reveal">
          <EditableText 
            tagName="h1"
            value={title}
            className="text-5xl md:text-7xl lg:text-9xl mb-8 font-serif font-bold text-[var(--color-title)] leading-tight" 
            cmsBind={{ file: 'site_settings', index: 0, key: 'title' }}
          />
          
          {tagline && (
            <EditableText 
              tagName="p"
              value={tagline}
              className="text-xl md:text-3xl font-light text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed italic"
              cmsBind={{ file: 'site_settings', index: 0, key: 'tagline' }}
            />
          )}
          <div className="flex gap-6 justify-center">
             <a href="#diensten_tarieven" className="btn-primary px-10 py-5 text-lg">Onze Diensten</a>
             <a href="#contact" className="px-10 py-5 border-2 border-white/30 rounded-full font-bold hover:bg-white hover:text-primary transition-all">Contact</a>
          </div>
        </div>
      </div>

      {/* Modern Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-20 fill-background">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.96C25.54,60.05,72.59,70.97,121.39,70.97c48.8,0,105.51-12.21,135.51-24.54l64.49,10Z"></path>
        </svg>
      </div>
    </header>
  );
}

export default Header;
