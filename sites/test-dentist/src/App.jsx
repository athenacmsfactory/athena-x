import React from 'react';
import Header from './components/Header';
import Section from './components/Section';

/**
 * App component - Dentist Sitetype
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

  const praktijkNaam = data.praktijk_info?.[0]?.naam || "Tandartspraktijk";

  return (
    <div className="min-h-screen bg-background font-sans text-text antialiased">
      <Header data={data} />
      
      <main>
        <Section data={data} />
      </main>

      <footer className="py-20 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-3xl font-bold mb-3">{praktijkNaam}</h3>
            <p className="text-white/60 text-sm max-w-sm italic">Hoogwaardige tandheelkundige zorg voor het hele gezin.</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3">
            <p className="text-white/80 text-sm font-medium">
              &copy; {new Date().getFullYear()} — {praktijkNaam}
            </p>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">
              Powered by Athena Factory
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;