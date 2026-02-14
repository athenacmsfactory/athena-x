import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ data }) {
    const { title, nav, logo: rawLogo } = data || {};
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Path resolution voor logo
    const baseUrl = import.meta.env.BASE_URL || '/';
    const logo = (rawLogo && rawLogo !== "" && !rawLogo.startsWith('http') && !rawLogo.startsWith('/') && !rawLogo.startsWith('data:'))
        ? `${baseUrl}${rawLogo}`.replace(/\/+/g, '/')
        : (rawLogo || null);

    // Scroll effect voor een 'floating' header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sluit mobiel menu bij navigatie
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
            isScrolled 
            ? 'py-3 bg-white/90 backdrop-blur-md shadow-lg shadow-slate-200/50 border-b border-slate-100' 
            : 'py-6 bg-white border-b border-slate-100'
        }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-10">
                    {/* LOGO & TITLE */}
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            {logo ? (
                                <img src={logo} alt={title} className="h-10 w-auto object-contain transition-transform group-hover:scale-110" />
                            ) : (
                                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
                                    {(title || 'A').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">{title || 'fpc-gent'}</span>
                        </div>
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-1">
                        {nav && nav.map((item, idx) => {
                            const isActive = location.hash === item.href;
                            return (
                                <a 
                                    key={idx} 
                                    href={item.href}
                                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                                        isActive 
                                        ? 'bg-blue-50 text-blue-600' 
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                    </nav>

                    {/* MOBILE TOGGLE */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-slate-50 rounded-xl text-slate-600"
                    >
                        <span className={`w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-5 h-0.5 bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-300">
                    <div className="p-6 flex flex-col gap-2">
                        {nav && nav.map((item, idx) => (
                            <a 
                                key={idx} 
                                href={item.href}
                                className="px-6 py-4 text-lg font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors flex items-center justify-between"
                            >
                                {item.label}
                                <i className="fa-solid fa-chevron-right text-slate-200"></i>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}