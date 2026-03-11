import React, { useMemo } from 'react';
import Header from './components/Header';
import Section from './components/Section';
import Footer from './components/Footer';
import StyleInjector from './components/StyleInjector';

const App = ({ data }) => {
  const primaryTable = data['basisgegevens'] || [];
  
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-500">
      <StyleInjector hero={data['hero']} headerSettings={data['header_settings']} />
      
      <Header 
        primaryTable={primaryTable} 
        tableName="basisgegevens" 
        hero={data['hero']} 
        headerSettings={data['header_settings']}
        navData={data['paginastructuur']}
      />
      
      <main>
        <Section data={data} />
      </main>

      <Footer 
        primaryTable={primaryTable} 
        socialData={data['social_media']}
      />
    </div>
  );
};

export default App;
