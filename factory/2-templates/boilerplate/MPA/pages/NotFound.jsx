import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-black text-slate-200 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Pagina Niet Gevonden</h2>
      <p className="text-slate-500 mb-10">De pagina die u zoekt bestaat niet of is verplaatst.</p>
      <Link to="/" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all">
        Terug naar Home
      </Link>
    </div>
  );
};

export default NotFound;
