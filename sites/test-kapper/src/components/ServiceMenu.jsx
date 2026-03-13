import React from 'react';

const ServiceMenu = ({ data }) => {
  const diensten = data.Diensten || [];
  
  // Categorize services
  const categories = [...new Set(diensten.map(d => d.categorie))];

  return (
    <section id="tarieven" className="py-24 md:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 block">Prijslijst</span>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900">
            Diensten & <span className="italic font-light">Investeringen</span>
          </h2>
          <div className="w-12 h-[1px] bg-stone-200 mx-auto mt-8"></div>
        </div>

        <div className="space-y-20">
          {categories.map((cat) => (
            <div key={cat} className="space-y-10">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-stone-300 border-b border-stone-100 pb-4 text-center">
                {cat}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                {diensten.filter(d => d.categorie === cat).map((item, idx) => (
                  <div key={idx} className="group cursor-default">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-stone-900 font-medium group-hover:text-stone-600 transition-colors">
                        {item.naam}
                      </h4>
                      <div className="flex-grow border-b border-dotted border-stone-200 mx-4"></div>
                      <span className="font-serif text-stone-900">{item.prijs}</span>
                    </div>
                    {item.omschrijving && (
                      <p className="text-stone-400 text-xs font-light leading-relaxed">
                        {item.omschrijving} {item.duur && `• ${item.duur}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-stone-50 rounded-2xl text-center">
          <p className="text-stone-500 text-sm font-light italic">
            Alle prijzen zijn inclusief BTW. Heb je vragen over een specifieke behandeling? 
            Neem gerust contact met ons op.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceMenu;
