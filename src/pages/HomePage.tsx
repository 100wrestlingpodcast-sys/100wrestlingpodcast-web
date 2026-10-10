import React, { useState, useEffect, useRef } from 'react';
import { LatestLiveHero } from '../components/LatestLiveHero';
import { siteConfig } from '../data/siteConfig';
import type { CalendarEvent } from '../types/calendar';
import { fetchCalendarEvents } from '../services/calendarService';
import { fetchShopifyProducts, getProductUrl } from '../services/shopifyService';
import type { ShopifyProduct } from '../types/shopify';
import { resolveAsset } from '../utils/assets';
import { parseEventDateTime, formatEventDate, formatEventTime, formatLocalTimezoneAbbr, generateIcsFile } from '../utils/dates';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Download, 
  ShoppingBag, 
  Play, 
  ChevronRight,
  ChevronLeft,
  Loader2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Real YouTube Review & Stream Item interface
export interface YouTubeReview {
  id: string;
  title: string;
  thumbnailUrl: string;
  url: string;
  date: string;
  status: 'live' | 'completed';
  categories: ('raw' | 'smackdown' | 'dynamite' | 'ple' | 'special')[];
}

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const [copied, setCopied] = useState(false);
  const [nextUpcomingEvent, setNextUpcomingEvent] = useState<CalendarEvent | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [reviewFilter, setReviewFilter] = useState<string>('todos');
  const [reviewsList, setReviewsList] = useState<YouTubeReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [reviewsError, setReviewsError] = useState<boolean>(false);
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [allEvents, storeItems] = await Promise.all([
          fetchCalendarEvents().catch(() => []),
          fetchShopifyProducts()
        ]);

        setProducts(storeItems.slice(0, 4));

        // 1. Determine next upcoming show based on parsed date
        const now = Date.now();
        const upcoming = allEvents
          .filter(e => e.visible && e.status !== 'cancelled')
          .filter(e => {
            const dt = parseEventDateTime(e.date, e.start_time, e.timezone);
            return dt.getTime() >= now - (3 * 60 * 60 * 1000); // within last 3 hours or future
          });

        if (upcoming.length > 0) {
          setNextUpcomingEvent(upcoming[0]);
        }
      } catch (err) {
        console.error("Fallo al obtener datos de portada:", err);
      }
    }
    loadData();
  }, [i18n.language]);

  // Fetch real reviews from YouTube endpoint with static fallback
  useEffect(() => {
    let active = true;
    async function fetchReviews() {
      try {
        setReviewsLoading(true);
        setReviewsError(false);
        let data: any = null;
        try {
          const res = await fetch('/.netlify/functions/latest-live');
          if (res.ok) {
            data = await res.json();
          }
        } catch {}

        if (!data || !Array.isArray(data.reviews)) {
          const fallbackRes = await fetch('/latest-live.json');
          if (fallbackRes.ok) {
            data = await fallbackRes.json();
          }
        }

        if (active && data && Array.isArray(data.reviews)) {
          setReviewsList(data.reviews);
        } else if (active) {
          setReviewsError(true);
        }
      } catch (e) {
        if (active) setReviewsError(true);
      } finally {
        if (active) setReviewsLoading(false);
      }
    }
    fetchReviews();
    return () => { active = false; };
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.ringsideCollectibles.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('No se pudo copiar el código:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-red text-white animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            {t('home.live')}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70 border border-white/10">
            {isEn ? 'Completed' : 'Finalizado'}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/15">
            {t('home.upcoming')}
          </span>
        );
    }
  };

  const getProgramIcon = (type: string) => {
    return resolveAsset(type);
  };

  // Filter real YouTube reviews
  const filteredReviews = reviewsList.filter(r => {
    if (reviewFilter === 'todos') return true;
    return r.categories.includes(reviewFilter as any);
  });

  const scrollReviews = (direction: 'left' | 'right') => {
    if (!reviewsScrollRef.current) return;
    const offset = direction === 'left' ? -360 : 360;
    reviewsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      
      <LatestLiveHero />

      {/* =========================================================
          2. FRANJA COMPACTA: "Síguenos donde prefieras"
         ========================================================= */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-display font-bold tracking-widest text-white/50 uppercase text-left m-0">
          {isEn ? 'Follow us wherever you prefer' : 'Síguenos donde prefieras'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* YouTube - Metallic Crimson Finish */}
          <a
            href={siteConfig.platforms.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 active:scale-95 group shadow-lg shadow-black/40 border border-[#ff3b47]/30 hover:border-[#ff4d5a]/60 bg-gradient-to-br from-[#2a080a] via-[#1a0507] to-[#120304] hover:shadow-[0_0_25px_rgba(255,30,45,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b47]"
            aria-label={isEn ? "100% Wrestling Podcast Official YouTube Channel" : "Canal oficial de YouTube de 100% Wrestling Podcast"}
          >
            {/* Specular metallic light reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/[0.03] to-transparent pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#ff1a2b]/25 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
            
            <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#ff2233] to-[#99000d] text-white shadow-inner shadow-white/30 border border-white/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(255,50,60,0.6)] transition-all duration-300 shrink-0">
              <svg className="w-6 h-6 fill-current filter drop-shadow-sm" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="text-left min-w-0 relative z-10">
              <span className="text-sm font-display font-black text-white uppercase tracking-wider block drop-shadow-sm group-hover:text-red-100 transition-colors">YouTube</span>
              <span className="text-[11px] text-white/70 truncate block">{isEn ? 'Live, reviews & clips' : 'En vivo, reviews y clips'}</span>
            </div>
          </a>

          {/* Spotify - Metallic Emerald Finish */}
          <a
            href={siteConfig.platforms.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 active:scale-95 group shadow-lg shadow-black/40 border border-[#1ed760]/30 hover:border-[#1ed760]/60 bg-gradient-to-br from-[#062410] via-[#04190b] to-[#021007] hover:shadow-[0_0_25px_rgba(30,215,96,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ed760]"
            aria-label={isEn ? "100% Wrestling Official Spotify Podcast" : "Podcast oficial en Spotify"}
          >
            {/* Specular metallic light reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/[0.03] to-transparent pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#1ed760]/25 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#1ed760] to-[#0d7331] text-white shadow-inner shadow-white/30 border border-white/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(30,215,96,0.6)] transition-all duration-300 shrink-0">
              <svg className="w-6 h-6 fill-current filter drop-shadow-sm" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308a.747.747 0 0 1-1.028.248c-2.814-1.72-6.357-2.108-10.53-1.155a.75.75 0 0 1-.336-1.462c4.567-1.042 8.49-.607 11.646 1.341.348.213.46.666.248 1.028zm1.468-3.266a.936.936 0 0 1-1.288.309c-3.22-1.98-8.127-2.553-11.936-1.396a.937.937 0 1 1-.548-1.791c4.356-1.323 9.774-.683 13.463 1.589.412.253.544.792.309 1.289zm.126-3.41c-3.86-2.292-10.228-2.504-13.896-1.39a1.124 1.124 0 1 1-.655-2.152c4.22-1.282 11.258-1.036 15.704 1.603a1.124 1.124 0 0 1-1.153 1.939z"/>
              </svg>
            </div>
            <div className="text-left min-w-0 relative z-10">
              <span className="text-sm font-display font-black text-white uppercase tracking-wider block drop-shadow-sm group-hover:text-emerald-100 transition-colors">Spotify</span>
              <span className="text-[11px] text-white/70 truncate block">{isEn ? 'Audio & video podcast' : 'Audio y video podcast'}</span>
            </div>
          </a>

          {/* Apple Podcasts - Metallic Violet Finish */}
          <a
            href={siteConfig.platforms.apple}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-2xl p-4 flex items-center gap-3.5 transition-all duration-300 active:scale-95 group shadow-lg shadow-black/40 border border-[#b257fc]/30 hover:border-[#b257fc]/60 bg-gradient-to-br from-[#240b3b] via-[#170626] to-[#0e0318] hover:shadow-[0_0_25px_rgba(178,87,252,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b257fc]"
            aria-label={isEn ? "100% Wrestling Official Feed on Apple Podcasts" : "Feed oficial en Apple Podcasts"}
          >
            {/* Specular metallic light reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/[0.03] to-transparent pointer-events-none" />
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#b257fc]/25 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

            <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#a742f5] to-[#591b8a] text-white shadow-inner shadow-white/30 border border-white/20 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(178,87,252,0.6)] transition-all duration-300 shrink-0">
              <svg className="w-6 h-6 fill-current filter drop-shadow-sm" viewBox="0 0 24 24">
                <path d="M18.84 8.784c-.495-.008-.946.335-1.042.827-.723 3.69-3.957 6.389-7.798 6.389s-7.075-2.699-7.798-6.389a1.05 1.05 0 0 0-1.042-.827c-.63 0-1.127.533-1.065 1.159.852 4.673 4.908 8.157 9.905 8.157s9.053-3.484 9.905-8.157c.062-.626-.435-1.159-1.065-1.159zm-6.84-6.784c-3.313 0-6 2.687-6 6 0 2.802 1.928 5.156 4.542 5.823l-.542 2.177h4l-.542-2.177c2.614-.667 4.542-3.021 4.542-5.823 0-3.313-2.687-6-6-6zm0 2c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4z"/>
              </svg>
            </div>
            <div className="text-left min-w-0 relative z-10">
              <span className="text-sm font-display font-black text-white uppercase tracking-wider block drop-shadow-sm group-hover:text-purple-100 transition-colors">Apple Podcasts</span>
              <span className="text-[11px] text-white/70 truncate block">{isEn ? 'High quality audio episodes' : 'Episodios en alta calidad'}</span>
            </div>
          </a>
        </div>
      </section>


      {/* =========================================================
          3. PRÓXIMO SHOW (Fecha y hora unificada con Intl)
         ========================================================= */}
      {nextUpcomingEvent && (() => {
        const eventDate = parseEventDateTime(nextUpcomingEvent.date, nextUpcomingEvent.start_time, nextUpcomingEvent.timezone);
        const targetLocale = isEn ? 'en-US' : 'es-ES';
        const title = isEn && nextUpcomingEvent.title_en ? nextUpcomingEvent.title_en : (nextUpcomingEvent.title_es || nextUpcomingEvent.title);
        
        return (
          <section className="bg-gradient-to-r from-[#17171C] via-[#1c1414] to-[#17171C] rounded-2xl border border-brand-red/35 p-5 sm:p-7 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-white">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shrink-0 p-2">
                <img 
                  src={getProgramIcon(nextUpcomingEvent.program_type)} 
                  alt={title} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-display font-black text-brand-red uppercase tracking-wider">
                    {isEn ? 'Next Confirmed Show' : 'Próxima Transmisión'}
                  </span>
                  {getStatusBadge(nextUpcomingEvent.status)}
                </div>

                <h3 className="text-base sm:text-xl font-display font-black uppercase text-white m-0 tracking-tight leading-snug">
                  {title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-white font-medium mt-1 bg-white/5 py-1 px-2.5 rounded-lg border border-white/10 w-fit">
                  <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
                  <span className="text-white font-semibold">
                    {formatEventDate(eventDate, targetLocale)} &bull; {formatEventTime(eventDate)} ({formatLocalTimezoneAbbr(eventDate)})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('calendario')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <span>{isEn ? 'View Schedule' : 'Ver Calendario'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        );
      })()}


      {/* =========================================================
          4. ÚLTIMOS REVIEWS (3 a 6 tarjetas reales con filtros)
         ========================================================= */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-black uppercase text-white tracking-tight m-0">
              {isEn ? 'Latest Reviews & Shows' : 'Últimos Reviews y Shows'}
            </h2>
            <p className="text-xs text-white/50 mt-1 m-0">
              {isEn ? 'Filter by program to see our latest analysis' : 'Filtra por programa para ver nuestros análisis recientes'}
            </p>
          </div>

          {/* Functional Filters (RAW, SmackDown, AEW, PLE) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
            {[
              { id: 'todos', label: isEn ? 'All' : 'Todos' },
              { id: 'raw', label: 'RAW' },
              { id: 'smackdown', label: 'SmackDown' },
              { id: 'dynamite', label: 'AEW' },
              { id: 'ple', label: 'PLE' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setReviewFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  reviewFilter === f.id 
                    ? 'bg-brand-red text-white' 
                    : 'bg-[#17171C] text-white/70 hover:text-white border border-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Carousel & Controls Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-white/50">
            {reviewsLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-red" />
                {isEn ? 'Loading shows...' : 'Cargando transmisiones...'}
              </span>
            ) : (
              <span>
                {filteredReviews.length} {isEn ? 'episodes found' : 'episodios encontrados'}
              </span>
            )}
          </div>

          {/* Desktop Left/Right Scroll Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scrollReviews('left')}
              className="p-2 rounded-xl bg-[#17171C] hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer active:scale-95"
              aria-label={isEn ? "Scroll left" : "Desplazar a la izquierda"}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollReviews('right')}
              className="p-2 rounded-xl bg-[#17171C] hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer active:scale-95"
              aria-label={isEn ? "Scroll right" : "Desplazar a la derecha"}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {reviewsLoading && (
          <div className="flex items-center justify-center py-16 bg-[#17171C]/50 rounded-2xl border border-white/10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              <p className="text-xs font-mono text-white/60">
                {isEn ? 'Fetching latest streams from @100wrestlingpodcast...' : 'Consultando directos de @100wrestlingpodcast...'}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!reviewsLoading && reviewsError && (
          <div className="p-6 bg-[#17171C] rounded-2xl border border-red-500/20 text-center flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-brand-red" />
            <p className="text-sm font-display font-bold text-white uppercase">
              {isEn ? 'Could not load recent shows' : 'No se pudieron cargar los shows recientes'}
            </p>
            <p className="text-xs text-white/50">
              {isEn ? 'Please check back soon or visit our YouTube channel directly.' : 'Intenta nuevamente más tarde o visita nuestro canal directamente en YouTube.'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!reviewsLoading && !reviewsError && filteredReviews.length === 0 && (
          <div className="p-10 bg-[#17171C] rounded-2xl border border-white/10 text-center flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-white/30" />
            <p className="text-sm font-display font-bold text-white uppercase">
              {isEn ? 'No shows found for this category' : 'No hay shows para esta categoría'}
            </p>
            <p className="text-xs text-white/50">
              {isEn ? 'Try selecting another filter or choose "All".' : 'Intenta seleccionar otro filtro o elige "Todos".'}
            </p>
          </div>
        )}

        {/* Horizontal Touch Snap Scroller */}
        {!reviewsLoading && !reviewsError && filteredReviews.length > 0 && (
          <div 
            ref={reviewsScrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {filteredReviews.map((show) => {
              const displayDate = show.date ? new Date(show.date).toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
                timeZone: 'America/Chicago',
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : '';

              return (
                <article 
                  key={show.id}
                  className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-start bg-[#17171C] hover:border-brand-red/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 text-left group"
                >
                  <div>
                    {/* 16:9 Thumbnail with YouTube Link */}
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-video w-full rounded-xl bg-black/80 overflow-hidden border border-white/10 mb-3.5 relative group/thumb cursor-pointer"
                      aria-label={`Ver ${show.title}`}
                    >
                      <img 
                        src={show.thumbnailUrl} 
                        alt={show.title} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                      />
                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg transform group-hover/thumb:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                      {/* Live or Completed Badge Overlay */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        {getStatusBadge(show.status)}
                      </div>
                    </a>

                    {/* Category tags & Date */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {show.categories.map((cat) => (
                          <span 
                            key={cat} 
                            className="px-2 py-0.5 rounded text-[9px] font-display font-black uppercase tracking-wider bg-white/10 text-brand-red border border-brand-red/20"
                          >
                            {cat === 'dynamite' ? 'AEW' : cat.toUpperCase()}
                          </span>
                        ))}
                      </div>
                      {displayDate && (
                        <span className="text-xs text-white font-semibold bg-white/10 px-2 py-0.5 rounded shrink-0 border border-white/10">
                          {displayDate}
                        </span>
                      )}
                    </div>

                    {/* Video Title */}
                    <h3 className="text-sm sm:text-base font-display font-bold uppercase text-white tracking-tight m-0 line-clamp-2 group-hover:text-brand-red transition-colors leading-snug">
                      <a 
                        href={show.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {show.title}
                      </a>
                    </h3>
                  </div>

                  {/* Watch Episode Action Button */}
                  <a
                    href={show.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-display font-bold uppercase text-white/80 group-hover:text-white cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-brand-red fill-brand-red" />
                      {isEn ? 'Watch Episode' : 'Ver Episodio'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-brand-red group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </article>
              );
            })}
          </div>
        )}
      </section>


      {/* =========================================================
          5. COMUNIDAD Y PATREON (Regla AGENTS.md: flex-row en móvil)
         ========================================================= */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-display font-bold tracking-widest text-white/50 uppercase text-left m-0">
          {t('home.patreon.sectionTitle')}
        </h2>
        
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#FFD400] bg-black p-3.5 sm:p-6 lg:p-8 flex flex-row items-center justify-between gap-3 sm:gap-6 lg:gap-8 shadow-[0_0_35px_rgba(255,212,0,0.18)] min-h-[90px] sm:min-h-[130px] lg:min-h-[220px]">
          
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 relative z-10 text-left min-w-0 flex-1">
            <div className="relative shrink-0 flex items-center justify-center p-1 sm:p-2">
              <img 
                src={resolveAsset('patreon_logo.png')} 
                alt="Patreon 100% Wrestling Podcast" 
                className="w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-contain drop-shadow-[0_0_15px_rgba(255,212,0,0.3)] shrink-0" 
              />
            </div>

            <div className="flex flex-col justify-center min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xs sm:text-base lg:text-2xl text-white uppercase tracking-tight truncate">
                  {t('home.patreon.heading')}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#FFD400] text-black text-[9px] font-black uppercase tracking-wider shrink-0">
                  VIP
                </span>
              </div>
              
              {/* Responsive Benefits List: Inlined on Mobile with bullet dots */}
              <div className="mt-1 sm:mt-1.5 text-white/90 font-bold uppercase text-[9px] sm:text-xs tracking-wide">
                <div className="block lg:hidden text-[9px] sm:text-xs text-white/80 leading-tight">
                  <span>{t('home.patreon.benefit1')}</span>
                  <span className="mx-1 text-[#FFD400] font-black">•</span>
                  <span>{t('home.patreon.benefit2')}</span>
                  <span className="mx-1 text-[#FFD400] font-black">•</span>
                  <span>{t('home.patreon.benefit3')}</span>
                </div>
                <div className="hidden lg:flex flex-col gap-1 text-xs text-white/80">
                  <span>{t('home.patreon.benefit1Full')}</span>
                  <span>{t('home.patreon.benefit2Full')}</span>
                  <span>{t('home.patreon.benefit3Full')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <a 
              href={siteConfig.patreonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 sm:px-6 sm:py-3 rounded-lg bg-gradient-to-r from-brand-red to-[#B30000] text-white hover:brightness-110 active:scale-95 font-display font-black text-[9px] sm:text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(215,25,32,0.35)] cursor-pointer"
            >
              {t('home.patreon.joinBtn')}
            </a>
          </div>
        </div>
      </section>


      {/* =========================================================
          6. TIENDA OFICIAL SHOPIFY (Sin PWT, datos reales)
         ========================================================= */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-red" />
              <h2 className="text-lg sm:text-xl font-display font-black uppercase text-white tracking-tight m-0">
                {isEn ? 'Official Shopify Shop' : 'Tienda Oficial Shopify'}
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-1 m-0">
              {isEn ? 'Support the podcast directly by wearing official merch' : 'Apoya directamente al podcast vistiendo nuestra mercancía'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('tienda')}
            className="px-4 py-2 rounded-xl bg-brand-red hover:bg-[#b91c1c] text-white font-display font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            {isEn ? 'View all products' : 'Ver todo el catálogo'} &rarr;
          </button>
        </div>

        {/* 4 Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(prod => {
            const firstVariant = prod.variants?.[0];
            const price = firstVariant?.price ? `$${parseFloat(firstVariant.price).toFixed(2)} USD` : 'Ver precio';
            const imageUrl = prod.images?.[0]?.src || '';
            const prodUrl = getProductUrl(prod.handle);

            return (
              <article 
                key={prod.id}
                className="bg-[#17171C] rounded-2xl p-4 border border-white/10 shadow-lg hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <a
                    href={prodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-44 w-full rounded-xl bg-black/60 flex items-center justify-center border border-white/10 overflow-hidden relative p-3 mb-3 cursor-pointer"
                  >
                    <img 
                      src={imageUrl} 
                      alt={prod.title} 
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </a>

                  <h3 className="text-sm font-display font-black uppercase text-white m-0 line-clamp-2 leading-snug">
                    <a href={prodUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-red">
                      {prod.title}
                    </a>
                  </h3>

                  <span className="text-sm font-mono font-bold text-white mt-1 block">
                    {price}
                  </span>
                  <span className="text-[10px] text-white/50 block">
                    Envío calculado al checkout
                  </span>
                </div>

                <a
                  href={prodUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-2.5 px-3 rounded-lg bg-white/10 hover:bg-brand-red hover:text-white text-white font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Ver y comprar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </article>
            );
          })}
        </div>
      </section>


      {/* =========================================================
          7. AUSPICIADORES Y AFILIADOS (Ringside Collectibles)
         ========================================================= */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-display font-bold tracking-widest text-white/50 uppercase text-left m-0">
          {t('home.ringsideCollectibles.title')}
        </h2>

        <div className="bg-[#17171C] rounded-2xl border border-white/10 p-5 sm:p-6 lg:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          {/* Full Panoramic Banner Image at Natural Proportions with Zero Letterboxing */}
          <div className="w-full lg:max-w-xl xl:max-w-2xl flex-1 rounded-xl overflow-hidden border border-white/10 shadow-md">
            <a
              href={siteConfig.ringsideCollectibles.directLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full hover:opacity-95 transition-opacity"
              aria-label="Ringside Collectibles - 100% Wrestling Podcast Official Sponsor"
            >
              <img 
                src={resolveAsset(siteConfig.ringsideCollectibles.bannerAsset)} 
                alt="Ringside Collectibles Official Sponsor Banner" 
                className="w-full h-auto block object-contain"
                loading="lazy"
              />
            </a>
          </div>

          {/* Actions & Code beside banner on desktop, stacked on mobile */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-center lg:items-end justify-center gap-3.5 w-full lg:w-auto shrink-0">
            <div className="text-center lg:text-right">
              <span className="text-[11px] font-display font-black text-brand-red uppercase tracking-wider block">
                {isEn ? 'Use Code for 10% Off' : 'Usa el código con 10% de descuento'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
              <button
                onClick={handleCopyCode}
                className="px-5 py-3 rounded-xl bg-black/80 hover:bg-black border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md hover:border-white/40"
                aria-label={isEn ? `Copy discount code ${siteConfig.ringsideCollectibles.code}` : `Copiar código de descuento ${siteConfig.ringsideCollectibles.code}`}
              >
                <span>{copied ? t('home.ringsideCollectibles.copied') : siteConfig.ringsideCollectibles.code}</span>
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <a
                href={siteConfig.ringsideCollectibles.directLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-brand-red hover:bg-[#b91c1c] text-white font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-red/25 active:scale-95"
              >
                <span>{t('home.ringsideCollectibles.buy')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal for Selected Event */}
      {selectedEvent && (() => {
        const parsedDate = parseEventDateTime(selectedEvent.date, selectedEvent.start_time, selectedEvent.timezone);
        const targetLocale = isEn ? 'en-US' : 'es-ES';
        const eventTitle = isEn && selectedEvent.title_en ? selectedEvent.title_en : (selectedEvent.title_es || selectedEvent.title);

        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedEvent(null)}
          >
            <div 
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#17171C] overflow-hidden shadow-2xl relative animate-scale-up text-left text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-44 bg-black/60 relative flex items-center justify-center border-b border-white/10 p-4">
                <img 
                  src={getProgramIcon(selectedEvent.program_type)} 
                  alt={eventTitle}
                  className="max-w-full max-h-full object-contain relative z-10"
                />
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-red text-white">
                    {selectedEvent.program_type.toUpperCase()}
                  </span>
                  {getStatusBadge(selectedEvent.status)}
                </div>

                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight m-0">
                  {eventTitle}
                </h3>

                <div className="flex items-center gap-2 text-xs text-white/80 font-mono bg-white/5 p-3 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-brand-red shrink-0" />
                  <span>
                    {formatEventDate(parsedDate, targetLocale)} &bull; {formatEventTime(parsedDate)} ({formatLocalTimezoneAbbr(parsedDate)})
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/70 leading-relaxed m-0">
                  {selectedEvent.description}
                </p>

                <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                  <a
                    href={selectedEvent.youtube_url || siteConfig.platforms.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-3 rounded-xl bg-brand-red hover:bg-[#b91c1c] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>YouTube</span>
                  </a>
                  <button
                    onClick={() => generateIcsFile(selectedEvent)}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isEn ? 'Save' : 'Guardar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
