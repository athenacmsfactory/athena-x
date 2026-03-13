import React from 'react';
import EditableImage from './EditableImage';
import Card from './ui/Card'; // Fixed Import Path

/**
 * Section Component - Medical Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
const Section = ({ data }) => {
  // We definiëren de secties die we willen tonen
  const sectionConfigs = [
    { table: "Specialisaties", title: "Onze Specialisaties", subtitle: "Hoogwaardige zorg door expertise" },
    { table: "Artsen", title: "Medisch Team", subtitle: "Maak kennis met onze specialisten" },
    { table: "Contactinformatie", title: "Contact & Bereikbaarheid", subtitle: "We staan voor u klaar" }
  ];

  return (
    <div className="flex flex-col">
      {sectionConfigs.map((config, idx) => {
        const items = data[config.table] || [];
        if (items.length === 0) return null;

        const isArtsen = config.table.toLowerCase().includes('arts');
        const isContact = config.table.toLowerCase().includes('contact');

        return (
          <section 
            key={idx} 
            id={config.table.toLowerCase()} 
            className={`py-24 px-6 ${idx % 2 === 1 ? 'bg-surface' : 'bg-background'}`}
          >
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <header className="mb-16 text-center">
                <span className="badge mb-4">{config.table}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                  {config.title}
                </h2>
                {config.subtitle && (
                  <p className="text-secondary text-lg max-w-2xl mx-auto italic">
                    {config.subtitle}
                  </p>
                )}
                <div className="mt-8 h-1 w-20 bg-accent/30 mx-auto rounded-full"></div>
              </header>

              {/* Items Grid */}
              <div className={`grid gap-8 ${
                isContact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {items.filter(item => Object.keys(item).some(k => k !== 'absoluteIndex' && !k.startsWith('_'))).map((item, index) => {
                  // Dynamische key detectie
                  const titleKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => /naam|specialisatie|dienst/i.test(k));
                  const imgKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => /foto|afbeelding|portret/i.test(k));
                  const descKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => /beschrijving|uitleg|functie/i.test(k));
                  
                  const rawImg = item[imgKey];
                  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

                  // Render Logic
                  if (isArtsen) {
                    return (
                      <article key={index} className="group transition-all duration-500 text-center flex flex-col items-center">
                         {imgKey && rawImg && (
                            <div className="relative overflow-hidden mb-6 w-48 h-48 rounded-full border-8 border-white shadow-soft group-hover:border-accent/10 transition-colors">
                              <EditableImage 
                                src={imgSrc} 
                                alt={item[titleKey]} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                cmsBind={{ file: config.table, index: item.absoluteIndex, key: imgKey }}
                              />
                            </div>
                          )}
                          <div className="mt-4">
                            <h3 className="font-bold text-primary text-2xl">
                              {item[titleKey]}
                            </h3>
                            <p className="text-accent font-medium mt-1 mb-4">
                              {item[descKey]}
                            </p>
                          </div>
                      </article>
                    );
                  }

                  // Default Card Layout for Services/Contact
                  return (
                    <Card key={index} className="group h-full flex flex-col">
                      {imgKey && rawImg && (
                        <div className="relative overflow-hidden mb-6 w-full h-48 rounded-2xl">
                          <EditableImage 
                            src={imgSrc} 
                            alt={item[titleKey]} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            cmsBind={{ file: config.table, index: item.absoluteIndex, key: imgKey }}
                          />
                        </div>
                      )}
                      
                      <h3 className="font-bold text-primary text-xl mb-3">
                        {item[titleKey]}
                      </h3>
                      
                      {descKey && (
                        <p className="text-slate-600 leading-relaxed mb-4 flex-grow">
                          {item[descKey]}
                        </p>
                      )}

                      <div className="space-y-2 mt-auto pt-4 border-t border-slate-50">
                           {Object.entries(item).map(([key, val]) => {
                             if (key === titleKey || key === imgKey || key === descKey || key.startsWith('_') || key === 'absoluteIndex' || !val) return null;
                             return (
                               <div key={key} className="flex items-start gap-3 justify-start text-sm">
                                 <span className="font-bold text-primary/40 uppercase text-[10px] tracking-widest pt-1">
                                   {key.replace(/_/g, ' ')}
                                 </span> 
                                 <span className="text-secondary font-medium">{val}</span>
                               </div>
                             );
                           })}
                      </div>
                    </Card>
                  );
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