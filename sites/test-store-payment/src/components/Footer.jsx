import React from 'react';

/**
 * Footer Component - Store Sitetype
 * Upgraded for React 19 & Tailwind CSS v4
 */
export default function Footer({ data }) {
  const info = data.Winkel_Instellingen?.[0] || {};
  const title = info.winkelnaam || "Athena Store";

  return (
    <footer className="py-24 bg-surface border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic text-primary">{title}</h3>
          <p className="text-sm text-secondary font-medium leading-relaxed opacity-80 italic">
            {info.slogan || "Kwaliteit en stijl voor iedereen."}
          </p>
          <div className="flex gap-4 mt-2">
            {/* Social icons placeholders */}
            {['Instagram', 'Facebook', 'Twitter'].map(social => (
              <a key={social} href="#" className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-bold text-primary hover:bg-accent hover:text-white transition-all shadow-soft">
                {social.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Shoppen</h4>
          <ul className="space-y-4">
            {['Alle Producten', 'Nieuwe Collectie', 'Aanbiedingen', 'Populaire Items'].map(link => (
              <li key={link}>
                <a href="#" className="text-sm font-bold text-primary hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Column 2 */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Klantenservice</h4>
          <ul className="space-y-4">
            {['Contact', 'Verzenden & Retour', 'Veelgestelde Vragen', 'Privacy Beleid'].map(link => (
              <li key={link}>
                <a href="#" className="text-sm font-bold text-primary hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-8">Blijf op de hoogte</h4>
          <p className="text-xs text-secondary mb-6 leading-relaxed font-medium">
            Schrijf je in voor onze nieuwsbrief en ontvang updates over nieuwe collecties.
          </p>
          <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email adres" 
              className="bg-primary/5 border border-primary/5 text-sm w-full p-4 rounded-2xl outline-none focus:border-accent transition-all" 
            />
            <button className="bg-primary text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-accent transition-all shadow-lg shadow-primary/10">
              Inschrijven
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-24 pt-10 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-secondary font-bold uppercase tracking-[0.2em] opacity-50">
          &copy; {new Date().getFullYear()} {title}. All Rights Reserved.
        </p>
        <div className="flex gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {/* Payment icons placeholder */}
           {['Visa', 'MasterCard', 'iDEAL', 'PayPal'].map(p => <span key={p} className="text-[10px] font-black italic">{p}</span>)}
        </div>
      </div>
    </footer>
  );
}
