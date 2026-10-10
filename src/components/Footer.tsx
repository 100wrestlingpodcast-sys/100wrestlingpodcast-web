import React from 'react';
import { siteConfig } from '../data/siteConfig';
import { logoWhite } from '../utils/assets';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const handleLegalClick = (term: string) => {
    const msg = i18n.language === 'en'
      ? `${term}: This is a demonstration link of the official legal terms of 100% Wrestling Podcast.`
      : `${term}: Este es un enlace demostrativo de los términos legales oficiales de 100% Wrestling Podcast.`;
    alert(msg);
  };

  return (
    <footer className="w-full bg-black border-t border-white/10 mt-auto pt-12 pb-24 md:pb-12 text-white/70 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={`${logoWhite}?v=2`} 
                alt="100% Wrestling Podcast" 
                className="w-10 h-10 object-contain shrink-0 drop-shadow-xs"
              />
              <span className="font-display font-black text-white uppercase tracking-wider text-lg">
                100% <span className="text-brand-red">Wrestling</span>
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed text-left max-w-sm">
              {t('footer.desc')}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start md:items-center">
            <div className="w-full md:w-auto text-left">
              <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest mb-3">
                {t('footer.sections.navigation')}
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('inicio')} className="hover:text-white transition-colors duration-200 cursor-pointer text-left">
                    {t('navigation.inicio')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ver-y-escuchar')} className="hover:text-white transition-colors duration-200 cursor-pointer text-left">
                    {t('navigation.verYEscuchar')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calendario')} className="hover:text-white transition-colors duration-200 cursor-pointer text-left">
                    {t('navigation.calendario')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('comunidad')} className="hover:text-white transition-colors duration-200 cursor-pointer text-left">
                    {t('navigation.comunidad')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('tienda')} className="hover:text-white transition-colors duration-200 cursor-pointer text-left">
                    {t('navigation.tienda')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('links')} className="hover:text-white transition-colors duration-200 cursor-pointer text-left">
                    {t('navigation.links')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('contacto')} className="hover:text-white transition-colors duration-200 cursor-pointer text-left">
                    {t('navigation.contacto')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Social & Communities */}
          <div className="flex flex-col items-start md:items-end">
            <div className="w-full md:w-auto text-left md:text-right">
              <h3 className="text-xs font-display font-bold text-white uppercase tracking-widest mb-3">
                {t('footer.sections.community')}
              </h3>
              <div className="flex gap-3 mb-4">
                <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-red text-white transition-all duration-200 cursor-pointer" aria-label="Facebook">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-red text-white transition-all duration-200 cursor-pointer" aria-label="Instagram">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href={siteConfig.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/10 hover:bg-brand-red text-white transition-all duration-200 cursor-pointer" aria-label="TikTok">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
                </a>
              </div>
              <a
                href={siteConfig.patreonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-brand-red hover:underline uppercase tracking-wider text-left md:text-right"
              >
                {t('footer.patreonAccess')} &rarr;
              </a>
            </div>
          </div>

        </div>

        {/* Affiliate Disclosure & Bottom Terms */}
        <div className="pt-6 flex flex-col gap-6">
          <div className="flex gap-3 items-start p-4 rounded-lg bg-[#0A0A0A] border border-white/10">
            <ShieldAlert className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/50 text-left leading-relaxed">
              {t('footer.affiliateDisclosure')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-white/40">
            <div>
              &copy; {currentYear} 100% Wrestling Podcast. {t('footer.rights')}
            </div>
            <div className="flex gap-4">
              <button onClick={() => handleLegalClick(t('footer.links.privacy'))} className="hover:text-white transition-colors cursor-pointer">
                {t('footer.links.privacy')}
              </button>
              <button onClick={() => handleLegalClick(t('footer.links.terms'))} className="hover:text-white transition-colors cursor-pointer">
                {t('footer.links.terms')}
              </button>
              <button onClick={() => handleLegalClick(i18n.language === 'en' ? 'Legal Notice' : 'Aviso Legal')} className="hover:text-white transition-colors cursor-pointer">
                {i18n.language === 'en' ? 'Legal Notice' : 'Aviso Legal'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
