import StyleInjector from './components/StyleInjector';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartOverlay from './components/CartOverlay';
import SectionToolbar from './components/SectionToolbar';

import { DisplayConfigProvider, useDisplayConfig } from './components/DisplayConfigContext';

const AppContent = ({ data }) => {
  const { isSectionVisible } = useDisplayConfig();
  const profile = data['profile']?.[0] || {};
  const projects = data['projects'] || [];
  const services = data['services'] || [];
  const testimonials = data['testimonials'] || [];
  const socials = data['socials'] || [];
  const sectionOrder = data.section_order || [];

  const componentMap = {
    profile: () => <Hero profile={profile} />,
    projects: () => <Projects projects={projects} />,
    services: () => <Services services={services} />,
    testimonials: () => <Testimonials testimonials={testimonials} />
  };

  return (
    <div className="bg-[#050505] dark:bg-[#050505] text-white min-h-screen">
      <StyleInjector siteSettings={data['site_settings']} />
      <Header siteSettings={data.site_settings} />
      <CartOverlay />
      
      <main>
        {sectionOrder.map((sectionName) => {
          if (!isSectionVisible(sectionName)) return null;

          const Component = componentMap[sectionName];
          if (!Component) return null;
          
          return (
            <div key={sectionName} className="relative group" data-dock-section={sectionName}>
              {import.meta.env.DEV && <SectionToolbar tableName={sectionName} sectionTitle={sectionName} />}
              <Component />
            </div>
          );
        })}
      </main>

      <Footer data={data} />
    </div>
  );
};

const App = ({ data }) => {
  // Theme handling (Standard Athena pattern)
  React.useEffect(() => {
    if (!data.site_settings) return;
    const settings = Array.isArray(data.site_settings) ? (data.site_settings[0] || {}) : (data.site_settings || {});
    const root = document.documentElement;
    
    if (settings.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');

    const mappings = {
        primary_color: '--color-primary',
        secondary_color: '--color-secondary',
        accent_color: '--color-accent',
        bg_color: '--color-background',
        text_color: '--color-text'
    };

    Object.keys(settings).forEach(key => {
        const varName = mappings[key];
        if (varName && settings[key]) {
            root.style.setProperty(varName, settings[key]);
        }
    });
  }, [data.site_settings]);

  if (!data) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-[0.5em]">Loading Athena...</div>;

  return (
    <DisplayConfigProvider data={data}>
      <CartProvider>
        <Router>
          <AppContent data={data} />
        </Router>
      </CartProvider>
    </DisplayConfigProvider>
  );
};

export default App;
