import React, { useEffect } from 'react';
import EditableMedia from './EditableMedia';
import EditableText from './EditableText';
import { useCart } from './CartContext';

const Section = ({ data }) => {
  const { addToCart } = useCart();
  const sectionOrder = data.section_order || [];

  // Meld aan de Dock welke secties we hebben
  useEffect(() => {
    if (window.athenaScan) {
      window.athenaScan(data);
    }
  }, [data, sectionOrder]);

  return (
    <div className="flex flex-col">
      {sectionOrder.map((sectionName, idx) => {
        const items = data[sectionName] || [];
        if (items.length === 0) return null;

        // 1. Hero Sectie (Basisgegevens)
        if (sectionName === 'basisgegevens') {
          const hero = items[0];
          return (
            <section 
              key={idx} 
              data-dock-section="basisgegevens"
              className="relative h-[90vh] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 z-0">
                <EditableMedia 
                  src={hero.hero_afbeelding} 
                  cmsBind={{file: 'basisgegevens', index: 0, key: 'hero_afbeelding'}}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
              </div>
              <div className="relative z-10 text-center px-6 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 drop-shadow-xl">
                  <EditableText value={hero.hero_header} cmsBind={{file: 'basisgegevens', index: 0, key: 'hero_header'}} />
                </h1>
                <div className="h-1.5 w-24 bg-accent mx-auto mb-8"></div>
                <button 
                  onClick={() => document.getElementById('producten')?.scrollIntoView({behavior: 'smooth'})}
                  className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-accent hover:text-white transition-all shadow-2xl"
                >
                  Ontdek onze pralines
                </button>
              </div>
            </section>
          );
        }

        // 2. Producten Grid
        if (sectionName === 'producten') {
          return (
            <section 
              key={idx} 
              id="producten" 
              data-dock-section="producten"
              className="py-32 px-6 bg-background"
            >
              <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-5xl font-serif font-bold mb-4 text-[var(--color-heading)]">Onze Collectie</h2>
                <p className="text-xl italic opacity-60 mb-20">Handgemaakte meesterwerken</p>
                
                <div className="flex flex-wrap justify-center items-stretch gap-12">
                  {items.map((item, index) => {
                    const priceValue = parseFloat(String(item.prijs).replace(',', '.'));
                    return (
                      <article 
                        key={index} 
                        className="w-full md:w-[calc(45%)] lg:w-[calc(30%)] min-w-[300px] flex flex-col card group transition-all duration-500"
                        style={{ borderRadius: 'var(--radius-custom)', boxShadow: 'var(--shadow-main)' }}
                      >
                        <div className="relative aspect-square overflow-hidden mb-8 shadow-inner flex-shrink-0" style={{ borderRadius: 'calc(var(--radius-custom) * 0.8)' }}>
                          <EditableMedia 
                            src={item.product_foto_url} 
                            cmsBind={{file: 'producten', index, key: 'product_foto_url'}}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute top-6 right-6 bg-accent text-white px-5 py-2 rounded-full font-bold text-lg shadow-lg">
                            €{priceValue.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex-grow text-left flex flex-col">
                          <h3 className="text-2xl font-bold mb-3 text-[var(--color-heading)] min-h-[4rem] flex items-center">
                            <EditableText value={item.naam} cmsBind={{file: 'producten', index, key: 'naam'}} />
                          </h3>
                          <p className="text-sm opacity-60 line-clamp-3 mb-6 leading-relaxed flex-grow">
                            <EditableText value={item.korte_beschrijving} cmsBind={{file: 'producten', index, key: 'korte_beschrijving'}} />
                          </p>
                        </div>
                        <button 
                          onClick={() => addToCart({ id: item.product_id || index, title: item.naam, price: priceValue, image: item.product_foto_url })}
                          className="btn-primary w-full py-5 flex items-center justify-center gap-3 mt-auto"
                        >
                          <i className="fa-solid fa-cart-shopping"></i> In winkelwagen
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        // 3. Sterke Punten
        if (sectionName === 'sterke_punten') {
          return (
            <section 
              key={idx} 
              data-dock-section="sterke_punten"
              className="py-24 bg-black text-white"
            >
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6 border border-accent/30 text-accent">
                       <i className={`fa-solid ${item.icoon_naam || 'fa-star'} text-3xl`}></i>
                    </div>
                    <h4 className="text-xl font-bold mb-2">
                      <EditableText value={item.titel} cmsBind={{file: 'sterke_punten', index, key: 'titel'}} />
                    </h4>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Section;