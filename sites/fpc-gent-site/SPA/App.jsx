import React, { useMemo } from 'react';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import Section from './components/Section';
import Footer from './components/Footer';
import { CartProvider, useCart } from './shared/components/CartContext';
import CartOverlay from './shared/components/CartOverlay';

// Import dock connector to enable editing
import './dock-connector.js';

const CartButton = () => {
  const { cartCount, setIsCartOpen } = useCart();
  if (cartCount === 0) return null;
  
  return (
    <button 
      className="fixed bottom-8 right-8 z-50 bg-accent text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2" 
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
  const settings = processedData.site_settings?.[0] || {};
  
  // Alle andere tabellen renderen als secties (alfabetisch of op blueprint volgorde)
  // EXCLUDE primary table (bedrijfsinformatie) - die wordt getoond in AboutSection
  const otherTables = Object.keys(processedData).filter(key => 
    key !== primaryTableName && 
    !key.startsWith('_') &&
    !['site_settings', 'schema', 'section_order', 'athena_meta'].includes(key) &&
    Array.isArray(processedData[key])
  );

  return (
    <div className="min-h-screen bg-background text-text transition-colors duration-500">
      <Header primaryTable={data[primaryTable]} />
      
      {/* About Section - alleen tonen als bedrijfsinformatie bestaat */}
      <AboutSection data={primaryTable} />
      
      <main className="flex-grow">
        <Section data={processedData} />
      </main>

      <Footer primaryTable={primaryTable} />
    </div>
  );
}

function App(props) {
  return (
    <CartProvider>
      <AppContent {...props} />
    </CartProvider>
  );
}

export default App;