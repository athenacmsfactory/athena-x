import React from 'react';
import { useCart } from './CartContext';

/**
 * ProductCard Component - Fashion Store Sitetype
 * Minimalist Editorial Design
 */
export default function ProductCard({ product, valuta }) {
  const { addToCart } = useCart();

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (!url.includes('/')) return `${import.meta.env.BASE_URL}images/${url}`;
    return `${import.meta.env.BASE_URL}${url.startsWith('/') ? url.slice(1) : url}`;
  };

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

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0f0f0] mb-6">
        {product["afbeelding-url"] ? (
          <img 
            src={getImageUrl(product["afbeelding-url"])}
            alt={product.naam} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif italic text-2xl bg-gray-50">
            {product.naam}
          </div>
        )}
        
        {/* Minimalist Overlay Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm text-black py-4 uppercase tracking-[0.2em] text-[10px] font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out border-t border-gray-100"
        >
          Add to Bag
        </button>

        {product.nieuw === 'Ja' && (
          <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-black bg-white px-2 py-1">New</span>
        )}
      </div>

      <div className="text-center space-y-1">
        <h3 className="font-serif text-xl text-gray-900 group-hover:text-gray-600 transition-colors">{product.naam}</h3>
        <p className="text-xs uppercase tracking-widest text-gray-500">{product.categorie}</p>
        <p className="text-sm font-medium text-black pt-2">
          {product.prijs && product.prijs.toString().includes(valuta) ? product.prijs : `${valuta}${product.prijs}`}
        </p>
      </div>
    </div>
  );
}