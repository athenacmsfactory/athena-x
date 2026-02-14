import React from 'react';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';
import EditableLink from './EditableLink';

const Hero = ({ profile }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left z-10">
          <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] mb-4 text-sm">
            <EditableText table="profile" field="professional_title" id={0} value={profile.professional_title} />
          </h2>
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
            <EditableText table="profile" field="full_name" id={0} value={profile.full_name} />
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed">
            <EditableText table="profile" field="bio_short" id={0} value={profile.bio_short} />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <EditableLink 
              href="#contact" 
              table="profile" 
              field="cta_text" 
              id={0} 
              value={profile.cta_text || 'Hire Me'} 
              className="bg-white text-black px-10 py-5 rounded-full font-black uppercase text-sm hover:bg-blue-500 hover:text-white transition-all duration-500 flex items-center justify-center"
            />
            <EditableLink 
              href="#projects" 
              className="border border-white/10 px-10 py-5 rounded-full font-black uppercase text-sm hover:bg-white/5 transition-all flex items-center justify-center"
            >
              View Work
            </EditableLink>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] mx-auto">
            <div className="absolute inset-0 bg-blue-600 blur-[120px] opacity-20 rounded-full animate-pulse"></div>
            <div className="relative h-full w-full rounded-full overflow-hidden border border-white/10 group">
              <EditableMedia 
                src={profile.avatar_url} 
                alt={profile.full_name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                cmsBind={{ file: 'profile', index: 0, key: 'avatar_url' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
        PORTFOLIO
      </div>
    </section>
  );
};

export default Hero;