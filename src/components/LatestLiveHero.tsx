import { useEffect, useState } from 'react';
import { Flame, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Broadcast = { videoId: string; title: string; thumbnailUrl: string; url: string; status: 'live' | 'completed' };
function validBroadcast(value: unknown): value is Broadcast {
  if (!value || typeof value !== 'object') return false;
  const v = value as Broadcast;
  try {
    const thumb = new URL(v.thumbnailUrl);
    return /^[\w-]{11}$/.test(v.videoId) && typeof v.title === 'string' && !!v.title.trim()
      && v.url === `https://www.youtube.com/watch?v=${v.videoId}`
      && thumb.protocol === 'https:' && ['i.ytimg.com', 'img.youtube.com'].includes(thumb.hostname)
      && ['live', 'completed'].includes(v.status);
  } catch { return false; }
}
export function LatestLiveHero() {
  const { i18n } = useTranslation();
  const en = i18n.language.startsWith('en');
  const [live, setLive] = useState<Broadcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [stale, setStale] = useState(false);
  useEffect(() => {
    let disposed = false;
    let controller: AbortController | undefined;
    const load = async () => {
      controller?.abort();
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 10000);
      try {
        let data: unknown = null;
        try {
          const response = await fetch('/.netlify/functions/latest-live', { signal: controller.signal });
          if (response.ok) {
            data = await response.json();
          }
        } catch {}

        if (!validBroadcast(data)) {
          const fallbackRes = await fetch('/latest-live.json', { signal: controller.signal });
          if (fallbackRes.ok) {
            data = await fallbackRes.json();
          }
        }

        if (!validBroadcast(data)) throw Error('Invalid broadcast');
        if (!disposed) { setLive(data); setStale(false); }
      } catch { if (!disposed) setStale(true); }
      finally { clearTimeout(timeout); if (!disposed) setLoading(false); }
    };
    void load();
    const interval = setInterval(() => { if (!document.hidden) void load(); }, 300000);
    return () => { disposed = true; controller?.abort(); clearInterval(interval); };
  }, []);
  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black py-8 sm:py-14 px-4 sm:px-6 flex items-center justify-center shadow-2xl">
      {/* Background: 3D YouTube theme with floating play buttons and dark studio atmosphere */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none select-none opacity-50 mix-blend-screen filter contrast-125"
        style={{ backgroundImage: 'url(/hero/youtube_3d_bg.jpg)' }}
        aria-hidden="true"
      />
      {/* Smooth Dark Gradient Overlays (Radial + Linear) ensuring total contrast and legibility */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90 pointer-events-none select-none"
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 bg-radial from-transparent via-black/50 to-black/95 pointer-events-none select-none"
        aria-hidden="true"
      />

      {/* Floating Compact Card: Always 1 column (Title -> Thumbnail -> Watch on YouTube) */}
      <section className="relative z-10 rounded-2xl border border-white/15 bg-[#17171C]/92 backdrop-blur-md overflow-hidden text-white w-full max-w-xl mx-auto shadow-[0_16px_48px_rgba(0,0,0,0.9)]">
        <div className="p-4 sm:p-5 flex flex-col items-start gap-3">
          {/* Badge & Title on top */}
          <div className="w-full">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <Flame size={12} className="text-yellow-300" />
                {en ? 'Latest podcast' : 'Podcast más reciente'}
              </span>
              {live?.status === 'live' && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-red text-white animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  LIVE
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-display font-black leading-snug m-0 text-white line-clamp-2">
              {live?.title ?? '100% Wrestling Podcast'}
            </h1>
          </div>

          {/* Proportional Thumbnail in the middle */}
          {live ? (
            <a 
              href={live.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={live.title} 
              className="w-full aspect-video overflow-hidden rounded-xl bg-black border border-white/10 block group relative cursor-pointer"
            >
              <img 
                src={live.thumbnailUrl} 
                alt={live.title} 
                width={1280} 
                height={720} 
                fetchPriority="high" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </a>
          ) : (
            <div className="w-full aspect-video rounded-xl bg-black/60 border border-white/10 flex items-center justify-center p-4 text-center">
              <p className="text-xs text-white/50 m-0">
                {loading 
                  ? (en ? 'Connecting to YouTube broadcasts…' : 'Conectando con transmisiones de YouTube…')
                  : (en ? 'Visit our channel on YouTube.' : 'Visita nuestro canal en YouTube.')}
              </p>
            </div>
          )}

          {/* Watch on YouTube button at the bottom */}
          <div className="w-full pt-1 flex items-center justify-between gap-3">
            <a 
              href={live?.url ?? 'https://www.youtube.com/@100wrestlingpodcast/streams'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-brand-red hover:bg-brand-red/90 font-display font-bold text-xs uppercase tracking-wider text-white shadow-md shadow-brand-red/20 transition-all cursor-pointer active:scale-98"
            >
              <Play size={15} className="fill-white" />
              {en ? 'Watch on YouTube' : 'Ver en YouTube'}
            </a>
          </div>

          {stale && live && (
            <p role="status" className="text-[11px] text-white/50 m-0 text-left">
              {en ? 'Showing last verified broadcast.' : 'Mostrando última transmisión verificada.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
