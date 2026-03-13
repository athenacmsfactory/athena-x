import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import ServiceMenu from './components/ServiceMenu';
import Team from './components/Team';
import Footer from './components/Footer';

/**
 * Soap Antwerp - Luxe Kapperswebsite
 * Gebouwd met Athena CMS Factory
 */
const App = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 text-stone-400 font-serif italic">
        Gegevens worden geladen...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-stone-200 selection:text-stone-900">
      <Header data={data} />
      
      <main>
        <Hero data={data} />
        <Story data={data} />
        <ServiceMenu data={data} />
        <Team data={data} />
      </main>

      <Footer data={data} />
    </div>
  );
};

export default App;
