import React from 'react';
import Header from './components/Header';
import Section from './components/Section';

// Mock Data for direct preview (fallback)
const defaultData = {
  basisgegevens: [{
    bedrijfsnaam: "The Golden Razor Club",
    adres: "Koningslaan 10, 1000 AB Amsterdam",
    telefoonnummer: "+31 20 123 4567",
    emailadres: "info@goldenrazor.nl",
    openingstijden_info: "Di t/m Za | 10:00 - 18:00 (Op afspraak)",
    boekings_url: "#",
  }],
  diensten: [
    {
      dienst_id: 1,
      naam: "The Royal Cut & Style",
      beschrijving: "Een op maat gemaakte, klassieke snit, inclusief warme handdoekbehandeling en professionele styling.",
      categorie: "Kapsel",
      duur_minuten: 60,
      prijs: 65.00,
      populair: "Ja",
    }
  ],
};

function App({ data = {} }) {
  // Gebruik de data uit de props, of val terug op de defaultData voor preview
  const basisgegevens = (Array.isArray(data.basisgegevens) && data.basisgegevens.length > 0) 
    ? data.basisgegevens[0] 
    : defaultData.basisgegevens[0];
    
  const diensten = (Array.isArray(data.diensten)) 
    ? data.diensten 
    : defaultData.diensten;
  
  const headerProps = {
    bedrijfsnaam: basisgegevens.bedrijfsnaam,
    openingstijden_info: basisgegevens.openingstijden_info,
    boekings_url: basisgegevens.boekings_url,
  };

  return (
    <div className="min-h-screen bg-dark-background text-text-light antialiased">
      <Header {...headerProps} />
      <main>
        <Section title="Onze Luxe Diensten" data={diensten} />
        <footer className="py-10 border-t border-gold/20 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {basisgegevens.bedrijfsnaam}. Alle rechten voorbehouden.</p>
            <p>Adres: {basisgegevens.adres} | Tel: {basisgegevens.telefoonnummer}</p>
        </footer>
      </main>
    </div>
  );
}

export default App;