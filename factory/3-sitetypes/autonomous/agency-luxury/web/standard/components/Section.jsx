import React from 'react';
import EditableMedia from './EditableMedia';
import EditableText from './EditableText';
import RepeaterControls from './RepeaterControls';

/**
 * Section Component - Nu met GEBALANCEERDE (gecentreerde) Layouts
 */
const Section = ({ data }) => {
  const isDev = import.meta.env.DEV;
  const layouts = data.layout_settings?.[0] || {};
  const infoTable = Object.keys(data).find(k => k.toLowerCase().endsWith('_info')) || 'info';

  const sectionConfigs = [
    { table: "cases", title: "Portfolio", subtitle: "Onze meest recente projecten en successen" },
    { table: "pakketten", title: "Tarieven", subtitle: "Transparante prijzen voor onze diensten en producten" },
    { table: "team", title: "Ons Team", subtitle: "Gedreven professionals met passie voor hun vak" },
    { table: "reviews", title: "Klant Ervaringen", subtitle: "Wat onze cliënten over onze service vertellen" },
    { table: infoTable, title: "Over Ons", subtitle: "Uw partner voor kwaliteit en betrouwbaarheid" }
  ];

  const addItem = async (file) => {
    try {
      const res = await fetch((import.meta.env.BASE_URL + '__athena/update-json').replace(/\\/g, '/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: file.toLowerCase(), action: 'add' })
      });
      if ((await res.json()).success) window.location.reload();
    } catch (err) { console.error(err); }
  };

  const updateLayout = async (table, style) => {
    try {
      await fetch((import.meta.env.BASE_URL + '__athena/update-json').replace(/\\/g, '/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: 'layout_settings', index: 0, key: table, value: style })
      });
      window.location.reload();
    } catch (err) { console.error(err); }
  };

  const moveSection = async (table, direction) => {
    try {
      const currentOrder = sectionConfigs.map(c => c.table.toLowerCase());
      await fetch((import.meta.env.BASE_URL + '__athena/update-json').replace(/\\/g, '/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            action: 'reorder-sections', 
            key: table, 
            direction,
            value: currentOrder // Fallback if no order file exists yet
        })
      });
      window.location.reload();
    } catch (err) { console.error(err); }
  };

  // Sorteer sections op basis van opgeslagen volgorde
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

        const currentLayout = layouts[config.table] || 'grid';
        const isTarieven = config.table === 'pakketten';
        const isTeam = config.table === 'team';
        const isReview = config.table === 'reviews';
        const isInfo = config.table === infoTable;

        const visibleItems = isDev ? items : items.filter(item => !item._hidden);
        if (visibleItems.length === 0 && !isDev) return null;

        const bgClass = idx % 2 === 1 ? 'bg-black/5 dark:bg-white/5' : 'bg-transparent';

        return (
          <section key={idx} id={config.table.toLowerCase()} className={`py-32 px-6 ${bgClass} relative transition-colors duration-500`}>
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
                        {['grid', 'z-pattern', 'list', 'focus'].map(style => (
                            <button key={style} onClick={() => updateLayout(config.table, style)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${currentLayout === style ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                                {style.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
                <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8" style={{ color: 'var(--primary-color)' }}>
                    {config.title}
                </h2>
                <div className="h-1.5 w-12 mx-auto mb-8" style={{ backgroundColor: 'var(--accent-color)' }}></div>
                <p className="text-xl italic font-light opacity-60" style={{ color: 'var(--text-color)' }}>{config.subtitle}</p>
              </header>

              {/* DYNAMISCHE CONTAINER - Nu met Flex-Centering voor Grid */}
              <div className={`
                ${isTarieven ? "max-w-4xl mx-auto flex flex-col gap-12" : ""}
                ${!isTarieven && currentLayout === 'grid' ? "flex flex-wrap justify-center gap-x-12 gap-y-24" : ""}
                ${!isTarieven && currentLayout === 'list' ? "max-w-4xl mx-auto flex flex-col gap-24" : ""}
                ${!isTarieven && currentLayout === 'z-pattern' ? "flex flex-col gap-32" : ""}
                ${!isTarieven && currentLayout === 'focus' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16" : ""}
              `}>
                {visibleItems.map((item, index) => {
                  const isHidden = item._hidden;
                  const itemClass = `relative group transition-all duration-500 ${isHidden ? 'opacity-30 grayscale blur-[1px]' : ''}`;
                  
                  const titleKey = Object.keys(item).find(k => /naam|titel/i.test(k));
                  const descKey = Object.keys(item).find(k => /beschrijving|omschrijving|bio/i.test(k));
                  let imgKey = isInfo ? 'foto_binnen' : (config.table === 'cases' ? (Object.keys(item).find(k => /foto_resultaat|resultaat|afbeelding/i.test(k)) || 'foto_resultaat') : Object.keys(item).find(k => /foto|afbeelding/i.test(k) && k !== 'foto_buiten'));

                  if (isTarieven) {
                    return (
                      <div key={index} className={itemClass}>
                        <RepeaterControls file={config.table} index={index} isHidden={isHidden} />
                        <div className="flex justify-between items-end">
                          <div className="flex-1">
                            <EditableText tagName="span" value={item.pakket_naam} className="text-lg font-medium block" style={{ color: 'var(--text-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: 'pakket_naam' }} />
                            <div className="border-b border-dotted border-slate-300 dark:border-white/20 flex-1 mx-4 relative top-[-5px]"></div>
                          </div>
                          <EditableText tagName="span" value={item.prijs} className="font-serif font-bold text-lg" style={{ color: 'var(--text-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: 'prijs' }} />
                        </div>
                      </div>
                    );
                  }

                  if (isReview) {
                    return (
                      <article key={index} className={`p-12 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-slate-100 dark:border-white/10 shadow-2xl rounded-[3rem] ${itemClass} w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] max-w-md`}>
                        <RepeaterControls file={config.table} index={index} isHidden={isHidden} />
                        <EditableText tagName="p" value={item.ervaring || item.tekst} className="text-lg italic leading-relaxed mb-10 block opacity-80" style={{ color: 'var(--text-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: item.ervaring ? 'ervaring' : 'tekst' }} />
                        <div className="flex items-center gap-4 pt-8 border-t border-slate-50 dark:border-white/5">
                           <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">{(item.naam || "K").charAt(0)}</div>
                           <EditableText tagName="h4" value={item.naam} className="font-bold" style={{ color: 'var(--text-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: 'naam' }} />
                        </div>
                      </article>
                    );
                  }

                  if (currentLayout === 'z-pattern') {
                    const isEven = index % 2 === 0;
                    return (
                      <article key={index} className={`${itemClass} flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}>
                        <RepeaterControls file={config.table} index={index} isHidden={isHidden} />
                        <div className="w-full md:w-1/2 aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
                           <EditableMedia src={item[imgKey]} dataItem={item} cmsBind={{ file: config.table.toLowerCase(), index, key: imgKey }} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-full md:w-1/2 text-center md:text-left">
                           <EditableText tagName="h3" value={item[titleKey]} className="text-4xl font-serif font-bold mb-6 block" style={{ color: 'var(--primary-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} />
                           <EditableText tagName="p" value={item[descKey]} className="text-xl leading-relaxed font-light block opacity-70" style={{ color: 'var(--text-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} />
                        </div>
                      </article>
                    );
                  }

                  if (currentLayout === 'list') {
                    return (
                      <article key={index} className={`${itemClass} flex flex-col md:flex-row items-start gap-12 border-b border-slate-100 dark:border-white/5 pb-24 last:border-0`}>
                        <RepeaterControls file={config.table} index={index} isHidden={isHidden} />
                        <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                           <EditableMedia src={item[imgKey]} dataItem={item} cmsBind={{ file: config.table.toLowerCase(), index, key: imgKey }} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <EditableText tagName="h3" value={item[titleKey]} className="text-3xl font-serif font-bold mb-4 block" style={{ color: 'var(--primary-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} />
                           <EditableText tagName="p" value={item[descKey]} className="text-lg leading-relaxed font-light block opacity-70" style={{ color: 'var(--text-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} />
                        </div>
                      </article>
                    );
                  }

                  // GRID / FOCUS (Nu gecentreerd en gebalanceerd)
                  return (
                    <article key={index} className={`${itemClass} ${currentLayout === 'focus' && index === 0 ? 'md:col-span-3' : 'w-full md:w-[calc(45%)] lg:w-[calc(30%)] min-w-[300px]'}`}>
                      <RepeaterControls file={config.table} index={index} isHidden={isHidden} />
                      <div className={`relative overflow-hidden mb-10 ${isTeam ? 'aspect-[4/5] rounded-[4rem]' : (currentLayout === 'focus' && index === 0 ? 'aspect-video rounded-[4rem]' : 'aspect-square rounded-[3rem]')} shadow-2xl`}>
                        <EditableMedia src={item[imgKey]} alt={item[titleKey]} className="w-full h-full object-cover" dataItem={item} cmsBind={{ file: config.table.toLowerCase(), index, key: imgKey }} />
                      </div>
                       <EditableText tagName="h3" value={item[titleKey]} className={`${currentLayout === 'focus' && index === 0 ? 'text-4xl' : 'text-2xl'} font-serif font-bold mb-4 block`} style={{ color: 'var(--primary-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: titleKey }} />
                       <EditableText tagName="p" value={item[descKey]} className={`leading-relaxed font-light block opacity-70 ${currentLayout === 'focus' && index === 0 ? 'text-xl' : 'line-clamp-4'}`} style={{ color: 'var(--text-color)' }} cmsBind={{ file: config.table.toLowerCase(), index, key: descKey }} />
                    </article>
                  );
                })}

                {/* ADD BUTTON */}
                {isDev && (
                  <button onClick={() => addItem(config.table)} className={`flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-slate-300 hover:border-blue-400 hover:text-blue-500 transition-all min-h-[300px] ${currentLayout === 'grid' ? 'w-full md:w-[calc(45%)] lg:w-[calc(30%)] min-w-[300px]' : 'w-full'}`}>
                    <i className="fa-solid fa-plus text-2xl mb-4"></i>
                    <span className="font-bold uppercase tracking-widest text-xs text-center">Item Toevoegen</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Section;