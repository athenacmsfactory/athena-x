import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('payconiq');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // In een echte productie-omgeving zou hier een API call naar Mollie of Stripe gaan
    setTimeout(() => {
      alert(`Je wordt nu doorgeleid naar de veilige ${paymentMethod} omgeving...`);
      setIsProcessing(false);
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
        
        {/* Linker kant: Besteloverzicht */}
        <div className="space-y-8">
          <Link to="/" className="inline-flex items-center text-accent hover:underline mb-8">
            <span className="mr-2">←</span> Terug naar winkel
          </Link>
          <h1 className="text-4xl font-serif font-bold text-[var(--color-heading)]">Afrekenen</h1>
          
          <div className="bg-surface p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5">
            <h3 className="text-xl font-bold mb-6">Besteloverzicht</h3>
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

        {/* Rechter kant: Betalingsmethode */}
        <div className="bg-surface p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-white/5 self-start">
          <h3 className="text-2xl font-bold mb-8">Betaalmethode</h3>
          
          <div className="space-y-4 mb-12">
            {/* Payconiq Option */}
            <label className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'payconiq' ? 'border-accent bg-accent/5' : 'border-slate-100 dark:border-white/10'}`}>
              <input 
                type="radio" 
                name="payment" 
                value="payconiq" 
                checked={paymentMethod === 'payconiq'} 
                onChange={() => setPaymentMethod('payconiq')}
                className="hidden"
              />
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-6">
                <span className="text-white font-bold text-xs">PAYCONIQ</span>
              </div>
              <div className="flex-grow">
                <span className="block font-bold">Payconiq by Bancontact</span>
                <span className="text-sm text-secondary text-balance">Snel en veilig betalen met je smartphone.</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'payconiq' ? 'border-accent' : 'border-slate-300'}`}>
                {paymentMethod === 'payconiq' && <div className="w-3 h-3 bg-accent rounded-full"></div>}
              </div>
            </label>

            {/* PayPal Option */}
            <label className={`flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-accent bg-accent/5' : 'border-slate-100 dark:border-white/10'}`}>
              <input 
                type="radio" 
                name="payment" 
                value="paypal" 
                checked={paymentMethod === 'paypal'} 
                onChange={() => setPaymentMethod('paypal')}
                className="hidden"
              />
              <div className="w-12 h-12 bg-[#0070ba] rounded-lg flex items-center justify-center mr-6">
                <span className="text-white font-bold text-xl italic">PP</span>
              </div>
              <div className="flex-grow">
                <span className="block font-bold">PayPal</span>
                <span className="text-sm text-secondary">Betaal met je PayPal saldo of gekoppelde kaart.</span>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-accent' : 'border-slate-300'}`}>
                {paymentMethod === 'paypal' && <div className="w-3 h-3 bg-accent rounded-full"></div>}
              </div>
            </label>
          </div>

          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-5 rounded-2xl text-xl font-bold shadow-xl transition-all ${isProcessing ? 'bg-slate-200 cursor-not-allowed' : 'btn-primary shadow-accent/20 hover:scale-[1.02]'}`}
          >
            {isProcessing ? 'Verwerken...' : `Nu Betalen (€${cartTotal.toFixed(2)})`}
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-4 opacity-40 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;