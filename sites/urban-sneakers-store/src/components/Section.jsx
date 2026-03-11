import React from 'react';
import ProductCard from './ProductCard';

const Section = ({ data }) => {
  const producten = data['Producten'] || [];
  const categorieen = data['Categorieen'] || [];

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Producten Grid */}
      <section id="producten" className="py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">De Collectie</h2>
            <p className="text-slate-500 font-medium">Exclusieve sneakers geselecteerd door Athena</p>
          </div>
          <div className="hidden md:block text-sm font-bold text-slate-400 uppercase tracking-widest">
            {producten.length} Items
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {producten.map((product, index) => (
            <ProductCard key={index} product={product} valuta="€" />
          ))}
        </div>
      </section>

      {/* Categorieën / Merken */}
      {categorieen.length > 0 && (
        <section id="categorieen" className="py-20 border-t border-slate-100">
          <h2 className="text-2xl font-black tracking-tighter uppercase mb-10 text-center">Onze Merken</h2>
          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {categorieen.map((cat, index) => (
              <span key={index} className="text-xl font-black tracking-widest uppercase">{cat.naam || cat.categorie}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Section;
