import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Section from './components/Section';
import Footer from './components/Footer';
import { CartProvider } from './components/CartContext';
import CartOverlay from './components/CartOverlay';

/**
 * AppContent Component - Store Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
const AppContent = ({ data }) => {
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-accent font-black uppercase tracking-widest text-xl">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-accent/20 selection:text-primary antialiased">
      <CartOverlay />
      <Header data={data} />
      
      <main>
        <Hero data={data} />
        <Section data={data} />
      </main>

      <Footer data={data} />
    </div>
  );
};

const App = (props) => (
  <CartProvider>
    <AppContent {...props} />
  </CartProvider>
);

export default App;