import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileNavigation } from './components/MobileNavigation';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { CalendarPage } from './pages/CalendarPage';
import { CommunityPage } from './pages/CommunityPage';
import { LinksPage } from './pages/LinksPage';
import { StorePage } from './pages/StorePage';
import { WatchListenPage } from './pages/WatchListenPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';

import { siteConfig } from './data/siteConfig';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './App.css';

const ROUTE_MAP: Record<string, { tab: string; lang: 'es' | 'en' }> = {
  '/': { tab: 'inicio', lang: 'es' },
  '/inicio': { tab: 'inicio', lang: 'es' },
  '/sobre-nosotros': { tab: 'sobre-nosotros', lang: 'es' },
  '/sobre-nosotros/': { tab: 'sobre-nosotros', lang: 'es' },
  '/es/sobre-nosotros': { tab: 'sobre-nosotros', lang: 'es' },
  '/es/sobre-nosotros/': { tab: 'sobre-nosotros', lang: 'es' },
  '/about': { tab: 'sobre-nosotros', lang: 'en' },
  '/en/about': { tab: 'sobre-nosotros', lang: 'en' },

  '/calendario': { tab: 'calendario', lang: 'es' },
  '/comunidad': { tab: 'comunidad', lang: 'es' },
  '/links': { tab: 'links', lang: 'es' },
  '/contacto': { tab: 'contacto', lang: 'es' },

  '/tienda': { tab: 'tienda', lang: 'es' },
  '/tienda/': { tab: 'tienda', lang: 'es' },
  '/es/tienda': { tab: 'tienda', lang: 'es' },
  '/en/tienda': { tab: 'tienda', lang: 'es' },
  '/store': { tab: 'tienda', lang: 'en' },
  '/store/': { tab: 'tienda', lang: 'en' },
  '/es/mercandia': { tab: 'tienda', lang: 'es' },
  '/en/merchandise': { tab: 'tienda', lang: 'en' },

  '/ver-y-escuchar': { tab: 'ver-y-escuchar', lang: 'es' },
  '/es/ver-y-escuchar': { tab: 'ver-y-escuchar', lang: 'es' },
  '/watch-listen': { tab: 'ver-y-escuchar', lang: 'en' },
  '/en/watch-listen': { tab: 'ver-y-escuchar', lang: 'en' },

  '/es': { tab: 'inicio', lang: 'es' },
  '/es/': { tab: 'inicio', lang: 'es' },
  '/es/inicio': { tab: 'inicio', lang: 'es' },
  '/es/calendario': { tab: 'calendario', lang: 'es' },
  '/es/comunidad': { tab: 'comunidad', lang: 'es' },
  '/es/links': { tab: 'links', lang: 'es' },
  '/es/contacto': { tab: 'contacto', lang: 'es' },

  '/en': { tab: 'inicio', lang: 'en' },
  '/en/': { tab: 'inicio', lang: 'en' },
  '/en/home': { tab: 'inicio', lang: 'en' },
  '/en/schedule': { tab: 'calendario', lang: 'en' },
  '/en/community': { tab: 'comunidad', lang: 'en' },
  '/en/links': { tab: 'links', lang: 'en' },
  '/en/store': { tab: 'tienda', lang: 'en' },
  '/en/contact': { tab: 'contacto', lang: 'en' }
};

export const ROUTE_URLS = {
  es: {
    inicio: '/es/inicio',
    'ver-y-escuchar': '/es/ver-y-escuchar',
    calendario: '/es/calendario',
    comunidad: '/es/comunidad',
    tienda: '/tienda',
    'sobre-nosotros': '/sobre-nosotros',
    links: '/es/links',
    contacto: '/es/contacto'
  },
  en: {
    inicio: '/en/home',
    'ver-y-escuchar': '/en/watch-listen',
    calendario: '/en/schedule',
    comunidad: '/en/community',
    tienda: '/store',
    'sobre-nosotros': '/en/about',
    links: '/en/links',
    contacto: '/en/contact'
  }
};

