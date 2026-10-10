import React, { useState, useEffect, useRef } from 'react';
import type { CalendarEvent } from '../types/calendar';
import { fetchCalendarEvents } from '../services/calendarService';
import { generateIcsFile, parseEventDateTime, formatEventDate, formatEventTime, formatLocalTimezoneAbbr, getCountdown } from '../utils/dates';
import type { CountdownTime } from '../utils/dates';
import { resolveAsset } from '../utils/assets';
import { Calendar, RefreshCw, AlertTriangle, Download, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CalendarPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = useState<'semanal' | 'mensual'>('semanal');
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPle, setNextPle] = useState<CalendarEvent | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.86 + 16));
    if (index >= 0 && index < filteredEvents.length) {
      setActiveIndex(index);
    }
  };

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeFilter]);

  const getModalButtonStyling = (programType: string) => {
    switch (programType) {
      case 'raw':
        return {
          primary: "bg-[#E10600] hover:bg-[#B30000] text-white shadow-[0_4px_14px_rgba(225,6,0,0.3)] hover:shadow-[0_0_20px_rgba(225,6,0,0.55)]",
          secondary: "border-brand-red/35 hover:border-brand-red hover:text-brand-red text-gray-700",
          hoverBorder: "hover:border-[#E10600] hover:text-[#E10600]"
        };
      case 'dynamite':
        return {
          primary: "bg-[#7B2CBF] hover:bg-[#5A189A] text-white shadow-[0_4px_14px_rgba(123,44,191,0.3)] hover:shadow-[0_0_20px_rgba(123,44,191,0.55)]",
          secondary: "border-[#7B2CBF]/35 hover:border-[#7B2CBF] hover:text-[#7B2CBF] text-gray-700",
          hoverBorder: "hover:border-[#7B2CBF] hover:text-[#7B2CBF]"
        };
      case 'smackdown':
        return {
          primary: "bg-[#0056b3] hover:bg-[#004085] text-white shadow-[0_4px_14px_rgba(0,86,179,0.3)] hover:shadow-[0_0_20px_rgba(0,86,179,0.55)]",
          secondary: "border-[#0056b3]/35 hover:border-[#0056b3] hover:text-[#0056b3] text-gray-700",
          hoverBorder: "hover:border-[#0056b3] hover:text-[#0056b3]"
        };
      default:
        return {
          primary: "bg-gradient-to-r from-[#B00000] to-[#E10600] text-white hover:brightness-110 shadow-[0_4px_15px_rgba(225,6,0,0.3)] hover:shadow-[0_0_25px_rgba(225,6,0,0.55)]",
          secondary: "border-brand-red/35 hover:border-brand-red hover:text-brand-red text-gray-700",
          hoverBorder: "hover:border-brand-red hover:text-brand-red"
        };
    }
  };

  const currentLang = i18n.language === 'en' ? 'en-US' : 'es-ES';

  // Load calendar events
  const loadEvents = async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCalendarEvents(force);
      setEvents(data);
      
      // Find the next upcoming featured/PLE event for the countdown banner
      const nowStr = new Date().toISOString().split('T')[0];
      const upcomingPles = data.filter(e => 
        (e.event_type === 'ple' || e.program_type === 'ple') && 
        e.date >= nowStr &&
        e.status !== 'completed'
      );
      if (upcomingPles.length > 0) {
        setNextPle(upcomingPles[0]);
      } else {
        setNextPle(null);
      }
    } catch (err) {
      setError(t('calendar.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [i18n.language]);

  // Update countdown clock for the next PLE
  useEffect(() => {
    if (!nextPle) return;

    const pleDateTime = parseEventDateTime(nextPle.date, nextPle.start_time, nextPle.timezone);
    
    const interval = setInterval(() => {
      const time = getCountdown(pleDateTime);
      setCountdown(time);
      if (time.totalMs <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPle]);

  // Filters mapping
  const filterOptions = [
    { id: 'todos', label: i18n.language === 'en' ? 'All' : 'Todos' },
    { id: 'raw', label: 'WWE RAW' },
    { id: 'dynamite', label: 'AEW Dynamite' },
    { id: 'smackdown', label: 'WWE SmackDown' },
    { id: 'ple', label: 'PLEs' },
    { id: 'special', label: t('calendar.type.special') },
  ];

  // Apply filters
  const filteredEvents = events.filter(e => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'ple') return e.event_type === 'ple' || e.program_type === 'ple';
    if (activeFilter === 'special') return e.event_type === 'special' || e.program_type === 'special';
    return e.program_type === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-brand-red text-white animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            {t('calendar.status.live')}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-white/10 text-white/60 border border-white/10">
            {t('calendar.status.completed')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-950/40 text-brand-red border border-brand-red/30">
            {t('calendar.status.cancelled')}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-white/10 text-white/80 border border-white/10">
            {t('calendar.status.upcoming')}
          </span>
        );
    }
  };

  // Group events by day for weekly/grid view
  const groupEventsByWeek = () => {
    return filteredEvents;
  };

  // Helper to resolve card border & tags for PLEs
  const getCardStyling = (event: CalendarEvent) => {
    const isPle = event.event_type === 'ple' || event.program_type === 'ple';
    if (isPle) {
      return "border-2 border-[#FFD400] shadow-[0_0_25px_rgba(255,212,0,0.18)] hover:shadow-[0_0_35px_rgba(255,212,0,0.3)] bg-[#0A0A0A] text-white";
    }
    return "border border-white/10 bg-[#0A0A0A] text-white shadow-xs hover:border-brand-red/40";
  };

  return (
    <div className="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      
      {/* 1. COUNTDOWN BANNER (For Next PLE) */}
      {nextPle && countdown && countdown.totalMs > 0 && (() => {
        return (
          <section className="relative overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 border-2 border-[#FFD400] bg-gradient-to-r from-[#1c1800] via-[#0d0c04] to-[#0a0a0a] shadow-[0_0_35px_rgba(255,212,0,0.25)]">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-[#FFD400]/10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-[#FFD400]/10" />
            
            <div className="flex items-center gap-4 text-left w-full md:w-auto relative z-10">
              {nextPle.logo_url || nextPle.banner_url ? (
                <div className="w-20 h-20 rounded-xl bg-black/60 flex items-center justify-center shrink-0 overflow-hidden p-2 shadow-inner border border-[#FFD400]/50">
                  <img 
                    src={resolveAsset(nextPle.logo_url || nextPle.banner_url!)} 
                    alt={i18n.language === 'en' && nextPle.title_en ? nextPle.title_en : (nextPle.title_es || nextPle.title)}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="p-3.5 rounded-full bg-[#FFD400]/10 text-[#FFD400] shrink-0 border border-[#FFD400]/30">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              )}
              <div>
                <span className="px-2 py-0.5 rounded text-black text-[9px] font-black uppercase tracking-widest bg-[#FFD400] shadow-[0_0_12px_rgba(255,212,0,0.45)]">
                  {i18n.language === 'en' ? 'Next Premium Live Event (PLE)' : 'Próximo Evento Premium (PLE)'}
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-white mt-1 mb-0 leading-tight">
                  {i18n.language === 'en' && nextPle.title_en ? nextPle.title_en : (nextPle.title_es || nextPle.title)}
                </h3>
                <p className="text-xs text-white/50 m-0 mt-1">
                  {formatEventDate(parseEventDateTime(nextPle.date, nextPle.start_time, nextPle.timezone), currentLang)} {t('calendar.at', { defaultValue: i18n.language === 'en' ? 'at' : 'a las' })} {formatEventTime(parseEventDateTime(nextPle.date, nextPle.start_time, nextPle.timezone))} ({formatLocalTimezoneAbbr(parseEventDateTime(nextPle.date, nextPle.start_time, nextPle.timezone))})
                </p>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex gap-2 sm:gap-4 select-none w-full md:w-auto justify-center relative z-10">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center font-mono text-xl sm:text-2xl font-black shadow-inner transition-all bg-gradient-to-b from-[#262100] via-[#120f00] to-black border border-[#FFD400]/50 text-[#FFD400] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {String(countdown.days).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-[#FFD400]/70 uppercase font-bold mt-1">{t('calendar.countdown.days')}</span>
              </div>
              <span className="text-xl sm:text-2xl font-mono font-black text-[#FFD400]/40 self-center -mt-4">:</span>
              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center font-mono text-xl sm:text-2xl font-black shadow-inner transition-all bg-gradient-to-b from-[#262100] via-[#120f00] to-black border border-[#FFD400]/50 text-[#FFD400] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-[#FFD400]/70 uppercase font-bold mt-1">{t('calendar.countdown.hours')}</span>
              </div>
              <span className="text-xl sm:text-2xl font-mono font-black text-[#FFD400]/40 self-center -mt-4">:</span>
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center font-mono text-xl sm:text-2xl font-black shadow-inner transition-all bg-gradient-to-b from-[#262100] via-[#120f00] to-black border border-[#FFD400]/50 text-[#FFD400] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-[#FFD400]/70 uppercase font-bold mt-1">{t('calendar.countdown.minutes')}</span>
              </div>
              <span className="text-xl sm:text-2xl font-mono font-black text-[#FFD400]/40 self-center -mt-4">:</span>
              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center font-mono text-xl sm:text-2xl font-black shadow-inner transition-all bg-gradient-to-b from-[#262100] via-[#120f00] to-black border border-[#FFD400]/50 text-[#FFD400] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <span className="text-[9px] text-[#FFD400]/70 uppercase font-bold mt-1">{t('calendar.countdown.seconds')}</span>
              </div>
            </div>

          </section>
        );
      })()}

      {/* 2. HEADER AND VIEW SWITCHER */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight m-0">
            {t('calendar.title')}
          </h2>
          <p className="text-sm font-medium text-white/90 mt-1.5 leading-relaxed">
            {t('calendar.desc')}
          </p>
        </div>

        {/* Desktop View Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => loadEvents(true)}
            className="p-2.5 rounded-xl border border-white/20 hover:border-brand-red bg-[#17171C] hover:bg-white/10 text-white hover:text-brand-red transition-all cursor-pointer shadow-md"
            title={i18n.language === 'en' ? 'Refresh schedule' : 'Refrescar programación'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="hidden md:flex rounded-xl p-1 bg-[#17171C] border border-white/20">
            <button
              onClick={() => setViewMode('semanal')}
              className={`px-4 py-2 rounded-lg text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'semanal' 
                  ? 'bg-brand-red text-white shadow-md' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {i18n.language === 'en' ? 'Weekly View' : 'Vista Semanal'}
            </button>
            <button
              onClick={() => setViewMode('mensual')}
              className={`px-4 py-2 rounded-lg text-xs font-display font-black uppercase tracking-wider transition-all cursor-pointer ${
                viewMode === 'mensual' 
                  ? 'bg-brand-red text-white shadow-md' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {i18n.language === 'en' ? 'Monthly View' : 'Vista Mensual'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. FILTER PILLS */}
      <section className="flex overflow-x-auto gap-2.5 no-scrollbar pb-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveFilter(opt.id)}
            className={`px-4 py-2 rounded-xl text-xs font-display font-black uppercase tracking-wider whitespace-nowrap border transition-all cursor-pointer ${
              activeFilter === opt.id
                ? 'bg-brand-red text-white border-brand-red shadow-[0_4px_14px_rgba(225,6,0,0.35)]'
                : 'bg-[#17171C] text-white/90 border-white/20 hover:border-white/40 hover:text-white shadow-xs'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </section>

      {/* 4. CALENDAR VIEWS CONTENT */}
      
      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col gap-6">
          <div className="h-10 w-44 rounded bg-gray-100 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-60 rounded-xl bg-gray-100 border border-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="bg-[#0A0A0A] p-8 text-center rounded-xl border border-brand-red/30 max-w-xl mx-auto flex flex-col items-center gap-4 shadow-sm text-white">
          <AlertTriangle className="w-12 h-12 text-brand-red" />
          <div>
            <h4 className="text-base font-display font-bold uppercase text-white m-0">
              {i18n.language === 'en' ? 'Connection Error' : 'Error de Conexión'}
            </h4>
            <p className="text-xs text-white/70 mt-1 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => loadEvents(true)}
            className="px-5 py-2.5 rounded bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {i18n.language === 'en' ? 'Try Again' : 'Volver a intentar'}
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="bg-[#0A0A0A] p-16 text-center rounded-xl border border-white/10 max-w-md mx-auto shadow-sm text-white">
          <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h4 className="text-base font-display font-bold uppercase text-white m-0">
            {i18n.language === 'en' ? 'No events found' : 'No se encontraron eventos'}
          </h4>
          <p className="text-xs text-white/60 mt-1 leading-relaxed">
            {i18n.language === 'en' 
              ? 'There are no shows matching the selected category at this moment.' 
              : 'No existen shows que coincidan con la categoría seleccionada en estos momentos.'}
          </p>
        </div>
      )}

      {/* RENDER EVENT SHEETS */}
      {!loading && !error && filteredEvents.length > 0 && (
        <>
          {/* A. WEEKLY VIEW */}
          {(viewMode === 'semanal' || window.innerWidth < 768) && (
            <div className="flex flex-col gap-4">
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="calendar-scroll md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0 -mx-4 px-4"
              >
                {groupEventsByWeek().map((event) => {
                  const parsedDate = parseEventDateTime(event.date, event.start_time, event.timezone);
                  const isPle = event.event_type === 'ple' || event.program_type === 'ple';
                  const eventTitle = i18n.language === 'en' && event.title_en ? event.title_en : (event.title_es || event.title);
                  const eventDesc = i18n.language === 'en' && event.description_en ? event.description_en : (event.description_es || event.description);
                  
                  return (
                    <article
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`calendar-card-mobile md:w-auto shrink-0 rounded-xl p-5 flex flex-col justify-between text-left transition-all duration-300 relative group min-h-[340px] cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${getCardStyling(event)}`}
                    >
                      <div>
                        {/* Banner if PLE, else basic logo top slot */}
                        {isPle && event.banner_url ? (
                          <div className="h-32 w-full rounded-lg bg-black/60 overflow-hidden border border-white/10 mb-4 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-brand-red/10 mix-blend-overlay" />
                            <img 
                              src={resolveAsset(event.banner_url)} 
                              alt={eventTitle}
                              className="max-w-full max-h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-brand-red text-white text-[9px] font-black uppercase tracking-wider shadow">
                              PLE
                            </div>
                          </div>
                        ) : (
                          <div className="h-28 w-full rounded-lg bg-black/60 flex items-center justify-center border border-white/10 mb-4 relative overflow-hidden">
                            <img 
                              src={resolveAsset(event.logo_url)} 
                              alt={eventTitle}
                              className="h-24 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}

                        {/* Header row: badge types & status */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex gap-1.5 items-center">
                            {isPle && !event.banner_url && (
                              <span className="px-2.5 py-1 rounded-md bg-brand-red text-white text-[11px] font-black uppercase tracking-wider">
                                PLE
                              </span>
                            )}
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/20">
                              {event.event_type === 'weekly' ? (i18n.language === 'en' ? 'Weekly' : 'Semanal') : (i18n.language === 'en' ? 'Special' : 'Especial')}
                            </span>
                          </div>
                          {getStatusBadge(event.status)}
                        </div>

                        {/* Title */}
                        <h4 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight m-0 line-clamp-1">
                          {eventTitle}
                        </h4>

                        {/* Date & Time: High-contrast white and clear font */}
                        <div className="flex items-center gap-1.5 text-xs text-white font-medium mt-1.5 bg-white/5 py-1 px-2 rounded-md border border-white/10">
                          <Clock className="w-4 h-4 text-brand-red shrink-0" />
                          <span className="text-white font-semibold">
                            {formatEventDate(parsedDate, currentLang)} &bull; {formatEventTime(parsedDate)} ({formatLocalTimezoneAbbr(parsedDate)})
                          </span>
                        </div>

                        {/* Description: Bright readable white text */}
                        <p className="text-sm text-white/90 font-normal leading-relaxed mt-3 line-clamp-2">
                          {eventDesc || (i18n.language === 'en' ? "Official podcast broadcast analyzing wrestling news." : "Transmisión oficial del podcast analizando lo último del wrestling.")}
                        </p>
                      </div>

                      {/* Actions slots */}
                      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                        <div className="flex gap-2">
                          {event.youtube_url && (
                            <a
                              href={event.youtube_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 px-3 py-2 rounded bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.096-2.099C19.56 3.75 12 3.75 12 3.75s-7.56 0-9.402.514c-1.022.273-1.824 1.077-2.096 2.099C0 8.002 0 12 0 12s0 3.998.502 5.837c.272 1.022 1.074 1.826 2.096 2.099C4.44 20.25 12 20.25 12 20.25s7.56 0 9.402-.514c1.022-.273 1.824-1.077 2.096-2.099C24 15.998 24 12 24 12s0-3.998-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                              </svg>
                              YouTube
                            </a>
                          )}
                          {event.patreon_url && (
                            <a
                              href={event.patreon_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                            >
                              Patreon
                            </a>
                          )}
                        </div>
                        
                        {/* ICS Export Trigger */}
                        <button
                          onClick={(e) => { e.stopPropagation(); generateIcsFile(event); }}
                          className="w-full px-3 py-2 rounded border border-white/10 hover:border-brand-red hover:text-brand-red bg-white/5 hover:bg-white/10 text-white/90 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {t('calendar.addCalendar')}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination Dots (Mobile Only) */}
              {groupEventsByWeek().length > 1 && (
                <div className="flex md:hidden items-center justify-center gap-2 mt-2">
                  {groupEventsByWeek().map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          const container = scrollContainerRef.current;
                          const cardWidth = container.scrollWidth / groupEventsByWeek().length;
                          container.scrollTo({
                            left: idx * cardWidth,
                            behavior: 'smooth'
                          });
                          setActiveIndex(idx);
                        }
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeIndex === idx 
                          ? 'bg-brand-red w-4' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* B. MONTHLY VIEW */}
          {viewMode === 'mensual' && window.innerWidth >= 768 && (
            <div className="bg-[#0A0A0A] rounded-xl p-6 border border-white/10 shadow-sm flex flex-col gap-6 text-white">
              
              {/* Simple Table list sorted by Date */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/20 text-white font-display font-black text-xs uppercase tracking-wider">
                      <th className="py-3 px-4">{i18n.language === 'en' ? 'Date' : 'Fecha'}</th>
                      <th className="py-3 px-4">{i18n.language === 'en' ? 'Show / Event' : 'Show / Evento'}</th>
                      <th className="py-3 px-4">{i18n.language === 'en' ? 'Type' : 'Tipo'}</th>
                      <th className="py-3 px-4">{i18n.language === 'en' ? 'Time' : 'Hora'}</th>
                      <th className="py-3 px-4">{i18n.language === 'en' ? 'Status' : 'Estado'}</th>
                      <th className="py-3 px-4 text-right">{i18n.language === 'en' ? 'Actions' : 'Acciones'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => {
                      const parsedDate = parseEventDateTime(event.date, event.start_time, event.timezone);
                      const isPle = event.event_type === 'ple' || event.program_type === 'ple';
                      const eventTitle = i18n.language === 'en' && event.title_en ? event.title_en : (event.title_es || event.title);
                      const eventDesc = i18n.language === 'en' && event.description_en ? event.description_en : (event.description_es || event.description);

                      return (
                        <tr 
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`border-b border-white/10 text-sm hover:bg-white/5 transition-colors cursor-pointer ${
                            isPle ? 'bg-brand-red/10' : ''
                          }`}
                        >
                          {/* Date info */}
                          <td className="py-4 px-4 font-bold whitespace-nowrap text-white text-sm">
                            {formatEventDate(parsedDate, currentLang)}
                          </td>
                          
                          {/* Title and small description */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={resolveAsset(event.logo_url)} 
                                alt=""
                                className="w-8 h-8 rounded bg-black/60 border border-white/10 object-contain p-0.5 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-base block uppercase tracking-tight text-white">
                                  {eventTitle}
                                </span>
                                <span className="text-xs text-white/90 block mt-0.5 line-clamp-1">
                                  {eventDesc}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="py-4 px-4 uppercase text-xs font-bold">
                            <span className={`px-2.5 py-1 rounded text-xs font-black tracking-wider ${
                              isPle 
                                ? 'bg-[#FFD400] text-black border border-[#FFD400]' 
                                : 'bg-white/15 text-white border border-white/20'
                            }`}>
                              {event.event_type === 'weekly' ? (i18n.language === 'en' ? 'Weekly' : 'Semanal') : (i18n.language === 'en' ? 'Special' : 'Especial')}
                            </span>
                          </td>

                          {/* Time */}
                          <td className="py-4 px-4 font-semibold text-xs whitespace-nowrap text-white">
                            {formatEventTime(parsedDate)} ({formatLocalTimezoneAbbr(parsedDate)})
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {getStatusBadge(event.status)}
                          </td>

                          {/* Action Button Triggers */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              {event.youtube_url && (
                                <a
                                  href={event.youtube_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 rounded bg-brand-red hover:bg-brand-red-hover text-white transition-colors cursor-pointer"
                                  title="YouTube"
                                >
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.096-2.099C19.56 3.75 12 3.75 12 3.75s-7.56 0-9.402.514c-1.022.273-1.824 1.077-2.096 2.099C0 8.002 0 12 0 12s0 3.998.502 5.837c.272 1.022 1.074 1.826 2.096 2.099C4.44 20.25 12 20.25 12 20.25s7.56 0 9.402-.514c1.022-.273 1.824-1.077 2.096-2.099C24 15.998 24 12 24 12s0-3.998-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                  </svg>
                                </a>
                              )}
                              {event.patreon_url && (
                                <a
                                  href={event.patreon_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
                                  title="Patreon"
                                >
                                  <span className="text-[10px] font-extrabold font-sans">PAT</span>
                                </a>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); generateIcsFile(event); }}
                                className="p-2 rounded border border-white/10 hover:border-brand-red hover:text-brand-red bg-white/5 text-white/80 hover:text-white transition-colors cursor-pointer"
                                title={t('calendar.addCalendar')}
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </>
      )}

      {/* EVENT DETAIL MODAL */}
      {selectedEvent && (() => {
        const btnStyles = getModalButtonStyling(selectedEvent.program_type);
        return (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedEvent(null)}
          >
            <div 
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden shadow-2xl relative animate-scale-up text-left text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Image Banner */}
              <div className="h-48 bg-black/60 relative flex items-center justify-center border-b border-white/10">
                <div className="absolute inset-0 bg-brand-red/5" />
                <img 
                  src={resolveAsset(selectedEvent.banner_url || selectedEvent.logo_url)} 
                  alt={i18n.language === 'en' && selectedEvent.title_en ? selectedEvent.title_en : (selectedEvent.title_es || selectedEvent.title)}
                  className="max-w-full max-h-full object-contain p-4 relative z-10"
                />
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-xs transition-all cursor-pointer z-20"
                  title={i18n.language === 'en' ? 'Close modal' : 'Cerrar modal'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-4">
                {/* Badges */}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-red text-white`}>
                    {selectedEvent.event_type === 'ple' || selectedEvent.program_type === 'ple' ? 'PLE' : (i18n.language === 'en' ? 'Special' : 'Especial')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/10 text-white/80 border border-white/10">
                    {selectedEvent.event_type === 'weekly' 
                      ? (i18n.language === 'en' ? 'Weekly Stream' : 'Transmisión Semanal') 
                      : (i18n.language === 'en' ? 'Special Event' : 'Evento Especial')}
                  </span>
                  {getStatusBadge(selectedEvent.status)}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight m-0 leading-tight">
                  {i18n.language === 'en' && selectedEvent.title_en ? selectedEvent.title_en : (selectedEvent.title_es || selectedEvent.title)}
                </h3>

                {/* Date, Time & Timezone */}
                <div className="flex items-center gap-2 text-xs text-white/80 font-mono bg-white/5 p-3 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-brand-red shrink-0" />
                  <span>
                    {formatEventDate(parseEventDateTime(selectedEvent.date, selectedEvent.start_time, selectedEvent.timezone), currentLang)} &bull; {formatEventTime(parseEventDateTime(selectedEvent.date, selectedEvent.start_time, selectedEvent.timezone))} ({formatLocalTimezoneAbbr(parseEventDateTime(selectedEvent.date, selectedEvent.start_time, selectedEvent.timezone))})
                  </span>
                </div>

                {/* Full Description */}
                <div className="text-sm text-white/70 leading-relaxed max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  <p className="m-0 whitespace-pre-line">
                    {(i18n.language === 'en' && selectedEvent.description_en ? selectedEvent.description_en : (selectedEvent.description_es || selectedEvent.description)) || 
                      (i18n.language === 'en' ? "No additional details for this event. Join us for the live stream." : "No hay descripción adicional para este evento. Acompáñanos en la transmisión en vivo.")}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-white/10">
                  {selectedEvent.youtube_url && (
                    <a
                      href={selectedEvent.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`flex-1 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${btnStyles.primary}`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.096-2.099C19.56 3.75 12 3.75 12 3.75s-7.56 0-9.402.514c-1.022.273-1.824 1.077-2.096 2.099C0 8.002 0 12 0 12s0 3.998.502 5.837c.272 1.022 1.074 1.826 2.096 2.099C4.44 20.25 12 20.25 12 20.25s7.56 0 9.402-.514c1.022-.273 1.824-1.077 2.096-2.099C24 15.998 24 12 24 12s0-3.998-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      YouTube
                    </a>
                  )}
                  {selectedEvent.patreon_url && (
                    <a
                      href={selectedEvent.patreon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`flex-1 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${btnStyles.primary}`}
                    >
                      Patreon
                    </a>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); generateIcsFile(selectedEvent); }}
                    className={`px-4 py-3 rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0`}
                  >
                    <Download className="w-4 h-4" />
                    {i18n.language === 'en' ? 'Save' : 'Guardar'}
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
