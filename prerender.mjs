import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = process.env.PROJECT_ROOT || __dirname;
const DIST_DIR = fs.existsSync(path.join(ROOT_DIR, 'dist'))
  ? path.join(ROOT_DIR, 'dist')
  : ROOT_DIR;
const PUBLIC_DIR = fs.existsSync(path.join(ROOT_DIR, 'public'))
  ? path.join(ROOT_DIR, 'public')
  : ROOT_DIR;
const SITE_URL = 'https://100wrestlingpodcast.com';

// Detect built asset tags from dist/index.html if present
let assetHeadTags = `    <script type="module" crossorigin src="/assets/index-bz17be1t.js"></script>\n    <link rel="stylesheet" crossorigin href="/assets/index-4eqsrfkb.css" />`;
const distIndexPath = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(distIndexPath)) {
  const existingHtml = fs.readFileSync(distIndexPath, 'utf8');
  const scripts = existingHtml.match(/<script\s+type="module"[^>]*><\/script>/g) || [];
  const styles = existingHtml.match(/<link\s+rel="stylesheet"[^>]*>/g) || [];
  if (scripts.length > 0 || styles.length > 0) {
    assetHeadTags = [...scripts, ...styles].map((t) => `    ${t}`).join('\n');
  }
}

// Load latest-live.json
const latestLivePath = fs.existsSync(path.join(PUBLIC_DIR, 'latest-live.json'))
  ? path.join(PUBLIC_DIR, 'latest-live.json')
  : path.join(ROOT_DIR, 'latest-live.json');
const latestLive = fs.existsSync(latestLivePath)
  ? JSON.parse(fs.readFileSync(latestLivePath, 'utf8'))
  : { reviews: [] };
const episodes = Array.isArray(latestLive.reviews) ? latestLive.reviews : [];

// Load calendar_events.csv
const csvPath = fs.existsSync(path.join(PUBLIC_DIR, 'calendar_events.csv'))
  ? path.join(PUBLIC_DIR, 'calendar_events.csv')
  : path.join(ROOT_DIR, 'calendar_events.csv');

function parseCalendarCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const parseLine = (line) => {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        out.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  };
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = parseLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] || '';
    });
    return obj;
  });
}

const calendarEvents = fs.existsSync(csvPath)
  ? parseCalendarCsv(fs.readFileSync(csvPath, 'utf8')).slice(0, 12)
  : [];

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildJsonLd(routeConfig) {
  const podcastSeriesId = `${SITE_URL}/#podcast`;
  const episodeSchemas = episodes.slice(0, 10).map((ep, idx) => ({
    '@type': 'PodcastEpisode',
    '@id': `${SITE_URL}/#episode-${ep.id || idx + 1}`,
    name: ep.title,
    description: `Episodio de 100% Wrestling Podcast en español conducido por Wiseman (El Wiseman): ${ep.title}. Noticias, análisis y review sin filtros de WWE y AEW.`,
    url: ep.url,
    datePublished: ep.date || latestLive.startedAt || '2026-10-10T02:24:33Z',
    inLanguage: 'es',
    image: ep.thumbnailUrl || `${SITE_URL}/logo.png`,
    author: {
      '@type': 'Person',
      name: 'Wiseman (El Wiseman)'
    },
    associatedMedia: {
      '@type': 'VideoObject',
      name: ep.title,
      description: `Review en español de WWE y AEW por Wiseman en 100% Wrestling Podcast: ${ep.title}`,
      contentUrl: ep.url,
      embedUrl: `https://www.youtube.com/embed/${ep.id}`,
      thumbnailUrl: ep.thumbnailUrl || `${SITE_URL}/logo.png`,
      uploadDate: ep.date || '2026-10-10T02:24:33Z'
    },
    partOfSeries: {
      '@type': 'PodcastSeries',
      '@id': podcastSeriesId,
      name: '100% Wrestling Podcast',
      url: `${SITE_URL}/`
    }
  }));

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'PodcastSeries',
        '@id': podcastSeriesId,
        name: '100% Wrestling Podcast',
        alternateName: '100 Wrestling Podcast en Español con El Wiseman',
        description:
          '100% Wrestling Podcast es el podcast en español de noticias, análisis sin filtros y reviews en vivo de WWE (RAW, SmackDown, NXT) y AEW (Dynamite, Collision) conducido por Wiseman (El Wiseman) junto a DrLuchaLibre, Mr. Tokens, Barbudo y JB Open Mic.',
        url: `${SITE_URL}/`,
        inLanguage: 'es',
        image: `${SITE_URL}/logo.png`,
        webFeed: 'https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086',
        author: {
          '@type': 'Person',
          name: 'Wiseman (El Wiseman)'
        },
        creator: {
          '@type': 'Organization',
          name: '100% Wrestling Podcast',
          url: `${SITE_URL}/`,
          logo: `${SITE_URL}/logo.png`,
          sameAs: [
            'https://www.youtube.com/@100wrestlingpodcast',
            'https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086',
            'https://www.instagram.com/100wrestlingpodcast/',
            'https://www.facebook.com/100wrestlingpodcast',
            'https://open.spotify.com/show/1wfTq0D1muEOUrZAIpgyiJ',
            'https://www.patreon.com/c/100wrestlingpodcast'
          ]
        },
        sameAs: [
          'https://www.youtube.com/@100wrestlingpodcast',
          'https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086',
          'https://www.instagram.com/100wrestlingpodcast/',
          'https://www.facebook.com/100wrestlingpodcast',
          'https://open.spotify.com/show/1wfTq0D1muEOUrZAIpgyiJ'
        ],
        hasPart: episodeSchemas.slice(0, 5)
      },
      ...episodeSchemas.slice(0, 5),
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${routeConfig.canonicalPath}#webpage`,
        url: `${SITE_URL}${routeConfig.canonicalPath}`,
        name: routeConfig.title,
        description: routeConfig.description,
        inLanguage: routeConfig.lang || 'es',
        isPartOf: {
          '@id': podcastSeriesId
        }
      }
    ]
  };

  return JSON.stringify(schema, null, 2);
}

