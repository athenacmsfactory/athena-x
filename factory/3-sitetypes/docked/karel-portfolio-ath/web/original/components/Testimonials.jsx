import React from 'react';
import EditableText from './EditableText';
import RepeaterControls from './RepeaterControls';

const Testimonials = ({ testimonials }) => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] mb-20 text-center text-sm">Validation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="relative group h-full">
              <RepeaterControls file="testimonials" index={idx} isHidden={test.hidden} />
              <div className="p-12 bg-zinc-900/50 rounded-[40px] border border-white/5 flex flex-col justify-between h-full">
                <p className="text-2xl font-medium text-zinc-300 mb-12 italic leading-relaxed tracking-tight">
                  "<EditableText table="testimonials" field="quote" id={idx} value={test.quote} />"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-black text-xs">
                    {test.client_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black uppercase text-sm tracking-wider">
                      <EditableText table="testimonials" field="client_name" id={idx} value={test.client_name} />
                    </h4>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                      <EditableText table="testimonials" field="company" id={idx} value={test.company} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
