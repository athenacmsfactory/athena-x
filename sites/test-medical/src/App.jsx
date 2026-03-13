import React from 'react';
import Header from './components/Header';
import Section from './components/Section';

/**
 * App component - Medical Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
const App = ({ data }) => {
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-accent font-serif text-2xl">Laden...</div>
      </div>
    );
  }

  const praktijkNaam = data.Praktijk_Info?.[0]?.naam || "Medisch Centrum";

  return (
    <div className="min-h-screen bg-background font-sans text-text antialiased">
      <Header data={data} />
      
      <main>
        <Section data={data} />
      </main>

      <footer className="py-16 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold mb-2">{praktijkNaam}</h3>
            <p className="text-white/60 text-sm italic">Professionele medische zorg met een persoonlijk karakter.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-white/80 text-sm">
              &copy; {new Date().getFullYear()} - {praktijkNaam}
            </p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest">
              Powered by Athena CMS Factory
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;