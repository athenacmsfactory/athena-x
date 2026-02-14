import React, { useState, useEffect } from 'react';
import { useCart } from './CartContext';
import EditableText from './EditableText';

const Section = ({ title, data, tableName }) => {
  const { addToCart } = useCart();
  const [currentLayout, setCurrentLayout] = useState('grid');
  
  useEffect(() => {
    // Load layout preference - still needed for rendering correct layout
    fetch(`${import.meta.env.BASE_URL}layout_settings.json`)
      .then(res => res.json())
      .then(settings => setCurrentLayout(settings[tableName] || 'grid'))
      .catch(() => setCurrentLayout('grid'));
  }, [tableName]);
  
  if (!data || data.length === 0) return null;

  // Render logic based on layout (Simplified)
  const gridClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    list: 'flex flex-col gap-6',
    'z-pattern': 'flex flex-col gap-12',
    focus: 'flex flex-col gap-24'
  };

  const bind = (index, key) => JSON.stringify({ file: tableName, index, key });

  return (
    <section 
      id={title.toLowerCase()} 
      className="py-20 px-6" 
      data-dock-section={tableName}
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center reveal relative">
          <h2 className="text-4xl md:text-5xl mb-4 capitalize">{title.replace(/_/g, ' ')}</h2>
          <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
        </header>

        <div className={gridClasses[currentLayout] || gridClasses.grid}>
          {data.map((item, index) => {
            // Mapping known fields
            const name = item.naam || item.product_naam || item.bedrijfsnaam || item.titel || Object.values(item)[1] || 'Naamloos';
            const description = item.beschrijving || item.omschrijving || item.korte_bio || item.info || '';
            const rawPrice = item.prijs || item.kosten;
            const category = item.categorie || item.type || item.specialisatie;
            const imageField = Object.keys(item).find(key => key.toLowerCase().includes('afbeelding') || key.toLowerCase().includes('foto') || key.toLowerCase().includes('image'));
            
            const nameField = Object.keys(item).find(k => (item[k] === name) && k !== 'absoluteIndex') || 'naam';
            const descField = Object.keys(item).find(k => (item[k] === description) && k !== 'absoluteIndex') || 'beschrijving';

            const price = typeof rawPrice === 'string' 
              ? parseFloat(rawPrice.replace('€', '').replace(',', '.')) 
              : parseFloat(rawPrice);

            let imgSrc = "placeholder.jpg";
            if (imageField && item[imageField]) {
              imgSrc = item[imageField].startsWith('http') ? item[imageField] : `${import.meta.env.BASE_URL}images/${item[imageField]}`;
            }

            const absoluteIndex = item.absoluteIndex !== undefined ? item.absoluteIndex : index;

            return (
              <article 
                key={absoluteIndex} 
                className={`card group reveal flex ${currentLayout === 'list' ? 'flex-row items-center gap-6' : 'flex-col'} h-full`}
              >
                <div className={`relative ${currentLayout === 'list' ? 'w-48 h-32' : 'h-64'} mb-6 overflow-hidden rounded-2xl shrink-0`}>
                  <img 
                    src={imgSrc} 
                    alt={name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    data-dock-bind={bind(absoluteIndex, imageField)}
                  />
                  {category && <span className="absolute top-4 left-4 badge bg-white/90 backdrop-blur-md text-slate-800 border-none shadow-sm">{category}</span>}
                </div>

                <div className="flex flex-col flex-grow">
                  <EditableText
                    tag="h3"
                    className="text-2xl mb-2 group-hover:text-accent transition-colors font-bold"
                    table={tableName}
                    id={absoluteIndex}
                    field={nameField}
                  >
                    {name}
                  </EditableText>
                  
                  {description && (
                    <EditableText
                      tag="p"
                      className="text-secondary line-clamp-3 mb-4 text-sm"
                      table={tableName}
                      id={absoluteIndex}
                      field={descField}
                    >
                      {description}
                    </EditableText>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    {price > 0 ? (
                      <span className="text-xl font-black text-slate-900">
                        €{price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    
                    {price > 0 && (
                      <button 
                        className="btn-primary py-2 px-6 text-xs uppercase tracking-widest font-bold"
                        onClick={() => addToCart({ id: `${tableName}-${absoluteIndex}`, name, price })}
                      >
                        Bestellen
                      </button>
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
};

export default Section;