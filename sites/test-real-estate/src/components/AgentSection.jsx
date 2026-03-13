import React from 'react';

export default function AgentSection({ agenten }) {
  if (!agenten || agenten.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-2">Uw Makelaars</h2>
          <p className="text-gray-500">Persoonlijke begeleiding bij elke stap.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {agenten.map((agent, i) => (
            <div key={i} className="text-center">
              <div className="aspect-square bg-gray-100 rounded-full mb-6 mx-auto overflow-hidden border-4 border-gray-50 max-w-[200px]">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 italic text-xs p-6 text-center">
                   {agent.foto_prompt || "Agent photo"}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.naam}</h3>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">{agent.functie}</p>
              {agent.telefoon_direct && (
                <p className="text-gray-500 text-sm font-medium">{agent.telefoon_direct}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
