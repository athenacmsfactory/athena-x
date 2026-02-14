import React from 'react';
import EditableText from './EditableText';

/**
 * ⚓ Athena Pro Footer v7
 * Volledig bewerkbaar via de Dock en gekoppeld aan 'basisgegevens'.
 */
export default function Footer({ primaryTable }) {
  const info = primaryTable?.[0] || {};
  
  // Velden zoeken met aliassen (voor robuustheid)
  const findValue = (keys) => {
    const key = keys.find(k => info[k] !== undefined);
    return { value: info[key] || '', key: key || keys[0] };
  };

  const naam = findValue(['bedrijfsnaam', 'naam_bedrijf', 'naam', 'titel', 'site_naam']);
  const adres = findValue(['adres', 'address', 'locatie']);
  const telefoon = findValue(['telefoonnummer', 'telefoon', 'phone']);
  const email = findValue(['email_algemeen', 'email_publiek', 'email']);
  const kvk = findValue(['kvk_nummer', 'kvk', 'chamber_of_commerce']);
  const btw = findValue(['btw_nummer', 'btw', 'vat_number']);

  return (
    <footer className="py-20 bg-slate-950 text-slate-400 border-t border-white/5" data-dock-section="footer">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          {/* Kolom 1: Branding & Missie */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
              <EditableText 
                value={naam.value || 'Athena Project'} 
                cmsBind={{ file: 'basisgegevens', index: 0, key: naam.key }} 
              />
            </h3>
            <div className="h-1 w-12 bg-accent rounded-full"></div>
            <p className="text-sm leading-relaxed max-w-xs">
              Gerealiseerd met Athena CMS Factory. Wetenschappelijk onderbouwde innovatie in tandheelkunde.
            </p>
          </div>

          {/* Kolom 2: Direct Contact */}
          <div className="space-y-6">
            <h4 className="text-sm uppercase font-black tracking-[0.2em] text-accent">Contact</h4>
            <ul className="space-y-4">
              {adres.value && (
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <i className="fa-solid fa-location-dot text-accent text-xs"></i>
                  </div>
                  <EditableText 
                    tagName="span"
                    className="text-sm group-hover:text-white transition-colors cursor-pointer"
                    cmsBind={{ file: 'basisgegevens', index: 0, key: adres.key }}
                  >
                    {adres.value}
                  </EditableText>
                </li>
              )}
              {telefoon.value && (
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <i className="fa-solid fa-phone text-accent text-xs"></i>
                  </div>
                  <EditableText 
                    tagName="span"
                    className="text-sm group-hover:text-white transition-colors cursor-pointer"
                    cmsBind={{ file: 'basisgegevens', index: 0, key: telefoon.key }}
                  >
                    {telefoon.value}
                  </EditableText>
                </li>
              )}
              {email.value && (
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <i className="fa-solid fa-envelope text-accent text-xs"></i>
                  </div>
                  <EditableText 
                    tagName="span"
                    className="text-sm group-hover:text-white transition-colors cursor-pointer"
                    cmsBind={{ file: 'basisgegevens', index: 0, key: email.key }}
                  >
                    {email.value}
                  </EditableText>
                </li>
              )}
            </ul>
          </div>

          {/* Kolom 3: Juridisch & Info */}
          <div className="space-y-6">
            <h4 className="text-sm uppercase font-black tracking-[0.2em] text-accent">Bedrijfsgegevens</h4>
            <div className="space-y-2 text-sm">
              {kvk.value && (
                <p className="flex justify-between border-b border-white/5 pb-2">
                  <span className="opacity-50">KVK</span>
                  <EditableText 
                    className="font-mono text-xs text-white"
                    cmsBind={{ file: 'basisgegevens', index: 0, key: kvk.key }}
                  >
                    {kvk.value}
                  </EditableText>
                </p>
              )}
              {btw.value && (
                <p className="flex justify-between border-b border-white/5 pb-2">
                  <span className="opacity-50">BTW</span>
                  <EditableText 
                    className="font-mono text-xs text-white"
                    cmsBind={{ file: 'basisgegevens', index: 0, key: btw.key }}
                  >
                    {btw.value}
                  </EditableText>
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-30">
            &copy; {new Date().getFullYear()} {naam.value || 'nieuwe-tanden'}. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <span className="text-[9px] font-black uppercase tracking-tighter">Powered by</span>
            <svg width="20" height="20" viewBox="0 0 256 256" className="text-accent fill-current">
               <path d="M128 40V216M128 40L90 80M128 40L166 80M70 100V140C70 172.033 95.9675 198 128 198C160.033 198 186 172.033 186 140V100M70 100L55 85M186 100L201 85" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="text-[11px] font-serif font-bold italic tracking-tight text-white">Athena CMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}