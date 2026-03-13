import React from 'react';
import EditableImage from './EditableImage';

/**
 * Section Component - Dentist Sitetype
 * Organized and clean medical sections
 */
const Section = ({ data }) => {
  const sectionConfigs = [
    { table: "behandelingen", title: "Onze Behandelingen", subtitle: "Gespecialiseerde zorg voor elk gebit" },
    { table: "team", title: "Uw Behandelteam", subtitle: "Ervaren specialisten staan voor u klaar" },
    { table: "praktijk_info", title: "Over de Praktijk", subtitle: "Modern uitgerust voor uw comfort" }
  ];

  return (
    <div className="flex flex-col">
      {sectionConfigs.map((config, idx) => {
        const items = data[config.table] || [];
        if (items.length === 0) return null;

        const isTeam = config.table.toLowerCase().includes('team');
        const isBehandelingen = config.table.toLowerCase().includes('behandeling');

        return (
          <section 
            key={idx} 
            id={config.table.toLowerCase()} 
            className={`py-24 px-6 ${idx % 2 === 1 ? 'bg-surface' : 'bg-background'}`}
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <header className="mb-20 text-center max-w-3xl mx-auto">
                <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">{config.table}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
                  {config.title}
                </h2>
                <p className="text-secondary text-lg italic opacity-80">
                  {config.subtitle}
                </p>
                <div className="mt-8 h-1 w-20 bg-accent/20 mx-auto rounded-full"></div>
              </header>

              {/* Content Grid */}
              <div className={`grid gap-10 ${
                isTeam ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {items.filter(item => Object.keys(item).some(k => k !== 'absoluteIndex' && !k.startsWith('_'))).map((item, index) => {
                  const titleKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => /naam|titel|behandeling/i.test(k));
                  const imgKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => /foto|afbeelding|image/i.test(k));
                  const descKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => /beschrijving|uitleg|functie/i.test(k));
                  
                  const rawImg = item[imgKey];
                  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

                  return (
                    <article 
                      key={index} 
                      className={`group ${
                        isTeam ? 'text-center' : 'p-10 bg-white rounded-[2.5rem] border border-primary/5 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-500'
                      }`}
                    >
                      {/* Image Logic */}
                      {imgKey && rawImg && (
                        <div className={`relative overflow-hidden mb-8 ${
                          isTeam 
                            ? 'w-56 h-56 rounded-full mx-auto border-8 border-white shadow-soft group-hover:border-accent/10 transition-colors' 
                            : 'w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center p-3'
                        }`}>
                          <EditableImage 
                            src={imgSrc} 
                            alt={item[titleKey]} 
                            className={`w-full h-full ${isTeam ? 'object-cover' : 'object-contain opacity-80'}`}
                            cmsBind={{ file: config.table, index: item.absoluteIndex, key: imgKey }}
                          />
                        </div>
                      )}

                      <h3 className={`font-bold text-primary ${isTeam ? 'text-2xl mb-1' : 'text-xl mb-4'}`}>
                        {item[titleKey] || "Item " + (index+1)}
                      </h3>
                      
                      {descKey && (
                        <p className={`text-secondary leading-relaxed ${
                          isTeam ? 'text-accent font-medium text-sm uppercase tracking-widest mb-6' : 'text-slate-600'
                        }`}>
                          {item[descKey]}
                        </p>
                      )}

                      {/* Display other fields if not team/behandelingen */}
                      {!isTeam && !isBehandelingen && (
                        <div className="space-y-3 mt-6 pt-6 border-t border-primary/5">
                           {Object.entries(item).map(([key, val]) => {
                             if (key === titleKey || key === imgKey || key === descKey || key.startsWith('_') || key.toLowerCase() === 'absoluteindex') return null;
                             return (
                               <div key={key} className="flex gap-4 text-sm">
                                 <span className="font-bold text-primary/30 uppercase text-[10px] tracking-tighter pt-1 w-20 shrink-0">{key.replace(/_/g, ' ')}</span>
                                 <span className="text-secondary font-medium">{val}</span>
                               </div>
                             );
                           })}
                        </div>
                      )}

                      {isTeam && item.bio && (
                        <p className="text-slate-500 italic text-sm max-w-xs mx-auto opacity-75">"{item.bio}"</p>
                      )}
                    </article>
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