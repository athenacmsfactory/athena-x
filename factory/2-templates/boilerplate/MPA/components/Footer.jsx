import React from 'react';

export default function Footer({ basis }) {
  return (
    <footer className="py-12 bg-black text-stone-500 border-t border-stone-900">
      <div className="container mx-auto px-6 text-center">
        <div className="text-xl font-black uppercase tracking-[0.4em] text-white mb-4">
          {basis.naam}
        </div>
        <p className="text-sm mb-8 italic">"{basis.tagline}"</p>
        <div className="text-xs uppercase tracking-widest">
          &copy; {new Date().getFullYear()} {basis.naam}. Made with Athena CMS Factory.
        </div>
      </div>
    </footer>
  );
}
