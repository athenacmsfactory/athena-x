import React from 'react';
import EditableImage from './EditableImage';

const Header = ({ data }) => {
  const info = data.Portfolio_Info?.[0] || {};
  const title = info.naam || "Portfolio";
  const subtitle = info.specialisatie || info.tagline || "";
  
  const imageField = Object.keys(info).find(key => key.toLowerCase().includes('portret') || key.toLowerCase().includes('profielfoto') || key.toLowerCase().includes('header'));
  const rawImg = info[imageField];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <header className="relative min-h-screen flex items-center justify-center px-6 bg-primary text-white overflow-hidden">
      {imgSrc && (
        <div className="absolute inset-0 opacity-40">
           <EditableImage src={imgSrc} alt={title} className="w-full h-full object-cover" cmsBind={{ file: 'Portfolio_Info', index: 0, key: imageField }} />
        </div>
      )}
      <div className="relative z-10 max-w-4xl text-center reveal">
        <h1 className="text-7xl md:text-9xl font-serif font-black mb-6 tracking-tighter">{title}</h1>
        <p className="text-2xl md:text-3xl font-light text-slate-300 mb-12 tracking-wide uppercase">{subtitle}</p>
        <a href="#projecten" className="btn-primary px-12 py-4">Bekijk Werk</a>
      </div>
    </header>
  );
};

export default Header;