const SEO_META: Record<'es' | 'en', Record<string, { title: string; desc: string }>> = {
  es: {
    inicio: {
      title: '100% Wrestling Podcast | Noticias y Reviews de WWE y AEW en Español por Wiseman',
      desc: 'Podcast #1 de lucha libre en español con El Wiseman. Noticias, análisis sin filtros y reviews en vivo de WWE RAW, SmackDown, AEW Dynamite y Premium Live Events.'
    },
    'sobre-nosotros': {
      title: 'Sobre Nosotros | 100% Wrestling Podcast con Wiseman (WWE y AEW en Español)',
      desc: 'Conoce la historia de 100% Wrestling Podcast, el programa en español de noticias y reviews de WWE y AEW conducido por Wiseman. Enlaces a YouTube, Apple Podcasts, Instagram y Facebook.'
    },
    'ver-y-escuchar': {
      title: 'Ver y Escuchar | Episodios de 100% Wrestling Podcast en YouTube y Apple Podcasts',
      desc: 'Escucha y mira todos los episodios de 100% Wrestling Podcast en español con Wiseman. Enlaces directos a YouTube, Apple Podcasts, Spotify y Patreon VIP.'
    },
    calendario: {
      title: 'Calendario de Shows y Reviews en Vivo | 100% Wrestling Podcast',
      desc: 'Consulta el calendario oficial de transmisiones en vivo de 100% Wrestling Podcast: horarios de reviews de WWE RAW, SmackDown, AEW Dynamite y Premium Live Events.'
    },
    comunidad: {
      title: 'Comunidad Oficial, Patreon y Discord | 100% Wrestling Podcast',
      desc: 'Únete a la comunidad de 100% Wrestling Podcast en español. Participa en Discord, accede a La Terapia en Vivo en Patreon y síguenos en redes sociales.'
    },
    tienda: {
      title: 'Tienda Oficial y Mercancía | 100% Wrestling Podcast',
      desc: 'Compra las camisetas, hoodies, gorras y tazas oficiales de 100% Wrestling Podcast. Apoya directamente al podcast de lucha libre en español.'
    },
    links: {
      title: 'Auspiciadores Oficiales y Códigos de Descuento | 100% Wrestling Podcast',
      desc: 'Aprovecha descuentos exclusivos de 100% Wrestling Podcast en Ringside Collectibles (código 100WRESTLING), NordVPN, Fanatics y Topps.'
    },
    contacto: {
      title: 'Contacto y Propuestas Comerciales | 100% Wrestling Podcast',
      desc: 'Ponte en contacto con 100% Wrestling Podcast y Wiseman para propuestas comerciales, patrocinios, colaboraciones y consultas de prensa.'
    }
  },
  en: {
    inicio: {
      title: '100% Wrestling Podcast | Spanish WWE & AEW News and Reviews by Wiseman',
      desc: 'Find all 100% Wrestling Podcast shows, WWE & AEW reviews by Wiseman, social media accounts, special events, Patreon and merchandise.'
    },
    'sobre-nosotros': {
      title: 'About Us | 100% Wrestling Podcast with Wiseman (Spanish WWE & AEW Reviews)',
      desc: 'Learn about 100% Wrestling Podcast, the premier Spanish WWE and AEW news and reviews podcast hosted by Wiseman on YouTube, Apple Podcasts, Instagram and Facebook.'
    },
    'ver-y-escuchar': {
      title: 'Watch & Listen | 100% Wrestling Podcast on YouTube, Apple Podcasts & Spotify',
      desc: 'Watch and listen to all 100% Wrestling Podcast episodes across YouTube, Apple Podcasts, Spotify and Patreon VIP.'
    },
    calendario: {
      title: 'Live Shows & PLE Schedule | 100% Wrestling Podcast',
      desc: 'Check the official schedule of upcoming WWE RAW, SmackDown, AEW Dynamite and PLE live reviews on 100% Wrestling Podcast.'
    },
    comunidad: {
      title: 'Official Community, Patreon & Discord | 100% Wrestling Podcast',
      desc: 'Join the 100% Wrestling Podcast community on Discord, Patreon, Apple Podcasts and Spotify.'
    },
    tienda: {
      title: 'Official Merch & Shop | 100% Wrestling Podcast',
      desc: 'Shop official 100% Wrestling Podcast shirts, hoodies, caps and drinkware.'
    },
    links: {
      title: 'Official Sponsors & Promo Codes | 100% Wrestling Podcast',
      desc: 'Get exclusive 100% Wrestling Podcast discounts at Ringside Collectibles, NordVPN, Fanatics and Topps.'
    },
    contacto: {
      title: 'Contact & Business Inquiries | 100% Wrestling Podcast',
      desc: 'Contact 100% Wrestling Podcast for sponsorships, brand partnerships and business proposals.'
    }
  }
};

