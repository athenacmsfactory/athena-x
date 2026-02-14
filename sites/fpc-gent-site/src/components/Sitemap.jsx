import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Sitemap() {
    const [pages, setPages] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch(import.meta.env.BASE_URL + 'data/pages-manifest.json')
            .then(res => res.json())
            .then(data => setPages(data))
            .catch(err => console.error("Manifest error:", err));
    }, []);

    const filteredPages = pages.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.path.toLowerCase().includes(search.toLowerCase())
    );

    // Groepeer per prefix (bijv. 'jobs', 'nieuws')
    const grouped = filteredPages.reduce((acc, page) => {
        const parts = page.path.split('/').filter(Boolean);
        const group = parts.length > 1 ? parts[0] : 'algemeen';
        if (!acc[group]) acc[group] = [];
        acc[group].push(page);
        return acc;
    }, {});

    return (
        <div className="max-w-6xl mx-auto px-6 py-16 animate-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Website Archief</h1>
                <p className="text-xl text-gray-500 max-w-2xl">
                                                Hier vindt u alle {pages.length} pagina's van de fpc-gent website,
                     
                    geautomatiseerd gemigreerd en doorzoekbaar.
                </p>
            </header>

            {/* Zoekbalk */}
            <div className="mb-12 sticky top-4 z-10">
                <input 
                    type="text" 
                    placeholder="Zoek in archief..." 
                    className="w-full p-4 text-lg border-2 border-gray-200 rounded-2xl shadow-xl focus:border-blue-500 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {Object.keys(grouped).sort().map(group => (
                    <section key={group} className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 border-b pb-2 mb-4">
                            {group}
                        </h2>
                        <ul className="space-y-3">
                            {grouped[group].map(page => (
                                <li key={page.path}>
                                    <Link 
                                        to={page.path === '/home' ? '/' : page.path}
                                        className="group block"
                                    >
                                        <span className="text-gray-800 group-hover:text-blue-600 font-medium transition-colors capitalize">
                                            {page.title}
                                        </span>
                                        <span className="block text-[10px] text-gray-400 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {page.path}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            {filteredPages.length === 0 && (
                <div className="text-center py-20 text-gray-400 italic">
                    Geen pagina's gevonden die voldoen aan uw zoekopdracht.
                </div>
            )}
        </div>
    );
}
