import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline'; 

const Header = ({ title, subtitle, imageUrl, heroAction }) => {
  const handleScroll = (e) => {
    e.preventDefault();
    const targetId = heroAction.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Utility to generate a placeholder image URL based on a prompt (using dummy logic)
  const getPlaceholderImage = (prompt) => {
    const keywords = prompt.split(', ')[0].replace(/ /g, '-').toLowerCase();
    // Using a large, consistent image size for the hero
    return `https://picsum.photos/seed/${keywords}/1920/1080`; 
  };

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${getPlaceholderImage(imageUrl)})`,
  };

  return (
    <header 
      className="relative h-[400px] lg:h-[500px] flex items-center justify-center text-white bg-cover bg-center transition-all duration-500 overflow-hidden"
      style={backgroundStyle}
    >
      <div className="text-center p-6 max-w-3xl z-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4 sm:text-4xl lg:text-5xl uppercase drop-shadow-lg">
          {title}
        </h1>
        <p className="text-base font-medium italic mb-8 opacity-95 sm:text-lg max-w-xl mx-auto drop-shadow-md">
          {subtitle}
        </p>
        
        {heroAction && (
          <button
            onClick={handleScroll}
            className="group px-8 py-3 mt-4 text-lg font-semibold rounded-full bg-primary hover:bg-primary-dark transition-all duration-300 shadow-xl flex items-center justify-center mx-auto"
          >
            Ontdek onze Cursussen
            <ChevronDownIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-1" />
          </button>
        )}
      </div>

      {/* Subtle fade effect at the bottom for transition */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/100 to-white/0"></div>
    </header>
  );
};

export default Header;