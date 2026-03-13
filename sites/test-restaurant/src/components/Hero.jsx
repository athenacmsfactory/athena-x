import React from 'react';
import EditableImage from './EditableImage';

/**
 * Hero Component - Restaurant Sitetype
 * Sophisticated Culinary Layout
 */
export default function Hero({ data }) {
  const info = data.Restaurant_Info?.[0] || {};
  const title = info.naam || "Gastronomique";
  const tagline = info.beschrijving || "Proef de passie";

  const imageField = Object.keys(info).find(key => /logo|foto|banner|hero/i.test(key));
  const rawImg = info[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden bg-primary">
      {/* Background with Gradient Overlay */}
      {imgSrc ? (
        <div className="absolute inset-0 z-0">
           <EditableImage 
             src={imgSrc} 
             alt={title} 
             className="w-full h-full object-cover animate-in fade-in zoom-in duration-[2.5s]" 
             cmsBind={{ file: 'Restaurant_Info', index: 0, key: imageField }} 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-10"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-stone-900 z-0"></div>
      )}
      
      <div className="relative z-20 max-w-4xl px-6 animate-in slide-in-from-bottom-8 duration-1000">
        <div className="flex justify-center mb-6">
           <span className="w-1 h-20 bg-accent"></span>
        </div>
        
        <span className="text-accent uppercase tracking-[0.4em] text-sm font-bold mb-6 block animate-in fade-in delay-300">
          {info.keuken_type || 'Fine Dining'}
        </span>
        
        <h1 className="text-6xl md:text-9xl font-serif mb-8 leading-tight animate-in fade-in zoom-in duration-1000 delay-200">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-stone-200 mb-12 font-light italic max-w-2xl mx-auto leading-relaxed opacity-90">
          {tagline}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <a 
            href="#menu" 
            className="px-10 py-4 border border-white/30 backdrop-blur-md text-white uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-primary transition-all duration-500"
          >
            Bekijk Kaart
          </a>
          {info.reserveren_url && (
            <a 
              href={info.reserveren_url} 
              className="px-10 py-4 bg-accent text-white uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-primary transition-all duration-500 shadow-xl shadow-accent/20"
            >
              Reserveren
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
