import React, { useState, useEffect, useRef } from 'react';
import { logoClassic } from '../utils/assets';
import { siteConfig } from '../data/siteConfig';
import { Share2, ChevronDown, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShare: () => void;
  isMobile: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onShare, isMobile }) => {
  const { t, i18n } = useTranslation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const primaryNavItems = [
    { id: 'inicio', label: t('navigation.inicio') },
    { id: 'ver-y-escuchar', label: t('navigation.verYEscuchar') },
    { id: 'calendario', label: t('navigation.calendario') },
    { id: 'comunidad', label: t('navigation.comunidad') },
    { id: 'tienda', label: t('navigation.tienda') },
  ];

  const moreItems = [
    { id: 'links', label: t('navigation.links') },
    { id: 'contacto', label: t('navigation.contacto') },
  ];

  const isMoreActive = moreItems.some(item => item.id === activeTab);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0B0D]/95 border-b border-white/10 backdrop-blur-md shadow-md">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 z-[60] px-4 py-2 bg-brand-red text-white font-display font-bold text-xs uppercase rounded shadow-lg outline-none"
      >
        {i18n.language === 'en' ? 'Skip to main content' : 'Saltar al contenido principal'}
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80px] py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo - Standalone high-visibility emblem */}
        <a 
          href="#inicio"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('inicio');
          }}
          className="flex items-center cursor-pointer group shrink-0 focus-visible:outline-2 focus-visible:outline-brand-red rounded-xl p-1 -ml-1 transition-transform active:scale-95"
          aria-label={i18n.language.startsWith('en') ? "100% Wrestling Podcast - Go to Home" : "100% Wrestling Podcast - Ir a Inicio"}
        >
          <img 
            src={logoClassic} 
            alt="100% Wrestling Podcast" 
            className="h-12 sm:h-14 lg:h-16 w-auto max-w-[140px] sm:max-w-[170px] lg:max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav 
          className={`${isMobile ? 'hidden' : 'hidden lg:flex'} items-center gap-1 xl:gap-2`}
          aria-label={i18n.language === 'en' ? 'Main Navigation' : 'Navegación Principal'}
        >
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3 py-2 rounded-lg font-display font-bold text-xs xl:text-sm uppercase tracking-wider transition-all duration-200 select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-red ${
                  isActive 
                    ? 'text-white font-black' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-red rounded-full shadow-[0_0_8px_#D71920]" />
                )}
              </a>
            );
          })}

          {/* "Más" Dropdown Menu */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              aria-expanded={isMoreOpen}
              aria-haspopup="true"
              className={`relative px-3 py-2 rounded-lg font-display font-bold text-xs xl:text-sm uppercase tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-brand-red ${
                isMoreActive 
                  ? 'text-white font-black' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{t('navigation.mas')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`} />
              {isMoreActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-red rounded-full shadow-[0_0_8px_#D71920]" />
              )}
            </button>

            {isMoreOpen && (
              <div 
                className="absolute right-0 mt-2 w-44 bg-[#17171C] border border-white/10 rounded-xl shadow-2xl py-2 flex flex-col z-50 animate-scale-up text-left"
                role="menu"
              >
                {moreItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      role="menuitem"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(item.id);
                        setIsMoreOpen(false);
                      }}
                      className={`px-4 py-2.5 text-xs font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-brand-red text-white' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls & Support CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Segmented Language Selector */}
          <div 
            className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 shrink-0"
            role="group"
            aria-label="Selector de idioma / Language selector"
          >
            <button
              onClick={() => i18n.changeLanguage('es')}
              className={`px-2 py-1 text-[10px] sm:text-xs font-display font-black uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                i18n.language === 'es' 
                  ? 'bg-brand-red text-white shadow-sm' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Cambiar idioma a Español"
              aria-current={i18n.language === 'es' ? 'true' : 'false'}
            >
              ES
            </button>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className={`px-2 py-1 text-[10px] sm:text-xs font-display font-black uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                i18n.language === 'en' 
                  ? 'bg-brand-red text-white shadow-sm' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Switch language to English"
              aria-current={i18n.language === 'en' ? 'true' : 'false'}
            >
              EN
            </button>
          </div>

          {/* Share Button */}
          <button 
            onClick={onShare}
            className="p-2 sm:p-2.5 rounded-lg border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-200 cursor-pointer bg-white/5 hover:bg-white/10 active:scale-95 shadow-sm"
            title={i18n.language === 'en' ? 'Share page' : 'Compartir página'}
            aria-label={i18n.language === 'en' ? 'Share this page' : 'Compartir esta página'}
          >
            <Share2 className="w-4 h-4 text-white" />
          </button>

          {/* Apoya el podcast CTA Destacado */}
          <a
            href={siteConfig.patreonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-[#b91c1c] active:scale-95 text-white font-display font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_2px_10px_rgba(215,25,32,0.35)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD400]" />
            <span>{t('navigation.apoyaPodcast')}</span>
          </a>
        </div>

      </div>
    </header>
  );
};
