import React from 'react';
import { BookOpenIcon, UserGroupIcon, AcademicCapIcon, CurrencyEuroIcon, StarIcon } from '@heroicons/react/24/solid'; 

// --- Sub-components for specific content types ---

// Utility function for placeholder images
const getPlaceholderImage = (prompt, size = '600/400') => {
  const keywords = prompt.split(', ')[0].replace(/ /g, '-').toLowerCase();
  return `https://picsum.photos/seed/${keywords}/${size}`;
};

// 1. Cursussen Renderer
const CoursesRenderer = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-10">
    {data.map((course, index) => (
      <div key={index} className="w-full md:w-[calc(50%-2.5rem)] lg:w-[calc(33.333%-2.5rem)] max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 border border-secondary/50">
        <img 
          src={getPlaceholderImage(course.image_prompt)} 
          alt={course.titel} 
          className="card-img"
        />
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2 text-primary">{course.titel}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{course.beschrijving}</p>
          
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <BookOpenIcon className="w-4 h-4 mr-2 text-primary" />
              <span>Duur: {course.duur}</span>
            </div>
            <div className="flex items-center">
              <AcademicCapIcon className="w-4 h-4 mr-2 text-primary" />
              <span>Niveau: <span className="font-semibold">{course.niveau}</span></span>
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-2 text-primary" />
              <span>Doelgroep: {course.doelgroep}</span>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center pt-4 border-t">
            <span className="text-3xl font-extrabold text-gray-900 flex items-center">
                <CurrencyEuroIcon className="w-6 h-6 mr-1" />
                {course.prijs.replace('€', '')}
            </span>
            <button className="px-5 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-primary transition duration-300">
              Inschrijven
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// 2. Docenten Renderer
const TeachersRenderer = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-8">
    {data.map((teacher, index) => (
      <div key={index} className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(25%-2rem)] max-w-[280px] bg-white p-6 rounded-xl shadow-xl border border-gray-100 text-center transition-all duration-300 hover:shadow-primary/10">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <img 
            src={getPlaceholderImage(teacher.foto_prompt, '256/256')} 
            alt={teacher.naam} 
            className="w-full h-full object-cover rounded-full border-4 border-primary/50 ring-4 ring-primary/20"
          />
        </div>
        
        <h3 className="text-xl font-semibold mb-1">{teacher.naam}</h3>
        <p className="text-sm font-medium text-primary mb-3">{teacher.expertise}</p>
        <p className="text-gray-600 text-sm line-clamp-3 italic">"{teacher.bio}"</p>
      </div>
    ))}
  </div>
);

// 3. Reviews Renderer
const ReviewsRenderer = ({ data }) => (
  <div className="space-y-8 max-w-4xl mx-auto">
    {data.map((review, index) => (
      <div key={index} className="bg-secondary/50 p-8 rounded-2xl shadow-lg border-l-4 border-primary">
        <div className="flex mb-3 text-yellow-500">
          {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 fill-current" />)}
        </div>
        <blockquote className="text-xl italic text-gray-800 leading-relaxed relative">
          <p className="before:content-['“'] before:text-primary before:text-6xl before:absolute before:-top-4 before:-left-4 before:opacity-30">
            {review.quote}
          </p>
        </blockquote>
        <p className="mt-4 text-right pt-3 border-t border-gray-300">
          <span className="font-semibold text-gray-900">{review.student_naam}</span>
          <span className="text-sm text-gray-500 block">Student van: {review.cursus_naam}</span>
        </p>
      </div>
    ))}
  </div>
);

// --- Main Section Component ---

const Section = ({ id, title, table, data }) => {
  // Using a fallback light grey background for sections
  const sectionBg = table === 'Reviews' ? 'bg-secondary/20' : 'bg-white';

  if (!data || data.length === 0) return null;

  let ContentComponent;
  switch (table) {
    case 'Cursussen':
      ContentComponent = CoursesRenderer;
      break;
    case 'Docenten':
      ContentComponent = TeachersRenderer;
      break;
    case 'Reviews':
      ContentComponent = ReviewsRenderer;
      break;
    default:
      return <div>Onbekende sectie: {table}</div>;
  }

  return (
    <section id={id} className={`py-20 px-4 sm:px-8 overflow-hidden ${sectionBg}`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 pb-4 relative">
          {title}
          <span className="block w-16 h-1 bg-primary absolute bottom-0 left-1/2 transform -translate-x-1/2"></span>
        </h2>
        
        <ContentComponent data={data} />
      </div>
    </section>
  );
};

export default Section;