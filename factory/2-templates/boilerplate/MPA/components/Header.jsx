import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ data, sitemap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const info = data.home_info ? data.home_info[0] : {};
  const links = sitemap || [];

  return (
    <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
          {info.titel || "Athena"} <span className="text-blue-600">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link 
            to="/" 
            className={`text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-500'}`}
          >
            Home
          </Link>
          
          {links.map((link, i) => {
             // Zorg dat pad correct is
             const path = link.pad.startsWith('/') ? link.pad : `/${link.pad}`;
             return (
               <Link 
                 key={i} 
                 to={path} 
                 className={`text-xs font-bold uppercase tracking-widest hover:text-blue-600 transition-colors ${location.pathname === path ? 'text-blue-600' : 'text-slate-500'}`}
               >
                 {link.titel}
               </Link>
             );
          })}
          
          <Link to="/contact" className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all">
            Contact
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl text-slate-900">
          <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-6 shadow-xl absolute w-full">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-slate-600">Home</Link>
          {links.map((link, i) => {
             const path = link.pad.startsWith('/') ? link.pad : `/${link.pad}`;
             return (
               <Link 
                 key={i} 
                 to={path} 
                 onClick={() => setIsOpen(false)}
                 className="text-sm font-bold uppercase tracking-widest text-slate-600"
               >
                 {link.titel}
               </Link>
             );
          })}
          <Link to="/contact" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-blue-600">Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
