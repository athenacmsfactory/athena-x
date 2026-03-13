import React, { useEffect } from 'react';

/**
 * ProjectModal Component - Portfolio Sitetype
 * Full-screen Detail View
 */
const ProjectModal = ({ project, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!project) return null;

  const imgSrc = project.image_url 
    ? (project.image_url.startsWith('http') ? project.image_url : `${import.meta.env.BASE_URL}images/${project.image_url}`)
    : null;

  const techStack = (project.tech_stack || project.technologies || "").split(',').filter(t => t.trim());

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/95 backdrop-blur-xl" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-7xl h-full max-h-[95vh] bg-surface md:rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-primary/10 animate-in zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-background/50 backdrop-blur-md rounded-full text-primary hover:bg-primary hover:text-white transition-all border border-primary/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        {/* Left Column: Visual */}
        <div className="lg:w-1/2 h-1/2 lg:h-full bg-background relative overflow-hidden group">
          {imgSrc ? (
            <img 
              src={imgSrc} 
              alt={project.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <span className="text-primary/20 font-black text-6xl uppercase tracking-tighter">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden"></div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:w-1/2 h-1/2 lg:h-full overflow-y-auto p-8 md:p-16 lg:p-20 flex flex-col custom-scrollbar">
          <div className="mb-auto">
            <span className="inline-block px-3 py-1 border border-accent/30 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full mb-8">
              {project.category || "Case Study"}
            </span>
            
            <h2 className="text-4xl md:text-6xl font-black text-primary tracking-tighter mb-8 leading-[0.9]">
              {project.title}
            </h2>
            
            <p className="text-secondary text-lg md:text-xl leading-relaxed font-light mb-12">
              {project.description || project.summary || "No description available for this project."}
            </p>

            {techStack.length > 0 && (
              <div className="mb-12">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary/50 mb-4">Built With</h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/5 rounded-md text-xs font-bold text-primary">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col sm:flex-row gap-4">
             {project.demo_url && (
               <a 
                 href={project.demo_url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="btn-primary py-4 px-8 text-center"
               >
                 View Live Project
               </a>
             )}
             {project.repo_url && (
               <a 
                 href={project.repo_url} 
                 target="_blank" 
                 rel="noreferrer"
                 className="py-4 px-8 border border-primary/20 rounded-full font-bold uppercase tracking-widest text-xs text-center hover:bg-primary hover:text-white transition-all"
               >
                 Source Code
               </a>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
