import React from 'react';
import EditableImage from './EditableImage';

const Header = ({ data }) => {
  const [table, col] = "Winkel_Info.naam".split('.');
  const title = data[table]?.[0]?.[col] || "Welkom";
  
  const [subTable, subCol] = "Winkel_Info.tagline".split('.');
  const subtitle = data[subTable]?.[0]?.[subCol] || "";

  return (
    <header className="py-20 px-6 bg-slate-50 border-b border-slate-200 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900">
          {title}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </header>
  );
};

export default Header;
