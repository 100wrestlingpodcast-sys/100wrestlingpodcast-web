import React, { useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { logoWhite } from '../utils/assets';
import { ShieldAlert, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

type LegalDocType = 'privacy' | 'terms' | 'legal' | null;

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const isEn = i18n.language === 'en';
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>(null);

  const getLegalContent = (doc: Exclude<LegalDocType, null>) => {
    if (doc === 'privacy') {
      return {
        title: isEn ? 'Privacy Policy' : 'Política de Privacidad',
        paragraphs: isEn
          ? [
              `100% Wrestling Podcast (${siteConfig.contactEmail}) respects your privacy and is committed to protecting the personal data you share when using 100wrestlingpodcast.com.`,
              'Advertising & Cookies (Google AdSense): This website uses Google AdSense to display advertisements. Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites. You may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com).',
              'Contact Form Data: Information submitted through our Business Proposal / Contact form (name, brand, email, phone, and message) is processed through Netlify Forms strictly to evaluate and respond to your inquiry. We never sell or rent your personal information to third parties.',
              'External Links & Affiliates: Our site contains links to external platforms (YouTube, Spotify, Apple Podcasts, Patreon, Spreadshop) and affiliate partners (NordVPN, Topps, Ringside Collectibles, Fanatics). Each external site operates under its own privacy policy.',
              `Contact & Data Requests: To request deletion or correction of any information you have submitted, email us at ${siteConfig.contactEmail}.`
            ]
          : [
              `100% Wrestling Podcast (${siteConfig.contactEmail}) respeta tu privacidad y se compromete a proteger los datos personales que compartas al utilizar 100wrestlingpodcast.com.`,
              'Publicidad y Cookies (Google AdSense): Este sitio web utiliza Google AdSense para mostrar anuncios. Proveedores terceros, incluido Google, utilizan cookies para mostrar anuncios basados en visitas anteriores a este u otros sitios web. Puedes inhabilitar la publicidad personalizada en la Configuración de anuncios de Google (https://adssettings.google.com).',
              'Datos del Formulario de Contacto: La información enviada a través de nuestro formulario de contacto comercial (nombre, marca, correo, teléfono y mensaje) se procesa mediante Netlify Forms exclusivamente para evaluar y responder tu solicitud. Nunca vendemos ni alquilamos tus datos a terceros.',
              'Enlaces Externos y Afiliados: Nuestro portal incluye enlaces a plataformas externas (YouTube, Spotify, Apple Podcasts, Patreon, Spreadshop) y enlaces de afiliados (NordVPN, Topps, Ringside Collectibles, Fanatics). Cada sitio externo se rige por su propia política de privacidad.',
              `Contacto y Solicitudes: Para solicitar la eliminación o modificación de cualquier dato enviado, escríbenos a ${siteConfig.contactEmail}.`
            ]
      };
    }

    if (doc === 'terms') {
      return {
        title: isEn ? 'Terms of Use' : 'Términos de Uso',
        paragraphs: isEn
          ? [
              'By accessing and using 100wrestlingpodcast.com, you agree to use this website for lawful, personal, and non-commercial viewing purposes.',
              'Broadcast Schedule: All live show dates, times, and special event coverages listed in our calendar are subject to change without prior notice due to broadcast adjustments, holidays, or wrestling promotion schedule updates.',
              'Intellectual Property: All original logos, audio/video commentary, graphics, and branding of 100% Wrestling Podcast belong to their respective creators. Wrestling promotion names, trademarks, and event titles belong to their respective owners and are referenced strictly for editorial commentary and review purposes.',
              'External Purchases: Merchandise orders placed through our Spreadshop store or affiliate links are fulfilled and governed by the terms and return policies of those respective retailers.'
            ]
          : [
              'Al acceder y utilizar 100wrestlingpodcast.com, aceptas utilizar este sitio web con fines lícitos, personales y de consulta informativa.',
              'Programación y Calendario: Las fechas, horarios y coberturas de shows semanales y eventos especiales mostrados en el calendario están sujetos a cambios sin previo aviso por ajustes de transmisión, días festivos o cambios de las promociones de lucha libre.',
              'Propiedad Intelectual: Los logotipos, comentarios en audio y video, diseños y marca de 100% Wrestling Podcast pertenecen a sus creadores. Los nombres de empresas, marcas registradas y eventos de lucha libre pertenecen a sus respectivos propietarios y se mencionan únicamente con fines informativos, periodísticos y de análisis.',
              'Compras Externas: Las compras de mercancía realizadas en nuestra tienda de Spreadshop o a través de enlaces afiliados son procesadas y regidas por las políticas de envío y devoluciones de dichas plataformas.'
            ]
      };
    }

    return {
      title: isEn ? 'Legal Notice & Affiliate Disclosure' : 'Aviso Legal y Transparencia',
      paragraphs: isEn
        ? [
            '100% Wrestling Podcast is an independent wrestling commentary, news, and entertainment media project. We are not affiliated with, endorsed by, or officially connected to WWE, AEW, AAA, or any wrestling promotion covered on our shows.',
            'Affiliate Disclosure: Some links on this website (such as NordVPN, Topps, Ringside Collectibles, and Fanatics WWE Shop) are affiliate links. If you make a purchase through them, 100% Wrestling Podcast may earn a small commission at no extra cost to you.',
            `Official Contact: For legal, copyright, or business inquiries, please contact ${siteConfig.contactEmail}.`
          ]
        : [
            '100% Wrestling Podcast es un proyecto independiente de análisis, noticias y entretenimiento sobre lucha libre profesional. No estamos afiliados, patrocinados ni conectados oficialmente con WWE, AEW, AAA ni ninguna promoción cubierta en nuestros programas.',
            'Transparencia de Afiliados: Algunos enlaces presentes en este sitio web (como NordVPN, Topps, Ringside Collectibles y Fanatics WWE Shop) son enlaces de afiliados. Si realizas una compra a través de ellos, 100% Wrestling Podcast puede recibir una pequeña comisión sin costo adicional para ti.',
            `Contacto Oficial: Para asuntos legales, derechos de autor o consultas comerciales, contáctanos en ${siteConfig.contactEmail}.`
          ]
    };
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
              <button onClick={() => setActiveLegalDoc('privacy')} className="hover:text-white transition-colors cursor-pointer">
                {t('footer.links.privacy')}
              </button>
              <button onClick={() => setActiveLegalDoc('terms')} className="hover:text-white transition-colors cursor-pointer">
                {t('footer.links.terms')}
              </button>
              <button onClick={() => setActiveLegalDoc('legal')} className="hover:text-white transition-colors cursor-pointer">
                {isEn ? 'Legal Notice' : 'Aviso Legal'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Legal Information Modal */}
      {activeLegalDoc && (() => {
        const doc = getLegalContent(activeLegalDoc);
        return (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveLegalDoc(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
          >
            <div
              className="bg-[#111114] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 text-left text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
                <h3 id="legal-modal-title" className="text-lg sm:text-xl font-display font-black uppercase tracking-tight m-0 text-white">
                  {doc.title}
                </h3>
                <button
                  onClick={() => setActiveLegalDoc(null)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label={isEn ? 'Close' : 'Cerrar'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col gap-4 mt-5 text-xs sm:text-sm text-white/80 leading-relaxed">
                {doc.paragraphs.map((p, idx) => (
                  <p key={idx} className="m-0">{p}</p>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setActiveLegalDoc(null)}
                  className="px-5 py-2 rounded-lg bg-brand-red hover:bg-[#b91c1c] text-white font-display font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {isEn ? 'Close' : 'Cerrar'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </footer>
  );
};
