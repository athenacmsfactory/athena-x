import React from 'react';

export default function Header({ instellingen }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900 tracking-tight">
          {instellingen.site_naam || 'Athena Basis'}
        </div>
        <nav className="hidden md:flex gap-8">
          <a href="#content" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Diensten</a>
          <a href="#kenmerken" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Kenmerken</a>
          {instellingen.email && (
            <a 
              href={`mailto:${instellingen.email}`} 
              className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-all"
            >
              Contact
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
