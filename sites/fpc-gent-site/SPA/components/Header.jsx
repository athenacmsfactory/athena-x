import React from 'react';

function Header({ primaryTable }) {
  const info = primaryTable?.[0] || {};
  
  // Zoek velden - prioriteer bedrijfsnaam en slogan
  const title = info.bedrijfsnaam || info.naam_bedrijf || info['{{PRIMARY_FIELD_NAME}}'] || info.naam || info.titel || Object.values(info)[1] || 'Welkom';
  const tagline = info.slogan || info.tagline || info.ondertitel || info.subtitle || '';
  const imageField = Object.keys(info).find(key => key.toLowerCase().includes('logo') || key.toLowerCase().includes('banner') || key.toLowerCase().includes('header') || key.toLowerCase().includes('afbeelding'));
  
  let imgSrc = null;
  if (imageField && info[imageField]) {
    imgSrc = info[imageField].startsWith('http') ? info[imageField] : `${import.meta.env.BASE_URL}images/${info[imageField]}`;
  }

  // Bindings helper
  const bind = (key) => JSON.stringify({ file: '{{PRIMARY_TABLE_NAME}}', index: 0, key });

  return (
    <header className="relative min-h-[60vh] flex items-center justify-center text-center px-6 overflow-hidden bg-primary text-white">
      {/* Background Image Overlay if available */}
      {imgSrc && (
        <div className="absolute inset-0 opacity-40">
           <img 
             src={imgSrc} 
             alt={title} 
             className="w-full h-full object-cover"
             data-dock-bind={bind(imageField)}
           />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto reveal">
        <h1 
          className="text-5xl md:text-7xl lg:text-8xl mb-6 font-bold" 
          data-dock-bind={bind(info['{{PRIMARY_FIELD_NAME}}'] ? '{{PRIMARY_FIELD_NAME}}' : Object.keys(info)[0])}
        >
          {title}
        </h1>
        {tagline && (
          <p 
            className="text-xl md:text-2xl font-light text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            data-dock-bind={bind(Object.keys(info).find(k => k.toLowerCase().includes('tagline') || k.toLowerCase().includes('slogan') || k.toLowerCase().includes('ondertitel')) || 'slogan')}
          >
            {tagline}
          </p>
        )}
        <div className="flex gap-4 justify-center">
           <a href="#aanbod" className="btn-primary">Ontdek Meer</a>
        </div>
      </div>

      {/* Modern Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-20 fill-background">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.96C25.54,60.05,72.59,70.97,121.39,70.97c48.8,0,105.51-12.21,135.51-24.54l64.49,10Z"></path>
        </svg>
      </div>
    </header>
  );
}

export default Header;