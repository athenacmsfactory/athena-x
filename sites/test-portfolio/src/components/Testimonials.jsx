import React from 'react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-bold mb-16 text-center">What Clients Say</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {testimonials.map((t, index) => (
            <div key={index} className="relative">
              <div className="text-6xl text-gray-700 absolute top-[-20px] left-[-10px] font-serif">"</div>
              <blockquote className="relative z-10 pl-6">
                <p className="text-lg md:text-xl text-gray-300 italic mb-6 leading-relaxed">
                  {t.quote}
                </p>
                <footer className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex-shrink-0"></div>
                  <div>
                    <div className="font-bold text-white">{t.client_name}</div>
                    <div className="text-sm text-gray-500">{t.company}</div>
                  </div>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
