import React, { useMemo } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';

const App = ({ data }) => {
  const primaryTable = Object.keys(data)[0];
  
  // Docked sites gebruiken CSS variabelen die door de Dock worden aangestuurd.
  // We hoeven hier geen interne state voor kleuren bij te houden.
  
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
      <Header primaryTable={data[primaryTable]} tableName={primaryTable} siteSettings={data['site_settings']} />
      
      <main>
        <Section data={data} />
      </main>

      <Footer primaryTable={data[primaryTable]} />
    </div>
  );
};

export default App;
