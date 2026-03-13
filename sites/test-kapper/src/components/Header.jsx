import React, { useState, useEffect } from 'react';

const Header = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const info = data.Basisgegevens?.[0] || {};

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Onze Story', href: '#story' },
    { name: 'Diensten', href: '#diensten' },
    { name: 'Het Team', href: '#team' },
    { name: 'Tarieven', href: '#tarieven' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className={`text-2xl font-serif tracking-widest uppercase transition-colors duration-500 ${
          isScrolled ? 'text-stone-900' : 'text-white'
        }`}>
          Soap <span className="font-light italic">Antwerp</span>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href}
              className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors duration-500 hover:text-stone-400 ${
                isScrolled ? 'text-stone-600' : 'text-white/90'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <a 
          href={info.boekings_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${
            isScrolled 
              ? 'bg-stone-900 text-white hover:bg-stone-700' 
              : 'bg-white text-stone-900 hover:bg-stone-100 shadow-xl'
          }`}
        >
          Afspraak Maken
        </a>
      </div>
    </header>
  );
};

export default Header;
