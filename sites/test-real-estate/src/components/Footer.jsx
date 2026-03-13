import React from 'react';

export default function Footer({ info }) {
  return (
    <footer id="contact" className="py-20 bg-blue-950 text-white">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-16">
        <div>
          <h3 className="text-2xl font-bold mb-6">{info.naam}</h3>
          <p className="text-blue-200/60 text-sm leading-relaxed mb-8">
            {info.beschrijving}
          </p>
          <div className="flex gap-4">
            {/* Social icons placeholders */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">F</div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">I</div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">L</div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-blue-400">Kantoor</h4>
          <ul className="space-y-4 text-blue-100/80 text-sm">
            <li className="flex gap-3"><span>📍</span> {info.adres}</li>
            <li className="flex gap-3"><span>📞</span> {info.telefoon}</li>
            <li className="flex gap-3"><span>✉️</span> {info.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-8 text-blue-400">Nieuwsbrief</h4>
          <p className="text-xs text-blue-100/60 mb-6 uppercase tracking-widest leading-loose">
            Ontvang als eerste de nieuwste panden in uw mailbox.
          </p>
          <div className="flex bg-white/10 p-1 rounded-xl border border-white/10 focus-within:border-blue-400 transition-colors">
            <input 
              type="email" 
              placeholder="Email adres" 
              className="bg-transparent px-4 py-3 text-sm w-full outline-none text-white" 
            />
            <button className="bg-blue-600 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-colors">Ok</button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-[10px] text-blue-200/30 uppercase tracking-[0.5em]">
        &copy; {new Date().getFullYear()} {info.naam}. Powered by Athena Real Estate Engine.
      </div>
    </footer>
  );
}
