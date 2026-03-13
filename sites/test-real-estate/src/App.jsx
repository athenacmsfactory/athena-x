import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PropertyList from './components/PropertyList';
import Section from './components/Section';

/**
 * App component - Real Estate Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
const App = ({ data }) => {
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-accent font-black uppercase tracking-widest text-xl">Laden...</div>
      </div>
    );
  }

  const agencyName = data.Agency_Info?.[0]?.naam || "Athena Realty";

  return (
    <div className="min-h-screen bg-background font-sans text-text antialiased selection:bg-accent/20 selection:text-primary">
      <Header data={data} />
      
      <main>
        <Hero data={data} />
        <PropertyList data={data} />
        <Section data={data} />
      </main>

      <footer className="py-24 bg-primary text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-4">{agencyName}</h3>
            <p className="text-white/60 text-sm max-w-sm italic leading-relaxed">
              Uw partner in exclusief vastgoed. Wij bieden een persoonlijke benadering en jarenlange expertise in de regio.
            </p>
          </div>

          <div className="text-center md:text-left flex flex-col gap-4">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Contact</h4>
             <p className="text-white/80 font-medium">Blijf op de hoogte van ons nieuwste aanbod.</p>
             <div className="flex gap-4 justify-center md:justify-start">
               <span className="text-xl opacity-40">📱</span>
               <span className="text-xl opacity-40">✉️</span>
               <span className="text-xl opacity-40">📍</span>
             </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end justify-center md:justify-start gap-4">
            <p className="text-white/80 text-sm font-bold">
              &copy; {new Date().getFullYear()} — {agencyName}
            </p>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-black">
              Digital Experience by Athena
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;