function renderShell(activeTab, mainHtml) {
  const navItems = [
    { id: 'inicio', href: '/es/inicio', label: 'Inicio' },
    { id: 'ver-y-escuchar', href: '/es/ver-y-escuchar', label: 'Ver y escuchar' },
    { id: 'calendario', href: '/es/calendario', label: 'Calendario' },
    { id: 'comunidad', href: '/es/comunidad', label: 'Comunidad' },
    { id: 'tienda', href: '/tienda', label: 'Tienda' },
    { id: 'sobre-nosotros', href: '/sobre-nosotros', label: 'Sobre nosotros' },
    { id: 'links', href: '/es/links', label: 'Afiliados' },
    { id: 'contacto', href: '/es/contacto', label: 'Contacto' }
  ];

  const navLinksHtml = navItems
    .map((item) => {
      const active = item.id === activeTab;
      return `<a href="${item.href}" ${active ? 'aria-current="page"' : ''} class="relative px-3 py-2 rounded-lg font-display font-bold text-xs xl:text-sm uppercase tracking-wider transition-all duration-200 ${
        active ? 'text-white font-black' : 'text-white/70 hover:text-white hover:bg-white/5'
      }"><span>${escapeHtml(item.label)}</span>${
        active ? '<span class="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-red rounded-full"></span>' : ''
      }</a>`;
    })
    .join('\n            ');

  const footerLinksHtml = navItems
    .map(
      (item) =>
        `<li><a href="${item.href}" class="hover:text-white transition-colors duration-200">${escapeHtml(item.label)}</a></li>`
    )
    .join('\n                ');

  return `<div class="flex flex-col min-h-screen bg-[#0B0B0D] text-[#F7F7F8] selection:bg-brand-red selection:text-white">
      <header class="sticky top-0 z-50 w-full bg-[#0B0B0D]/95 border-b border-white/10 backdrop-blur-md shadow-md">
        <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 z-[60] px-4 py-2 bg-brand-red text-white font-display font-bold text-xs uppercase rounded shadow-lg outline-none">Saltar al contenido principal</a>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[80px] py-3 flex items-center justify-between gap-4">
          <a href="/es/inicio" class="flex items-center cursor-pointer group shrink-0 rounded-xl p-1 -ml-1" aria-label="100% Wrestling Podcast - Ir a Inicio">
            <img src="/logo.png" alt="100% Wrestling Podcast" width="160" height="64" class="h-12 sm:h-14 lg:h-16 w-auto max-w-[140px] sm:max-w-[170px] lg:max-w-[190px] object-contain drop-shadow-md" />
          </a>
          <nav class="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Navegación Principal">
            ${navLinksHtml}
          </nav>
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="https://www.patreon.com/c/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-red hover:bg-[#b91c1c] text-white font-display font-black text-xs uppercase tracking-wider shadow-md">
              <span>Apoya el podcast</span>
            </a>
          </div>
        </div>
      </header>
      <main id="main-content" tabindex="-1" class="flex-grow outline-none">
        ${mainHtml}
      </main>
      <footer class="w-full bg-black border-t border-white/10 mt-auto pt-12 pb-24 md:pb-12 text-white/70 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
            <div class="flex flex-col items-start gap-4">
              <div class="flex items-center gap-3">
                <img src="/logo.png" alt="100% Wrestling Podcast" width="40" height="40" class="w-10 h-10 object-contain shrink-0" />
                <span class="font-display font-black text-white uppercase tracking-wider text-lg">100% <span class="text-brand-red">Wrestling</span></span>
              </div>
              <p class="text-xs text-white/50 leading-relaxed text-left max-w-sm">Tu portal de referencia en español con Wiseman (El Wiseman) para noticias y reviews en vivo de WWE RAW, SmackDown, AEW Dynamite y todos los Premium Live Events.</p>
            </div>
            <div class="flex flex-col items-start md:items-center">
              <div class="w-full md:w-auto text-left">
                <h2 class="text-xs font-display font-bold text-white uppercase tracking-widest mb-3">Navegación</h2>
                <ul class="space-y-2 text-xs">
                  ${footerLinksHtml}
                </ul>
              </div>
            </div>
            <div class="flex flex-col items-start md:items-end">
              <div class="w-full md:w-auto text-left md:text-right">
                <h2 class="text-xs font-display font-bold text-white uppercase tracking-widest mb-3">Comunidad y Redes</h2>
                <ul class="space-y-1.5 text-xs mb-4">
                  <li><a href="https://www.youtube.com/@100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="hover:text-white">YouTube (@100wrestlingpodcast)</a></li>
                  <li><a href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086" target="_blank" rel="noopener noreferrer" class="hover:text-white">Apple Podcasts</a></li>
                  <li><a href="https://www.instagram.com/100wrestlingpodcast/" target="_blank" rel="noopener noreferrer" class="hover:text-white">Instagram (@100wrestlingpodcast)</a></li>
                  <li><a href="https://www.facebook.com/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="hover:text-white">Facebook (100% Wrestling Podcast)</a></li>
                </ul>
                <a href="https://www.patreon.com/c/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="inline-block text-xs font-bold text-brand-red hover:underline uppercase tracking-wider">Acceso Miembros Patreon →</a>
              </div>
            </div>
          </div>
          <div class="pt-6 flex flex-col gap-4 text-[10px] text-white/40">
            <p class="text-left leading-relaxed">Renuncia Legal: 100% Wrestling Podcast es una producción independiente conducida por Wiseman y no está afiliada oficialmente con World Wrestling Entertainment (WWE), All Elite Wrestling (AEW) o Lucha Libre AAA Worldwide.</p>
            <div>© 2026 100% Wrestling Podcast. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>`;
}

