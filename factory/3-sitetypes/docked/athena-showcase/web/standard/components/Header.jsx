import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ primaryTable, tableName, siteSettings }) => {
  const [scrolled, setScrolled] = useState(false);
  const settings = Array.isArray(siteSettings) ? (siteSettings[0] || {}) : (siteSettings || {});
  const siteName = settings.site_name || '{{PROJECT_NAME}}';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (url) => {
    if (url.startsWith('#')) {
      document.getElementById(url.substring(1))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] px-6 transition-all duration-500 flex items-center ${
        scrolled ? 'h-16 bg-[var(--header-bg,rgba(255,255,255,0.9))] backdrop-blur-md shadow-lg' : 'h-24 bg-[var(--header-bg,transparent)]'
      }`}
      style={{ 
        height: scrolled ? 'var(--header-height-scrolled, 64px)' : 'var(--header-height, 96px)',
        borderBottom: settings.header_transparent ? 'none' : '1px solid var(--header-border, rgba(0,0,0,0.05))'
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-4 group">
            {settings.site_logo_image && (
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-xl group-hover:scale-110 transition-transform duration-500 p-2">
                <img 
                  src={`./images/${settings.site_logo_image}`} 
                  alt={siteName} 
                  className="w-full h-full object-contain" 
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-black tracking-tighter text-primary">
                {settings.logo_text || siteName}
              </span>
              {settings.tagline && (
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold -mt-1">
                  {settings.tagline}
                </span>
              )}
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('#showcase')} className="text-sm font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">Showcase</button>
          <button onClick={() => scrollToSection('#proces')} className="text-sm font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">Proces</button>
          <button onClick={() => scrollToSection('#contact')} className="text-sm font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">Contact</button>
          
          {settings.header_show_button && (
            <button 
              onClick={() => scrollToSection('#contact')}
              className="bg-primary text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-accent transition-all transform hover:scale-105 active:scale-95"
            >
              Start Project
            </button>
          )}
        </nav>

        <button className="md:hidden text-primary text-2xl">
          <i className="fa-solid fa-bars-staggered"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
