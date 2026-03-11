import React from 'react';
import Header from './components/Header';
import Section from './components/Section';
import { CartProvider, useCart } from './components/CartContext';
import CartOverlay from './components/CartOverlay';

const CartButton = () => {
  const { cartCount, setIsCartOpen } = useCart();
  return (
    <button 
      className="fixed top-8 right-8 z-[500] group"
      onClick={() => setIsCartOpen(true)}
    >
      <div className="relative bg-black text-white p-5 rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-active:scale-95">
        <span className="text-2xl block group-hover:rotate-12 transition-transform duration-300">🛒</span>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-4 border-white animate-bounce">
            {cartCount}
          </span>
        )}
      </div>
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Bekijk Mandje
      </span>
    </button>
  );
};

const AppContent = ({ data }) => {
  if (!data) return <div className="p-10 text-center font-black uppercase tracking-widest">Laden...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white">
      <CartButton />
      <CartOverlay />
      
      <Header data={data} />
      <main>
        <Section data={data} />
      </main>
      <footer className="py-20 text-center border-t border-slate-50 text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em]">
        &copy; {new Date().getFullYear()} — ATHENA PREMIUM E-COMMERCE — ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};

const App = (props) => (
  <CartProvider>
    <AppContent {...props} />
  </CartProvider>
);

export default App;