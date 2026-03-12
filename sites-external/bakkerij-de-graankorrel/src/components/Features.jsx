import React from 'react';

export default function Features({ kenmerken }) {
  if (!kenmerken || kenmerken.length === 0) return null;

  return (
    <section id="kenmerken" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Waarom voor ons kiezen?</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {kenmerken.map((k, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-bold">
                {k.icoon ? k.icoon[0] : (i + 1)}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{k.titel}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {k.beschrijving}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
