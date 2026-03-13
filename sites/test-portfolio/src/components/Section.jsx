import React from 'react';
import EditableImage from './EditableImage';

const Section = ({ data }) => {
  const sections = [{"table":"Projecten"},{"table":"Diensten"},{"table":"Ervaring"}];

  return (
    <>
      {sections.map((sec, idx) => {
        const items = data[sec.table] || [];
        if (items.length === 0) return null;

        return (
          <section key={idx} id={sec.table.toLowerCase()} className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
              <header className="mb-20 reveal">
                <h2 className="text-5xl font-serif font-bold mb-4">{sec.table}</h2>
                <div className="h-1 w-24 bg-accent"></div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {items.filter(item => Object.keys(item).some(k => k !== 'absoluteIndex' && !k.startsWith('_'))).map((item, index) => {
                  const titleKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => k.toLowerCase().includes('titel') || k.toLowerCase().includes('naam'));
                  const imgKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => k.toLowerCase().includes('foto') || k.toLowerCase().includes('afbeelding') || k.toLowerCase().includes('image'));
                  const descKey = Object.keys(item).filter(k => k !== 'absoluteIndex').find(k => k.toLowerCase().includes('beschrijving') || k.toLowerCase().includes('uitleg'));

                  const rawImg = item[imgKey];
                  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : '/placeholder.jpg';

                  return (
                    <article key={index} className="reveal group" style={{ transitionDelay: `${index * 150}ms` }}>
                      <div className="relative aspect-video mb-8 overflow-hidden rounded-3xl shadow-2xl">
                        <EditableImage 
                          src={imgSrc} 
                          alt={item[titleKey]} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                          cmsBind={{ file: sec.table, index: item.absoluteIndex, key: imgKey }}
                        />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">{item[titleKey]}</h3>
                      <p className="text-secondary text-lg leading-relaxed opacity-80">{item[descKey]}</p>
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