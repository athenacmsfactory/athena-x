import React from 'react';
import { useCart } from './CartContext';

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

  return (
    <div className="group">
      <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-6 overflow-hidden relative shadow-sm border border-gray-100">
        {product["afbeelding-url"] ? (
             <img 
               src={getImageUrl(product["afbeelding-url"])}
               alt={product.naam} 
               className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
             />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 italic text-xs p-10 text-center group-hover:scale-105 transition-transform duration-500">
              {product.image_prompt || "Product photo"}
            </div>
        )}
        
        {product.populair === 'Ja' && (
          <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
            Populair
          </div>
        )}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur py-3 rounded-xl text-xs font-black uppercase tracking-widest translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white"
        >
          In Winkelwagen
        </button>
      </div>
      
      <div className="text-center">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{product.categorie}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.naam}</h3>
        <p className="text-xl font-black text-gray-900">
          {product.prijs && product.prijs.toString().includes(valuta) ? product.prijs : `${valuta}${product.prijs}`}
        </p>
      </div>
    </div>
  );
}