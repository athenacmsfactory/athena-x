import React from 'react';

const Footer = ({ data }) => {
  const info = data.Basisgegevens?.[0] || {};
  const uren = data.Openingstijden || [];

  return (
    <footer id="contact" className="bg-stone-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 border-b border-white/10 pb-24">
        {/* Brand */}
        <div className="lg:col-span-1">
          <a href="#" className="text-2xl font-serif tracking-widest uppercase block mb-8">
            Soap <span className="font-light italic">Antwerp</span>
          </a>
          <p className="text-white/40 font-light leading-relaxed text-sm">
            Een exclusieve locatie, hoogwaardige producten, persoonlijke service en een touch of Soap!
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-8">Contact</h4>
          <address className="not-italic space-y-4 text-sm font-light text-white/70">
            <p className="flex items-start gap-4">
              <span>{info.adres}</span>
            </p>
            <p>
              <a href={`tel:${info.telefoon}`} className="hover:text-white transition-colors">{info.telefoon}</a>
            </p>
            <p>
              <a href={`mailto:${info.email}`} className="hover:text-white transition-colors">{info.email}</a>
            </p>
          </address>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-8">Openingsuren</h4>
          <div className="space-y-3 text-sm font-light text-white/70">
            {uren.map((dag, idx) => (
              <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                <span>{dag.dag}</span>
                <span className={dag.uren === 'Gesloten' ? 'text-white/30' : ''}>{dag.uren}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social & CTA */}
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-8">Volg Ons</h4>
          <div className="flex gap-6 mb-12">
            <a href="#" className="text-white/60 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">Facebook</a>
          </div>
          <a 
            href={info.boekings_url}
            className="inline-block px-10 py-4 bg-white text-stone-900 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-stone-100 transition-all"
          >
            Maak Afspraak
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/20 text-[10px] uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Soap Antwerp. Alle rechten voorbehouden.
        </p>
        <p className="text-white/20 text-[10px] uppercase tracking-widest">
          Gebouwd met <span className="text-white/40">Athena CMS Factory</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
