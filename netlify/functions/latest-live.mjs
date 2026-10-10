import { selectLatestLive } from './lib/select-live.mjs';

let cache;

function getChicagoDayOfWeek(isoDateStr) {
  try {
    const d = new Date(isoDateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/Chicago' });
  } catch {
    return '';
  }
}

function classifyLiveByDay(isoDateStr) {
  const day = getChicagoDayOfWeek(isoDateStr);
  const categories = [];

  // RAW: lunes
  if (day === 'Monday') {
    categories.push('raw');
  }
  // SmackDown: viernes
  else if (day === 'Friday') {
    categories.push('smackdown');
  }
  // AEW: miércoles O jueves
  else if (day === 'Wednesday' || day === 'Thursday') {
    categories.push('dynamite');
  }
  // PLE: sábado O domingo
  else if (day === 'Saturday' || day === 'Sunday') {
    categories.push('ple');
  } else {
    categories.push('special');
  }

  return categories;
}

export async function handler() {
  const headers = { 
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=60, s-maxage=300' 
  };
  const fail = () => ({ 
    statusCode: 503, 
    headers: { ...headers, 'Cache-Control': 'no-store' }, 
    body: JSON.stringify({ error: 'Latest broadcast unavailable' }) 
  });

  const key = (process.env.YOUTUBE_API_KEY || '').trim();
  if (!key) return fail();

  if (cache && Date.now() - cache.at < 300000) {
    return { statusCode: 200, headers, body: cache.body };
  }

  const get = async (resource, params) => {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
    url.search = new URLSearchParams({ ...params, key }).toString();
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('YouTube request failed');
    return response.json();
  };

  try {
    const channels = await get('channels', { part: 'contentDetails', forHandle: '@100wrestlingpodcast' });
    const channel = channels.items?.[0];
    if (!channel) return fail();

    // Fetch up to 100 uploads to ensure we get plenty of live broadcasts
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    const page1 = await get('playlistItems', { 
      part: 'contentDetails', 
      playlistId: uploadsPlaylistId, 
      maxResults: '50' 
    });

    const videoIds = (page1.items ?? []).map(i => i.contentDetails.videoId);

    if (page1.nextPageToken) {
      try {
        const page2 = await get('playlistItems', { 
          part: 'contentDetails', 
          playlistId: uploadsPlaylistId, 
          maxResults: '50',
          pageToken: page1.nextPageToken
        });
        if (page2.items) {
          videoIds.push(...page2.items.map(i => i.contentDetails.videoId));
        }
      } catch {}
    }

    if (!videoIds.length) return fail();

    // Query in batches of 50
    const videoBatches = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      const batchIds = videoIds.slice(i, i + 50);
      const batchRes = await get('videos', { 
        part: 'snippet,liveStreamingDetails', 
        id: batchIds.join(',') 
      });
      if (batchRes.items) {
        videoBatches.push(...batchRes.items);
      }
    }

    // Filter strictly to authentic LIVE streams (actualStartTime present, excludes regular uploads and Shorts)
    const validVideos = videoBatches.filter(v => 
      v.snippet.channelId === channel.id && 
      v.liveStreamingDetails?.actualStartTime && 
      /^[\w-]{11}$/.test(v.id)
    );

    if (!validVideos.length) return fail();

    // Select the single latest live for the hero
    const latest = selectLatestLive(validVideos);
    if (!latest) return fail();

    const thumb = latest.snippet.thumbnails;
    const thumbnailUrl = (thumb.maxres ?? thumb.standard ?? thumb.high ?? thumb.medium ?? thumb.default)?.url;
    if (!thumbnailUrl) return fail();

    // Sort chronologically descending
    const sortedLives = validVideos.sort(
      (a, b) => Date.parse(b.liveStreamingDetails.actualStartTime) - Date.parse(a.liveStreamingDetails.actualStartTime)
    );

    // Build full list of live episodes classified by America/Chicago broadcast day
    const reviews = sortedLives.map(v => {
      const t = v.snippet.thumbnails;
      const vThumb = (t.maxres ?? t.standard ?? t.high ?? t.medium ?? t.default)?.url || '';
      const startedAt = v.liveStreamingDetails.actualStartTime;
      return {
        id: v.id,
        title: v.snippet.title,
        thumbnailUrl: vThumb,
        url: `https://www.youtube.com/watch?v=${v.id}`,
        date: startedAt,
        status: v.liveStreamingDetails.actualEndTime ? 'completed' : 'live',
        categories: classifyLiveByDay(startedAt)
      };
    });

    const body = JSON.stringify({ 
      videoId: latest.id, 
      title: latest.snippet.title, 
      thumbnailUrl, 
      startedAt: latest.liveStreamingDetails.actualStartTime, 
      status: latest.liveStreamingDetails.actualEndTime ? 'completed' : 'live', 
      url: `https://www.youtube.com/watch?v=${latest.id}`,
      reviews
    });

    cache = { at: Date.now(), body };
    return { statusCode: 200, headers, body };
  } catch { 
    return fail(); 
  }
}
