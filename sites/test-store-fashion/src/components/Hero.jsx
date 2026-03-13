import React from 'react';
import EditableImage from './EditableImage';

/**
 * Hero Component - Fashion Store Sitetype
 * Editorial / High-Fashion Layout
 */
export default function Hero({ data }) {
  const info = data.Winkel_Instellingen?.[0] || {};
  const title = info.winkelnaam || "MAISON ATHENA";
  const tagline = info.slogan || "Spring / Summer 2026 Collection";
  
  const imageField = Object.keys(info).find(key => /logo|foto|banner/i.test(key));
  const rawImg = info[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {imgSrc && (
        <div className="absolute inset-0 z-0">
          <EditableImage 
            src={imgSrc} 
            alt={title} 
            className="w-full h-full object-cover" 
            cmsBind={{ file: 'Winkel_Instellingen', index: 0, key: imageField }} 
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] mb-8 font-light animate-in fade-in slide-in-from-bottom-4 duration-700">
          {tagline}
        </p>
        <h1 className="text-6xl md:text-9xl font-serif italic mb-12 animate-in fade-in zoom-in duration-1000 leading-none">
          {title}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <a href="#producten" className="px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 min-w-[200px]">
            Shop Women
          </a>
          <a href="#producten" className="px-10 py-4 border border-white text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 min-w-[200px]">
            Shop Men
          </a>
        </div>
      </div>
      
      {/* Footer minimal info */}
      <div className="absolute bottom-10 w-full flex justify-between px-10 text-[10px] uppercase tracking-widest text-white/70">
         <span>Est. 2026</span>
         <span>Paris — Milan — New York</span>
      </div>
    </section>
  );
}
