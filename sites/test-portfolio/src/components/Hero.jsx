import React from 'react';
import EditableImage from './EditableImage';

/**
 * Hero Component - Portfolio Sitetype
 * Modern Digital Brutalism / High-Impact Layout
 */
export default function Hero({ data }) {
  const profile = data.Profiel?.[0] || {};
  const fullName = profile.volledige_naam || "Creator";
  const tagline = profile.tagline || "Designing the Future";
  
  const imageField = Object.keys(profile).find(key => /foto|portret|image|background/i.test(key));
  const rawImg = profile[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-background text-text overflow-hidden pt-20">
      
      {/* Background Visual (Abstract or Photo) */}
      <div className="absolute inset-0 z-0 opacity-20">
        {imgSrc ? (
          <EditableImage 
             src={imgSrc} 
             alt={fullName} 
             className="w-full h-full object-cover grayscale" 
             cmsBind={{ file: 'Profiel', index: 0, key: imageField }} 
           />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20"></div>
        )}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
        <div className="inline-block mb-8 px-4 py-2 border border-primary/20 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700">
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Available for work</span>
        </div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-primary mix-blend-difference animate-in fade-in zoom-in duration-1000">
          {fullName}
        </h1>
        
        <p className="text-2xl md:text-4xl text-secondary font-light mb-16 max-w-3xl mx-auto leading-tight italic animate-in slide-in-from-bottom-8 duration-1000 delay-200">
          {tagline}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6 animate-in slide-in-from-bottom-12 duration-1000 delay-500">
          <a 
            href="#projects" 
            className="px-10 py-5 bg-primary text-white font-black uppercase tracking-widest text-sm hover:bg-accent transition-all duration-300 shadow-xl shadow-primary/20"
          >
            View Work
          </a>
          {profile.contact_email && (
            <a 
              href={`mailto:${profile.contact_email}`} 
              className="px-10 py-5 border-2 border-primary text-primary font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all duration-300"
            >
              Get in Touch
            </a>
          )}
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between text-[10px] font-bold uppercase tracking-widest text-secondary/50">
         <span>Based in Europe</span>
         <span>Scroll to explore</span>
      </div>
    </section>
  );
}
