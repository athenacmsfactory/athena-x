import React from 'react';
import EditableImage from './EditableImage';

/**
 * Hero Component - Store Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
export default function Hero({ data }) {
  const info = data.Winkel_Instellingen?.[0] || {};
  const title = info.winkelnaam || "Onze Collectie";
  const tagline = info.slogan || "Ontdek de nieuwste trends";
  
  const imageField = Object.keys(info).find(key => /logo|foto|banner/i.test(key));
  const rawImg = info[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-surface">
      {/* Background Image with Overlay */}
      {imgSrc && (
        <div className="absolute inset-0 z-0">
          <EditableImage 
            src={imgSrc} 
            alt={title} 
            className="w-full h-full object-cover grayscale-[20%] brightness-75" 
            cmsBind={{ file: 'Winkel_Instellingen', index: 0, key: imageField }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-background/90"></div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <span className="badge mb-6 bg-white/20 text-white border-white/30 backdrop-blur-md">Nieuwe Collectie 2026</span>
        <h1 className="text-6xl md:text-9xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9]">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto italic leading-relaxed">
          {tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#producten" className="btn-primary px-12 py-5 text-lg shadow-2xl shadow-primary/40">
            Shop de Collectie
          </a>
          <a href="#categorieën" className="px-12 py-5 text-lg font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-white hover:text-primary transition-all">
            Bekijk Lookbook
          </a>
        </div>
      </div>
      
      {/* Scroll indicator decoration */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 text-white">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-slide-down"></div>
        </div>
      </div>
    </section>
  );
}
