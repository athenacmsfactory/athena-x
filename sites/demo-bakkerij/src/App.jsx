import StyleInjector from './components/StyleInjector';
import React, { useMemo } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import CartOverlay from './components/CartOverlay';
import { CartProvider } from './components/CartContext';

const Layout = ({ data, children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
      <StyleInjector siteSettings={data['site_settings']} />
      <Header primaryTable={data.basisgegevens} siteSettings={data['site_settings']} />
      <main className="pt-20">{children}</main>
      <Footer primaryTable={data.basisgegevens} />
      <CartOverlay />
    </div>
  );
};

const App = ({ data }) => {
  // Pas globale thema instellingen toe
  /* Old Design Engine Removed */

  return (
    <CartProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout data={data}><Section data={data} /></Layout>} />
          <Route path="/checkout" element={<Layout data={data}><Checkout /></Layout>} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;