function renderInicioMain() {
  const recentEpisodesHtml = episodes
    .slice(0, 8)
    .map(
      (ep) => `<article class="bg-[#17171C] rounded-2xl p-4 border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <span class="text-[10px] font-mono uppercase text-brand-red font-bold">${escapeHtml((ep.categories || ['wrestling']).join(', '))}</span>
              <h3 class="text-sm sm:text-base font-display font-bold text-white mt-1"><a href="${escapeHtml(ep.url)}" target="_blank" rel="noopener noreferrer" class="hover:text-brand-red">${escapeHtml(ep.title)}</a></h3>
            </div>
            <a href="${escapeHtml(ep.url)}" target="_blank" rel="noopener noreferrer" class="text-xs font-display font-bold uppercase text-brand-red hover:underline">Ver episodio en YouTube →</a>
          </article>`
    )
    .join('\n          ');

  return `<div class="flex flex-col gap-12 sm:gap-16 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black py-8 sm:py-14 px-4 sm:px-6 flex flex-col items-center justify-center shadow-2xl text-center">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3">Podcast #1 de Lucha Libre en Español</span>
          <h1 class="text-3xl sm:text-5xl font-display font-black uppercase text-white tracking-tight max-w-3xl">100% Wrestling Podcast — Noticias y Reviews de WWE y AEW en Español con Wiseman</h1>
          <p class="text-sm sm:text-base text-white/80 max-w-2xl mt-3 leading-relaxed">Reviews en vivo, noticias de última hora y análisis sin filtros de WWE RAW, SmackDown, AEW Dynamite y todos los Premium Live Events conducidos por Wiseman (El Wiseman) junto al equipo de 100% Wrestling.</p>
          <div class="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a href="https://www.youtube.com/@100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-brand-red text-white font-display font-black text-xs uppercase tracking-wider">Ver en YouTube</a>
            <a href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-display font-black text-xs uppercase tracking-wider">Escuchar en Apple Podcasts</a>
            <a href="/sobre-nosotros" class="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-display font-black text-xs uppercase tracking-wider">Sobre nosotros</a>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="text-lg sm:text-xl font-display font-black tracking-wider text-white uppercase m-0">Síguenos donde prefieras</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="https://www.youtube.com/@100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="rounded-2xl p-4 bg-[#17171C] border border-white/10 text-white">
              <strong class="block font-display uppercase text-sm">YouTube</strong>
              <span class="text-xs text-white/70">En vivo, reviews de WWE/AEW y clips con Wiseman</span>
            </a>
            <a href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086" target="_blank" rel="noopener noreferrer" class="rounded-2xl p-4 bg-[#17171C] border border-white/10 text-white">
              <strong class="block font-display uppercase text-sm">Apple Podcasts</strong>
              <span class="text-xs text-white/70">Audio en alta fidelidad de todos los episodios</span>
            </a>
            <a href="https://www.instagram.com/100wrestlingpodcast/" target="_blank" rel="noopener noreferrer" class="rounded-2xl p-4 bg-[#17171C] border border-white/10 text-white">
              <strong class="block font-display uppercase text-sm">Instagram</strong>
              <span class="text-xs text-white/70">Noticias diarias de WWE y AEW, reels y resultados</span>
            </a>
            <a href="https://www.facebook.com/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="rounded-2xl p-4 bg-[#17171C] border border-white/10 text-white">
              <strong class="block font-display uppercase text-sm">Facebook</strong>
              <span class="text-xs text-white/70">Comunidad oficial, debates y transmisiones</span>
            </a>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="text-lg sm:text-xl font-display font-black tracking-wider text-white uppercase m-0">Últimos Episodios y Reviews de WWE y AEW</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            ${recentEpisodesHtml}
          </div>
        </section>
      </div>`;
}

function renderSobreNosotrosMain() {
  return `<div class="flex flex-col gap-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="border-b border-white/10 pb-6">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded bg-brand-red text-white text-[10px] font-black uppercase tracking-wider">Historia y Equipo</span>
            <span class="text-[10px] font-mono text-white/50 uppercase">100% Wrestling Podcast</span>
          </div>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-tight m-0 leading-tight">Sobre nosotros</h1>
          <p class="text-sm sm:text-base text-white/75 mt-2 max-w-3xl leading-relaxed m-0">Noticias, análisis sin filtros y reviews en español de WWE y AEW conducidos por Wiseman (El Wiseman) junto al equipo de 100% Wrestling Podcast.</p>
        </section>

        <article class="bg-[#17171C] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl text-white flex flex-col gap-5 leading-relaxed text-sm sm:text-base">
          <h2 class="text-xl sm:text-2xl font-display font-black uppercase text-white m-0 tracking-tight">¿Qué es 100% Wrestling Podcast?</h2>
          <p class="text-white/85 m-0">100% Wrestling Podcast es el programa y portal independiente en español dedicado a las noticias, análisis y reviews en vivo de WWE y AEW, creado y conducido por Wiseman (El Wiseman). Cada semana analizamos sin filtros ni compromisos todo lo que ocurre en el mundo de la lucha libre profesional, ofreciendo opiniones directas sobre WWE Monday Night RAW, Friday Night SmackDown, WWE NXT, AEW Dynamite, AEW Collision y Lucha Libre AAA.</p>
          <p class="text-white/85 m-0">Bajo la dirección de Wiseman (El Wiseman), junto a los coanfitriones DrLuchaLibre, Mr. Tokens, Barbudo y JB Open Mic, realizamos coberturas especiales y post-shows en directo de todos los Premium Live Events (PLE) y Pay-Per-Views del año, incluyendo WrestleMania, SummerSlam, Royal Rumble, Money in the Bank, Survivor Series, AEW All In, All Out, Full Gear y WrestleDream.</p>
          <p class="text-white/85 m-0">Además de nuestros episodios gratuitos semanales en video y audio, contamos con programas especiales para nuestra comunidad como La Terapia en Vivo, sesiones de preguntas y respuestas (Q&amp;A) y reacciones en tiempo real. Nuestro compromiso es brindar a los fanáticos hispanohablantes de Puerto Rico, Estados Unidos, México, Latinoamérica y España el debate más honesto, apasionado y entretenido sobre WWE y AEW en español.</p>
        </article>

        <section class="bg-[#17171C] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl text-white flex flex-col gap-6">
          <div>
            <h2 class="text-xl sm:text-2xl font-display font-black uppercase text-white m-0 tracking-tight">Enlaces Oficiales de 100% Wrestling Podcast</h2>
            <p class="text-xs sm:text-sm text-white/70 mt-1 m-0">Síguenos y escúchanos en nuestras plataformas oficiales de YouTube, Apple Podcasts, Instagram y Facebook:</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="https://www.youtube.com/@100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="p-5 rounded-xl bg-black/50 border border-white/10 hover:border-brand-red transition-all flex flex-col gap-1.5">
              <span class="font-display font-black uppercase text-base text-white">YouTube — @100wrestlingpodcast</span>
              <span class="text-xs text-white/70">Mira todos los reviews en vivo de WWE y AEW, noticias y post-shows con Wiseman en YouTube.</span>
              <span class="text-xs font-mono text-brand-red break-all">https://www.youtube.com/@100wrestlingpodcast</span>
            </a>
            <a href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086" target="_blank" rel="noopener noreferrer" class="p-5 rounded-xl bg-black/50 border border-white/10 hover:border-brand-red transition-all flex flex-col gap-1.5">
              <span class="font-display font-black uppercase text-base text-white">Apple Podcasts — 100% Wrestling Podcast</span>
              <span class="text-xs text-white/70">Escucha y descarga todos los episodios en español de WWE y AEW en Apple Podcasts.</span>
              <span class="text-xs font-mono text-brand-red break-all">https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086</span>
            </a>
            <a href="https://www.instagram.com/100wrestlingpodcast/" target="_blank" rel="noopener noreferrer" class="p-5 rounded-xl bg-black/50 border border-white/10 hover:border-brand-red transition-all flex flex-col gap-1.5">
              <span class="font-display font-black uppercase text-base text-white">Instagram — @100wrestlingpodcast</span>
              <span class="text-xs text-white/70">Noticias de última hora de WWE y AEW, clips exclusivos, reels y resultados en Instagram.</span>
              <span class="text-xs font-mono text-brand-red break-all">https://www.instagram.com/100wrestlingpodcast/</span>
            </a>
            <a href="https://www.facebook.com/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="p-5 rounded-xl bg-black/50 border border-white/10 hover:border-brand-red transition-all flex flex-col gap-1.5">
              <span class="font-display font-black uppercase text-base text-white">Facebook — 100% Wrestling Podcast</span>
              <span class="text-xs text-white/70">Únete a nuestra página oficial de Facebook para debates, videos y noticias diarias de lucha libre.</span>
              <span class="text-xs font-mono text-brand-red break-all">https://www.facebook.com/100wrestlingpodcast</span>
            </a>
          </div>
        </section>
      </div>`;
}

