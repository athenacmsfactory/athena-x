import React from 'react';
import Header from './components/Header';
import Section from './components/Section';

/**
 * App component gegenereerd door Athena Standard Engine
 */
const App = ({ data }) => {
  if (!data) return <div className="p-10">Laden...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Header data={data} />
      <main>
        <Section data={data} />
      </main>
      <footer className="p-10 text-center border-t border-slate-100 text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} - Gebouwd met Athena CMS
      </footer>
    </div>
  );
};

export default App; 
