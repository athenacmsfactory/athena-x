import React from 'react';
import EditableImage from '../shared/shared/components/EditableImage';

/**
 * DynamicPage
 * Rendert een pagina op basis van een rij uit de 'sitemap' tabel.
 * Koppelt automatisch door naar de data in 'pageConfig.data_bron'.
 */
const DynamicPage = ({ pageConfig, fullData }) => {
  const { titel, ondertitel, data_bron, type } = pageConfig;
  
  // Haal de specifieke data op voor deze pagina
  // Bv. als data_bron = 'team', haal fullData['team'] op.
  const pageData = data_bron && fullData[data_bron] ? fullData[data_bron] : [];

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header van de pagina */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4">{titel}</h1>
          {ondertitel && <p className="text-xl text-slate-500 font-light">{ondertitel}</p>}
          <div className="h-1 w-24 bg-blue-600 mx-auto mt-8 rounded-full"></div>
        </header>

        {/* Content Rendering op basis van Type */}
        {pageData.length === 0 ? (
          <div className="text-center p-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">Nog geen gegevens gevonden in tabblad: <strong>{data_bron}</strong></p>
          </div>
        ) : (
          <div className={`grid gap-10 ${type === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {pageData.map((item, index) => {
              // Intelligente veld-detectie
              const titleKey = Object.keys(item).find(k => /naam|titel|kop/i.test(k));
              const descKey = Object.keys(item).find(k => /omschrijving|tekst|bio|uitleg/i.test(k));
              const imgKey = Object.keys(item).find(k => /foto|afbeelding|image/i.test(k));
              const priceKey = Object.keys(item).find(k => /prijs|tarief/i.test(k));

              const imgSrc = item[imgKey] ? (item[imgKey].startsWith('http') ? item[imgKey] : `${import.meta.env.BASE_URL}images/${item[imgKey]}`) : null;

              return (
                <article key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  {imgSrc && (
                    <div className="w-full h-56 mb-6 rounded-2xl overflow-hidden relative bg-slate-50">
                      <EditableImage 
                        src={imgSrc} 
                        alt={item[titleKey]} 
                        className="w-full h-full object-cover"
                        cmsBind={{ file: data_bron, index: item.absoluteIndex, key: imgKey }} 
                      />
                    </div>
                  )}
                  
                  {item[titleKey] && <h3 className="text-2xl font-bold text-slate-900 mb-3">{item[titleKey]}</h3>}
                  {item[priceKey] && <p className="text-blue-600 font-bold mb-3">{item[priceKey]}</p>}
                  {item[descKey] && <p className="text-slate-600 leading-relaxed text-sm">{item[descKey]}</p>}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicPage;
