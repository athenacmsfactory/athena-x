import React from 'react';
import { Quote } from 'lucide-react';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const About = ({ data }) => {
  const aboutData = data || {
    title: 'Over Mij',
    content: 'Hallo, ik ben Karel. Ik ben een gepassioneerde webdeveloper die werkt aan zijn professionele re-integratie. Programmeren is voor mij meer dan werk; het is mijn vakmanschap en mijn houvast.',
    image_url: 'https://picsum.photos/id/447/600/800'
  };

  return (
    <div id="about" className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              <EditableText table="about" field="title" id={0} value={aboutData.title} />
            </h2>
            <div className="mt-4 text-lg text-slate-500 space-y-4">
              <EditableText 
                tagName="div" 
                table="about" 
                field="content" 
                id={0} 
                value={aboutData.content} 
                className="whitespace-pre-wrap"
              />
            </div>
            
            <div className="mt-8 border-l-4 border-blue-600 pl-4 bg-slate-50 p-4 italic text-slate-600 rounded-r-lg">
              <Quote className="h-6 w-6 text-blue-300 mb-2" />
              "U bent goed in uw vak. Ik ben goed in het mijne. Samen zorgen we dat uw bedrijf online vindbaar is."
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0 relative">
             <div className="aspect-w-3 aspect-h-4 rounded-xl overflow-hidden shadow-2xl bg-slate-100">
                <EditableImage 
                    src={aboutData.image_url} 
                    alt="Karel" 
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                    cmsBind={{ file: 'about', index: 0, key: 'image_url' }}
                />
             </div>
             <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg hidden md:block">
                <p className="font-bold text-lg">Gecertificeerd via Smart</p>
                <p className="text-blue-100 text-sm">Legaal & Verzekerd</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
