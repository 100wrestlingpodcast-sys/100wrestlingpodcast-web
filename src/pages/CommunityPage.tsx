import React from 'react';
import { siteConfig } from '../data/siteConfig';
import { patreonLogo } from '../utils/assets';
import { Award, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CommunityPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* Page Header */}
      <section className="border-b border-white/15 pb-6">
        <h2 className="text-2xl sm:text-3xl font-display font-black uppercase text-white tracking-tight m-0">
          {t('community.title')}
        </h2>
        <p className="text-sm text-white/80 mt-1.5">
          {t('community.desc')}
        </p>
      </section>

      {/* Spotify & Apple Podcast Premium Banner Section */}
      <section className="relative overflow-hidden rounded-3xl border border-gray-200 p-8 md:p-12 shadow-xl flex flex-col items-center text-center justify-center min-h-[460px] bg-podcast-premium group">
        
        {/* Deep ambient glows & particles */}
        <div className="absolute top-10 left-12 w-32 h-32 rounded-full bg-[#872EC4]/25 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-10 right-12 w-40 h-40 rounded-full bg-[#1DB954]/20 blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        
        {/* Soft floating bokeh particles */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-white/10 blur-[1px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-white/5 blur-[2px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-10 w-2 h-2 rounded-full bg-white/15 blur-[1px] animate-pulse" style={{ animationDuration: '3s' }} />

        {/* Text Header Content */}
        <div className="relative z-10 max-w-2xl flex flex-col items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-black/40 text-brand-gold text-[10px] font-display font-black uppercase tracking-widest border border-brand-gold/15">
            {t('community.audio.badge')}
          </span>
          <h3 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-tight m-0 drop-shadow-md">
            {t('community.audio.title')}
          </h3>
          <p className="text-white/90 text-xs sm:text-sm leading-relaxed max-w-xl">
            {t('community.audio.desc')}
          </p>
        </div>

        {/* Brand Grid Container */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full max-w-4xl mt-10 pt-10 border-t border-white/15">
          
          {/* Apple Podcasts */}
          <div className="flex flex-col items-center gap-6 group/apple">
            <a 
              href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086"
              target="_blank"
              rel="noopener noreferrer"
              className="w-28 h-28 flex items-center justify-center rounded-3xl bg-black/40 border border-white/20 shadow-[0_0_30px_rgba(135,46,196,0.35)] hover:shadow-[0_0_50px_rgba(135,46,196,0.6)] transition-all duration-300 hover:scale-105 hover:border-white/40 cursor-pointer p-5"
            >
              {/* Apple Podcasts Official Logo */}
              <svg 
                role="img" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-16 h-16 text-[#D56DFB] group-hover/apple:text-white transition-all duration-300"
              >
                <path d="M5.65 18.05A9.25 9.25 0 1 1 18.35 18.05" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <path d="M8.1 15.6A5.75 5.75 0 1 1 15.9 15.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <circle cx="12" cy="11.2" r="2.1" fill="currentColor" />
                <path d="M9.6 15.4c0-1.05.95-1.8 2.4-1.8s2.4.75 2.4 1.8l-.65 5.1c-.12.9-.85 1.5-1.75 1.5s-1.63-.6-1.75-1.5l-.65-5.1z" fill="currentColor" />
              </svg>
            </a>
            
            <a 
              href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#872EC4] hover:bg-[#A14BE0] text-white font-display font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(135,46,196,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer shadow-lg"
            >
              {/* Mini Icon */}
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M5.65 18.05A9.25 9.25 0 1 1 18.35 18.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8.1 15.6A5.75 5.75 0 1 1 15.9 15.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="11.2" r="2.1" fill="currentColor" />
                <path d="M9.6 15.4c0-1.05.95-1.8 2.4-1.8s2.4.75 2.4 1.8l-.65 5.1c-.12.9-.85 1.5-1.75 1.5s-1.63-.6-1.75-1.5l-.65-5.1z" fill="currentColor" />
              </svg>
              {t('community.audio.appleBtn')}
            </a>
          </div>

          {/* Spotify */}
          <div className="flex flex-col items-center gap-6 group/spotify">
            <a 
              href="https://open.spotify.com/show/1wfTq0D1muEOUrZAIpgyiJ?si=LXFHJE3lRSK5D4hhp3HXkA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-28 h-28 flex items-center justify-center rounded-3xl bg-black/40 border border-white/20 shadow-[0_0_30px_rgba(29,185,84,0.35)] hover:shadow-[0_0_50px_rgba(29,185,84,0.6)] transition-all duration-300 hover:scale-105 hover:border-white/40 cursor-pointer p-5"
            >
              {/* Spotify Official Logo */}
              <svg 
                role="img" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-16 h-16 text-[#1DB954] group-hover/spotify:text-[#1ED760] transition-colors duration-300"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.076-.67-.135-.746-.47-.077-.337.135-.67.47-.747 3.856-.88 7.15-.509 9.822 1.13.295.18.387.563.207.862zm1.224-2.724c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.848-.107-.973-.52-.125-.413.108-.847.52-.972 3.67-1.114 8.24-.57 11.35 1.345.366.226.486.707.26 1.07zm.106-2.833C14.382 8.87 8.533 8.68 5.136 9.712c-.525.16-1.077-.142-1.237-.667-.16-.526.142-1.077.667-1.237 3.905-1.185 10.37-.96 14.45 1.46.475.282.63.897.347 1.372-.28.475-.895.63-1.37.347z"/>
              </svg>
            </a>
            
            <a 
              href="https://open.spotify.com/show/1wfTq0D1muEOUrZAIpgyiJ?si=LXFHJE3lRSK5D4hhp3HXkA"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#1DB954] hover:bg-[#1ED760] text-brand-black font-display font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(29,185,84,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer shadow-lg"
            >
              {/* Mini Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              {t('community.audio.spotifyBtn')}
            </a>
          </div>

        </div>
      </section>

      {/* Patreon Community Card (Discord hidden until active invite link is ready) */}
      <div className="grid grid-cols-1 gap-6 w-full mt-4">
        
        {/* Patreon Premium Promo Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] border border-brand-gold/30 p-6 md:p-8 text-left flex flex-col justify-between gap-6 shadow-xl hover:border-brand-gold transition-all min-h-[280px] text-white">
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-gold" />
              <span className="text-[10px] font-display font-black text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-full border border-brand-gold/30 uppercase tracking-widest">
                {t('community.patreon.badge')}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <img 
                src={patreonLogo} 
                alt="Patreon Premium Logo" 
                className="w-16 h-16 rounded-full bg-black/60 border border-white/10 p-1 shrink-0 object-contain shadow-xs"
              />
              <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-white tracking-tight m-0">
                {t('community.patreon.title')}
              </h3>
            </div>
            
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {t('community.patreon.desc')}
            </p>
          </div>

          <a
            href={siteConfig.patreonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-black font-display font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer self-start relative z-10"
          >
            {t('community.patreon.joinBtn')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>

      </div>

    </div>
  );
};
