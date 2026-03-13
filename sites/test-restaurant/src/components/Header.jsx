import React from 'react';
import EditableImage from './EditableImage';

const Header = ({ data = {} }) => {
  // Debug log om te zien wat er binnenkomt
  console.log("Athena Header Data Keys:", Object.keys(data));

  // Zoek naar een tabel die 'restaurant_info' bevat en NIET leeg is
  const infoKey = Object.keys(data).find(k => 
    k.toLowerCase().includes('restaurant_info') && 
    Array.isArray(data[k]) && 
    data[k].length > 0
  );
  
  const infoTable = data[infoKey] || [];
  const info = infoTable[0] || {};
  
  console.log("Found Info Table Key:", infoKey);
  console.log("Info Content:", info);
  
  const title = info?.naam || "Bistro Le Goût";
  const tagline = info?.beschrijving || info?.slogan || "Authentieke Franse keuken";
  
  // Zoek zeer breed naar een foto-veld
  const allFields = Object.keys(info || {});
  const imageField = allFields.find(key => /foto|afbeelding|image|banner|header/i.test(key));
  
  const rawImg = info?.[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  console.log("Athena Header Image Source:", imgSrc);

  return (
    <header className="relative min-h-[90vh] flex items-center justify-center text-center px-6 overflow-hidden bg-slate-950 text-white">
      {/* Background Image with Lighter Overlay */}
      <div className="absolute inset-0 z-0">
        <EditableImage
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover opacity-90 scale-105 animate-in fade-in zoom-in duration-[3s]"
          cmsBind={{ file: 'restaurant_info', index: 0, key: imageField || 'foto' }}
          key={imgSrc}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-950/60 pointer-events-none"></div>
      </div>

      <div className="relative z-10 max-w-4xl reveal">
        <h1 className="text-7xl md:text-9xl font-serif font-black mb-6 tracking-tight leading-none text-white [text-shadow:_0_4px_20px_rgb(0_0_0_/_80%),_0_2px_4px_rgb(0_0_0_/_90%)]">
          {title}
        </h1>
        <p className="text-2xl md:text-3xl font-light text-white mb-12 max-w-2xl mx-auto italic [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]">
          {tagline}
        </p>
        <div className="flex justify-center gap-6">
          <a href="#menu" className="btn-primary px-12 py-4 text-xl shadow-2xl shadow-accent/20">Bekijk het Menu</a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-24 fill-background">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.96C25.54,60.05,72.59,70.97,121.39,70.97c48.8,0,105.51-12.21,135.51-24.54l64.49,10Z"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;