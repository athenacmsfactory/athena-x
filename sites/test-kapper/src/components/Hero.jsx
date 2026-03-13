import React from 'react';

const Hero = ({ data }) => {
  const info = data.Basisgegevens?.[0] || {};
  
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={info.foto_url ? `${import.meta.env.BASE_URL}${info.foto_url}` : "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000"} 
          alt="Soap Antwerp Salon" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/20 via-transparent to-stone-900/60"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <span className="inline-block text-white/80 text-[10px] uppercase tracking-[0.4em] mb-6 animate-fade-in-up">
          Welkom bij Soap Antwerp
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-[1.1] animate-fade-in-up delay-100">
          {info.tagline}
        </h1>
        <p className="text-white/70 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
          Ontdek een unieke oase van rust in het hartje van Antwerpen, waar natuur en vakmanschap samenkomen.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up delay-300">
          <a href="#tarieven" className="w-full sm:w-auto px-10 py-4 bg-white text-stone-900 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-stone-100 transition-all shadow-2xl">
            Ontdek onze diensten
          </a>
          <a href={info.boekings_url} className="w-full sm:w-auto px-10 py-4 border border-white/30 text-white backdrop-blur-sm rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-all">
            Boek direct online
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white"></div>
      </div>
    </section>
  );
};

export default Hero;
