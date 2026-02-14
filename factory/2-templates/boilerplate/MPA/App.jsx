import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import DesignControls from './shared/components/DesignControls';
import HomePage from './pages/HomePage';
import DynamicPage from './pages/DynamicPage';
import NotFound from './pages/NotFound';

/**
 * App component voor Multi-Page Architecture (MPA)
 * Genereert routes dynamisch op basis van de 'sitemap' tabel.
 */
const App = ({ data }) => {
  if (!data) return <div className="p-10">Laden...</div>;

  // Haal de sitemap op uit de data, of gebruik een lege array als fallback
  const sitemap = data.sitemap || [];
  const settings = data.site_settings?.[0] || {};

  return (
    <div className="min-h-screen transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100 dark:bg-slate-900 flex flex-col">
      <DesignControls settings={settings} />
      <Header data={data} sitemap={sitemap} />
      
      <main className="flex-grow">
        <Routes>
          {/* De Homepage is altijd hardcoded op '/' of gedefinieerd in sitemap */}
          <Route path="/" element={<HomePage data={data} />} />
          
          {/* Dynamische routes genereren */}
          {sitemap.map((page, index) => {
            // Zorg dat het pad altijd begint met een /
            const path = page.pad.startsWith('/') ? page.pad : `/${page.pad}`;
            // Sla de homepage over als die in de sitemap staat (voorkomt dubbele key warning)
            if (path === '/' || path === '') return null;

            return (
              <Route 
                key={index} 
                path={path} 
                element={<DynamicPage pageConfig={page} fullData={data} />} 
              />
            );
          })}

          {/* 404 Pagina */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer data={data} />
    </div>
  );
};

export default App;