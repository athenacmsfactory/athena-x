import React from 'react';
import EditableText from './EditableText';

export default function Footer({ primaryTable }) {
  const info = primaryTable?.[0] || {};
  
  // Zoek velden met verschillende mogelijke aliassen
  const naam = info.site_naam || info.bedrijfsnaam || info.naam_bedrijf || info.naam || info.titel || 'Athena Shop';
  const adres = info.adres || info.address || info.locatie || '';
  const telefoon = info.telefoonnummer || info.telefoon || info.phone || '';
  const email = info.email_algemeen || info.email_publiek || info.email || info.order_email || '';
  const kvk = info.kvk_nummer || info.kvk || info.chamber_of_commerce || '';

  // Zoek de juiste keys voor de editor
  const findKey = (search) => Object.keys(info).find(k => k.toLowerCase() === search.toLowerCase()) || Object.keys(info).find(k => k.toLowerCase().includes(search.toLowerCase()));
  
  const naamKey = findKey('site_naam') || findKey('naam') || findKey('titel') || 'site_naam';
  const adresKey = findKey('adres') || findKey('address') || 'adres';
  const telKey = findKey('telefoon') || findKey('phone') || 'telefoonnummer';
  const emailKey = findKey('email_algemeen') || findKey('email') || findKey('order_email') || 'email_algemeen';
  const kvkKey = findKey('kvk') || 'kvk_nummer';

  return (
    <footer className="py-16 bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{naam}</h3>
            {adres && (
              <div className="mb-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-accent mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <EditableText 
                  tag="p"
                  className="text-sm leading-relaxed"
                  table="basisgegevens"
                  id={0}
                  field={adresKey}
                >
                  {adres}
                </EditableText>
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
            {telefoon && (
              <div className="mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-sm">
                    <EditableText
                      tag="span"
                      className="hover:text-accent transition-colors"
                      table="basisgegevens"
                      id={0}
                      field={telKey}
                    >
                      {telefoon}
                    </EditableText>
                </div>
              </div>
            )}
            {email && (
              <div className="mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="text-sm">
                    <EditableText 
                        tag="span"
                        className="hover:text-accent transition-colors"
                        table="basisgegevens"
                        id={0}
                        field={emailKey}
                    >
                        {email}
                    </EditableText>
                </div>
              </div>
            )}
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Bedrijfsgegevens</h4>
            {kvk && (
              <p className="text-sm mb-2">
                <span className="text-slate-400">KVK:</span>{' '}
                <EditableText 
                  tag="span"
                  className="text-white"
                  table="basisgegevens"
                  id={0}
                  field={kvkKey}
                >
                  {kvk}
                </EditableText>
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {naam}. Alle rechten voorbehouden.</p>
          <p className="mt-2 text-xs">Gemaakt met Athena CMS Factory</p>
        </div>
      </div>
    </footer>
  );
}
