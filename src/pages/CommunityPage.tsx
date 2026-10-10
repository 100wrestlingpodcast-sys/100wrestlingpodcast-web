import React from 'react';
import { siteConfig } from '../data/siteConfig';
import { patreonLogo } from '../utils/assets';
import { Award, ExternalLink, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CommunityPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* Page Header */}
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-display font-black uppercase text-gray-950 tracking-tight m-0">
          {t('community.title')}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
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
                className="w-16 h-16 text-white group-hover/apple:brightness-110 transition-all duration-300"
              >
                <path 
                  d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.59.12 2.2.007 2.864a8.506 8.506 0 01-3.24 5.296c-.608.46-2.096 1.261-2.336 1.261-.088 0-.096-.091-.056-.46.072-.592.144-.715.48-.856.536-.224 1.448-.874 2.008-1.435a7.644 7.644 0 002.008-3.536c.208-.824.184-2.656-.048-3.504-.728-2.696-2.928-4.792-5.624-5.352-.784-.16-2.208-.16-3 0-2.728.56-4.984 2.76-5.672 5.528-.184.752-.184 2.584 0 3.336.456 1.832 1.64 3.512 3.192 4.512.304.2.672.408.824.472.336.144.408.264.472.856.04.36.03.464-.056.464-.056 0-.464-.176-.896-.384l-.04-.03c-2.472-1.216-4.056-3.274-4.632-6.012-.144-.706-.168-2.392-.03-3.04.36-1.74 1.048-3.1 2.192-4.304 1.648-1.737 3.768-2.656 6.128-2.656zm.134 2.81c.409.004.803.04 1.106.106 2.784.62 4.76 3.408 4.376 6.174-.152 1.114-.536 2.03-1.216 2.88-.336.43-1.152 1.15-1.296 1.15-.023 0-.048-.272-.048-.603v-.605l.416-.496c1.568-1.878 1.456-4.502-.256-6.224-.664-.67-1.432-1.064-2.424-1.246-.64-.118-.776-.118-1.448-.008-1.02.167-1.81.562-2.512 1.256-1.72 1.704-1.832 4.342-.264 6.222l.413.496v.608c0 .336-.027.608-.06.608-.03 0-.264-.16-.512-.36l-.034-.011c-.832-.664-1.568-1.842-1.872-2.997-.184-.698-.184-2.024.008-2.72.504-1.878 1.888-3.335 3.808-4.019.41-.145 1.133-.22 1.814-.211zm-.13 2.99c.31 0 .62.06.844.178.488.253.888.745 1.04 1.259.464 1.578-1.208 2.96-2.72 2.254h-.015c-.712-.331-1.096-.956-1.104-1.77 0-.733.408-1.371 1.112-1.745.224-.117.534-.176.844-.176zm-.011 4.728c.988-.004 1.706.349 1.97.97.198.464.124 1.932-.218 4.302-.232 1.656-.36 2.074-.68 2.356-.44.39-1.064.498-1.656.288h-.003c-.716-.257-.87-.605-1.164-2.644-.341-2.37-.416-3.838-.218-4.302.262-.616.974-.966 1.97-.97z"
                  fill="currentColor"
                />
              </svg>
            </a>
            
            <a 
              href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#872EC4] hover:bg-[#A14BE0] text-white font-display font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(135,46,196,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer shadow-lg"
            >
              {/* Mini Icon */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.93c0 .59-.41 1.07-1 1.07s-1-.48-1-1.07V15c0-.55.45-1 1-1s1 .45 1 1v2.93zm-1-5.18c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
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

      {/* Grid of Patreon and Discord communities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
        
        {/* Patreon Premium Promo Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] border border-brand-gold/30 p-6 md:p-8 text-left flex flex-col justify-between gap-6 shadow-xl hover:border-brand-gold transition-all min-h-[350px] text-white">
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
            
            <p className="text-white/70 text-xs leading-relaxed max-w-xl">
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

        {/* Discord Official Server Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] border border-[#5865F2]/30 p-6 md:p-8 text-left flex flex-col justify-between gap-6 shadow-xl hover:border-[#5865F2] transition-all min-h-[350px] text-white">
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#5865F2]" />
              <span className="text-[10px] font-display font-black text-[#5865F2] bg-[#5865F2]/10 px-2.5 py-0.5 rounded-full border border-[#5865F2]/30 uppercase tracking-widest">
                {t('community.discord.badge')}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 flex items-center justify-center shrink-0 shadow-xs">
                {/* Official Discord Logo */}
                <svg 
                  role="img" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-9 h-9 text-[#5865F2]"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.197.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-black uppercase text-white tracking-tight m-0">
                {t('community.discord.title')}
              </h3>
            </div>
            
            <p className="text-white/70 text-xs leading-relaxed max-w-xl">
              {t('community.discord.desc')}
            </p>
          </div>

          <a
            href="https://discord.gg/100wrestling"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-display font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer self-start relative z-10"
          >
            {t('community.discord.joinBtn')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>

      </div>

    </div>
  );
};
