import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ContentBlock from './components/ContentBlock';
import Features from './components/Features';
import Footer from './components/Footer';

function App({ data }) {
  const instellingen = data.Instellingen ? data.Instellingen[0] : {};
  const content = data.Content || [];
  const kenmerken = data.Kenmerken || [];

  const heroBlock = content.find(b => b.blok_type === 'Hero');
  const otherBlocks = content.filter(b => b.blok_type !== 'Hero');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      <Header instellingen={instellingen} />
      
      <main>
        <Hero block={heroBlock} instellingen={instellingen} index={content.indexOf(heroBlock)} />
        
        {/* Render sequence: Hero -> Content Blocks (except CTA) -> Features -> CTA */}
        {otherBlocks.filter(b => b.blok_type !== 'CTA').map((block, i) => (
          <ContentBlock key={i} block={block} index={content.indexOf(block)} />
        ))}
        
        <Features kenmerken={kenmerken} />
        
        {otherBlocks.filter(b => b.blok_type === 'CTA').map((block, i) => (
          <ContentBlock key={i} block={block} index={content.indexOf(block)} />
        ))}
      </main>

      <Footer instellingen={instellingen} />
    </div>
  );
}

export default App;
