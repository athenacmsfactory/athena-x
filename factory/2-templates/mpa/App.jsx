import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import PageRenderer from './components/PageRenderer';
import Header from './components/Header';
import Footer from './components/Footer';
import Sitemap from './components/Sitemap';

function App() {
  const headerData = {
      title: "FPC Gent", 
      nav: /* @NAV_ITEMS@ */ [
          { label: "Home", href: "#/" },
          { label: "Over ons", href: "#/over-ons" },
          { label: "Behandeling", href: "#/behandelen-en-beveiligen" },
          { label: "Jobs", href: "#/jobs" },
          { label: "Contact", href: "#/contact" },
          { label: "Archief", href: "#/sitemap" }
      ]
  };

  return (
    <Router>
        <div className="min-h-screen flex flex-col bg-white">
            <Header data={headerData} />
            
            <main className="flex-grow pt-28">
                <Routes>
                    {/* @ROUTES@ */}
                    <Route path="*" element={<div className="p-20 text-center text-gray-400 font-bold">404 - Pagina niet gevonden</div>} />
                </Routes>
            </main>

            <Footer />
        </div>
    </Router>
  );
}

export default App;