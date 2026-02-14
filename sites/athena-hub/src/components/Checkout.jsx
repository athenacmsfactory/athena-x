import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    telefoon: '',
    adres: '',
    opmerkingen: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // In een echte omgeving zou dit naar een server-actie gaan die de mail verstuurt
    // Voor statische sites kunnen we Formspree of een mailto link gebruiken
    
    const productLijst = cart.map(item => `- ${item.title} (x${item.quantity}): €${(item.price * item.quantity).toFixed(2)}`).join('\n');
    const emailBody = `
Nieuwe Bestelling:
------------------
${productLijst}

Totaal: €${cartTotal.toFixed(2)}

Klantgegevens:
--------------
Naam: ${formData.naam}
E-mail: ${formData.email}
Telefoon: ${formData.telefoon}
Adres: ${formData.adres}
Opmerkingen: ${formData.opmerkingen}
    `;

    console.log("Verzenden bestelling per e-mail...", emailBody);

    setTimeout(() => {
      alert("Bedankt! Je bestelling is verzonden. We nemen zo snel mogelijk contact met je op voor de betaling en levering.");
      clearCart();
      setIsProcessing(false);
      window.location.href = '/';
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4 text-[var(--color-heading)]">Je winkelmand is leeg</h2>
        <p className="text-secondary mb-8">Voeg wat producten toe voordat je gaat afrekenen.</p>
        <Link to="/" className="btn-primary px-8 py-3 rounded-full">Terug naar de winkel</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Besteloverzicht */}
        <div className="space-y-8">
          <Link to="/" className="inline-flex items-center text-accent hover:underline mb-8">
            <span className="mr-2">←</span> Terug naar winkel
          </Link>
          <h1 className="text-4xl font-serif font-bold text-[var(--color-heading)]">Plaats Bestelling</h1>
          
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="text-xl font-bold mb-6">Jouw Selectie</h3>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.title || item.name}</span>
                    <span className="text-sm text-secondary ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-bold">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 dark:border-white/5 pt-6 flex justify-between items-center">
              <span className="text-xl font-bold">Totaal</span>
              <span className="text-3xl font-black text-accent">€{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Contactformulier */}
        <div className="bg-surface p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-white/5 self-start">
          <h3 className="text-2xl font-bold mb-8">Jouw Gegevens</h3>
          
          <form onSubmit={handleEmailOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Naam</label>
                <input required type="text" name="naam" value={formData.naam} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-background" placeholder="Je volledige naam" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">E-mail</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-background" placeholder="je@email.be" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">Adres</label>
              <input required type="text" name="adres" value={formData.adres} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-background" placeholder="Straat, Nr, Postcode, Stad" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Telefoon</label>
                <input type="text" name="telefoon" value={formData.telefoon} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-background" placeholder="04xx / xx xx xx" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Extra opmerkingen</label>
              <textarea name="opmerkingen" value={formData.opmerkingen} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-100 dark:border-white/10 bg-background h-24" placeholder="Bijv. gewenste levertijd of specifieke wensen..."></textarea>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className={`w-full py-5 rounded-2xl text-xl font-bold shadow-xl transition-all ${isProcessing ? 'bg-slate-200 cursor-not-allowed' : 'btn-primary shadow-accent/20 hover:scale-[1.02]'}`}
            >
              {isProcessing ? 'Bestelling verzenden...' : 'Bestelling Bevestigen'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-secondary italic">
             Na bevestiging ontvang je van ons een e-mail met de betaalinstructies.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
