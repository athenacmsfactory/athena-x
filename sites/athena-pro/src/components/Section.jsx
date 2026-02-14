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

  return (
    <div className="flex flex-col">
      {sectionOrder.map((sectionName, idx) => {
        if (sectionName === 'contact') return null;
        const items = data[sectionName] || [];
        if (items.length === 0) return null;

        // HERO SECTION
        if (sectionName === 'hero') {
          const item = items[0];
          return (
            <section key={idx} data-dock-section="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <EditableMedia 
                  src={item.image} 
                  cmsBind={{file: 'hero', index: 0, key: 'image'}} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 z-20 pointer-events-none" style={{ 
                  backgroundImage: 'linear-gradient(to right, var(--hero-overlay-start, rgba(0,0,0,0.8)), var(--hero-overlay-end, rgba(0,0,0,0.32)))' 
                }}></div>
              </div>
              <div className="relative z-10 text-left px-6 max-w-7xl w-full">
                <div className="max-w-3xl mt-[4.25rem]">
                  <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-8 leading-tight">
                    <EditableText value={item.title} cmsBind={{file: 'hero', index: 0, key: 'title'}} />
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-16 leading-relaxed font-light">
                    <EditableText value={item.subtitle} cmsBind={{file: 'hero', index: 0, key: 'subtitle'}} />
                  </p>
                  <button 
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-[var(--color-button-bg)] text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:opacity-90 transition-all transform hover:scale-105"
                  >
                    <EditableText value={item.cta_text} cmsBind={{file: 'hero', index: 0, key: 'cta_text'}} />
                  </button>
                </div>
              </div>
            </section>
          );
        }

        // INTRO SECTION
        if (sectionName === 'intro') {
          const item = items[0];
          return (
            <section key={idx} id="intro" data-dock-section="intro" className="py-32 px-6 overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                <div className="w-full md:w-1/2 relative">
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
                  <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-8 border-slate-50 rotate-2 hover:rotate-0 transition-transform duration-700">
                    <EditableMedia src={item.image} cmsBind={{file: 'intro', index: 0, key: 'image'}} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-10 leading-tight">
                    <EditableText value={item.title} cmsBind={{file: 'intro', index: 0, key: 'title'}} />
                  </h2>
                  <div className="space-y-8">
                    <p className="text-xl leading-relaxed text-slate-600 font-light">
                      <EditableText value={item.content} cmsBind={{file: 'intro', index: 0, key: 'content'}} />
                    </p>
                    <p className="text-xl leading-relaxed text-slate-600 font-light italic border-l-4 border-accent pl-8">
                      <EditableText value={item.subcontent} cmsBind={{file: 'intro', index: 0, key: 'subcontent'}} />
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // GRID SECTIONS (VOORDELEN, INNOVATIE, SHOWCASE, PROCES)
        return (
          <section key={idx} id={sectionName} data-dock-section={sectionName} className={`py-32 px-6 ${idx % 2 === 0 ? 'bg-black/5 dark:bg-white/5' : ''}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 capitalize">
                  {sectionName.replace(/_/g, ' ')}
                </h2>
                <div className="h-2 w-32 bg-accent mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {items.map((item, index) => {
                  // Specific logic for different grid types
                  const isShowcase = sectionName === 'showcase';
                  const isProces = sectionName === 'proces';
                  const isVoordelen = sectionName === 'voordelen';

                  return (
                    <div key={index} className={`flex flex-col bg-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-500 group border border-slate-100 ${isShowcase ? 'overflow-hidden p-0' : ''}`}>
                      
                      {/* Image / Icon Header */}
                      {item.image && (
                        <div className={`overflow-hidden ${isShowcase ? 'h-64' : 'h-48 rounded-3xl mb-8'}`}>
                          <EditableMedia src={item.image} cmsBind={{file: sectionName, index, key: 'image'}} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      )}

                      {isVoordelen && item.icon && (
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 text-accent text-3xl group-hover:bg-accent group-hover:text-white transition-colors duration-500">
                           <i className={`fa-solid fa-${item.icon}`}></i>
                        </div>
                      )}

                      {isProces && item.stap && (
                        <div className="text-6xl font-serif font-black text-accent/20 mb-6 group-hover:text-accent/40 transition-colors">
                          <EditableText value={item.stap} cmsBind={{file: sectionName, index, key: 'stap'}} />
                        </div>
                      )}

                      {/* Content */}
                      <div className={isShowcase ? 'p-10' : ''}>
                        <h3 className="text-2xl font-serif font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                          <EditableText 
                            value={item.title || item.name || item.titel} 
                            cmsBind={{file: sectionName, index, key: item.title ? 'title' : (item.name ? 'name' : 'titel')}} 
                          />
                        </h3>
                        
                        {(item.description || item.skills || item.uitleg || item.content) && (
                          <p className="text-lg text-slate-600 font-light leading-relaxed mb-6">
                            <EditableText 
                              value={item.description || item.skills || item.uitleg || item.content} 
                              cmsBind={{file: sectionName, index, key: item.description ? 'description' : (item.skills ? 'skills' : (item.uitleg ? 'uitleg' : 'content'))}} 
                            />
                          </p>
                        )}

                        {(item.tijdsduur || item.category) && (
                          <div className="text-sm font-bold uppercase tracking-widest text-accent mb-4">
                            <EditableText 
                              value={item.tijdsduur || item.category} 
                              cmsBind={{file: sectionName, index, key: item.tijdsduur ? 'tijdsduur' : 'category'}} 
                            />
                          </div>
                        )}

                        {item.link && (
                          <a href={item.link} className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all mt-auto">
                            Bekijk Project <i className="fa-solid fa-arrow-right"></i>
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

      {/* HIGH-IMPACT CTA / CONTACT SECTION */}
      {data.contact && data.contact.length > 0 && (
        <section key="contact-cta-static" id="contact" data-dock-section="contact" className="py-32 px-6 bg-[var(--color-primary)] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-12 md:p-20 border border-white/10 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="max-w-2xl text-center lg:text-left">
                  <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
                    <EditableText value={data.contact[0].titel} cmsBind={{file: 'contact', index: 0, key: 'titel'}} />
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
