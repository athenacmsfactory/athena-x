import React, { useEffect } from 'react';
import EditableMedia from './EditableMedia';
import EditableText from './EditableText';

const Section = ({ data }) => {
  const sectionOrder = data.section_order || [];

  useEffect(() => {
    if (window.athenaScan) {
      window.athenaScan(data);
    }
  }, [data, sectionOrder]);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      {sectionOrder.map((sectionName, idx) => {
        // Skip contact if handled specially at the end
        if (sectionName === 'contact') return null;
        
        const items = data[sectionName] || [];
        if (items.length === 0) return null;

        if (sectionName === 'basisgegevens' || sectionName === 'hero') {
          const hero = items[0];
          const heroTitle = hero.titel || hero.hero_header || hero.site_naam;
          const heroImg = hero.hero_afbeelding || hero.foto_url || hero.image;
          const heroSub = hero.ondertitel || hero.introductie || hero.subtitle;

          return (
            <section key={idx} id="hero" data-dock-section={sectionName} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <EditableMedia src={heroImg} cmsBind={{file: sectionName, index: 0, key: hero.hero_afbeelding ? 'hero_afbeelding' : (hero.foto_url ? 'foto_url' : 'image')}} className="w-full h-full object-cover" />
                <div className="absolute inset-0 z-20 pointer-events-none" style={{ 
                  backgroundImage: 'linear-gradient(to bottom, var(--hero-overlay-start, rgba(0,0,0,0.6)), var(--hero-overlay-end, rgba(0,0,0,0.6)))' 
                }}></div>
              </div>
              <div className="relative z-10 text-center px-6 max-w-5xl">
                <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-2xl">
                  <EditableText value={heroTitle} cmsBind={{file: sectionName, index: 0, key: hero.titel ? 'titel' : (hero.hero_header ? 'hero_header' : (hero.site_naam ? 'site_naam' : 'title'))}} />
                </h1>
                <div className="h-2 w-32 bg-accent mx-auto mb-10 rounded-full shadow-lg shadow-accent/50"></div>
                <div className="flex flex-col items-center gap-12">
                    <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-light italic">
                       <EditableText value={heroSub} cmsBind={{file: sectionName, index: 0, key: hero.ondertitel ? 'ondertitel' : (hero.introductie ? 'introductie' : 'subtitle')}} />
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={scrollToContact} className="bg-[var(--color-button-bg)] text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:opacity-90 transition-all transform hover:scale-105">
                            Contact
                        </button>
                    </div>
                </div>
              </div>
            </section>
          );
        }

        // Standard GRID logic for other sections
        return (
          <section key={idx} id={sectionName} data-dock-section={sectionName} className={'py-32 px-6 ' + (idx % 2 === 1 ? 'bg-black/5' : 'bg-white')}>
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center mb-24">
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary text-center mb-6 capitalize">
                  {sectionName.replace(/_/g, ' ')}
                </h2>
                <div className="h-2 w-32 bg-accent rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {items.map((item, index) => {
                   if (item._visible === false || item._visible === "false" || item.visible === false || item.visible === "false") return null;
                   
                   const titleKey = Object.keys(item).find(k => /naam|titel|onderwerp|header/i.test(k));
                   const textKeys = Object.keys(item).filter(k => k !== titleKey && !/foto|afbeelding|url|link|id|stap|icon|category|tijdsduur/i.test(k));
                   const imgKey = Object.keys(item).find(k => /foto|afbeelding|url|image/i.test(k));

                   return (
                     <div key={index} className="flex flex-col bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-500 group border border-slate-100">
                       {imgKey && item[imgKey] && (
                         <div className="h-48 rounded-3xl mb-8 overflow-hidden">
                           <EditableMedia src={item[imgKey]} cmsBind={{file: sectionName, index, key: imgKey}} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         </div>
                       )}
                       
                       <h3 className="text-2xl font-serif font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                         {titleKey && <EditableText value={item[titleKey]} cmsBind={{file: sectionName, index, key: titleKey}} />}
                       </h3>
                       
                       {textKeys.map(tk => (
                         <p key={tk} className="text-lg text-slate-600 font-light leading-relaxed mb-6">
                           <EditableText value={item[tk]} cmsBind={{file: sectionName, index, key: tk}} />
                         </p>
                       ))}

                       {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all mt-auto">
                              Bekijk Project <i className="fa-solid fa-arrow-right"></i>
                          </a>
                       )}
                     </div>
                   );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* HIGH-IMPACT CTA / CONTACT SECTION (Pro Style) */}
      {data.contact && data.contact.length > 0 && (
        <section key="contact-cta-static" id="contact" data-dock-section="contact" className="py-32 px-6 bg-[var(--color-primary)] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-12 md:p-20 border border-white/10 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="max-w-2xl text-center lg:text-left">
                  <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                    <EditableText value={data.contact[0].titel || 'Laten we praten'} cmsBind={{file: 'contact', index: 0, key: 'titel'}} />
                  </h2>
                  <p className="text-xl text-white/70 mb-0 font-light">
                    Klaar om uw digitale aanwezigheid naar een hoger niveau te tillen? Laat ons samen iets buitengewoons bouwen.
                  </p>
                </div>
                
                <div className="flex flex-col items-center lg:items-end gap-10">
                  <a 
                    href={`mailto:${data.contact[0].email}?subject=${encodeURIComponent("Projectaanvraag via Athena CMS Factory")}`}
                    className="bg-accent hover:bg-accent/90 text-white px-12 py-6 rounded-full text-2xl font-bold shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                    Start uw Project
                  </a>
                  
                  <div className="flex flex-wrap justify-center lg:justify-end gap-10 text-white/60">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-location-dot text-accent"></i>
                      <EditableText value={data.contact[0].locatie} cmsBind={{file: 'contact', index: 0, key: 'locatie'}} />
                    </div>
                    {data.contact[0].linkedin_url && (
                      <a href={data.contact[0].linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-3">
                        <i className="fa-brands fa-linkedin text-accent text-xl"></i>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Section;
