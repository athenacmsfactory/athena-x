import React from 'react';
import EditableImage from './EditableImage';
import ProductCard from './ProductCard';

/**
 * Section Component - Store Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
const Section = ({ data }) => {
  const shopInfo = data.Winkel_Instellingen?.[0] || {};
  const valuta = shopInfo.valuta || "€";

  const sectionConfigs = [
    { table: "Categorieën", title: "Onze Collecties", subtitle: "Verken onze zorgvuldig samengestelde selectie" },
    { table: "Producten", title: "Nieuwe Items", subtitle: "De meest populaire items van dit moment" },
    { table: "Reviews", title: "Klantervaringen", subtitle: "Wat anderen zeggen over onze service" }
  ];

  return (
    <div className="flex flex-col gap-16 py-16">
      {sectionConfigs.map((config, idx) => {
        const items = data[config.table] || [];
        if (items.length === 0) return null;

        const isProducts = config.table.toLowerCase().includes('product');
        const isCategories = config.table.toLowerCase().includes('categorie');
        const isReviews = config.table.toLowerCase().includes('review');

        return (
          <section 
            key={idx} 
            id={config.table.toLowerCase()} 
            className={`py-24 px-6 ${idx % 2 === 1 ? 'bg-surface' : 'bg-background'}`}
          >
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <span className="badge mb-4 bg-accent/10 text-accent border-none">{config.table}</span>
                  <h2 className="text-4xl md:text-6xl font-serif font-black text-primary leading-tight">
                    {config.title}
                  </h2>
                  {config.subtitle && (
                    <p className="text-secondary text-lg mt-4 italic font-medium opacity-80">
                      {config.subtitle}
                    </p>
                  )}
                </div>
                {isProducts && (
                  <a href="#producten" className="text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-accent pb-1 hover:text-accent transition-colors">
                    Bekijk alles
                  </a>
                )}
              </header>

              {/* Items Grid Logic */}
              <div className={`grid gap-10 ${
                isProducts ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                isCategories ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 md:grid-cols-3'
              }`}>
                {items.filter(item => Object.keys(item).some(k => k !== 'absoluteIndex' && !k.startsWith('_'))).map((item, index) => {
                  if (isProducts) {
                    return <ProductCard key={index} product={item} valuta={valuta} />;
                  }

                  if (isCategories) {
                    const imgKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => /foto|afbeelding|image/i.test(k));
                    const name = item.naam || item.titel || "Collectie";
                    const rawImg = item[imgKey];
                    const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

                    return (
                      <div key={index} className="group relative h-[400px] rounded-3xl overflow-hidden shadow-soft cursor-pointer">
                        {imgSrc && (
                          <EditableImage 
                            src={imgSrc} 
                            alt={name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            cmsBind={{ file: config.table, index: item.absoluteIndex, key: imgKey }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{name}</h3>
                          <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            Bekijk collectie →
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (isReviews) {
                    return (
                      <article key={index} className="bg-white p-10 rounded-3xl shadow-soft border border-primary/5 flex flex-col gap-6 relative">
                        <div className="text-accent text-5xl font-serif absolute -top-4 -left-2 opacity-20">“</div>
                        <p className="text-secondary italic leading-relaxed relative z-10 font-medium">
                          {item.review || item.tekst}
                        </p>
                        <div className="mt-auto flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center font-bold text-accent">
                            {item.naam?.charAt(0) || "K"}
                          </div>
                          <div>
                            <h4 className="font-bold text-primary text-sm">{item.naam || "Klant"}</h4>
                            <div className="flex gap-1 text-[10px] text-accent">
                               {"★★★★★".split('').map((s, i) => <span key={i}>{s}</span>)}
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Section;