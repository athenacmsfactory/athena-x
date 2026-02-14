import React from 'react';
import { ShieldCheck, User, Zap } from 'lucide-react';
import EditableText from './EditableText';

const iconMap = {
  ShieldCheck,
  User,
  Zap,
};

const Features = ({ data }) => {
  const features = data || [];

  return (
    <div id="features" className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Waarom ik?
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Een betere aanpak voor uw website
          </p>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 lg:mx-auto">
            Geen gedoe, geen verrassingen. Gewoon een goede website.
          </p>
        </div>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = iconMap[feature.icon] || Zap;
              return (
                <div key={idx} className="pt-6">
                  <div className="flow-root bg-slate-50 rounded-lg px-6 pb-8 border border-slate-100 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-slate-900 tracking-tight">
                        <EditableText table="features" field="title" id={idx} value={feature.title} />
                      </h3>
                      <p className="mt-5 text-base text-slate-600">
                        <EditableText table="features" field="description" id={idx} value={feature.description} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;