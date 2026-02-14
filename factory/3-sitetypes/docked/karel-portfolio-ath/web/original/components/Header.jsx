import React from 'react';
import EditableText from './EditableText';

const Header = ({ profile }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-10 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/50 backdrop-blur-2xl border border-white/10 rounded-full px-10 py-4">
        <div className="text-xl font-black uppercase tracking-tighter">
          <EditableText table="profile" field="full_name" id={0} value={profile.full_name || 'Karel'} />
        </div>
        
        <nav className="hidden md:flex gap-8 items-center">
          {['Projects', 'Services', 'About', 'Contact'].map(item => (
            <a key={item} href={`#\${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">
              {item}
            </a>
          ))}
          <a href="#contact" className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
            Let's Talk
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;