function renderVerYEscucharMain() {
  const epList = episodes
    .slice(0, 12)
    .map(
      (ep) => `<li class="py-2 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <a href="${escapeHtml(ep.url)}" target="_blank" rel="noopener noreferrer" class="font-bold text-white hover:text-brand-red">${escapeHtml(ep.title)}</a>
            <span class="text-xs text-white/50 font-mono">${escapeHtml((ep.date || '').slice(0, 10))}</span>
          </li>`
    )
    .join('\n          ');

  return `<div class="flex flex-col gap-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="border-b border-white/10 pb-6">
          <span class="px-2.5 py-0.5 rounded bg-brand-red text-white text-[10px] font-black uppercase tracking-wider">Directorio Oficial</span>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-display font-black uppercase text-white tracking-tight mt-2 m-0">Ver y escuchar — 100% Wrestling Podcast</h1>
          <p class="text-sm sm:text-base text-white/70 mt-2 max-w-3xl leading-relaxed m-0">Accede a toda la programación en español de 100% Wrestling Podcast con Wiseman en tus plataformas favoritas de video y audio: YouTube, Apple Podcasts, Spotify y Patreon VIP.</p>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-2xl font-display font-black uppercase">YouTube</h2>
            <p class="text-sm text-white/70 mt-2">Mira todos los reviews de episodios completos de WWE RAW, SmackDown, AEW Dynamite y transmisiones en vivo de PLEs.</p>
            <a href="https://www.youtube.com/@100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-brand-red text-white font-display font-bold text-xs uppercase">Ver en YouTube</a>
          </article>
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-2xl font-display font-black uppercase">Apple Podcasts</h2>
            <p class="text-sm text-white/70 mt-2">Suscríbete en Apple Podcasts para descargas automáticas de cada nuevo episodio en español con Wiseman.</p>
            <a href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#872EC4] text-white font-display font-bold text-xs uppercase">Escuchar en Apple Podcasts</a>
          </article>
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-2xl font-display font-black uppercase">Spotify</h2>
            <p class="text-sm text-white/70 mt-2">Escucha los episodios en cualquier lugar o míralos en formato video dentro de Spotify.</p>
            <a href="https://open.spotify.com/show/1wfTq0D1muEOUrZAIpgyiJ" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#1DB954] text-black font-display font-bold text-xs uppercase">Escuchar en Spotify</a>
          </article>
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-2xl font-display font-black uppercase">Patreon VIP</h2>
            <p class="text-sm text-white/70 mt-2">Shows exclusivos incluyendo La Terapia en Vivo, reacciones en tiempo real y contenido sin censura.</p>
            <a href="https://www.patreon.com/c/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-brand-red text-white font-display font-bold text-xs uppercase">Entrar a Patreon</a>
          </article>
        </section>
        <section class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
          <h2 class="text-xl font-display font-black uppercase mb-4">Archivo Reciente de Episodios</h2>
          <ul class="list-none m-0 p-0 text-sm">
            ${epList}
          </ul>
        </section>
      </div>`;
}

function renderCalendarioMain() {
  const rowsHtml = calendarEvents
    .map(
      (ev) => `<article class="bg-[#17171C] rounded-2xl p-5 border border-white/10 text-white flex flex-col gap-2">
          <div class="flex items-center justify-between text-xs font-mono text-brand-red">
            <span>${escapeHtml(ev.date)} — ${escapeHtml(ev.start_time)} (${escapeHtml(ev.timezone)})</span>
            <span class="uppercase">${escapeHtml(ev.event_type || 'weekly')}</span>
          </div>
          <h2 class="text-lg font-display font-black uppercase text-white m-0">${escapeHtml(ev.title_es || ev.title)}</h2>
          <p class="text-xs text-white/75 m-0 leading-relaxed">${escapeHtml(ev.description_es || ev.description)}</p>
          <a href="${escapeHtml(ev.youtube_url || 'https://www.youtube.com/@100wrestlingpodcast')}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-brand-red hover:underline mt-1">Ver transmisión en YouTube →</a>
        </article>`
    )
    .join('\n          ');

  return `<div class="flex flex-col gap-10 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="border-b border-white/10 pb-6">
          <h1 class="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-tight m-0">Calendario de Shows y Eventos en Vivo</h1>
          <p class="text-sm sm:text-base text-white/70 mt-2 max-w-3xl leading-relaxed m-0">Mantente al día con los horarios de los próximos reviews en vivo de WWE RAW, SmackDown, AEW Dynamite, podcasts semanales y Premium Live Events en Patreon y YouTube con Wiseman.</p>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${rowsHtml}
        </section>
      </div>`;
}

