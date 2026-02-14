import React, { useState, useEffect } from 'react';
import Section from './Section'; 
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';

export default function PageRenderer({ file }) {
    const [data, setData] = useState(null);
    const [styles, setStyles] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Laden van data en styles
    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);
            try {
                const base = import.meta.env.BASE_URL;
                
                // Fetch pagina data with cache busting
                const pageRes = await fetch(`${base}data/pages/${file}?v=${Date.now()}`.replace(/\/+/g, '/'));
                if (!pageRes.ok) throw new Error("Pagina data niet gevonden");
                const pageData = await pageRes.json();
                
                // Fetch globale styles (indien aanwezig)
                try {
                    const styleRes = await fetch(base + 'src/data/style_bindings.json?t=' + Date.now());
                    if (styleRes.ok) {
                        const styleData = await styleRes.json();
                        setStyles(styleData);
                    }
                } catch (e) { /* Geen styles gevonden */ }

                setData(pageData);
                setLoading(false);
            } catch (err) {
                console.warn("Loading error:", err);
                setError(err);
                setLoading(false);
            }
        };

        loadPage();
    }, [file]);

    // 2. Notify Dock nadat data is geladen en gerenderd
    useEffect(() => {
        if (!loading && data && window.athenaScan) {
            console.log(`[PageRenderer] Data geladen voor ${file}. Secties gevonden:`, data.content?.sections?.length || 0);
            
            // MPA TRANSLATION LAYER VOOR DOCK SIDEBAR
            // De Dock verwacht een plat object waar keys tabelnamen zijn en waarden arrays
            const sections = data.content?.sections || [];
            
            try {
                const dockData = { 
                    ...data, 
                    style_bindings: styles,
                    // We voegen elke sectie toe als een 'tabel' zodat de Dock zijbalk ze ziet
                    ...sections.reduce((acc, sec, idx) => {
                        const tableName = `section-${idx}`;
                        // Veiligheid: zorg dat we niet crashen op ontbrekende content
                        const content = sec?.content || {};
                        acc[tableName] = content.items || [content];
                        return acc;
                    }, {})
                };

                // Voor archief pagina's
                if (sections.length === 0) {
                    dockData["archief-inhoud"] = [{
                        title: data.meta?.title,
                        raw_text: data.content?.raw_text
                    }];
                }

                const timer = setTimeout(() => {
                    window.athenaScan(dockData);
                }, 150);
                return () => clearTimeout(timer);
            } catch (dockErr) {
                console.error("[PageRenderer] Fout bij voorbereiden Dock data:", dockErr);
            }
        }
    }, [loading, data, file, styles]);

    if (loading) return <div className="p-10 text-center text-xl animate-pulse">Laden...</div>;
    
    if (error || !data) {
        return (
            <div className="p-10 text-center text-gray-500">
                <h1 className="text-2xl font-bold mb-2">Nog niet beschikbaar</h1>
                <p>De inhoud voor deze pagina ("{file}") is nog niet gestructureerd door de AI.</p>
                <p className="text-sm mt-4 text-gray-400">Draai parse-mpa-pages.js voor dit bestand.</p>
            </div>
        );
    }

    const sections = data.content?.sections || [];
    const images = data.meta?.images || [];
    const pageName = file.replace('.json', '');
    
    // Filter logo's eruit voor algemeen gebruik
    const contentImages = images.filter(img => 
        !img.toLowerCase().includes('logo') && 
        !img.toLowerCase().includes('share') &&
        !img.toLowerCase().includes('banner')
    );
    
    // Fallback pool: als we geen "schone" content images hebben, gebruik dan alle images behalve logo's
    const imagePool = contentImages.length > 0 ? contentImages : images.filter(img => !img.toLowerCase().includes('logo'));
    
    const bannerImage = imagePool.length > 0 ? imagePool[0] : (images.length > 0 ? images[0] : null);

    // Artikel view (indien niet gestructureerd)
    if (sections.length === 0) {
         return (
            <article 
                data-dock-section="archief-inhoud"
                className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-700"
            >
                <header className="mb-8 border-b pb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 capitalize">
                        <EditableText 
                            value={data.meta?.title || "Informatie"} 
                            cmsBind={{ file: pageName, key: 'meta.title' }} 
                        />
                    </h1>
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span>Archief</span>
                        <span>•</span>
                        <a href={data.meta?.url} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">
                            Bekijk origineel
                        </a>
                    </div>
                </header>
                
                {bannerImage && (
                    <div className="mb-8 rounded-2xl overflow-hidden shadow-xl bg-gray-100 aspect-video text-center flex items-center justify-center">
                        <EditableMedia 
                            src={bannerImage} 
                            cmsBind={{ file: pageName, key: 'meta.images.0' }} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                )}
                
                <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                    <EditableText 
                        value={data.content?.raw_text || "Geen inhoud beschikbaar."} 
                        cmsBind={{ file: pageName, key: 'content.raw_text' }}
                        renderValue={(val) => parseContentWithLinks(val)}
                    />
                </div>
            </article>
        );
    }

    // Sectie view (indien gestructureerd)
    let imgIdx = 0;

    return (
        <main className="animate-in fade-in duration-500">
            {sections.map((section, idx) => {
                try {
                    const sectionContent = { ...(section?.content || {}) };
                    
                    // Assign afbeelding if missing (Only if we haven't used all unique images yet)
                    if (!sectionContent.afbeelding && !sectionContent.image && imgIdx < imagePool.length) {
                        sectionContent.afbeelding = imagePool[imgIdx];
                        imgIdx++;
                    }

                    // Special case for hero: if we still have no image, take the first one from the pool anyway (even if reused)
                    if (section.type?.toLowerCase() === 'hero' && !sectionContent.afbeelding && !sectionContent.image && imagePool.length > 0) {
                        sectionContent.afbeelding = imagePool[0];
                    }

                    // Assign afbeelding for items if missing
                    const isFeaturesType = ['features', 'list', 'cards', 'highlights'].includes(section.type?.toLowerCase());
                    if (isFeaturesType && Array.isArray(sectionContent.items)) {
                        sectionContent.items = sectionContent.items.map(item => {
                            const wasString = typeof item === 'string';
                            // Convert string to object so it can hold an image (if added manually later)
                            let itemObj = wasString ? { titel: item } : { ...item };
                            
                            // ONLY assign from pool if it was ALREADY an object (implying intent for structure)
                            // AND we still have UNIQUE images left in the pool
                            if (!wasString && !itemObj.afbeelding && !itemObj.image && imgIdx < imagePool.length) {
                                itemObj.afbeelding = imagePool[imgIdx];
                                imgIdx++;
                            }
                            return itemObj;
                        });
                    }

                    return (
                        <Section 
                            key={idx} 
                            pageFile={pageName}
                            sectionIndex={idx}
                            data={{
                                id: `section-${idx}`,
                                type: mapSectionType(section.type),
                                settings: {},
                                content: sectionContent,
                                style_bindings: styles
                            }} 
                        />
                    );
                } catch (secErr) {
                    console.error(`[PageRenderer] Fout bij renderen van sectie ${idx}:`, secErr);
                    return <div key={idx} className="p-4 bg-red-50 text-red-500 text-xs">Fout bij renderen sectie {idx}</div>;
                }
            })}
        </main>
    );
}

function mapSectionType(aiType) {
    if (!aiType) return 'text_block';
    
    const type = aiType.toLowerCase();
    switch(type) {
        case 'hero': return 'hero';
        case 'features': 
        case 'list': 
        case 'cards':
        case 'highlights':
            return 'features';
        case 'contact_info': 
        case 'contact': 
        case 'locatie':
            return 'contact';
        case 'text':
        case 'text_block':
        case 'content':
        case 'about':
            return 'text_block';
        default: return 'text_block';
    }
}

function parseContentWithLinks(text) {
    if (!text || typeof text !== 'string') return text || "";
    
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