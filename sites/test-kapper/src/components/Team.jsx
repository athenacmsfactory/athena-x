import React from 'react';

const Team = ({ data }) => {
  const team = data.Team || [];

  return (
    <section id="team" className="py-24 md:py-32 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 block">Vakmanschap</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
              Ontmoet de <span className="italic font-light">Creators</span>
            </h2>
          </div>
          <p className="text-stone-500 font-light max-w-sm leading-relaxed">
            Ons professioneel team staat klaar om je te verwennen met persoonlijke service en passie voor het vak.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((member, idx) => (
            <div key={idx} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-8">
                <img 
                  src={member.foto_url ? `${import.meta.env.BASE_URL}${member.foto_url}` : `https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800`} 
                  alt={member.naam} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
              <h3 className="text-xl font-serif text-stone-900 mb-1">{member.naam}</h3>
              <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-4">{member.rol}</div>
              <p className="text-stone-500 text-sm font-light leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
