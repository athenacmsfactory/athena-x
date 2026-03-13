import React from 'react';

export default function Footer({ info = {}, socials = [] }) {
  const restaurantName = info?.naam || "Ons Restaurant";
  
  return (
    <footer className="py-12 bg-black text-stone-600 border-t border-stone-800">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-white font-serif text-2xl mb-4 tracking-widest uppercase">{restaurantName}</h3>
        
        <div className="flex justify-center gap-8 mb-8">
          {socials && Array.isArray(socials) && socials.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors uppercase text-[10px] tracking-[0.2em] font-bold">
              {s.platform}
            </a>
          ))}
        </div>

        <div className="text-[10px] uppercase tracking-widest opacity-50">
          &copy; {new Date().getFullYear()} {restaurantName}. Built with Athena CMS Factory.
        </div>
      </div>
    </footer>
  );
}
