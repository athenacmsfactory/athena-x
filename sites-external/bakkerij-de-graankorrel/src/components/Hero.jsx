import React from 'react';
import EditableImage from './EditableImage';

export default function Hero({ block, instellingen, index = 0 }) {
  if (!block) return null;

  return (
    <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
            {block.titel || instellingen.site_naam}
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            {block.tekst || instellingen.tagline}
          </p>
          {block.knop_tekst && (
            <a 
              href={block.knop_link || '#'} 
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1"
            >
              {block.knop_tekst}
            </a>
          )}
        </div>
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
            <EditableImage 
              src={`${import.meta.env.BASE_URL}images/${block['afbeelding-url'] || block.afbeelding || '1.jpeg'}`} 
              alt="Bakkerij de Graankorrel" 
              className="w-full h-full object-cover"
              cmsBind={{ file: "content", index: index, key: "afbeelding-url" }}
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-2xl -z-10 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
