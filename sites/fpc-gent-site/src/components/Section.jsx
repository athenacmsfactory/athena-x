import React from 'react';
import { Link } from 'react-router-dom';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';

export default function Section({ data, pageFile, sectionIndex }) {
    const { type, content: rawContent } = data;
    const content = rawContent || {};

    // Globale pagina data voor style bindings
    const styleBindings = data.style_bindings || {};

    // Helper voor het ophalen van styles per veld
    const getStyles = (key) => {
        const styleKey = `${pageFile}:${sectionIndex}:${key}`;
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

    // Helper voor binding (MPA specifieke paden)
    const bind = (key) => ({
        file: pageFile,
        index: sectionIndex, 
        key: key
    });

    // Helper om te bepalen of een link extern is
    const isExternal = (url) => url && (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:'));

    // Render verschillende secties op basis van type
    switch (type) {
        case 'hero':
            return (
                <section 
                    data-dock-section={`section-${sectionIndex} (hero)`}
                    className="bg-white text-slate-900 py-20 md:py-32 px-6 relative overflow-hidden border-b border-slate-100"
                >
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                        <div className="w-full md:w-1/2 relative z-10">
                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-slate-900">
                                <EditableText value={content.titel} cmsBind={bind('titel')} style={getStyles('titel')} />
                            </h1>
                            <div className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl">
                                {parseContentWithLinks(content.tagline)}
                            </div>
                            {content.cta_text && (
                                <div className="inline-block">
                                    {content.cta_link ? (
                                        isExternal(content.cta_link) ? (
                                            <a href={content.cta_link} target="_blank" rel="noreferrer" className="cursor-pointer">
                                                <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 cursor-pointer">
                                                    <EditableText value={content.cta_text} cmsBind={bind('cta_text')} style={getStyles('cta_text')} />
                                                </button>
                                            </a>
                                        ) : (
                                            <Link to={content.cta_link} className="cursor-pointer">
                                                <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 cursor-pointer">
                                                    <EditableText value={content.cta_text} cmsBind={bind('cta_text')} style={getStyles('cta_text')} />
                                                </button>
                                            </Link>
                                        )
                                    ) : (
                                        <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200">
                                            <EditableText value={content.cta_text} cmsBind={bind('cta_text')} style={getStyles('cta_text')} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="w-full md:w-1/2">
                            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                                <EditableMedia 
                                    src={content.afbeelding} 
                                    cmsBind={bind('afbeelding')} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </div>
                    </div>
                </section>
            );

        case 'features':
            return (
                <section 
                    data-dock-section={`section-${sectionIndex} (cards)`}
                    className="py-24 bg-slate-50 px-6"
                >
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-black text-slate-900 mb-16 text-center tracking-tight">
                            <EditableText value={content.titel} cmsBind={bind('titel')} style={getStyles('titel')} />
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {content.items?.map((item, i) => {
                                const isString = typeof item === 'string';
                                const itemTitle = isString ? item : item.titel;
                                const itemText = isString ? "" : (item.beschrijving || item.tekst);
                                const itemImg = isString ? null : (item.afbeelding || item.image);
                                const itemLink = isString ? null : (item.link || item.url || item.href);
                                
                                const CardWrapper = ({ children, className }) => {
                                    if (!itemLink) return <div className={className}>{children}</div>;
                                    
                                    if (isExternal(itemLink)) {
                                        return (
                                            <a href={itemLink} target="_blank" rel="noreferrer" className={`${className} hover:border-blue-300`}>
                                                {children}
                                            </a>
                                        );
                                    }
                                    
                                    return (
                                        <Link to={itemLink} className={`${className} hover:border-blue-300`}>
                                            {children}
                                        </Link>
                                    );
                                };

                                return (
                                    <CardWrapper key={i} className="bg-white p-2 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all group border border-slate-100 flex flex-col relative">
                                        {itemImg ? (
                                            <div className="aspect-video rounded-[2rem] overflow-hidden mb-6">
                                                <EditableMedia 
                                                    src={itemImg} 
                                                    cmsBind={bind(`items.${i}.${item.afbeelding ? 'afbeelding' : 'image'}`)} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                                />
                                            </div>
                                        ) : (
                                            /* Spacer for text-only cards */
                                            <div className="pt-6"></div>
                                        )}
                                        <div className={`px-6 pb-8 ${itemImg ? 'pt-2' : 'pt-4'}`}>
                                            <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center justify-between">
                                                <EditableText 
                                                    value={itemTitle} 
                                                    cmsBind={bind(isString ? `items.${i}` : `items.${i}.titel`)} 
                                                    style={getStyles(isString ? `items.${i}` : `items.${i}.titel`)} 
                                                />
                                                {itemLink && (
                                                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                                )}
                                            </h3>
                                            {(itemText || !isString) && (
                                                <p className="text-slate-500 leading-relaxed text-sm">
                                                    <EditableText 
                                                        value={itemText} 
                                                        cmsBind={bind(`items.${i}.${item.beschrijving ? 'beschrijving' : 'tekst'}`)} 
                                                        style={getStyles(`items.${i}.${item.beschrijving ? 'beschrijving' : 'tekst'}`)} 
                                                    />
                                                </p>
                                            )}
                                            {itemLink && (
                                                <div className="mt-6 pt-6 border-t border-slate-50 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:text-blue-700 flex items-center gap-2">
                                                    Lees Meer
                                                    <div className="w-4 h-px bg-blue-200 group-hover:w-8 transition-all"></div>
                                                </div>
                                            )}
                                        </div>
                                    </CardWrapper>
                                );
                            })}
                        </div>
                    </div>
                </section>
            );

        case 'contact':
            return (
                <section 
                    data-dock-section={`section-${sectionIndex} (contact)`}
                    className="py-24 bg-slate-900 text-white px-6"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-black mb-12 tracking-tight">
                            <EditableText value={content.titel || 'Contact'} cmsBind={bind('titel')} style={getStyles('titel')} />
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                            <div>
                                <h3 className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-6">Onze Locatie</h3>
                                <p className="text-xl text-slate-300 leading-relaxed font-light">
                                    <EditableText value={content.adres} cmsBind={bind('adres')} style={getStyles('adres')} />
                                </p>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-3">Telefoon</h3>
                                    <p className="text-2xl font-black tracking-tight">
                                        <EditableText value={content.telefoon} cmsBind={bind('telefoon')} style={getStyles('telefoon')} />
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-3">Direct Mail</h3>
                                    <p className="text-xl font-medium underline decoration-blue-500 underline-offset-8">
                                        <EditableText value={content.email} cmsBind={bind('email')} style={getStyles('email')} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );

        case 'text_block':
        default:
            const hasImage = !!content.afbeelding;
            return (
                <section 
                    data-dock-section={`section-${sectionIndex} (text)`}
                    className="py-20 bg-white px-6"
                >
                    <div className={`max-w-7xl mx-auto flex flex-col ${hasImage ? 'md:flex-row' : ''} gap-16 items-center`}>
                        <div className={hasImage ? 'md:w-3/5' : 'max-w-3xl mx-auto w-full'}>
                            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
                                <EditableText value={content.titel} cmsBind={bind('titel')} style={getStyles('titel')} />
                            </h2>
                            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {parseContentWithLinks(content.tekst)}
                            </div>
                        </div>
                        {hasImage && (
                            <div className="md:w-2/5 w-full">
                                <div className="aspect-square rounded-[3rem] overflow-hidden shadow-xl border-8 border-slate-50">
                                    <EditableMedia 
                                        src={content.afbeelding} 
                                        cmsBind={bind('afbeelding')} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            );
    }
}

function parseContentWithLinks(text) {
    if (!text || typeof text !== 'string') return text;
    
    const parts = [];
    const regex = /\[LINK:\s*(.*?)\]\s*(.*?)\s*\[\/LINK\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        
        const url = match[1];
        const linkText = match[2];
        parts.push(
            <a 
                key={match.index} 
                href={url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4 font-bold"
            >
                {linkText}
            </a>
        );
        
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
}