function renderComunidadMain() {
  return `<div class="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="border-b border-white/10 pb-6">
          <h1 class="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-tight m-0">Comunidad Oficial de 100% Wrestling Podcast</h1>
          <p class="text-sm sm:text-base text-white/70 mt-2 max-w-3xl leading-relaxed m-0">Únete a nuestros canales oficiales, sintonízanos en tus plataformas de audio preferidas y sé parte de la experiencia de lucha libre en español sin filtros con Wiseman.</p>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-xl font-display font-black uppercase">Patreon Premium — La Terapia en Vivo</h2>
            <p class="text-sm text-white/75 mt-2">Accede a contenido exclusivo todas las semanas, como LA TERAPIA el podcast en vivo, Q&amp;A con preguntas de los miembros, video reacciones y directos de eventos especiales de PLEs.</p>
            <a href="https://www.patreon.com/c/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-brand-red text-white font-display font-bold text-xs uppercase">Únete a Patreon</a>
          </article>
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-xl font-display font-black uppercase">Redes Sociales y Plataformas</h2>
            <p class="text-sm text-white/75 mt-2">Conecta con otros fanáticos de WWE y AEW en español a través de nuestras redes sociales oficiales:</p>
            <ul class="mt-3 space-y-2 text-xs">
              <li><a href="https://www.youtube.com/@100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="text-brand-red hover:underline">YouTube: @100wrestlingpodcast</a></li>
              <li><a href="https://podcasts.apple.com/us/podcast/100-wrestling-podcast/id1508202086" target="_blank" rel="noopener noreferrer" class="text-brand-red hover:underline">Apple Podcasts: 100% Wrestling Podcast</a></li>
              <li><a href="https://www.instagram.com/100wrestlingpodcast/" target="_blank" rel="noopener noreferrer" class="text-brand-red hover:underline">Instagram: @100wrestlingpodcast</a></li>
              <li><a href="https://www.facebook.com/100wrestlingpodcast" target="_blank" rel="noopener noreferrer" class="text-brand-red hover:underline">Facebook: 100% Wrestling Podcast</a></li>
            </ul>
          </article>
        </section>
      </div>`;
}

function renderTiendaMain() {
  return `<div class="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="border-b border-white/10 pb-6">
          <h1 class="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-tight m-0">Tienda Oficial de 100% Wrestling Podcast</h1>
          <p class="text-sm sm:text-base text-white/70 mt-2 max-w-3xl leading-relaxed m-0">Apoya directamente a 100% Wrestling Podcast y Wiseman con nuestra mercancía oficial: camisetas, hoodies, gorras, tazas y vasos térmicos con envíos seguros.</p>
        </section>
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-lg font-display font-bold uppercase">Camisetas y Hoodies Oficiales 100% Wrestling</h2>
            <p class="text-xs text-white/70 mt-2">Estampados duraderos y materiales cómodos de primera calidad en tallas S hasta 5XL.</p>
            <a href="https://100wrestlingpodcast.myshopify.com" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-4 py-2 rounded-lg bg-brand-red text-white text-xs font-display font-bold uppercase">Comprar en Tienda Oficial</a>
          </article>
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-lg font-display font-bold uppercase">Taza Negra 100% Wrestling PR Edition</h2>
            <p class="text-xs text-white/70 mt-2">Disfruta tu café con el orgullo de Puerto Rico y la pasión por la lucha libre en cada episodio.</p>
            <a href="https://100wrestlingpodcast.myshopify.com" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-4 py-2 rounded-lg bg-brand-red text-white text-xs font-display font-bold uppercase">Ver Producto</a>
          </article>
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-lg font-display font-bold uppercase">Vaso Térmico 100% Wrestling — 20 oz</h2>
            <p class="text-xs text-white/70 mt-2">Acero inoxidable de alta calidad con tapa y sorbeto para acompañar cada review de WWE y AEW.</p>
            <a href="https://100wrestlingpodcast.myshopify.com" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-4 py-2 rounded-lg bg-brand-red text-white text-xs font-display font-bold uppercase">Ver Producto</a>
          </article>
        </section>
      </div>`;
}

function renderLinksMain() {
  return `<div class="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="border-b border-white/10 pb-6">
          <h1 class="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-tight m-0">Enlaces de Auspiciadores y Afiliados Oficiales</h1>
          <p class="text-sm sm:text-base text-white/70 mt-2 max-w-3xl leading-relaxed m-0">Encuentra ofertas exclusivas para la comunidad de 100% Wrestling Podcast y apoya al programa con tus compras en Ringside Collectibles, NordVPN, Fanatics y Topps.</p>
        </section>
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-xl font-display font-black uppercase">Ringside Collectibles — Código: 100WRESTLING</h2>
            <p class="text-xs text-white/75 mt-2">Usa nuestro código oficial de afiliado 100WRESTLING y recibe un 10% de descuento inmediato en tu compra de figuras de acción de WWE y AEW.</p>
            <a href="https://www.wrestlingfigures.com" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-4 py-2 rounded bg-brand-red text-white text-xs font-display font-bold uppercase">Visitar Ringside Collectibles</a>
          </article>
          <article class="bg-[#17171C] rounded-2xl p-6 border border-white/10 text-white">
            <h2 class="text-xl font-display font-black uppercase">Auspiciadores y Ofertas para Fanáticos</h2>
            <p class="text-xs text-white/75 mt-2">Al comprar a través de estos enlaces oficiales apoyas directamente la producción independiente de 100% Wrestling Podcast sin costo adicional para ti.</p>
          </article>
        </section>
      </div>`;
}

