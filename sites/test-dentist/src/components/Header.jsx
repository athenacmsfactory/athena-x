import React from 'react';
import EditableImage from './EditableImage';

/**
 * Header Component - Dentist Sitetype
 * Clean, Trustworthy Clinical Hero
 */
const Header = ({ data }) => {
  const info = data.praktijk_info?.[0] || {};
  const title = info.naam || "Tandartspraktijk";
  const tagline = info.tagline || "Uw glimlach is onze prioriteit";
  
  const imageField = Object.keys(info).find(key => /logo|foto|banner|hero/i.test(key));
  const rawImg = info[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <header className="relative min-h-[75vh] flex items-center bg-background overflow-hidden pt-24 px-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 transform origin-top-right"></div>
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        <div className="flex flex-col items-start animate-in fade-in slide-in-from-left duration-1000">
          <span className="badge mb-6 bg-accent/10 text-accent border-none">Moderne Tandheelkunde</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-secondary mb-10 leading-relaxed max-w-xl font-medium opacity-80">
            {tagline}
          </p>
          
          <div className="flex flex-wrap gap-5">
             <a href="#contact" className="btn-primary py-4 px-10 shadow-xl shadow-accent/20">
                Afspraak maken
             </a>
             <a href="#behandelingen" className="px-10 py-4 rounded-full font-bold border-2 border-primary/5 text-primary hover:bg-white hover:border-accent/20 hover:shadow-soft transition-all">
                Onze behandelingen
             </a>
          </div>

          <div className="mt-12 flex gap-8 items-center border-t border-primary/5 pt-8 w-full">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-accent/20 flex items-center justify-center text-[10px] font-bold">DR</div>
              ))}
            </div>
            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Gecertificeerde Specialisten</p>
          </div>
        </div>

        <div className="relative h-[500px] lg:h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-1000 delay-200">
           {imgSrc ? (
             <EditableImage 
               src={imgSrc} 
               alt={title} 
               className="w-full h-full object-cover" 
               cmsBind={{ file: 'praktijk_info', index: 0, key: imageField }} 
             />
           ) : (
             <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent/30 text-9xl">
                <i className="fa-solid fa-tooth"></i>
             </div>
           )}
           <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent"></div>
        </div>

      </div>
    </header>
  );
};

export default Header;