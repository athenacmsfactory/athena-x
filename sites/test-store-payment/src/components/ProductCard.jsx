import React from 'react';
import { useCart } from './CartContext';

/**
 * ProductCard Component - Store Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
export default function ProductCard({ product, valuta }) {
  const { addToCart } = useCart();

  // Helper voor slimme URL afhandeling
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (!url.includes('/')) return `${import.meta.env.BASE_URL}images/${url}`;
    return `${import.meta.env.BASE_URL}${url.startsWith('/') ? url.slice(1) : url}`;
  };

  // Prijs parseren naar nummer
  const priceNum = typeof product.prijs === 'string' 
    ? parseFloat(product.prijs.replace(/[^0-9.,]/g, '').replace(',', '.')) 
    : parseFloat(product.prijs);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: product.id || product.naam,
      name: product.naam,
      price: priceNum,
      image: getImageUrl(product["afbeelding-url"])
    });
  };

  const formattedPrice = product.prijs && product.prijs.toString().includes(valuta) 
    ? product.prijs 
    : `${valuta}${product.prijs}`;

  return (
    <article className="group flex flex-col h-full">
      {/* Product Image Container */}
      <div className="aspect-[4/5] bg-surface rounded-3xl mb-6 overflow-hidden relative shadow-soft border border-primary/5 transition-transform duration-500 hover:shadow-xl">
        {product["afbeelding-url"] ? (
             <img 
               src={getImageUrl(product["afbeelding-url"])}
               alt={product.naam} 
               loading="lazy"
               className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
             />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center text-secondary/30 italic text-xs p-10 text-center bg-primary/5">
              {product.image_prompt || "Geen afbeelding beschikbaar"}
            </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.populair === 'Ja' && (
            <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Populair
            </span>
          )}
          {product.nieuw === 'Ja' && (
            <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              Nieuw
            </span>
          )}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-white text-primary py-4 rounded-2xl text-xs font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-primary hover:text-white shadow-xl flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7v14"/></svg>
            In Winkelwagen
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-1">
              {product.categorie || 'Collectie'}
            </p>
            <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
              {product.naam}
            </h3>
          </div>
          <p className="text-xl font-black text-primary">
            {formattedPrice}
          </p>
        </div>
        
        {product.beschrijving && (
          <p className="text-sm text-secondary line-clamp-2 mt-2 font-medium opacity-80 leading-relaxed">
            {product.beschrijving}
          </p>
        )}
      </div>
    </article>
  );
}