import React from 'react';

export default function Footer({ profile, socials }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 border-t border-gray-900">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <div className="text-xl font-bold mb-1">{profile.volledige_naam || profile.full_name || profile.naam || "Portfolio"}</div>
          <div className="text-sm text-gray-500">{profile.tagline || profile.specialisatie || ""}</div>
        </div>

        {socials && socials.length > 0 && (
          <div className="flex gap-6">
            {socials.map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {social.platform}
              </a>
            ))}
          </div>
        )}

        <div className="text-gray-600 text-sm">
          &copy; {currentYear}. Built with Athena CMS.
        </div>
      </div>
    </footer>
  );
}
