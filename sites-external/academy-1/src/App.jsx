import React from 'react';
import Header from './components/Header';
import Section from './components/Section';

// --- MOCK DATA & MAPPING (Normally imported or fetched) ---
const mockData = {
  Academy_Info: {
    naam: "The Future Academy",
    missie: "Verrijk je kennis en vaardigheden met cutting-edge technologie en onderwijs.",
    locatie: "Online & Amsterdam",
    contact_email: "info@academy.com",
    hero_image_prompt: "Futuristic library interior, digital screens, warm lighting, deep blue accents, high resolution"
  },
  Cursussen: [
    {
      titel: "React Masterclass 2024",
      duur: "8 Weken",
      niveau: "Gevorderd",
      prijs: "€ 499,-",
      beschrijving: "Diepgaande cursus over State Management, Hooks, en Performance Optimalisatie.",
      doelgroep: "Ervaren front-end developers",
      image_prompt: "Abstract geometric design representing data flow and coding structure"
    },
    {
      titel: "Tailwind CSS V4 Essentials",
      duur: "3 Dagen",
      niveau: "Beginner",
      prijs: "€ 199,-",
      beschrijving: "Leer utility-first CSS van scratch en bouw responsieve designs in recordtijd.",
      doelgroep: "Designers en junior developers",
      image_prompt: "Minimalist layout grid structure, pastel colors"
    }
  ],
  Docenten: [
    {
      naam: "Dr. Evelyn Reed",
      expertise: "AI & Machine Learning",
      bio: "Evelyn heeft 15 jaar ervaring in de ontwikkeling van zelflerende systemen en is auteur van diverse bestsellers.",
      foto_prompt: "Professional woman, smiling, modern office background"
    },
    {
      naam: "Jeroen Bakker",
      expertise: "Front-end Development & UX",
      bio: "Jeroen is een full-stack developer met een passie voor toegankelijkheid en strakke interfaces.",
      foto_prompt: "Young man, casual business attire, urban loft background"
    }
  ],
  Reviews: [
    {
      student_naam: "Sarah K.",
      cursus_naam: "React Masterclass 2024",
      quote: "De diepgang van de cursus overtuigde me. Ik pas nu complexe hooks toe die ik eerder niet begreep. Een echte aanrader!"
    },
    {
      student_naam: "Mark V.",
      cursus_naam: "Tailwind CSS V4 Essentials",
      quote: "In slechts drie dagen heb ik mijn workflow volledig veranderd. Fantastische docent en heldere uitleg."
    }
  ]
};

const uiMapping = {
  header_title: "Academy_Info.naam",
  header_subtitle: "Academy_Info.missie",
  hero_action: "#sectie-Cursussen", 
  sections: [
    { table: "Cursussen", title: "Ons Aanbod" },
    { table: "Docenten", title: "Maak kennis met onze Experts" },
    { table: "Reviews", title: "Wat zeggen onze Studenten?" }
  ]
};
// --------------------------------------------------------

// Helper function to extract nested data (e.g., "Academy_Info.naam")
const getNestedData = (obj, path) => {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  return current;
};


const App = ({ data = mockData, mapping = uiMapping }) => {

  // Extract Header Props
  const headerTitle = getNestedData(data, mapping.header_title);
  const headerSubtitle = getNestedData(data, mapping.header_subtitle);
  const heroImagePrompt = data.Academy_Info?.hero_image_prompt || 'modern education landscape';

  return (
    <div className="min-h-screen">
      
      <Header
        title={headerTitle}
        subtitle={headerSubtitle}
        imageUrl={heroImagePrompt}
        heroAction={mapping.hero_action}
      />

      <main>
        {mapping.sections.map((section, index) => {
          const tableName = section.table;
          const sectionId = `sectie-${tableName}`;
          const sectionData = data[tableName];
          
          if (!sectionData) {
            console.warn(`Data for table ${tableName} not found.`);
            return null;
          }

          return (
            <Section
              key={index}
              id={sectionId}
              title={section.title || tableName}
              table={tableName}
              data={sectionData}
            />
          );
        })}
      </main>

      <footer className="bg-gray-900 text-white py-10 px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} {headerTitle}. Alle rechten voorbehouden.</p>
            <p className="text-sm mt-2 text-gray-500">
              Locatie: {Array.isArray(data.Academy_Info) ? data.Academy_Info[0]?.locatie : data.Academy_Info?.locatie} 
              | Contact: {Array.isArray(data.Academy_Info) ? data.Academy_Info[0]?.contact_email : data.Academy_Info?.contact_email}
            </p>
          </div>
      </footer>
    </div>
  );
};

export default App;