import React from 'react';

export default function Footer({ info }) {
  return (
    <footer className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
        <div>
          <h3 className="text-xl font-black uppercase tracking-widest mb-4">{info.naam}</h3>
          <p className="text-sm text-gray-500">{info.tagline}</p>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Klantenservice</h4>
          <ul className="text-sm font-bold text-gray-900 space-y-4">
            <li><a href="#" className="hover:text-gray-500">Contact</a></li>
            <li><a href="#" className="hover:text-gray-500">Verzenden & Retourneren</a></li>
            <li><a href="#" className="hover:text-gray-500">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Nieuwsbrief</h4>
          <div className="flex border-b border-black pb-2">
            <input type="email" placeholder="Email adres" className="bg-transparent text-sm w-full outline-none" />
            <button className="text-xs font-black uppercase">Go</button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-20 text-center text-[10px] text-gray-400 uppercase tracking-widest">
        &copy; {new Date().getFullYear()} {info.naam}. Powered by Athena Commerce.
      </div>
    </footer>
  );
}