function renderContactoMain() {
  return `<div class="flex flex-col gap-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
        <section class="border-b border-white/10 pb-6">
          <h1 class="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-tight m-0">Contacto y Propuestas Comerciales</h1>
          <p class="text-sm sm:text-base text-white/70 mt-2 max-w-3xl leading-relaxed m-0">Envíanos tu propuesta comercial, patrocinio o consulta a 100% Wrestling Podcast y Wiseman, y nos pondremos en contacto contigo lo antes posible.</p>
        </section>
        <section class="bg-[#17171C] rounded-2xl p-6 sm:p-8 border border-white/10 text-white">
          <h2 class="text-xl font-display font-black uppercase mb-2">Contacto Directo</h2>
          <p class="text-sm text-white/80">Correo electrónico oficial para negocios, prensa y patrocinios: <a href="mailto:100wrestlingpodcast@gmail.com" class="text-brand-red hover:underline">100wrestlingpodcast@gmail.com</a></p>
        </section>
      </div>`;
}

function getMainHtmlForTab(tab) {
  switch (tab) {
    case 'sobre-nosotros':
      return renderSobreNosotrosMain();
    case 'ver-y-escuchar':
      return renderVerYEscucharMain();
    case 'calendario':
      return renderCalendarioMain();
    case 'comunidad':
      return renderComunidadMain();
    case 'tienda':
      return renderTiendaMain();
    case 'links':
      return renderLinksMain();
    case 'contacto':
      return renderContactoMain();
    case 'inicio':
    default:
      return renderInicioMain();
  }
}

