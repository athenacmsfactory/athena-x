import React from 'react';

export default function ContactInfo({ info, uren }) {
  return (
    <section id="contact" className="py-24 bg-stone-900 text-stone-300">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 max-w-5xl mx-auto">
          
          <div>
            <h2 className="text-4xl font-serif text-white mb-10">Locatie & Contact</h2>
            <div className="space-y-8">
              <div>
                <span className="text-orange-500 uppercase tracking-widest text-xs font-bold mb-2 block">Adres</span>
                <p className="text-xl text-white">{info.adres}</p>
              </div>
              <div>
                <span className="text-orange-500 uppercase tracking-widest text-xs font-bold mb-2 block">Telefoon</span>
                <p className="text-xl text-white">{info.telefoon}</p>
              </div>
              <div>
                <span className="text-orange-500 uppercase tracking-widest text-xs font-bold mb-2 block">Email</span>
                <p className="text-lg">{info.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-serif text-white mb-10">Openingstijden</h2>
            <div className="space-y-4">
              {uren && uren.map((u, i) => (
                <div key={i} className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="font-bold text-stone-500">{u.dag}</span>
                  <span className="text-white">{u.uren}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
