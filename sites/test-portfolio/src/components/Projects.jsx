import React, { useState } from 'react';
import EditableImage from './EditableImage';
import ProjectModal from './ProjectModal';

/**
 * Projects Component - Portfolio Sitetype
 * Modern Grid Showcase
 */
export default function Projects({ data }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = data.Projecten || [];

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-32 bg-surface">
      {/* Modal Integration */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-primary/10 pb-8">
          <div className="max-w-2xl">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Selected Work</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-primary leading-none">
              Crafting <br/>
              <span className="italic font-serif font-light text-secondary">Experiences.</span>
            </h2>
          </div>
          <div className="text-primary font-black uppercase tracking-widest text-xl">
            {String(projects.length).padStart(2, '0')} Cases
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {projects.map((project, index) => {
             const imgKey = Object.keys(project).find(k => /foto|image|thumbnail|cover/i.test(k));
             const rawImg = project[imgKey];
             const imgSrc = rawImg ? (rawImg.startsWith('http') ? rawImg : `${import.meta.env.BASE_URL}images/${rawImg}`) : null;
             const category = project.categorie || project.type || "Case Study";
             const title = project.titel || project.naam || "Untitled Project";

             return (
              <article 
                key={index} 
                className={`group cursor-pointer flex flex-col ${index % 2 === 1 ? 'md:mt-24' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                {/* Image Container */}
                <div className="aspect-[4/3] overflow-hidden bg-background mb-8 relative shadow-soft">
                  {imgSrc ? (
                    <EditableImage 
                      src={imgSrc} 
                      alt={title} 
                      className="w-full h-full object-cover transition-transform duration-[0.8s] ease-out group-hover:scale-105"
                      cmsBind={{ file: 'Projecten', index: project.absoluteIndex, key: imgKey }} 
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20 font-black text-4xl">
                      {title.charAt(0)}
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                     <span className="px-8 py-4 border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-colors">
                       View Case
                     </span>
                  </div>
                </div>

                {/* Info */}
                <div className="border-t border-primary/10 pt-6 group-hover:border-accent transition-colors duration-500">
                  <div className="flex justify-between items-baseline mb-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">{category}</p>
                    <span className="text-xs font-bold text-secondary/40">0{index + 1}</span>
                  </div>
                  <h3 className="text-3xl font-black text-primary tracking-tight group-hover:ml-2 transition-all duration-300">
                    {title}
                  </h3>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}