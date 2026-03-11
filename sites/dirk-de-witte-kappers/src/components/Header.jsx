import React from 'react';

const Header = ({ bedrijfsnaam, openingstijden_info, boekings_url }) => {
  return (
    <header className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
      {/* Achtergrondafbeelding en overlay */}
      <div 
        className="absolute inset-0 bg-dark-background"
        style={{ background: "radial-gradient(circle, #1a1a1a 0%, #000000 100%)" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Navigatie */}
      <nav className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        <h1 className="text-2xl text-gold uppercase tracking-widest font-serif">{bedrijfsnaam}</h1>
        <a 
          href={boekings_url} 
          className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-black transition duration-300 uppercase text-sm font-sans tracking-wider"
        >
          Afspraak Maken
        </a>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 p-4 max-w-4xl">
        <h2 className="text-7xl md:text-8xl lg:text-9xl font-serif text-white mb-6 leading-tight">
          {bedrijfsnaam}
        </h2>
        <p className="text-xl md:text-2xl text-gold mb-10 tracking-widest uppercase">
          {openingstijden_info}
        </p>
        
        <a 
          href={boekings_url} 
          className="inline-block px-10 py-4 bg-gold text-black text-lg uppercase font-bold tracking-wider hover:bg-white transition duration-300 shadow-xl"
        >
          Boek Uw Luxe Ervaring
        </a>
      </div>
    </header>
  );
};

export default Header;