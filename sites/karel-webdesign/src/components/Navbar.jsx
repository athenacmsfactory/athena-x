import React from 'react';

const Navbar = ({ data, settings }) => {
  const navLinks = data && data.length > 0 ? data : [
    { label: 'Waarom ik?', href: '#features' },
    { label: 'Diensten', href: '#services' },
    { label: 'Werk', href: '#portfolio' },
    { label: 'Over mij', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const logoText = settings?.logo_text || "Karel Webdesign";

  const handleScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-slate-200 border-opacity-20 md:border-none">
          <div className="flex items-center">
            <a href="#" onClick={(e) => handleScroll(e, '#')} className="text-slate-900 text-lg font-bold">
              {logoText}
            </a>
          </div>
          <div className="hidden ml-10 space-x-8 md:block">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-base font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {link.label || link.name}
              </a>
            ))}
          </div>
        </div>
        <div className="py-4 px-4 flex flex-nowrap overflow-x-auto justify-start space-x-4 md:hidden">
          {navLinks.map((link, idx) => (
            <a 
              key={idx}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-base font-medium text-slate-500 hover:text-slate-900"
            >
              {link.label || link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;