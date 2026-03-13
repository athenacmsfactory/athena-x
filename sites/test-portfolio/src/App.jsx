import React from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

/**
 * App component gegenereerd door Athena Standard Engine
 */
const App = ({ data }) => {
  if (!data) return <div className="p-10 text-center">Laden...</div>;

  // Robuuste data mapping voor de componenten
  const profile = data.Profiel?.[0] || data.Profile?.[0] || data.Portfolio_Info?.[0] || {};
  const socials = data.Socials || data.Socialen || [];
  
  // Voeg absoluteIndex toe aan items als het ontbreekt (voor de Editor)
  const prepareData = (list) => {
    if (!list || !Array.isArray(list)) return [];
    return list.map((item, idx) => ({
      ...item,
      absoluteIndex: item.absoluteIndex !== undefined ? item.absoluteIndex : idx
    }));
  };

  const enrichedData = {
    ...data,
    Profiel: prepareData(data.Profiel || data.Profile || data.Portfolio_Info),
    Projecten: prepareData(data.Projecten || data.Projects),
    Diensten: prepareData(data.Diensten || data.Services),
    Testimonials: prepareData(data.Testimonials || data.Reviews)
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-accent selection:text-white">
      <Hero data={enrichedData} />
      <main>
        <Projects data={enrichedData} />
        <Services data={enrichedData} />
        <Testimonials data={enrichedData} />
      </main>
      <Footer profile={profile} socials={socials} />
    </div>
  );
};

export default App;
