import React from 'react';
import EditableImage from './EditableImage';

const Section = ({ data }) => {
  const sections = [{"table":"Menu"},{"table":"Team"},{"table":"Contact"}];

  return (
    <>
      {sections.map((sec, idx) => {
        const items = data[sec.table] || [];
        if (items.length === 0) return null;

        return (
          <section key={idx} id={sec.table.toLowerCase()} className="py-32 px-6 bg-background">
            <div className="max-w-5xl mx-auto">
              <header className="mb-20 text-center reveal">
                <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4">{sec.table}</h2>
                <div className="h-1.5 w-24 bg-accent mx-auto rounded-full"></div>
              </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {items.filter(item => Object.keys(item).some(k => k !== 'absoluteIndex' && !k.startsWith('_'))).map((item, index) => {
                  const titleKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => k.toLowerCase().includes('naam') || k.toLowerCase().includes('gerecht'));
                  const priceKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => k.toLowerCase().includes('prijs'));
                  const descKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => k.toLowerCase().includes('beschrijving'));
                  const imgKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => k.toLowerCase().includes('foto') || k.toLowerCase().includes('afbeelding'));

                  const title = titleKey ? item[titleKey] : ("Item " + (index + 1));
                  const price = priceKey ? item[priceKey] : "";
                  const desc = descKey ? item[descKey] : "";

                  const rawImg = imgKey ? item[imgKey] : null;
                  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

                  return (
                    <article key={index} className="reveal group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 flex flex-col">
                      <div className="relative h-72 overflow-hidden bg-slate-100">
                        {imgSrc ? (
                          <EditableImage 
                            src={imgSrc} 
                            alt={title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            cmsBind={{ file: sec.table, index: item.absoluteIndex, key: imgKey }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-sm">Geen afbeelding</div>
                        )}
                        {price && (
                          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-xl">
                            <span className="font-black text-xl text-primary">{price}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-10 flex flex-col flex-grow text-center">
                        <h3 className="text-3xl font-bold font-serif mb-4 group-hover:text-accent transition-colors">{title}</h3>
                        <p className="text-secondary text-lg opacity-70 leading-relaxed italic line-clamp-3">{desc}</p>
                        
                        <div className="mt-8 pt-8 border-t border-slate-50">
                           <button className="text-accent font-bold uppercase tracking-widest text-xs hover:tracking-[0.2em] transition-all">Ontdek meer</button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
};

export default Section;