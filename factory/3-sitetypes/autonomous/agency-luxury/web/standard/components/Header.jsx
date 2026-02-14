import React from 'react';
import EditableMedia from './EditableMedia';
import EditableText from './EditableText';
import ThemeToggle from './ThemeToggle';

/**
 * Header Component - Volledig Visueel Bewerkbaar (Media + Tekst)
 */
const Header = ({ data }) => {
  const keys = Object.keys(data || {});
  const infoKey = keys.find(k => k.toLowerCase().endsWith('_info')) || 
                  keys.find(k => k.toLowerCase() === 'info') || 
                  'agency_info';
  
  const infoArray = data?.[infoKey] || [];
  const info = infoArray[0] || {};
  
  const title = info.naam || "Athena Web Factory";
  const tagline = info.tagline || "Accelerating Digital Growth Through AI-Driven Web Architecture.";
  const bgMedia = info.video_url || info.foto_buiten || info.foto;

  return (
    <header className="relative min-h-screen flex items-center bg-slate-900 overflow-hidden px-6">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
           <EditableMedia 
             src={bgMedia} 
             alt="Hero Background" 
             className="w-full h-full object-cover opacity-40"
             dataItem={info}
             cmsBind={{ 
                 file: infoKey.toLowerCase(), 
                 index: 0, 
                 key: (bgMedia && (bgMedia.endsWith('.mp4') || bgMedia.includes('video'))) ? 'video_url' : 'foto_buiten' 
             }}
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 pointer-events-none"></div>
      </div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10 text-white">
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="absolute top-10 right-10 z-[100]">
             <ThemeToggle />
          </div>

          <span className="inline-block px-4 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-8">
             Athena CMS Factory
          </span>
          
          <EditableText 
            tagName="h1" 
            value={title} 
            className="text-6xl md:text-8xl font-serif font-bold mb-10 leading-[1.1] block"
            cmsBind={{ file: infoKey.toLowerCase(), index: 0, key: 'naam' }}
          />

          <EditableText 
            tagName="p" 
            value={tagline} 
            className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed font-light italic block"
            cmsBind={{ file: infoKey.toLowerCase(), index: 0, key: 'tagline' }}
          />
          
          <div className="flex flex-wrap gap-8">
             <a href="#cases" className="px-12 py-5 bg-blue-600 text-white rounded-full font-bold text-lg shadow-2xl hover:bg-blue-500 transition-all">
                Onze Projecten
             </a>
             <a href={`#${infoKey.toLowerCase()}`} className="px-12 py-5 border-2 border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Over Ons
             </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;