import StyleInjector from './components/StyleInjector';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

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

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-[var(--color-background,white)] text-[var(--color-text,slate-900)]">
      <StyleInjector siteSettings={data['site_settings']} />
          <Navbar data={data.navigation} settings={data.site_settings} />
          <main>
            <Hero data={data.hero?.[0]} />
            <Features data={data.features} />
            <Services data={data.services} />
            <Portfolio data={data.portfolio} />
            <About data={data.about?.[0]} />
            <Contact data={data.contact?.[0]} settings={data.site_settings} />
          </main>
          <Footer data={data} />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
