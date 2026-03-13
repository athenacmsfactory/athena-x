import React from 'react';

/**
 * Menu Component - Restaurant Sitetype
 * Classic Elegant Menu Layout
 */
export default function Menu({ data }) {
  const items = data.Menu || [];
  if (items.length === 0) return null;

  const categories = [...new Set(items.map(i => i.categorie || 'Gerechten'))];

  return (
    <section id="menu" className="py-32 bg-surface relative">
      {/* Decorative background pattern could go here */}
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Culinaire Beleving</span>
          <h2 className="text-5xl md:text-6xl font-serif text-primary mb-8">Onze Kaart</h2>
          <div className="w-24 h-[1px] bg-primary/20 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-24 gap-y-20 max-w-6xl mx-auto">
          {categories.map((cat, idx) => (
            <div key={cat} className="animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <h3 className="text-3xl font-serif text-primary border-b border-primary/10 pb-6 mb-10 text-center italic">
                {cat}
              </h3>
              
              <div className="space-y-12">
                {items.filter(i => (i.categorie || 'Gerechten') === cat).map((item, itemIdx) => (
                  <article key={itemIdx} className="group">
                    <div className="flex justify-between items-baseline mb-2 relative">
                      <h4 className="text-xl font-bold text-primary group-hover:text-accent transition-colors z-10 bg-surface pr-4">
                        {item.naam}
                      </h4>
                      
                      {/* Dotted Line Leader */}
                      <div className="absolute inset-x-0 bottom-1 border-b border-dotted border-primary/30 group-hover:border-accent/30"></div>
                      
                      <span className="font-serif font-bold text-accent text-xl z-10 bg-surface pl-4">
                        {item.prijs}
                      </span>
                    </div>
                    
                    <p className="text-secondary text-sm leading-relaxed pr-12 font-medium opacity-80 italic">
                      {item.beschrijving}
                    </p>
                    
                    {item.dieet_info && (
                      <div className="mt-3 flex gap-2">
                        {item.dieet_info.split(',').map(tag => (
                          <span key={tag} className="text-[10px] uppercase tracking-widest text-secondary/60 border border-secondary/20 px-2 py-1 rounded-sm">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-24">
          <p className="text-secondary text-sm italic">Heeft u allergieën? Meld het ons team.</p>
        </div>
      </div>
    </section>
  );
}
