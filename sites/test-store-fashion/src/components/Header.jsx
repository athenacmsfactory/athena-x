import React from 'react';
import { useCart } from './CartContext';

/**
 * Header Component - Store Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
const Header = ({ data }) => {
  const info = data.Winkel_Instellingen?.[0] || {};
  const title = info.winkelnaam || "Athena Store";
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
           <a href="#" className="text-2xl font-black tracking-tighter uppercase italic text-primary">
            {title}
           </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#producten" className="text-sm font-bold uppercase tracking-widest text-secondary hover:text-accent transition-colors">Producten</a>
          <a href="#categorieën" className="text-sm font-bold uppercase tracking-widest text-secondary hover:text-accent transition-colors">Collecties</a>
          <a href="#over-ons" className="text-sm font-bold uppercase tracking-widest text-secondary hover:text-accent transition-colors">Over Ons</a>
        </div>

        {/* Cart Trigger */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative group p-2 transition-all active:scale-95"
          aria-label="Open winkelwagen"
        >
          <div className="w-10 h-10 rounded-full bg-surface border border-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-in zoom-in duration-300">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Header;