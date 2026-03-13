import React, { useState, useEffect } from 'react';

/**
 * Header Component - Real Estate Sitetype
 * Transparent Sticky Navigation
 */
const Header = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const info = data.Agency_Info?.[0] || {};
  const title = info.naam || "Athena Realty";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md shadow-soft py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className={`text-2xl font-black uppercase tracking-tighter transition-colors ${
          isScrolled ? 'text-primary' : 'text-white'
        }`}>
          {title}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {['Aanbod', 'Over Ons', 'Diensten', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className={`text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors ${
                isScrolled ? 'text-secondary' : 'text-white/80'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a 
            href="#contact" 
            className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
              isScrolled 
                ? 'bg-primary text-white hover:bg-accent shadow-lg shadow-primary/20' 
                : 'bg-white text-primary hover:bg-white/90'
            }`}
          >
            Plaats Bod
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;