import React from 'react';
import EditableImage from './EditableImage';

/**
 * PropertyCard Component - Real Estate Sitetype
 * Luxury Listing Card
 */
export default function PropertyCard({ pand }) {
  const imgKey = Object.keys(pand).find(k => /foto|afbeelding|image|cover/i.test(k));
  const rawImg = pand[imgKey];
  const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;

  return (
    <article className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-primary/5 shadow-soft hover:shadow-2xl transition-all duration-500 h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/11] overflow-hidden bg-surface">
        {imgSrc ? (
          <EditableImage 
             src={imgSrc} 
             alt={pand.titel} 
             className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
             cmsBind={{ file: 'Woningen', index: pand.absoluteIndex, key: imgKey }} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/10 italic text-xl font-serif">
            Property Photo
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary shadow-lg">
            {pand.type || 'Woning'}
          </span>
          {pand.status && (
            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg ${
              pand.status.toLowerCase().includes('verkocht') ? 'bg-red-500' : 'bg-accent'
            }`}>
              {pand.status}
            </span>
          )}
        </div>

        {/* EPC Label */}
        {pand.epc_waarde && (
          <div className="absolute bottom-5 right-5 bg-green-500 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm shadow-xl">
            {pand.epc_waarde[0]}
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="text-3xl font-black text-primary tracking-tighter">
            {pand.prijs || "Op aanvraag"}
          </div>
          <button className="w-10 h-10 rounded-full border border-primary/5 flex items-center justify-center hover:bg-primary/5 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
        </div>

        <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
          {pand.titel}
        </h3>
        
        <p className="text-sm text-secondary mb-8 flex items-center gap-2 font-medium opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {pand.locatie}
        </p>
        
        {/* Features Row */}
        <div className="mt-auto pt-6 border-t border-primary/5 flex gap-8 text-[11px] text-secondary font-black uppercase tracking-widest">
          {pand.oppervlakte && (
            <div className="flex items-center gap-2">
              <span className="text-accent opacity-40">📐</span> {pand.oppervlakte}
            </div>
          )}
          {pand.slaapkamers && (
            <div className="flex items-center gap-2">
              <span className="text-accent opacity-40">🛏️</span> {pand.slaapkamers}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