const ROUTES = [
  {
    routePath: '/',
    canonicalPath: '/',
    altEs: '/es/inicio',
    altEn: '/en/home',
    tab: 'inicio',
    lang: 'es',
    priority: '1.0',
    changefreq: 'daily',
    inSitemap: true,
    title: '100% Wrestling Podcast | Noticias y Reviews de WWE y AEW en Español por Wiseman',
    description:
      'Podcast #1 de lucha libre en español con El Wiseman. Noticias, análisis sin filtros y reviews en vivo de WWE RAW, SmackDown, AEW Dynamite y Premium Live Events.'
  },
  {
    routePath: '/sobre-nosotros',
    canonicalPath: '/sobre-nosotros',
    altEs: '/sobre-nosotros',
    altEn: '/en/about',
    tab: 'sobre-nosotros',
    lang: 'es',
    priority: '0.9',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Sobre Nosotros | 100% Wrestling Podcast con Wiseman (WWE y AEW en Español)',
    description:
      'Conoce la historia de 100% Wrestling Podcast, el programa en español de noticias y reviews de WWE y AEW conducido por Wiseman. Enlaces a YouTube, Apple Podcasts, Instagram y Facebook.'
  },
  {
    routePath: '/es/sobre-nosotros',
    canonicalPath: '/sobre-nosotros',
    altEs: '/sobre-nosotros',
    altEn: '/en/about',
    tab: 'sobre-nosotros',
    lang: 'es',
    priority: '0.8',
    changefreq: 'weekly',
    inSitemap: false,
    title: 'Sobre Nosotros | 100% Wrestling Podcast con Wiseman (WWE y AEW en Español)',
    description:
      'Conoce la historia de 100% Wrestling Podcast, el programa en español de noticias y reviews de WWE y AEW conducido por Wiseman. Enlaces a YouTube, Apple Podcasts, Instagram y Facebook.'
  },
  {
    routePath: '/es/inicio',
    canonicalPath: '/es/inicio',
    altEs: '/es/inicio',
    altEn: '/en/home',
    tab: 'inicio',
    lang: 'es',
    priority: '0.9',
    changefreq: 'daily',
    inSitemap: true,
    title: 'Inicio | 100% Wrestling Podcast — Reviews de WWE y AEW en Español con Wiseman',
    description:
      'Portal oficial en español de 100% Wrestling Podcast con Wiseman. Mira los últimos episodios, horarios en vivo de WWE RAW, SmackDown, AEW Dynamite y PLEs.'
  },
  {
    routePath: '/es',
    canonicalPath: '/es/inicio',
    altEs: '/es/inicio',
    altEn: '/en/home',
    tab: 'inicio',
    lang: 'es',
    priority: '0.8',
    changefreq: 'daily',
    inSitemap: false,
    title: 'Inicio | 100% Wrestling Podcast — Reviews de WWE y AEW en Español con Wiseman',
    description:
      'Portal oficial en español de 100% Wrestling Podcast con Wiseman. Mira los últimos episodios, horarios en vivo de WWE RAW, SmackDown, AEW Dynamite y PLEs.'
  },
  {
    routePath: '/es/ver-y-escuchar',
    canonicalPath: '/es/ver-y-escuchar',
    altEs: '/es/ver-y-escuchar',
    altEn: '/en/watch-listen',
    tab: 'ver-y-escuchar',
    lang: 'es',
    priority: '0.9',
    changefreq: 'daily',
    inSitemap: true,
    title: 'Ver y Escuchar | Episodios de 100% Wrestling Podcast en YouTube y Apple Podcasts',
    description:
      'Escucha y mira todos los episodios de 100% Wrestling Podcast en español con Wiseman. Enlaces directos a YouTube, Apple Podcasts, Spotify y Patreon VIP.'
  },
  {
    routePath: '/ver-y-escuchar',
    canonicalPath: '/es/ver-y-escuchar',
    altEs: '/es/ver-y-escuchar',
    altEn: '/en/watch-listen',
    tab: 'ver-y-escuchar',
    lang: 'es',
    priority: '0.8',
    changefreq: 'daily',
    inSitemap: false,
    title: 'Ver y Escuchar | Episodios de 100% Wrestling Podcast en YouTube y Apple Podcasts',
    description:
      'Escucha y mira todos los episodios de 100% Wrestling Podcast en español con Wiseman. Enlaces directos a YouTube, Apple Podcasts, Spotify y Patreon VIP.'
  },
  {
    routePath: '/es/calendario',
    canonicalPath: '/es/calendario',
    altEs: '/es/calendario',
    altEn: '/en/schedule',
    tab: 'calendario',
    lang: 'es',
    priority: '0.9',
    changefreq: 'daily',
    inSitemap: true,
    title: 'Calendario de Shows y Reviews en Vivo | 100% Wrestling Podcast',
    description:
      'Consulta el calendario oficial de transmisiones en vivo de 100% Wrestling Podcast: horarios de reviews de WWE RAW, SmackDown, AEW Dynamite y Premium Live Events.'
  },
  {
    routePath: '/calendario',
    canonicalPath: '/es/calendario',
    altEs: '/es/calendario',
    altEn: '/en/schedule',
    tab: 'calendario',
    lang: 'es',
    priority: '0.8',
    changefreq: 'daily',
    inSitemap: false,
    title: 'Calendario de Shows y Reviews en Vivo | 100% Wrestling Podcast',
    description:
      'Consulta el calendario oficial de transmisiones en vivo de 100% Wrestling Podcast: horarios de reviews de WWE RAW, SmackDown, AEW Dynamite y Premium Live Events.'
  },
  {
    routePath: '/es/comunidad',
    canonicalPath: '/es/comunidad',
    altEs: '/es/comunidad',
    altEn: '/en/community',
    tab: 'comunidad',
    lang: 'es',
    priority: '0.8',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Comunidad Oficial, Patreon y Discord | 100% Wrestling Podcast',
    description:
      'Únete a la comunidad de 100% Wrestling Podcast en español. Participa en Discord, accede a La Terapia en Vivo en Patreon y síguenos en redes sociales.'
  },
  {
    routePath: '/comunidad',
    canonicalPath: '/es/comunidad',
    altEs: '/es/comunidad',
    altEn: '/en/community',
    tab: 'comunidad',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: false,
    title: 'Comunidad Oficial, Patreon y Discord | 100% Wrestling Podcast',
    description:
      'Únete a la comunidad de 100% Wrestling Podcast en español. Participa en Discord, accede a La Terapia en Vivo en Patreon y síguenos en redes sociales.'
  },
  {
    routePath: '/tienda',
    canonicalPath: '/tienda',
    altEs: '/tienda',
    altEn: '/store',
    tab: 'tienda',
    lang: 'es',
    priority: '0.8',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Tienda Oficial y Mercancía | 100% Wrestling Podcast',
    description:
      'Compra las camisetas, hoodies, gorras y tazas oficiales de 100% Wrestling Podcast. Apoya directamente al podcast de lucha libre en español.'
  },
  {
    routePath: '/es/tienda',
    canonicalPath: '/tienda',
    altEs: '/tienda',
    altEn: '/store',
    tab: 'tienda',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: false,
    title: 'Tienda Oficial y Mercancía | 100% Wrestling Podcast',
    description:
      'Compra las camisetas, hoodies, gorras y tazas oficiales de 100% Wrestling Podcast. Apoya directamente al podcast de lucha libre en español.'
  },
  {
    routePath: '/es/links',
    canonicalPath: '/es/links',
    altEs: '/es/links',
    altEn: '/en/links',
    tab: 'links',
    lang: 'es',
    priority: '0.8',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Auspiciadores Oficiales y Códigos de Descuento | 100% Wrestling Podcast',
    description:
      'Aprovecha descuentos exclusivos de 100% Wrestling Podcast en Ringside Collectibles (código 100WRESTLING), NordVPN, Fanatics y Topps.'
  },
  {
    routePath: '/links',
    canonicalPath: '/es/links',
    altEs: '/es/links',
    altEn: '/en/links',
    tab: 'links',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: false,
    title: 'Auspiciadores Oficiales y Códigos de Descuento | 100% Wrestling Podcast',
    description:
      'Aprovecha descuentos exclusivos de 100% Wrestling Podcast en Ringside Collectibles (código 100WRESTLING), NordVPN, Fanatics y Topps.'
  },
  {
    routePath: '/es/contacto',
    canonicalPath: '/es/contacto',
    altEs: '/es/contacto',
    altEn: '/en/contact',
    tab: 'contacto',
    lang: 'es',
    priority: '0.8',
    changefreq: 'monthly',
    inSitemap: true,
    title: 'Contacto y Propuestas Comerciales | 100% Wrestling Podcast',
    description:
      'Ponte en contacto con 100% Wrestling Podcast y Wiseman para propuestas comerciales, patrocinios, colaboraciones y consultas de prensa.'
  },
  {
    routePath: '/contacto',
    canonicalPath: '/es/contacto',
    altEs: '/es/contacto',
    altEn: '/en/contact',
    tab: 'contacto',
    lang: 'es',
    priority: '0.7',
    changefreq: 'monthly',
    inSitemap: false,
    title: 'Contacto y Propuestas Comerciales | 100% Wrestling Podcast',
    description:
      'Ponte en contacto con 100% Wrestling Podcast y Wiseman para propuestas comerciales, patrocinios, colaboraciones y consultas de prensa.'
  },
  {
    routePath: '/en',
    canonicalPath: '/en/home',
    altEs: '/es/inicio',
    altEn: '/en/home',
    tab: 'inicio',
    lang: 'es',
    priority: '0.6',
    changefreq: 'weekly',
    inSitemap: false,
    title: '100% Wrestling Podcast | Noticias y Reviews de WWE y AEW en Español por Wiseman',
    description:
      'Podcast #1 de lucha libre en español con El Wiseman. Noticias, análisis sin filtros y reviews en vivo de WWE RAW, SmackDown, AEW Dynamite y Premium Live Events.'
  },
  {
    routePath: '/en/home',
    canonicalPath: '/en/home',
    altEs: '/es/inicio',
    altEn: '/en/home',
    tab: 'inicio',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: true,
    title: '100% Wrestling Podcast | Spanish WWE & AEW News and Reviews by Wiseman',
    description:
      'Official hub of 100% Wrestling Podcast hosted by Wiseman: Spanish WWE and AEW news, live post-show reviews, schedule and community.'
  },
  {
    routePath: '/en/about',
    canonicalPath: '/en/about',
    altEs: '/sobre-nosotros',
    altEn: '/en/about',
    tab: 'sobre-nosotros',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Sobre Nosotros (About Us) | 100% Wrestling Podcast con Wiseman',
    description:
      'Sobre 100% Wrestling Podcast: noticias y reviews en español de WWE y AEW por Wiseman en YouTube, Apple Podcasts, Instagram y Facebook.'
  },
  {
    routePath: '/en/watch-listen',
    canonicalPath: '/en/watch-listen',
    altEs: '/es/ver-y-escuchar',
    altEn: '/en/watch-listen',
    tab: 'ver-y-escuchar',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Ver y Escuchar (Watch & Listen) | 100% Wrestling Podcast',
    description:
      'Escucha y mira todos los episodios de 100% Wrestling Podcast con Wiseman en YouTube, Apple Podcasts, Spotify y Patreon.'
  },
  {
    routePath: '/en/schedule',
    canonicalPath: '/en/schedule',
    altEs: '/es/calendario',
    altEn: '/en/schedule',
    tab: 'calendario',
    lang: 'es',
    priority: '0.7',
    changefreq: 'daily',
    inSitemap: true,
    title: 'Calendario de Eventos (Schedule) | 100% Wrestling Podcast',
    description:
      'Horarios y calendario oficial de reviews en vivo de WWE RAW, SmackDown, AEW Dynamite y PLEs en 100% Wrestling Podcast.'
  },
  {
    routePath: '/en/community',
    canonicalPath: '/en/community',
    altEs: '/es/comunidad',
    altEn: '/en/community',
    tab: 'comunidad',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Comunidad y Patreon (Community) | 100% Wrestling Podcast',
    description:
      'Únete a la comunidad oficial de 100% Wrestling Podcast en Patreon, Discord, YouTube, Apple Podcasts, Instagram y Facebook.'
  },
  {
    routePath: '/store',
    canonicalPath: '/store',
    altEs: '/tienda',
    altEn: '/store',
    tab: 'tienda',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Tienda Oficial (Official Store) | 100% Wrestling Podcast',
    description:
      'Mercancía oficial de 100% Wrestling Podcast: camisetas, hoodies, gorras y accesorios para fanáticos de la lucha libre.'
  },
  {
    routePath: '/en/links',
    canonicalPath: '/en/links',
    altEs: '/es/links',
    altEn: '/en/links',
    tab: 'links',
    lang: 'es',
    priority: '0.7',
    changefreq: 'weekly',
    inSitemap: true,
    title: 'Auspiciadores y Afiliados (Affiliates) | 100% Wrestling Podcast',
    description:
      'Descuentos y códigos oficiales de auspiciadores de 100% Wrestling Podcast como Ringside Collectibles (código 100WRESTLING).'
  },
  {
    routePath: '/en/contact',
    canonicalPath: '/en/contact',
    altEs: '/es/contacto',
    altEn: '/en/contact',
    tab: 'contacto',
    lang: 'es',
    priority: '0.7',
    changefreq: 'monthly',
    inSitemap: true,
    title: 'Contacto y Patrocinios (Contact) | 100% Wrestling Podcast',
    description:
      'Contacta a 100% Wrestling Podcast y Wiseman para propuestas comerciales, patrocinios y colaboraciones.'
  }
];

