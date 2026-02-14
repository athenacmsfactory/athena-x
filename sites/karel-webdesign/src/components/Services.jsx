import React from 'react';

const Services = ({ data }) => {
  const services = data || [];

  return (
    <div id="services" className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Diensten
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-4">
            Heldere pakketten voor een eerlijke prijs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
          {services.map((pkg, idx) => {
            const features = pkg.features_list ? pkg.features_list.split(',').map(f => f.trim()) : [];
            const isRecommended = String(pkg.recommended).toLowerCase() === 'true';

            return (
              <div
                key={idx}
                className={`rounded-lg p-8 flex flex-col text-center bg-slate-50 border-2 ${
                  isRecommended ? 'border-blue-500 shadow-2xl' : 'border-slate-200'
                }`}
              >
                <h3 className="text-2xl font-bold text-slate-900">{pkg.title}</h3>
                <p className="mt-4 text-slate-500">{pkg.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-slate-900">{pkg.price}</span>
                </div>
                <ul className="mt-8 space-y-4 text-left">
                  {features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-slate-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <button
                    className="block w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kies dit pakket
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Services;