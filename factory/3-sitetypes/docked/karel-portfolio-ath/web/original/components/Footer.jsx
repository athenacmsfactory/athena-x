import React from 'react';
import EditableText from './EditableText';

const Footer = ({ profile, socials }) => {
  return (
    <footer className="py-32 px-6 border-t border-white/5 bg-zinc-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32">
          <div>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-10 leading-[0.8]">
              Let's create <br /> <span className="text-zinc-800">Together.</span>
            </h2>
            <p className="text-zinc-500 text-xl max-w-md leading-relaxed">
              Available for freelance opportunities and innovative collaborations.
            </p>
          </div>
          <div className="flex flex-col justify-end items-start md:items-end">
             <a href={`mailto:\${profile.contact_email}`} className="text-3xl md:text-5xl font-black uppercase tracking-tighter hover:text-blue-500 transition-colors mb-4 break-all">
                <EditableText table="profile" field="contact_email" id={0} value={profile.contact_email} />
             </a>
             <div className="flex gap-6 mt-10">
                {socials.map((social, idx) => (
                  <a key={idx} href={social.url} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                    <EditableText table="socials" field="platform" id={idx} value={social.platform} />
                  </a>
                ))}
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <div>© {new Date().getFullYear()} <EditableText table="profile" field="full_name" id={0} value={profile.full_name} /></div>
          <div className="flex gap-10">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div>Built with Athena v7.4</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