function App() {
  const { t, i18n } = useTranslation();
  const [path, setPath] = useState<string>(window.location.pathname);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const detectDevice = () => {
      const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
      const isTouchSmall = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
      setIsMobile(uaMobile || isIPadOS || isTouchSmall);
    };
    detectDevice();
  }, []);

  const cleanPath = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  let routeInfo = ROUTE_MAP[cleanPath] || ROUTE_MAP[path];
  if (!routeInfo) {
    if (path.startsWith('/en')) {
      routeInfo = { tab: 'inicio', lang: 'en' };
    } else {
      routeInfo = { tab: 'inicio', lang: 'es' };
    }
  }
  const activeTab = routeInfo.tab;
  const activeLang = routeInfo.lang;

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      const cl = currentPath.length > 1 && currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
      setPath(currentPath);
      const info = ROUTE_MAP[cl] || ROUTE_MAP[currentPath];
      if (info && info.lang !== i18n.language) {
        i18n.changeLanguage(info.lang);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [i18n]);

  useEffect(() => {
    if (activeLang !== i18n.language) {
      i18n.changeLanguage(activeLang);
    }
  }, []);

  useEffect(() => {
    const currentLang = (i18n.language === 'en' ? 'en' : 'es') as 'es' | 'en';
    const cl = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    const info = ROUTE_MAP[cl] || ROUTE_MAP[path];
    if (info && info.lang === currentLang) return;
    const currentTab = info ? info.tab : 'inicio';
    const targetUrl = ROUTE_URLS[currentLang][currentTab as keyof typeof ROUTE_URLS['es']];
    if (path !== targetUrl) {
      window.history.replaceState({}, '', targetUrl);
      setPath(targetUrl);
    }
  }, [i18n.language]);

  useEffect(() => {
    const currentLang = (i18n.language === 'en' ? 'en' : 'es') as 'es' | 'en';
    const cl = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
    const currentTab = (ROUTE_MAP[cl] || ROUTE_MAP[path])?.tab || 'inicio';
    const meta = SEO_META[currentLang]?.[currentTab] || SEO_META.es.inicio;

    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.desc);
    document.querySelector('meta[name="title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.desc);
    document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', meta.desc);

    const origin = window.location.origin;
    const canonicalHref = origin + (cl === '/' ? '/' : ROUTE_URLS[currentLang][currentTab as keyof typeof ROUTE_URLS.es] || cl);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalHref);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalHref);
    document.querySelector('meta[property="twitter:url"]')?.setAttribute('content', canonicalHref);

    const esUrl = origin + ROUTE_URLS.es[currentTab as keyof typeof ROUTE_URLS.es];
    const enUrl = origin + ROUTE_URLS.en[currentTab as keyof typeof ROUTE_URLS.en];

    const setAlternateLink = (hreflang: string, href: string) => {
      let el = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'alternate');
        el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setAlternateLink('es', esUrl);
    setAlternateLink('en', enUrl);
    setAlternateLink('x-default', esUrl);
    document.documentElement.setAttribute('lang', currentLang);
  }, [path, i18n.language]);

  const handleTabChange = (tab: string) => {
    const currentLang = (i18n.language === 'en' ? 'en' : 'es') as 'es' | 'en';
    const targetUrl = ROUTE_URLS[currentLang][tab as keyof typeof ROUTE_URLS['es']];
    window.history.pushState({}, '', targetUrl);
    setPath(targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: '100% Wrestling Podcast',
      text: t('footer.legalDisclaimer'),
      url: window.location.origin + path
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log('Compartir cancelado o no disponible.');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin + path);
        alert(t('links.codeCopied'));
      } catch {
        alert(t('contact.validation.errorMessage'));
      }
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomePage setActiveTab={handleTabChange} />;
      case 'sobre-nosotros':
        return <AboutPage />;
      case 'ver-y-escuchar':
        return <WatchListenPage />;
      case 'calendario':
        return <CalendarPage />;
      case 'comunidad':
        return <CommunityPage />;
      case 'tienda':
        return <StorePage />;
      case 'links':
        return <LinksPage />;
      case 'contacto':
        return <ContactPage />;
      default:
        return <HomePage setActiveTab={handleTabChange} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0D] text-[#F7F7F8] selection:bg-brand-red selection:text-white">
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onShare={handleShare}
        isMobile={isMobile}
      />

      <main id="main-content" tabIndex={-1} className={`flex-grow outline-none ${isMobile ? 'pb-16' : 'pb-0'}`}>
        {renderActivePage()}
      </main>

      <a
        href={siteConfig.youtubeChannelUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed z-40 p-3.5 rounded-full bg-brand-red hover:bg-[#b91c1c] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(215,25,32,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
          isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'
        }`}
        title={t('home.watchYouTube', { defaultValue: 'Ver canal de YouTube' })}
        aria-label="Ver canal de YouTube oficial de 100% Wrestling Podcast"
      >
        <div className="absolute inset-0 rounded-full bg-brand-red/30 animate-ping group-hover:hidden" />
        <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.096-2.099C19.56 3.75 12 3.75 12 3.75s-7.56 0-9.402.514c-1.022.273-1.824 1.077-2.096 2.099C0 8.002 0 12 0 12s0 3.998.502 5.837c.272 1.022 1.074 1.826 2.096 2.099C4.44 20.25 12 20.25 12 20.25s7.56 0 9.402-.514c1.022-.273 1.824-1.077 2.096-2.099C24 15.998 24 12 24 12s0-3.998-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </a>

      {showScrollTop && !isMobile && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-white hover:bg-brand-red text-gray-700 hover:text-white border border-gray-200 hover:border-brand-red flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
          title="Subir al inicio"
          aria-label="Subir al inicio de la página"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {isMobile && (
        <MobileNavigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
        />
      )}

      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}

export default App;
