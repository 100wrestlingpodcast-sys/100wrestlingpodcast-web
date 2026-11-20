import React from 'react';
import { siteConfig } from '../data/siteConfig';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const officialLinks = [
    {
      name: 'YouTube — @100wrestlingpodcast',
      desc: 'Mira todos los reviews en vivo de WWE y AEW, noticias y post-shows con Wiseman en YouTube.',
      url: siteConfig.platforms.youtube
    },
    {
      name: 'Apple Podcasts — 100% Wrestling Podcast',
      desc: 'Escucha y descarga todos los episodios en español de WWE y AEW en Apple Podcasts.',
      url: siteConfig.platforms.apple
    },
    {
      name: 'Instagram — @100wrestlingpodcast',
      desc: 'Noticias de última hora de WWE y AEW, clips exclusivos, reels y resultados en Instagram.',
      url: siteConfig.socials.instagram
    },
    {
      name: 'Facebook — 100% Wrestling Podcast',
      desc: 'Únete a nuestra página oficial de Facebook para debates, videos y noticias diarias de lucha libre.',
      url: siteConfig.socials.facebook
    }
  ];

  return (
    <div className="flex flex-col gap-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      <section className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded bg-brand-red text-white text-[10px] font-black uppercase tracking-wider">
            {isEn ? 'About Us' : 'Historia y Equipo'}
          </span>
          <span className="text-[10px] font-mono text-white/50 uppercase">
            100% Wrestling Podcast
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-tight m-0 leading-tight">
          {isEn ? 'About 100% Wrestling Podcast' : 'Sobre nosotros'}
        </h1>
        <p className="text-sm sm:text-base text-white/75 mt-2 max-w-3xl leading-relaxed m-0">
          {isEn
            ? 'Spanish WWE and AEW news, live post-show reviews and unfiltered pro wrestling analysis hosted by Wiseman (El Wiseman).'
            : 'Noticias, análisis sin filtros y reviews en español de WWE y AEW conducidos por Wiseman (El Wiseman) junto al equipo de 100% Wrestling Podcast.'}
        </p>
      </section>

      <article className="bg-[#17171C] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl text-white flex flex-col gap-5 leading-relaxed text-sm sm:text-base">
        <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white m-0 tracking-tight">
          {isEn ? 'What is 100% Wrestling Podcast?' : '¿Qué es 100% Wrestling Podcast?'}
        </h2>
        <p className="text-white/85 m-0">
          100% Wrestling Podcast es el programa y portal independiente en español dedicado a las noticias, análisis y reviews en vivo de WWE y AEW, creado y conducido por Wiseman (El Wiseman). Cada semana analizamos sin filtros ni compromisos todo lo que ocurre en el mundo de la lucha libre profesional, ofreciendo opiniones directas sobre WWE Monday Night RAW, Friday Night SmackDown, WWE NXT, AEW Dynamite, AEW Collision y Lucha Libre AAA.
        </p>
        <p className="text-white/85 m-0">
          Bajo la dirección de Wiseman (El Wiseman), junto a los coanfitriones DrLuchaLibre, Mr. Tokens, Barbudo y JB Open Mic, realizamos coberturas especiales y post-shows en directo de todos los Premium Live Events (PLE) y Pay-Per-Views del año, incluyendo WrestleMania, SummerSlam, Royal Rumble, Money in the Bank, Survivor Series, AEW All In, All Out, Full Gear y WrestleDream.
        </p>
        <p className="text-white/85 m-0">
          Además de nuestros episodios gratuitos semanales en video y audio, contamos con programas especiales para nuestra comunidad como La Terapia en Vivo, sesiones de preguntas y respuestas (Q&amp;A) y reacciones en tiempo real. Nuestro compromiso es brindar a los fanáticos hispanohablantes de Puerto Rico, Estados Unidos, México, Latinoamérica y España el debate más honesto, apasionado y entretenido sobre WWE y AEW en español.
        </p>
      </article>

      <section className="bg-[#17171C] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl text-white flex flex-col gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-black uppercase text-white m-0 tracking-tight">
            Enlaces Oficiales de 100% Wrestling Podcast
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-1 m-0">
            Síguenos y escúchanos en nuestras plataformas oficiales de YouTube, Apple Podcasts, Instagram y Facebook:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {officialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-black/50 border border-white/10 hover:border-brand-red transition-all flex flex-col gap-1.5 group"
            >
              <span className="font-display font-black uppercase text-base text-white group-hover:text-brand-red transition-colors flex items-center justify-between gap-2">
                <span>{item.name}</span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </span>
              <span className="text-xs text-white/70">{item.desc}</span>
              <span className="text-xs font-mono text-brand-red break-all">{item.url}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
