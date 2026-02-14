import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const Portfolio = ({ data }) => {
  const portfolioItems = data || [];

  return (
    <div id="portfolio" className="relative bg-slate-50 py-16 sm:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Recent Werk
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-4">
            Een selectie van mijn technische projecten, variërend van full-stack applicaties en browser-extensies tot AI-integraties.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-y-12">
          {portfolioItems.map((item, idx) => {
            const techStack = item.tech_stack ? item.tech_stack.split(',').map(t => t.trim()) : [];
            
            return (
              <div key={idx} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 border border-slate-100">
                <div className="flex-shrink-0 relative h-64 bg-slate-200 group">
                  <EditableImage 
                    src={item.image_url} 
                    alt={item.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    cmsBind={{ file: 'portfolio', index: idx, key: 'image_url' }}
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase tracking-wide shadow-sm">
                    {item.status}
                  </div>
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-slate-900">
                        <EditableText table="portfolio" field="title" id={idx} value={item.title} />
                      </h3>
                    </div>
                    <p className="mt-3 text-base text-slate-600 leading-relaxed">
                      <EditableText table="portfolio" field="description" id={idx} value={item.description} />
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {techStack.map((tech, tIdx) => (
                        <span key={tIdx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4">
                    {item.github_url && (
                      <a 
                        href={item.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    )}
                    {item.live_url && (
                      <a 
                        href={item.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
