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

import { siteConfig } from './data/siteConfig';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './App.css';

const ROUTE_MAP: Record<string, { tab: string; lang: 'es' | 'en' }> = {
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

const ROUTE_URLS = {
  es: {
    inicio: '/es/inicio',
    'ver-y-escuchar': '/es/ver-y-escuchar',
    calendario: '/es/calendario',
    comunidad: '/es/comunidad',
    tienda: '/tienda',
    links: '/es/links',
    contacto: '/es/contacto'
  },
  en: {
    inicio: '/en/home',
    'ver-y-escuchar': '/en/watch-listen',
    calendario: '/en/schedule',
    comunidad: '/en/community',
    tienda: '/store',
    links: '/en/links',
    contacto: '/en/contact'
  }
};

function App() {
  const { t, i18n } = useTranslation();
  const [path, setPath] = useState<string>(window.location.pathname);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect if running on mobile device vs desktop computer
  useEffect(() => {
    const detectDevice = () => {
      const uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
      const isTouchSmall = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1024;
      setIsMobile(uaMobile || isIPadOS || isTouchSmall);
    };
    detectDevice();
  }, []);

  // Resolve current active tab and language from URL pathname
  let routeInfo = ROUTE_MAP[path];
  if (!routeInfo) {
    if (path.startsWith('/en')) {
      routeInfo = { tab: 'inicio', lang: 'en' };
    } else if (path.startsWith('/es')) {
      routeInfo = { tab: 'inicio', lang: 'es' };
    } else {
      const defaultLang = localStorage.getItem('i18n_lang') || (navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es');
      routeInfo = { tab: 'inicio', lang: defaultLang as 'es' | 'en' };
      // Redirect root to default language on mount
      const targetUrl = defaultLang === 'en' ? '/en/home' : '/es/inicio';
      window.history.replaceState({}, '', targetUrl);
    }
  }
  const activeTab = routeInfo.tab;
  const activeLang = routeInfo.lang;

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      setPath(currentPath);
      
      const info = ROUTE_MAP[currentPath];
      if (info && info.lang !== i18n.language) {
        i18n.changeLanguage(info.lang);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [i18n]);

  // Sync active language on mount
  useEffect(() => {
    if (activeLang !== i18n.language) {
      i18n.changeLanguage(activeLang);
    }
  }, []);

  // Sync address bar when i18n language is toggled on the same page
  useEffect(() => {
    const currentLang = i18n.language as 'es' | 'en';
    let currentTab = 'inicio';
    const info = ROUTE_MAP[path];
    if (info) {
      currentTab = info.tab;
    }
    const targetUrl = ROUTE_URLS[currentLang][currentTab as keyof typeof ROUTE_URLS['es']];
    if (path !== targetUrl) {
      window.history.replaceState({}, '', targetUrl);
      setPath(targetUrl);
    }
  }, [i18n.language]);

  // Dynamic SEO Metadata and Hreflang alternative tags in head
  useEffect(() => {
    const currentLang = i18n.language as 'es' | 'en';
    
    // 1. Dynamic Title and Description
    if (currentLang === 'en') {
      document.title = '100% Wrestling Podcast | Shows, Patreon and Social Media';
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content',
        'Find all 100% Wrestling Podcast shows, social media accounts, special events, Patreon, merchandise and official links.'
      );
    } else {
      document.title = '100% Wrestling Podcast | Programas, Patreon y Redes Sociales';
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content',
        'Encuentra todos los programas, redes sociales, eventos especiales, Patreon, mercancía y links oficiales de 100% Wrestling Podcast.'
      );
    }

    // 2. alternate hreflang URL tags
    const currentTab = ROUTE_MAP[path]?.tab || 'inicio';
    const origin = window.location.origin;
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

    // 3. HTML lang tag attribute
    document.documentElement.setAttribute('lang', currentLang);

  }, [path, i18n.language]);

  // Update URL pathname when tabs change manually
  const handleTabChange = (tab: string) => {
    const currentLang = i18n.language as 'es' | 'en';
    const targetUrl = ROUTE_URLS[currentLang][tab as keyof typeof ROUTE_URLS['es']];
    window.history.pushState({}, '', targetUrl);
    setPath(targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Monitor scroll height to show back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
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
      } catch (err) {
        console.log('Compartir cancelado o no disponible.');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin + path);
        alert(t('links.codeCopied'));
      } catch (err) {
        alert(t('contact.validation.errorMessage'));
      }
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomePage setActiveTab={handleTabChange} />;
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
      {/* 1. Desktop / Main Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onShare={handleShare}
        isMobile={isMobile}
      />

      {/* 2. Main Page Render Slot */}
      <main id="main-content" tabIndex={-1} className={`flex-grow outline-none ${isMobile ? 'pb-16' : 'pb-0'}`}>
        {renderActivePage()}
      </main>

      {/* 3. Floating YouTube Action Button - verified destination */}
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


      {/* 4. Scroll To Top Button (Desktop only/above floating buttons) */}
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

      {/* 5. Mobile Bottom Navigation Bar */}
      {isMobile && (
        <MobileNavigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
        />
      )}

      {/* 6. Footer Content */}
      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}

export default App;
