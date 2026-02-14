import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import EditableText from './EditableText';

const Contact = ({ data, settings }) => {
  const contactData = data || {
    title: 'Klaar om te starten?',
    description: 'Stuur me een bericht voor een vrijblijvend gesprek. Geen verplichtingen, gewoon kijken wat mogelijk is.',
    address: '',
    phone: ''
  };

  const email = settings?.contact_email || "karel@voorbeeld.be";

  return (
    <div id="contact" className="bg-slate-900 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <EditableText table="contact" field="title" id={0} value={contactData.title} />
          </h2>
          <p className="mt-4 text-xl text-slate-300">
            <EditableText table="contact" field="description" id={0} value={contactData.description} />
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row">
          <div className="bg-blue-600 p-8 md:p-12 md:w-1/2 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Contactgegevens</h3>
              <p className="text-blue-100 mb-8">
                Heeft u al een idee, of weet u nog niet precies wat u nodig heeft? Ik denk graag mee.
              </p>
              
              <div className="flex items-center space-x-4 text-white mb-4">
                <Mail className="h-6 w-6 text-blue-200" />
                <span><EditableText table="site_settings" field="contact_email" id={0} value={email} /></span>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <MessageSquare className="h-6 w-6 text-blue-200" />
                <span>Antwoord binnen 24u</span>
              </div>
            </div>
            
            <div className="mt-12 text-blue-200 text-sm">
              <p>BTW via Smart Productions vzw</p>
            </div>
          </div>

          <div className="p-8 md:p-12 md:w-1/2 bg-white">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Naam</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Uw naam"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mailadres</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="uwnaam@bedrijf.be"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Bericht</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Vertel kort wat u zoekt..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
              >
                Verstuur Bericht
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
