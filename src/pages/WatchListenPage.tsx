import React from 'react';
import { siteConfig } from '../data/siteConfig';
import { ExternalLink, Headphones, Video, Radio, Sparkles, Play, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const WatchListenPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const platforms = [
    {
      name: 'YouTube',
      type: isEn ? 'Video & Live Streams' : 'Video y Transmisiones en Vivo',
      desc: isEn 
        ? 'Watch all full episode reviews, live PLE watch-alongs, breaking news and official shorts.' 
        : 'Mira todos los reviews de episodios completos, transmisiones en vivo de PLEs y clips destacados.',
      url: siteConfig.platforms.youtube,
      badge: isEn ? 'Main Video Hub' : 'Canal Principal de Video',
      color: 'from-[#FF0000] to-[#990000]',
      icon: Play,
      cta: isEn ? 'Watch on YouTube' : 'Ver en YouTube'
    },
    {
      name: 'Spotify',
      type: isEn ? 'Audio & Video Podcast' : 'Podcast de Audio y Video',
      desc: isEn 
        ? 'Listen on the go or watch full video episodes directly inside the Spotify app.' 
        : 'Escucha los episodios en cualquier lugar o míralos en formato video dentro de Spotify.',
      url: siteConfig.platforms.spotify,
      badge: isEn ? 'Audio & Video' : 'Audio y Video',
      color: 'from-[#1DB954] to-[#0D6B2D]',
      icon: Headphones,
      cta: isEn ? 'Listen on Spotify' : 'Escuchar en Spotify'
    },
    {
      name: 'Apple Podcasts',
      type: isEn ? 'High Fidelity Audio' : 'Audio en Alta Calidad',
      desc: isEn 
        ? 'Subscribe on Apple Podcasts to get automatic episode downloads and notifications.' 
        : 'Suscríbete en Apple Podcasts para descargas automáticas de cada nuevo episodio.',
      url: siteConfig.platforms.apple,
      badge: isEn ? 'Official Feed' : 'Feed Oficial',
      color: 'from-[#872EC4] to-[#4A1570]',
      icon: Radio,
      cta: isEn ? 'Listen on Apple Podcasts' : 'Escuchar en Apple Podcasts'
    },
    {
      name: 'Patreon VIP',
      type: isEn ? 'Uncensored & Early Access' : 'Sin Censura y Acceso Anticipado',
      desc: isEn 
        ? 'Exclusive shows including La Terapia en Vivo, real-time match reactions, private chat and raw commentary.' 
        : 'Shows exclusivos incluyendo La Terapia en Vivo, reacciones en tiempo real, chat privado y contenido sin censura.',
      url: siteConfig.platforms.patreon,
      badge: isEn ? 'Exclusive Membership' : 'Membresía Exclusiva',
      color: 'from-[#E10600] to-[#B00000]',
      icon: Sparkles,
      cta: isEn ? 'Access Patreon' : 'Entrar a Patreon'
    }
  ];

  return (
    <div className="flex flex-col gap-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* 1. Header Hero */}
      <section className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded bg-brand-red text-white text-[10px] font-black uppercase tracking-wider">
            {isEn ? 'Directory' : 'Directorio Oficial'}
          </span>
          <span className="text-[10px] font-mono text-white/50 uppercase">
            100% Wrestling Podcast
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-tight m-0 leading-tight">
          {isEn ? 'Watch and Listen' : 'Ver y escuchar'}
        </h1>
        <p className="text-sm sm:text-base text-white/70 mt-2 max-w-3xl leading-relaxed m-0">
          {isEn 
            ? 'Access all 100% Wrestling Podcast broadcasts across your favorite streaming video and audio platforms. Direct links, no filters, updated weekly.'
            : 'Accede a toda la programación de 100% Wrestling Podcast en tus plataformas favoritas de video y audio. Enlaces oficiales directos, sin filtros y actualizados cada semana.'}
        </p>
      </section>

      {/* 2. Platform Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <article 
              key={platform.name}
              className="bg-[#17171C] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300 text-white relative overflow-hidden group"
            >
              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {platform.badge}
                  </span>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-display font-black uppercase text-white m-0 tracking-tight">
                    {platform.name}
                  </h2>
                  <span className="text-xs font-display font-bold text-brand-red uppercase tracking-wider block mt-1">
                    {platform.type}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/70 leading-relaxed m-0">
                  {platform.desc}
                </p>
              </div>

              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r ${platform.color} text-white font-display font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer`}
              >
                <span>{platform.cta}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </article>
          );
        })}
      </section>

      {/* 3. Program Information Banner */}
      <section className="bg-[#17171C] rounded-2xl p-6 sm:p-8 border border-white/10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h3 className="text-lg sm:text-xl font-display font-black uppercase text-white m-0">
            {isEn ? 'Weekly Release Schedule' : 'Horario Semanal de Emisiones'}
          </h3>
          <ul className="text-xs sm:text-sm text-white/70 space-y-1.5 list-none p-0 m-0">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-red shrink-0" />
              <span><strong>WWE RAW Review:</strong> {isEn ? 'Mondays live after RAW' : 'Lunes en vivo al terminar RAW'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-red shrink-0" />
              <span><strong>AEW Dynamite Review:</strong> {isEn ? 'Thursdays live analysis' : 'Jueves análisis en vivo'}</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-brand-red shrink-0" />
              <span><strong>WWE SmackDown Review:</strong> {isEn ? 'Fridays live review' : 'Viernes review completo'}</span>
            </li>
          </ul>
        </div>

        <a
          href={siteConfig.platforms.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-xl bg-brand-red hover:bg-[#b91c1c] text-white font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 whitespace-nowrap active:scale-95 transition-all shadow-[0_4px_14px_rgba(217,0,0,0.3)] cursor-pointer"
        >
          <Video className="w-4 h-4" />
          <span>{isEn ? 'Subscribe to Channel' : 'Suscribirse al canal'}</span>
        </a>
      </section>

    </div>
  );
};
