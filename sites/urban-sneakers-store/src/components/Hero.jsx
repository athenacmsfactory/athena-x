import React from 'react';

export default function Hero({ info }) {
  return (
    <section className="py-20 lg:py-32 bg-gray-50 text-center">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter">
          {info.naam}
        </h1>
        <p className="text-xl text-gray-500 mb-12 font-medium">
          {info.tagline}
        </p>
        <a href="#producten" className="inline-block px-12 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-all rounded-full shadow-lg">
          Shop de Collectie
        </a>
      </div>
    </section>
  );
}
