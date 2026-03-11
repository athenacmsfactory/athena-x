import React from 'react';

export default function Footer({ instellingen }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-xl font-bold mb-4">{instellingen.site_naam}</h3>
          <p className="text-gray-500 text-sm">{instellingen.tagline}</p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-gray-900 uppercase text-xs tracking-widest">Contact</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>{instellingen.adres}</li>
            <li>{instellingen.telefoon}</li>
            <li>{instellingen.email}</li>
          </ul>
        </div>
        <div className="text-right flex flex-col justify-end">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} {instellingen.site_naam}.<br/>
            Powered by Athena CMS Factory.
          </p>
        </div>
      </div>
    </footer>
  );
}
