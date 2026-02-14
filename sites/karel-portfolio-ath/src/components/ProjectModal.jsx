import React from 'react';
import EditableImage from './EditableImage';

const ProjectModal = ({ project, onClose, onInquire }) => {
  if (!project) return null;

  // Helper voor slimme URL afhandeling
  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    return `${import.meta.env.BASE_URL}images/${url}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl animate-reveal custom-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
        >
          <span className="text-2xl">✕</span>
        </button>

        <div className="flex flex-col lg:flex-row min-h-full">
          
          <div className="flex-1 bg-slate-900 border-r border-white/5">
            <EditableImage 
              src={getImageUrl(project.image_url)}
              alt={project.title || project.name}
              className="w-full h-full"
              cmsBind={{
                file: 'tabel',
                index: project.absoluteIndex, 
                key: 'image_url'
              }}
            />
          </div>

          {/* Info Column */}
          <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
            <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-6">
              {project.category || "Development"}
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none text-white">
              {project.title || project.name}
            </h2>
            
            <div className="space-y-8 mb-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">About the project</h4>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {project.description || project.summary || "No description available."}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {(project.tech_stack || project.type || "Web App").split(',').map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="flex flex-wrap gap-6 pt-10 border-t border-white/5">
              {(project.repo_url || project.githubLink) && (
                <a 
                  href={(project.repo_url || project.githubLink).startsWith('http') ? (project.repo_url || project.githubLink) : `https://${(project.repo_url || project.githubLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5"
                >
                  View Source Code
                </a>
              )}
              {(project.demo_url || project.liveLink) && (
                <a 
                  href={(project.demo_url || project.liveLink).startsWith('http') ? (project.demo_url || project.liveLink) : `https://${(project.demo_url || project.liveLink)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 border-2 border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/5 transition-all"
                >
                  Live Demo
                </a>
              )}

              <button 
                className="flex-1 lg:flex-none px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                onClick={() => onInquire(project)}
              >
                Inquire about this <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
