import React from 'react';
import PropertyCard from './PropertyCard';

/**
 * PropertyList Component - Real Estate Sitetype
 * Luxury Property Feed
 */
export default function PropertyList({ data }) {
  const panden = data.Woningen || [];
  if (panden.length === 0) return null;

  return (
    <section id="aanbod" className="py-32 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Portefeuille</span>
            <h2 className="text-4xl md:text-6xl font-black text-primary tracking-tighter leading-none">
              Ons <br/> <span className="text-secondary italic font-serif font-light">Exclusief Aanbod.</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-4 border-b border-primary/10 pb-4 w-full md:w-auto">
             <button className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors">Alle Panden</button>
             <div className="h-4 w-[1px] bg-primary/10"></div>
             <button className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors">Te Koop</button>
             <div className="h-4 w-[1px] bg-primary/10"></div>
             <button className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors">Te Huur</button>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {panden.map((pand, i) => (
            <PropertyCard key={i} pand={pand} />
          ))}
        </div>
        
        {/* Pagination Placeholder */}
        <div className="mt-24 flex justify-center">
           <button className="px-12 py-5 border-2 border-primary/5 text-primary font-black uppercase tracking-widest text-xs hover:border-accent hover:text-accent transition-all duration-500 rounded-2xl">
              Laad meer panden
           </button>
        </div>
      </div>
    </section>
  );
}
