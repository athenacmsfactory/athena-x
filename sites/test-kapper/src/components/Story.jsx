import React from 'react';

const Story = ({ data }) => {
  const info = data.Basisgegevens?.[0] || {};

  return (
    <section id="story" className="py-24 md:py-32 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1200" 
              alt="Professional Hair Styling" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 hidden md:block w-64 h-64 bg-stone-200 rounded-2xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>
          <div className="absolute top-10 -left-10 hidden md:block w-40 h-40 border border-stone-200 rounded-2xl -z-10 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-700"></div>
        </div>

        <div className="space-y-10">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mb-4 block">Onze Filosofie</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
              Soap & Aveda:<br />
              <span className="italic font-light">Een natuurlijke combinatie</span>
            </h2>
          </div>
          
          <div className="space-y-6 text-stone-600 font-light leading-relaxed text-lg">
            <p>
              Soap was het eerste Antwerpse kapsalon dat zichzelf een trotse partner mocht noemen van Aveda. 
              Dit merk is van mening dat de natuur de beste schoonheidsverzorging biedt.
            </p>
            <p>
              Al meer dan 20 jaar werken we bij Soap met Aveda-kwaliteitsproducten, die voor 97% uit 
              plantaardige grondstoffen zijn opgebouwd. Dat is niet alleen beter voor je haar, 
              maar ook voor de planeet!
            </p>
            <p className="pt-4 italic text-stone-400 border-l-2 border-stone-200 pl-6">
              "Soap ademt passie, vakmanschap en rust. Even ontsnappen aan de dagelijkse rush, 
              je in de watten laten leggen en vol zelfvertrouwen weer de straat op."
            </p>
          </div>

          <div className="pt-10 flex items-center gap-12">
            <div>
              <div className="text-3xl font-serif text-stone-900">30+</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400">Jaar Ervaring</div>
            </div>
            <div className="w-[1px] h-12 bg-stone-200"></div>
            <div>
              <div className="text-3xl font-serif text-stone-900">97%</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400">Natuurlijk</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
