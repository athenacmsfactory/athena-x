import React from 'react';
import EditableImage from '../shared/components/EditableImage';

const HomePage = ({ data }) => {
  const homeData = data.home_info ? data.home_info[0] : {};
  const heroImage = homeData.foto_hero || 'hero-placeholder.jpg';
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0 opacity-60">
           {homeData.foto_hero ? (
             <EditableImage 
               src={homeData.foto_hero.startsWith('http') ? homeData.foto_hero : `${import.meta.env.BASE_URL}images/${homeData.foto_hero}`}
               alt="Hero"
               className="w-full h-full object-cover"
               cmsBind={{ file: 'home_info', index: 0, key: 'foto_hero' }}
             />
           ) : (
             <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900"></div>
           )}
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            {homeData.titel || "Welkom bij Athena"}
          </h1>
          <p className="text-xl md:text-2xl font-light opacity-90 mb-10 max-w-2xl mx-auto">
            {homeData.ondertitel || "Multi-Page Architecture (MPA) Ready"}
          </p>
          {homeData.knop_tekst && (
            <a href={homeData.knop_link || "/contact"} className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold uppercase tracking-widest hover:bg-blue-50 transition-all">
              {homeData.knop_tekst}
            </a>
          )}
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
           <h2 className="text-3xl font-bold mb-6">Een solide basis voor groei.</h2>
           <p className="text-slate-600 leading-loose">
             Dit is de startpagina van uw Multi-Page website. Via de sitemap in uw Google Sheet worden automatisch nieuwe pagina's toegevoegd aan het menu.
           </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
