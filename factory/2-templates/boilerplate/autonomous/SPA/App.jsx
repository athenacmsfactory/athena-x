import React, { useMemo } from 'react';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import Section from './components/Section';
import Footer from './components/Footer';
import { CartProvider, useCart } from './shared/components/CartContext';
import { StyleProvider } from './shared/components/StyleContext';
import CartOverlay from './shared/components/CartOverlay';
import DesignControls from './shared/components/DesignControls';

const CartButton = () => {
  const { cartCount, setIsCartOpen } = useCart();
  if (cartCount === 0) return null;
  
  return (
    <button 
      className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2" 
      onClick={() => setIsCartOpen(true)}
    >
      <span className="text-xl">🛒</span>
      <span className="font-bold">{cartCount}</span>
    </button>
  );
};

function AppContent({ data = {} }) {
  // Memoize de data verwerking voor performance
  const processedData = useMemo(() => {
    const result = {};
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        result[key] = data[key].map((item, index) => ({
          ...item,
          absoluteIndex: index // Gebruik de index van de bron-array voor CMS binding
        }));
      } else {
        result[key] = data[key];
      }
    });
    return result;
  }, [data]);

  const primaryTableName = '{{PRIMARY_TABLE_NAME}}';
  const primaryTable = processedData[primaryTableName] || [];
  const settings = (processedData.site_settings || processedData.Site_settings)?.[0] || {};
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <Header data={primaryTable} />
      
      <main className="flex-grow">
        <AboutSection data={primaryTable} />
        <Section data={processedData} />
      </main>

        <Footer data={data} />

      {/* Alleen in development tonen we de controls */}
      {import.meta.env.DEV && (
          <>
            <DesignControls settings={settings} />
            <CartButton />
            <CartOverlay />
          </>
      )}
    </div>
  );
}

function App({ data = {} }) {
  // Haal stijlen op uit de ingeladen data
  const initialStyles = data.style_bindings || data.Style_bindings || {};

  return (
    <StyleProvider initialStyles={initialStyles}>
      <CartProvider>
        <AppContent data={data} />
      </CartProvider>
    </StyleProvider>
  );
}

export default App;