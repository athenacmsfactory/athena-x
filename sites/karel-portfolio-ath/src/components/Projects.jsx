import React from 'react';
import EditableText from './EditableText';
import EditableMedia from './EditableMedia';
import RepeaterControls from './RepeaterControls';

const Projects = ({ projects }) => {
  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] mb-4 text-sm">Selected Work</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Innovation in Every <span className="text-zinc-800">Pixel</span>
            </h3>
          </div>
          <p className="text-zinc-500 max-w-xs text-sm uppercase font-bold tracking-widest leading-loose">
            Explorations in full-stack development, AI integration, and user-centric design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <div key={idx} className="group relative">
              <RepeaterControls file="projects" index={idx} isHidden={project.hidden} />
              <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5 mb-8">
                <EditableMedia 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  cmsBind={{ file: 'projects', index: idx, key: 'image_url' }}
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                    <EditableText table="projects" field="category" id={idx} value={project.category} />
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-3xl font-black uppercase tracking-tighter mb-2">
                    <EditableText table="projects" field="title" id={idx} value={project.title} />
                  </h4>
                  <p className="text-zinc-500 text-sm max-w-sm">
                    <EditableText table="projects" field="summary" id={idx} value={project.summary} />
                  </p>
                </div>
                <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l10-10M7 7h10v10"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;