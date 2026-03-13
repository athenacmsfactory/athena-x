import React from 'react';
import EditableImage from './EditableImage';

/**
 * Header Component - Medical Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
const Header = ({ data }) => {
  const info = data.Praktijk_Info?.[0] || {};
  const title = info.naam || "Medisch Centrum";
  const tagline = info.tagline || "Uw gezondheid is onze zorg";
  
  const imageField = Object.keys(info).find(key => /logo|foto|banner/i.test(key));
  const rawImg = info[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <header className="relative min-h-[85vh] flex items-center bg-surface overflow-hidden pt-32 pb-20 px-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 transform origin-top-right hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        <div className="flex flex-col items-start">
          <span className="badge mb-6">Expertise & Vertrouwen</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-[1.1]">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-secondary mb-12 leading-relaxed max-w-xl italic opacity-90 font-light">
            {tagline}
          </p>
          
          <div className="flex flex-wrap gap-5">
             <a href="#contactinformatie" className="btn-primary flex items-center gap-3 group">
                Maak een afspraak
                <span className="group-hover:translate-x-1 transition-transform">→</span>
             </a>
             <a href="#specialisaties" className="px-8 py-3 rounded-full font-bold border-2 border-primary/10 text-primary hover:bg-white hover:border-accent/20 hover:shadow-soft transition-all">
                Onze specialisaties
             </a>
          </div>
          
          {/* Trust badges / stats */}
          <div className="mt-16 flex gap-10 border-t border-primary/5 pt-10 w-full">
            <div>
              <p className="text-3xl font-serif font-bold text-accent">24/7</p>
              <p className="text-xs uppercase tracking-widest text-secondary font-bold">Spoedhulp</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-accent">15+</p>
              <p className="text-xs uppercase tracking-widest text-secondary font-bold">Specialisten</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold text-accent">100%</p>
              <p className="text-xs uppercase tracking-widest text-secondary font-bold">Patiëntgericht</p>
            </div>
          </div>
        </div>

        <div className="relative h-[450px] lg:h-[600px] w-full rounded-[4rem] overflow-hidden shadow-2xl">
           {imgSrc ? (
             <EditableImage 
               src={imgSrc} 
               alt={title} 
               className="w-full h-full object-cover" 
               cmsBind={{ file: 'Praktijk_Info', index: 0, key: imageField }} 
             />
           ) : (
             <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent/30 text-9xl">
                <i className="fa-solid fa-hospital-user"></i>
             </div>
           )}
           {/* Subtle overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent"></div>
           
           {/* Floating card decoration */}
           <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl hidden md:block max-w-[200px]">
              <p className="text-xs font-bold text-accent uppercase tracking-tighter mb-1">Direct contact</p>
              <p className="text-sm font-medium text-primary">Onze assistenten staan klaar voor uw vragen.</p>
           </div>
        </div>

      </div>
    </header>
  );
};

export default Header;