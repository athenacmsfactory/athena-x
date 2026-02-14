import React, { useEffect } from 'react';
import EditableMedia from './EditableMedia';
import EditableText from './EditableText';


const Section = ({ data }) => {
  
  const sectionOrder = data.section_order || [];
  const displayConfig = data.display_config || { sections: {} };

  
  const getGoogleSearchUrl = (query, researcher = '') => {
    const context = "tandheelkunde wetenschappelijk onderzoek 2026";
    const fullQuery = [query, researcher, context].filter(Boolean).join(' ');
    // udm=50 forceert de AI/SGE modus voor diepere inzichten bij complexe vragen
    return `https://www.google.com/search?q=${encodeURIComponent(fullQuery)}&udm=50`;
  };

  useEffect(() => {
    if (window.athenaScan) {
      // Gebruik een kleine timeout om te zorgen dat de DOM echt klaar is
      const timer = setTimeout(() => {
          window.athenaScan(data);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sectionOrder.length]); // Alleen re-scannen als het aantal secties verandert

  return (
    <div className="flex flex-col">
      {sectionOrder.map((sectionName, idx) => {
        const items = data[sectionName] || [];
        if (items.length === 0) return null;

        if (sectionName === 'basisgegevens') {
          const config = displayConfig.sections?.[sectionName] || {};
          const hiddenFields = config.hidden_fields || [];
          
          const hero = items[0];
          const heroTitle = hero.titel || hero.hero_header || hero.site_naam;
          const showTitle = !hiddenFields.includes('titel') && !hiddenFields.includes('hero_header') && !hiddenFields.includes('site_naam');
          const showSubtitle = !hiddenFields.includes('ondertitel') && !hiddenFields.includes('introductie');
          const showImage = !hiddenFields.includes('hero_afbeelding') && !hiddenFields.includes('foto_url');

          return (
            <section key={idx} data-dock-section="basisgegevens" className="relative w-full h-auto min-h-[var(--hero-height,85vh)] max-h-[var(--hero-max-height,150vh)] aspect-[var(--hero-aspect-ratio,16/9)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                {showImage && <EditableMedia src={hero.hero_afbeelding || hero.foto_url} cmsBind={{file: 'basisgegevens', index: 0, key: hero.hero_afbeelding ? 'hero_afbeelding' : 'foto_url'}} className="w-full h-full object-cover object-top" />}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
              </div>
              <div className="relative z-10 text-center px-6 max-w-5xl">
                {showTitle && (
                    <>
                        <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                        <EditableText value={heroTitle} cmsBind={{file: 'basisgegevens', index: 0, key: hero.titel ? 'titel' : (hero.hero_header ? 'hero_header' : 'site_naam')}} />
                        </h1>
                        <div className="h-2 w-32 bg-accent mx-auto mb-10 rounded-full shadow-lg shadow-accent/50"></div>
                    </>
                )}
                <div className="flex flex-col items-center gap-8">
                    {showSubtitle && (
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light italic">
                        <EditableText value={hero.ondertitel || hero.introductie} cmsBind={{file: 'basisgegevens', index: 0, key: hero.ondertitel ? 'ondertitel' : 'introductie'}} />
                        </p>
                    )}
                    
                    {showTitle && (
                        <a href={getGoogleSearchUrl(heroTitle)} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-full backdrop-blur-md transition-all font-bold flex items-center gap-3 group">
                            <i className="fa-brands fa-google group-hover:text-accent transition-colors"></i>
                            Zoek meer inzichten
                        </a>
                    )}
                </div>
              </div>
            </section>
          );
        }

        if (sectionName.includes('product') || sectionName.includes('shop')) {
          const config = displayConfig.sections?.[sectionName] || {};
          const hiddenFields = config.hidden_fields || [];
          
          const sectionSettingIndex = data.section_settings?.findIndex(s => s.id === sectionName);
          const sectionSetting = sectionSettingIndex !== -1 ? data.section_settings[sectionSettingIndex] : null;
          const displayTitle = sectionSetting?.title || sectionName.replace(/_/g, ' ');

          return (
            <section key={idx} data-dock-section={sectionName} className="py-24 px-6" style={{ backgroundColor: 'var(--color-background)' }}>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-serif font-bold mb-16 text-center text-primary uppercase tracking-widest">
                   <EditableText 
                     value={displayTitle} 
                     cmsBind={sectionSettingIndex !== -1 ? { file: 'section_settings', index: sectionSettingIndex, key: 'title' } : null} 
                   />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {items.map((item, index) => {
                    const priceValue = parseFloat(String(item.prijs || 0).replace(/[^0-9.,]/g, '').replace(',', '.'));
                    const titleKey = Object.keys(item).find(k => /naam|titel/i.test(k) && !hiddenFields.includes(k));
                    const imgKey = Object.keys(item).find(k => /foto|afbeelding|url/i.test(k) && !hiddenFields.includes(k));
                    const showPrice = !hiddenFields.includes('prijs');

                    return (
                      <article key={index} className="flex flex-col bg-surface rounded-[2.5rem] shadow-xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl group border border-slate-100">
                        {imgKey && (
                            <div className="aspect-square overflow-hidden flex-shrink-0 relative">
                                <EditableMedia src={item[imgKey]} cmsBind={{file: sectionName, index, key: imgKey}} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                            </div>
                        )}
                        <div className="p-8 flex flex-col flex-grow text-center">
                          {titleKey && (
                            <h3 className="text-2xl font-bold mb-4 text-primary min-h-[4rem] flex items-center justify-center">
                                <EditableText value={item[titleKey]} cmsBind={{file: sectionName, index, key: titleKey}} />
                            </h3>
                          )}
                          {showPrice && <div className="text-accent font-bold mt-auto text-3xl mb-6">€{priceValue.toFixed(2)}</div>}
                          <div className="flex flex-col gap-3">
                            
                            
                            {titleKey && (
                                <a href={getGoogleSearchUrl(item[titleKey])} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center justify-center gap-2">
                                    <i className="fa-brands fa-google text-xs"></i> Zoek details
                                </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        const sectionSettingIndex = data.section_settings?.findIndex(s => s.id === sectionName);
        const sectionSetting = sectionSettingIndex !== -1 ? data.section_settings[sectionSettingIndex] : null;
        const displayTitle = sectionSetting?.title || sectionName.replace(/_/g, ' ');

        return (
          <section key={idx} id={sectionName} data-dock-section={sectionName} className={'py-24 px-6 '} style={{ backgroundColor: idx % 2 === 1 ? 'var(--color-surface)' : 'var(--color-background)' }}>
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col items-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary text-center mb-4 capitalize">
                  <EditableText 
                    value={displayTitle} 
                    cmsBind={sectionSettingIndex !== -1 ? { file: 'section_settings', index: sectionSettingIndex, key: 'title' } : null} 
                  />
                </h2>
                <div className="h-1.5 w-24 bg-accent rounded-full"></div>
              </div>
              
              <div className="space-y-20">
                {items.map((item, index) => {
                   const config = displayConfig.sections?.[sectionName] || {};
                   const hiddenFields = config.hidden_fields || [];

                   const titleKey = Object.keys(item).find(k => /naam|titel|onderwerp|header/i.test(k) && !hiddenFields.includes(k));
                   const researcherKey = Object.keys(item).find(k => /onderzoeker|auteur|expert/i.test(k) && !hiddenFields.includes(k));
                   const textKeys = Object.keys(item).filter(k => k !== titleKey && k !== researcherKey && !/foto|afbeelding|url|link|id/i.test(k) && !hiddenFields.includes(k));
                   const imgKey = Object.keys(item).find(k => /foto|afbeelding|url/i.test(k) && !hiddenFields.includes(k));
                   const isEven = index % 2 === 0;

                   return (
                     <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center`}>
                       {imgKey && item[imgKey] && (
                         <div className="w-full md:w-1/2 aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl rotate-1 group hover:rotate-0 transition-transform duration-500 border-8 border-white">
                           <EditableMedia src={item[imgKey]} cmsBind={{file: sectionName, index, key: imgKey}} className="w-full h-full object-cover" />
                         </div>
                       )}
                       <div className="flex-1 text-center md:text-left">
                         {titleKey && (
                           <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                               <h3 className="text-3xl font-serif font-bold text-primary leading-tight flex-1">
                                 <EditableText value={item[titleKey]} cmsBind={{file: sectionName, index, key: titleKey}} />
                               </h3>
                               
                               <a href={getGoogleSearchUrl(item[titleKey], item[researcherKey])} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-full transition-all text-sm font-bold self-start md:self-center">
                                  <i className="fa-brands fa-google text-accent"></i> Zoek bronnen
                               </a>
                           </div>
                         )}
                         {researcherKey && item[researcherKey] && (
                            <div className="mb-4 text-accent font-bold font-serif italic">
                               — <EditableText value={item[researcherKey]} cmsBind={{file: sectionName, index, key: researcherKey}} />
                            </div>
                         )}
                         {textKeys.map(tk => (
                           <div key={tk} className="text-xl leading-relaxed text-slate-600 mb-6 font-light">
                             <EditableText value={item[tk]} cmsBind={{file: sectionName, index, key: tk}} />
                           </div>
                         ))}
                         {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent font-bold hover:underline text-lg mt-4">
                                Lees meer <i className="fa-solid fa-arrow-right text-sm"></i>
                            </a>
                         )}
                       </div>
                     </div>
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