function buildHtmlDocument(routeConfig) {
  const canonicalUrl = `${SITE_URL}${routeConfig.canonicalPath}`;
  const altEsUrl = `${SITE_URL}${routeConfig.altEs}`;
  const altEnUrl = `${SITE_URL}${routeConfig.altEn}`;
  const ogImageUrl = `${SITE_URL}/logo.png`;
  const jsonLd = buildJsonLd(routeConfig);
  const preRenderedRoot = renderShell(routeConfig.tab, getMainHtmlForTab(routeConfig.tab));

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9669993534894443"
     crossorigin="anonymous"></script>

    <!-- Primary Meta Tags -->
    <title>${escapeHtml(routeConfig.title)}</title>
    <meta name="title" content="${escapeHtml(routeConfig.title)}" />
    <meta name="description" content="${escapeHtml(routeConfig.description)}" />
    <meta name="author" content="Wiseman — 100% Wrestling Podcast" />

    <!-- Favicon & PWA -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#0B0B0D" />

    <!-- Mobile App Settings -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="100% Wrestling" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="100% Wrestling Podcast" />
    <meta property="og:locale" content="es_PR" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(routeConfig.title)}" />
    <meta property="og:description" content="${escapeHtml(routeConfig.description)}" />
    <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
    <meta property="og:image:alt" content="100% Wrestling Podcast — Noticias y Reviews de WWE y AEW en Español con Wiseman" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="twitter:title" content="${escapeHtml(routeConfig.title)}" />
    <meta property="twitter:description" content="${escapeHtml(routeConfig.description)}" />
    <meta property="twitter:image" content="${escapeHtml(ogImageUrl)}" />

    <!-- Robots, Canonical & Hreflang -->
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <link rel="alternate" hreflang="es" href="${escapeHtml(altEsUrl)}" />
    <link rel="alternate" hreflang="en" href="${escapeHtml(altEnUrl)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(altEsUrl)}" />

    <!-- JSON-LD Structured Data (PodcastSeries & PodcastEpisode) -->
    <script type="application/ld+json">
${jsonLd}
    </script>

    <!-- Fonts Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
${assetHeadTags}
  </head>
  <body class="bg-[#0B0B0D] text-[#F7F7F8] antialiased font-sans selection:bg-brand-red selection:text-white pb-safe">
    <div id="root">${preRenderedRoot}</div>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.error('Fallo al registrar el Service Worker:', err));
        });
      }
    </script>
  </body>
</html>
`;
}

// Write pre-rendered HTML files into DIST_DIR
for (const route of ROUTES) {
  const html = buildHtmlDocument(route);
  if (route.routePath === '/') {
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
  } else {
    const cleanRel = route.routePath.replace(/^\/+/, '');
    const outDir = path.join(DIST_DIR, cleanRel);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  }
}

// Generate sitemap.xml and robots.txt in both DIST_DIR and PUBLIC_DIR
const today = '2026-10-27';
const sitemapUrls = ROUTES.filter((r) => r.inSitemap)
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.routePath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${SITE_URL}${r.altEs}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${r.altEn}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${r.altEs}" />
  </url>`
  )
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls}
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');
if (PUBLIC_DIR !== DIST_DIR && fs.existsSync(PUBLIC_DIR)) {
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8');
}

console.log(`✅ Pre-rendered ${ROUTES.length} routes into ${DIST_DIR}, generated sitemap.xml and robots.txt.`);
