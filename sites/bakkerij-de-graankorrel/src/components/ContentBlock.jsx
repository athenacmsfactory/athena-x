import React from 'react';
import EditableImage from './EditableImage';

export default function ContentBlock({ block, index }) {
  const isReversed = index % 2 !== 0;

  if (block.blok_type === 'CTA') {
    return (
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-3xl p-12 lg:p-20 text-center text-white shadow-xl shadow-blue-200">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">{block.titel}</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">{block.tekst}</p>
            {block.knop_tekst && (
              <a 
                href={block.knop_link || '#'} 
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                {block.knop_tekst}
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="content" className="py-20 bg-white">
      <div className={`container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
        <div className={isReversed ? 'lg:order-2' : ''}>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{block.titel}</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {block.tekst}
          </p>
        </div>
        <div className={`aspect-video bg-gray-50 rounded-2xl overflow-hidden ${isReversed ? 'lg:order-1' : ''}`}>
          <EditableImage 
            src={`${import.meta.env.BASE_URL}images/${block['afbeelding-url'] || '1.jpeg'}`} 
            alt={block.titel}
            className="w-full h-full object-cover"
            cmsBind={{ file: 'content', index: index, key: 'afbeelding-url' }}
          />
        </div>
      </div>
    </section>
  );
}
