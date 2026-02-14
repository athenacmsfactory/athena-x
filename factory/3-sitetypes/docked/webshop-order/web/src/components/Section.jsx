import React, { useState } from 'react';
import EditableMedia from './EditableMedia';
import EditableText from './EditableText';
import RepeaterControls from './RepeaterControls';
import MetadataConfigModal from './MetadataConfigModal';
import { useCart } from './CartContext';

const Section = ({ data }) => {
  const isDev = import.meta.env.DEV;
  const { addToCart } = useCart();
  const [activeConfigTable, setActiveConfigTable] = useState(null);
  // Robust layout reading (handle both array and object)
  const layouts = Array.isArray(data.layout_settings) ? (data.layout_settings[0] || {}) : (data.layout_settings || {});
  
  // Load style bindings if they exist
  const styleBindings = data.style_bindings || {};

  const sectionConfigs = [
    { table: "basis", title: "basis", subtitle: "Overzicht van basis", defaultLayout: "grid" },
    { table: "categorieen", title: "categorieen", subtitle: "Overzicht van categorieen", defaultLayout: "grid" },
    { table: "producten", title: "producten", subtitle: "Onze Producten", defaultLayout: "grid" },
    { table: "product_specificaties", title: "product specificaties", subtitle: "Overzicht van product specificaties", defaultLayout: "grid" },
    { table: "klantbeoordelingen", title: "klantbeoordelingen", subtitle: "Overzicht van klantbeoordelingen", defaultLayout: "list" },
    { table: "sterke_punten", title: "sterke punten", subtitle: "Overzicht van sterke punten", defaultLayout: "grid" }
  ];

  // Helper voor actuele layout per sectie
  const getLayout = (tableName, defaultStyle) => {
    return layouts[tableName] || layouts[tableName.toLowerCase()] || defaultStyle || 'grid';
  };

  // Helper voor het ophalen van styles per veld
  const getStyles = (file, index, key) => {
    const styleKey = `${file}:${index}:${key}`;
    const f = styleBindings[styleKey];
    if (!f) return {};
    
    return {
      fontWeight: f.bold ? 'bold' : 'normal',
      fontStyle: f.italic ? 'italic' : 'normal',
      fontSize: f.fontSize,
      textAlign: f.textAlign,
      fontFamily: f.fontFamily === 'inherit' ? '' : f.fontFamily
    };
  };

  // Helper voor veilige API calls zonder slash-problemen
  const getApiUrl = (path) => {
    const base = import.meta.env.BASE_URL || '/';
    return (base + '/' + path).replace(new RegExp('/+', 'g'), '/');
  };

  const addItem = async (file) => {
    try {
      const res = await fetch(getApiUrl('__athena/update-json'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: file.toLowerCase(), action: 'add' })
      });
      if ((await res.json()).success) {
          window.parent.postMessage({ type: 'DOCK_TRIGGER_REFRESH' }, '*');
      }
    } catch (err) { console.error(err); }
  };

  const updateLayout = async (table, style) => {
    try {
      await fetch(getApiUrl('__athena/update-json'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: 'layout_settings', index: 0, key: table, value: style })
      });
      window.parent.postMessage({ type: 'DOCK_TRIGGER_REFRESH' }, '*');
    } catch (err) { console.error(err); }
  };

  const moveSection = async (table, direction) => {
    try {
      const currentOrder = sectionConfigs.map(c => c.table.toLowerCase());
      await fetch(getApiUrl('__athena/update-json'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'reorder-sections',
            key: table,
            direction,
            value: currentOrder
        })
      });
      window.parent.postMessage({ type: 'DOCK_TRIGGER_REFRESH' }, '*');
    } catch (err) { console.error(err); }
  };

  const savedOrder = data.section_order || [];
  const sortedConfigs = [...sectionConfigs].sort((a, b) => {
    const idxA = savedOrder.indexOf(a.table.toLowerCase());
    const idxB = savedOrder.indexOf(b.table.toLowerCase());
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="flex flex-col">
      {sortedConfigs.map((config, idx) => {
        const realKey = Object.keys(data).find(k => k.toLowerCase() === config.table.toLowerCase());
        let items = data[realKey] || [];
        if (items.length === 0 && !isDev) return null;

        const currentLayout = getLayout(config.table, config.defaultLayout);
        const visibleItems = isDev ? items : items.filter(item => !item._hidden);
        if (visibleItems.length === 0 && !isDev) return null;

        // Sectie-specifieke instellingen ophalen (voor titel/ondertitel)
        const sectionMeta = (data.section_settings || []).find(s => s.id === config.table.toLowerCase()) || {};
        const sectionTitle = sectionMeta.title || config.title;
        const sectionSubtitle = sectionMeta.subtitle || config.subtitle;
        const metaIndex = (data.section_settings || []).findIndex(s => s.id === config.table.toLowerCase());
        
        // Display config voor metadata velden
        const displayConfig = (data.display_config?.sections || {})[config.table.toLowerCase()] || { visible_fields: [], hidden_fields: [] };

        const metaBind = (key) => metaIndex !== -1 
            ? { file: 'section_settings', index: metaIndex, key } 
            : null;

        const bgClass = idx % 2 === 1 ? 'bg-black/5 dark:bg-white/5' : 'bg-transparent';

        return (
          <section 
            key={idx} 
            id={config.table.toLowerCase()} 
            data-dock-section={config.table.toLowerCase()}
            className={'py-32 px-6 ' + bgClass + ' relative transition-colors duration-500'}
          >
            <div className="max-w-7xl mx-auto">
              
              <header className="mb-24 text-center max-w-3xl mx-auto group/header relative">
                {isDev && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-full shadow-xl border border-slate-100 dark:border-slate-700 z-[100] opacity-0 group-hover/header:opacity-100 transition-all">
                        <div className="flex border-r border-slate-100 dark:border-slate-700 pr-2 mr-2 gap-1">
                            <button onClick={() => moveSection(config.table, 'up')} className="px-2 py-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all">
                                <i className="fa-solid fa-arrow-up text-[10px]"></i>
                            </button>
                            <button onClick={() => moveSection(config.table, 'down')} className="px-2 py-1.5 rounded-full text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all">
                                <i className="fa-solid fa-arrow-down text-[10px]"></i>
                            </button>
                        </div>
                        <div className="flex border-r border-slate-100 dark:border-slate-700 pr-2 mr-2 gap-1">
                            {['grid', 'z-pattern', 'list', 'focus'].map(style => (
                                <button key={style} onClick={() => updateLayout(config.table, style)} className={'px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ' + (currentLayout === style ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50')}>
                                    {style.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => setActiveConfigTable(config.table.toLowerCase())}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-400 hover:bg-slate-50 hover:text-accent transition-all"
                            title="Metadata velden configureren"
                        >
                            <i className="fa-solid fa-gear mr-1"></i> VELDEN
                        </button>
                    </div>
                )}
                <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-[var(--color-heading)] text-center">
                    <EditableText 
                        value={sectionTitle} 
                        cmsBind={metaBind('title')} 
                        table="section_settings"
                        field="title"
                        id={metaIndex}
                        style={getStyles('section_settings', metaIndex, 'title')}
                    />
                </h2>
                <div className="h-1.5 w-12 mx-auto mb-8 bg-accent"></div>
                <div className="text-xl italic font-light opacity-60 text-text text-center">
                    <EditableText 
                        value={sectionSubtitle} 
                        cmsBind={metaBind('subtitle')} 
                        table="section_settings"
                        field="subtitle"
                        id={metaIndex}
                        style={getStyles('section_settings', metaIndex, 'subtitle')}
                    />
                </div>
              </header>

              <div className={
                (currentLayout === 'grid' ? "flex flex-wrap justify-center gap-x-12 gap-y-24" : "") +
                (currentLayout === 'list' ? "max-w-4xl mx-auto flex flex-col gap-24" : "") +
                (currentLayout === 'z-pattern' ? "flex flex-col gap-32" : "") +
                (currentLayout === 'focus' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16" : "")
              }>
                {visibleItems.map((item, index) => {
                  const isHidden = item._hidden;
                  const itemClass = 'relative group transition-all duration-500 ' + (isHidden ? 'opacity-30 grayscale blur-[1px]' : '');
                  
                  const keys = Object.keys(item);

                  // 1. Haal configuratie op
                  const configFields = displayConfig.visible_fields || [];
                  const hiddenFields = displayConfig.hidden_fields || [];

                  // 2. Bepaal kandidaten voor hoofdvelden
                  let candidateTitle = keys.find(k => /naam|titel|header|kop/i.test(k)) || keys[0];
                  let candidateDesc = keys.find(k => /beschrijving|omschrijving|tekst|bio/i.test(k)) || keys[1];
                  let candidateImg = keys.find(k => /foto|afbeelding|img|image/i.test(k) && !k.includes('buiten')) || 'afbeelding';
                  let candidatePrice = keys.find(k => /prijs|kosten|tarief/i.test(k));

                  // 3. Pas visibility regels toe op hoofdvelden (Huidige Fix)
                  const titleKey = hiddenFields.includes(candidateTitle) ? null : candidateTitle;
                  const descKey = hiddenFields.includes(candidateDesc) ? null : candidateDesc;
                  const imgKey = hiddenFields.includes(candidateImg) ? null : candidateImg;
                  const priceKey = (candidatePrice && !hiddenFields.includes(candidatePrice)) ? candidatePrice : null;

                  // 4. Bepaal extra velden (metadata)
                  const technicalFields = ['absoluteIndex', '_hidden', 'id', 'pk', 'uuid', 'naam', 'product_naam', 'bedrijfsnaam', 'titel', 'kaas_naam', 'naam_hond', 'beschrijving', 'omschrijving', 'korte_bio', 'info', 'inhoud_bericht', 'prijs', 'kosten', 'categorie', 'type', 'specialisatie'];
                  
                  const metaFields = keys.filter(k => {
                      // a. Als het een hoofdveld is dat we tonen, sla over voor meta
                      if (k === titleKey || k === descKey || k === imgKey || k === priceKey) return false;
                      
                      // b. Als het expliciet verborgen is, sla over
                      if (hiddenFields.includes(k)) return false;

                      // c. Als er een whitelist is (visible_fields), moet het erin staan
                      if (configFields.length > 0) {
                          return configFields.includes(k);
                      }

                      // d. Anders: standaard filter (geen technische velden of afbeeldingen)
                      if (technicalFields.some(tf => k.toLowerCase().includes(tf))) return false;
                      if (k.toLowerCase().includes('foto') || k.toLowerCase().includes('image')) return false;
                      
                      return true; 
                  });

                  const renderMetadata = () => (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start">
                        {metaFields.map(mk => (
                            <EditableText 
                                key={mk}
                                value={String(item[mk])} 
                                cmsBind={{ file: config.table.toLowerCase(), index, key: mk }} 
                                className="text-sm opacity-70"
                                style={getStyles(config.table.toLowerCase(), index, mk)}
                            />
                        ))}
                    </div>
                  );

                  // Binding object voor de Dock
                  const bind = (key) => JSON.stringify({ file: config.table.toLowerCase(), index, key });

                  // Afhandeling voor product-tabel met Buy Button
                  if (config.table === 'producten') {
                    const priceValue = parseFloat(String(item[priceKey]).replace(/[^\d.,]/g, '').replace(',', '.'));
                    
                    return (
                        <article key={index} className={itemClass + ' w-full md:w-[calc(45%)] lg:w-[calc(30%)] min-w-[300px] flex flex-col h-full bg-surface p-6 rounded-[2.5rem] shadow-lg border border-slate-100 dark:border-white/5'}>
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                                {imgKey ? (
                                    <EditableMedia src={item[imgKey]} alt={item[titleKey]} className="w-full h-full object-cover" dataItem={item} cmsBind={{ file: config.table.toLowerCase(), index, key: imgKey }} data-dock-bind={bind(imgKey)} />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">Geen Beeld</div>
                                )}
                                <div className="absolute top-4 right-4 bg-accent text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg">
                                    €{priceValue.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex-grow">
                                {titleKey && <EditableText tagName="h3" value={item[titleKey]} className="text-xl font-bold mb-2 block text-[var(--color-heading)]" cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} data-dock-bind={bind(titleKey)} style={getStyles(config.table.toLowerCase(), index, titleKey)} />}
                                {descKey && <EditableText tagName="p" value={item[descKey]} className="text-sm opacity-60 line-clamp-2 mb-4" cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} data-dock-bind={bind(descKey)} style={getStyles(config.table.toLowerCase(), index, descKey)} />}
                            </div>
                            <button 
                                onClick={() => addToCart({ id: item.id || index, title: item[titleKey], price: priceValue, image: item[imgKey] })}
                                className="w-full py-4 mt-4 bg-accent text-white rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20"
                            >
                                <i className="fa-solid fa-cart-shopping mr-2"></i> In winkelwagen
                            </button>
                        </article>
                    );
                  }

                  if (priceKey) {
                    return (
                      <div key={index} className={itemClass + " w-full max-w-2xl mx-auto"}>
                        <div className="flex justify-between items-end">
                          <div className="flex-1">
                            {titleKey && <EditableText tagName="span" value={item[titleKey]} className="text-lg font-medium block text-text" cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} data-dock-bind={bind(titleKey)} style={getStyles(config.table.toLowerCase(), index, titleKey)} />}
                            {descKey && <EditableText tagName="span" value={item[descKey]} className="text-sm opacity-60 block mt-1 text-text" cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} data-dock-bind={bind(descKey)} style={getStyles(config.table.toLowerCase(), index, descKey)} />}
                            {renderMetadata()}
                            <div className="border-b border-dotted border-slate-300 dark:border-white/20 flex-1 mx-4 relative top-[-5px]"></div>
                          </div>
                          <EditableText tagName="span" value={item[priceKey]} className="font-serif font-bold text-lg text-text" cmsBind={{ file: config.table.toLowerCase(), index, key: priceKey }} data-dock-bind={bind(priceKey)} style={getStyles(config.table.toLowerCase(), index, priceKey)} />
                        </div>
                      </div>
                    );
                  }

                  if (currentLayout === 'z-pattern') {
                    const isEven = index % 2 === 0;
                    return (
                      <article key={index} className={itemClass + ' flex flex-col ' + (isEven ? 'md:flex-row' : 'md:flex-row-reverse') + ' items-center gap-16 md:gap-24'}>
                        <div className="w-full md:w-1/2 aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                           {imgKey ? (
                             <EditableMedia src={item[imgKey]} dataItem={item} cmsBind={{ file: config.table.toLowerCase(), index, key: imgKey }} data-dock-bind={bind(imgKey)} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">Geen Afbeelding</div>
                           )}
                        </div>
                        <div className="w-full md:w-1/2 text-center md:text-left">
                           {titleKey && <EditableText tagName="h3" value={item[titleKey]} className="text-4xl font-serif font-bold mb-6 block text-[var(--color-heading)]" cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} data-dock-bind={bind(titleKey)} style={getStyles(config.table.toLowerCase(), index, titleKey)} />}
                           {descKey && <EditableText tagName="p" value={item[descKey]} className="text-xl leading-relaxed font-light block opacity-70 text-text" cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} data-dock-bind={bind(descKey)} style={getStyles(config.table.toLowerCase(), index, descKey)} />}
                           {renderMetadata()}
                        </div>
                      </article>
                    );
                  }

                  if (currentLayout === 'list') {
                    return (
                      <article key={index} className={itemClass + ' flex flex-col md:flex-row items-start gap-12 border-b border-slate-100 dark:border-white/5 pb-24 last:border-0'}>
                        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                           {imgKey ? (
                             <EditableMedia src={item[imgKey]} dataItem={item} cmsBind={{ file: config.table.toLowerCase(), index, key: imgKey }} data-dock-bind={bind(imgKey)} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">Geen Foto</div>
                           )}
                        </div>
                        <div>
                           {titleKey && <EditableText tagName="h3" value={item[titleKey]} className="text-3xl font-serif font-bold mb-4 block text-[var(--color-heading)]" cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} data-dock-bind={bind(titleKey)} style={getStyles(config.table.toLowerCase(), index, titleKey)} />}
                           {descKey && <EditableText tagName="p" value={item[descKey]} className="text-lg leading-relaxed font-light block opacity-70 text-text" cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} data-dock-bind={bind(descKey)} style={getStyles(config.table.toLowerCase(), index, descKey)} />}
                           {renderMetadata()}
                        </div>
                      </article>
                    );
                  }

                  return (
                    <article key={index} className={itemClass + ' ' + (currentLayout === 'focus' && index === 0 ? 'md:col-span-3' : 'w-full md:w-[calc(45%)] lg:w-[calc(30%)] min-w-[300px]')}>
                      <div className={'relative overflow-hidden mb-10 ' + (currentLayout === 'focus' && index === 0 ? 'aspect-video rounded-[4rem]' : 'aspect-square rounded-[3rem]') + ' shadow-2xl'}>
                        {imgKey ? (
                          <EditableMedia src={item[imgKey]} alt={item[titleKey]} className="w-full h-full object-cover" dataItem={item} cmsBind={{ file: config.table.toLowerCase(), index, key: imgKey }} data-dock-bind={bind(imgKey)} />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">Geen Afbeelding</div>
                        )}
                      </div>
                       {titleKey && <EditableText tagName="h3" value={item[titleKey]} className={(currentLayout === 'focus' && index === 0 ? 'text-4xl' : 'text-2xl') + ' font-serif font-bold mb-4 block text-[var(--color-heading)]'} cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} data-dock-bind={bind(titleKey)} style={getStyles(config.table.toLowerCase(), index, titleKey)} />}
                       {descKey && <EditableText tagName="p" value={item[descKey]} className={'leading-relaxed font-light block opacity-70 text-text ' + (currentLayout === 'focus' && index === 0 ? 'text-xl' : 'line-clamp-4')} cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} data-dock-bind={bind(descKey)} style={getStyles(config.table.toLowerCase(), index, descKey)} />}
                       {renderMetadata()}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {activeConfigTable && (
          <MetadataConfigModal 
            isOpen={true}
            onClose={() => setActiveConfigTable(null)}
            tableName={activeConfigTable}
            sampleItem={data[activeConfigTable]?.[0] || {}}
            currentConfig={(data.display_config?.sections || {})[activeConfigTable] || { visible_fields: [], hidden_fields: [] }}
          />
      )}
    </div>
  );
};

export default Section;

      {activeConfigTable && (
          <MetadataConfigModal 
            isOpen={true}
            onClose={() => setActiveConfigTable(null)}
            tableName={activeConfigTable}
            sampleItem={data[activeConfigTable]?.[0] || {}}
            currentConfig={(data.display_config?.sections || {})[activeConfigTable] || { visible_fields: [], hidden_fields: [] }}
          />
      )}
    </div>
  );
};

export default Section;
