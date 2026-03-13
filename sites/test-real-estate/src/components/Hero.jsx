import React from 'react';
import EditableImage from './EditableImage';

/**
 * Hero Component - Real Estate Sitetype
 * Luxury Property Search Layout
 */
export default function Hero({ data }) {
  const info = data.Agency_Info?.[0] || {};
  const title = info.naam || "Uw Droomwoning";
  const tagline = info.tagline || "Vind exclusief vastgoed in uw regio";

  const imageField = Object.keys(info).find(key => /logo|foto|banner|hero/i.test(key));
  const rawImg = info[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <section className="relative h-screen flex items-center justify-center text-white overflow-hidden bg-primary">
      {/* Background with Gradient Overlay */}
      {imgSrc ? (
        <div className="absolute inset-0 z-0">
           <EditableImage 
             src={imgSrc} 
             alt={title} 
             className="w-full h-full object-cover animate-in fade-in zoom-in duration-[2s] brightness-75" 
             cmsBind={{ file: 'Agency_Info', index: 0, key: imageField }} 
           />
           <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent z-10"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-slate-900 z-0"></div>
      )}
      
      <div className="relative z-20 max-w-5xl px-6 text-center animate-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-6xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter uppercase">
          Find Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white/50">Sanctuary.</span>
        </h1>
        <p className="text-xl md:text-3xl text-white/80 mb-16 max-w-3xl mx-auto font-light italic leading-relaxed">
          {tagline}
        </p>
        
        {/* Search Bar Overlay */}
        <div className="bg-white/10 backdrop-blur-2xl p-3 rounded-[2rem] border border-white/20 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 shadow-2xl">
          <div className="flex-grow flex items-center bg-white rounded-[1.5rem] px-6 py-4 shadow-inner">
             <span className="text-primary opacity-30 mr-3 text-xl">📍</span>
             <input 
               type="text" 
               placeholder="Waar zoekt u een woning?" 
               className="w-full bg-transparent text-primary font-bold outline-none placeholder:text-primary/30"
             />
          </div>
          <button className="px-12 py-5 bg-accent text-white font-black uppercase tracking-[0.2em] text-xs rounded-[1.5rem] hover:bg-white hover:text-primary transition-all duration-500 shadow-xl shadow-accent/20">
            Zoek Aanbod
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 flex justify-center gap-12 text-white/50 font-bold uppercase tracking-widest text-[10px]">
           <div className="flex flex-col gap-1">
             <span className="text-white text-2xl font-black">2.5k+</span>
             <span>Panden Verkocht</span>
           </div>
           <div className="flex flex-col gap-1 border-x border-white/10 px-12">
             <span className="text-white text-2xl font-black">15+</span>
             <span>Jaar Ervaring</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-white text-2xl font-black">98%</span>
             <span>Tevreden Klanten</span>
           </div>
        </div>
      </div>
    </section>
  );
}
