import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [logo, setLogo] = useState(null);

    // Haal logo op uit home.json
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const base = import.meta.env.BASE_URL || '/';
                const res = await fetch(`${base}data/pages/home.json`.replace(/\/+/g, '/'));
                if (res.ok) {
                    const data = await res.json();
                    if (data.meta?.logo) setLogo(data.meta.logo);
                }
            } catch (e) {}
        };
        loadLogo();
    }, []);
    
    return (
        <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            {logo ? (
                                <img src={logo} alt="FPC Gent" className="h-10 w-auto object-contain" />
                            ) : (
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">F</div>
                            )}
                            <span className="text-xl font-black tracking-tight">FPC Gent</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Kwaliteitsvolle forensische psychiatrische zorg in een veilige en humane omgeving. 
                            Gericht op herstel en re-integratie.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-6 text-slate-200">Snel naar</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link to="/over-ons" className="hover:text-blue-400 transition-colors">Over ons</Link></li>
                            <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Werken bij</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold mb-6 text-slate-200">Informatie</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/sitemap" className="hover:text-blue-400 transition-colors">Archief</Link></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Disclaimer</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Instellingen</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-6 text-slate-200">Contact</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-center gap-3">
                                <i className="fa-solid fa-phone text-blue-500 w-4"></i>
                                <span>+32 (0)9 325 21 00</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fa-solid fa-envelope text-blue-500 w-4"></i>
                                <span className="truncate">info@fpcgent.be</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="fa-solid fa-location-dot text-blue-500 w-4 mt-1"></i>
                                <span>Beukenlaan 20,<br />9051 Gent, België</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">
                        © {currentYear} FPC Gent — Built with <span className="text-blue-500">Athena Factory MPA Engine</span>
                    </p>
                    <div className="flex gap-4">
                        <a href="https://www.linkedin.com/company/fpc-antwerpen-gent/" target="_blank" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                            <i className="fa-brands fa-linkedin-in text-xs"></i>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                            <i className="fa-brands fa-twitter text-xs"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
