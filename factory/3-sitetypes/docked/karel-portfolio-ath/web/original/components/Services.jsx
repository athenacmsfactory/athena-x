import React from 'react';
import EditableText from './EditableText';
import * as Icons from 'lucide-react';
import RepeaterControls from './RepeaterControls';

const Services = ({ services }) => {
  return (
    <section id="services" className="py-32 px-6 bg-white/5 rounded-[60px] mx-4 border border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] mb-20 text-center text-sm">Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const IconComponent = Icons[service.icon_name] || Icons.Zap;
            return (
              <div key={idx} className="relative group h-full">
                <RepeaterControls file="services" index={idx} isHidden={service.hidden} />
                <div className="p-12 bg-black/40 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all h-full">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-10 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                    <IconComponent size={32} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
                    <EditableText table="services" field="title" id={idx} value={service.title} />
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                    <EditableText table="services" field="description" id={idx} value={service.description} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
