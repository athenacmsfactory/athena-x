import React from 'react';

const ServiceCard = ({ naam, beschrijving, duur_minuten, prijs, populair }) => {
  const isPopular = populair === 'Ja';
  
  return (
    <div className={`p-8 bg-dark-surface/50 border-gold-subtle backdrop-blur-sm transition duration-500 hover:bg-dark-surface/80 relative
        ${isPopular ? 'shadow-2xl shadow-gold/30' : ''}
    `}>
      {isPopular && (
        <span className="absolute top-0 right-0 bg-gold text-black px-3 py-1 text-xs uppercase font-bold tracking-wider -mt-3 mr-4">
          Populair
        </span>
      )}
      
      <h3 className="text-3xl font-serif text-gold mb-3">{naam}</h3>
      <p className="text-sm text-gray-400 mb-6 min-h-12">{beschrijving}</p>
      
      <div className="flex justify-between items-end border-t border-gold/50 pt-4">
        <div>
          <span className="block text-4xl font-serif text-white leading-none">
            €{prijs.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Vanaf Prijs</span>
        </div>
        
        <div className="text-right">
          <span className="block text-sm text-gold tracking-wider font-bold">
            {duur_minuten} min
          </span>
          <a href="#booking" className="text-xs text-gray-400 hover:text-gold transition duration-200 mt-1 underline">
            Boek Nu
          </a>
        </div>
      </div>
    </div>
  );
};


const Section = ({ title, data }) => {
  return (
    <section className="py-24 bg-dark-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <h2 className="text-center text-6xl font-serif text-white mb-4">
          {title}
        </h2>
        <p className="text-center text-xl text-gold mb-16 uppercase tracking-widest">
          Vakmanschap en Precisie
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((dienst) => (
            <ServiceCard 
              key={dienst.dienst_id} 
              {...dienst} 
            />
          ))}
        </div>
        
        <div className="text-center mt-16">
            <a 
              href="#full-menu" 
              className="inline-block px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition duration-300 uppercase text-sm font-sans tracking-wider"
            >
              Bekijk Alle Diensten
            </a>
        </div>
      </div>
    </section>
  );
};

export default Section;