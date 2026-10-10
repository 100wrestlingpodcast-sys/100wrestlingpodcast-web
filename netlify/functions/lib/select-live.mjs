export function selectLatestLive(videos) {
  return videos
    .filter(v => v.liveStreamingDetails?.actualStartTime && v.snippet?.channelId && /^[\w-]{11}$/.test(v.id))
    .sort((a, b) => Date.parse(b.liveStreamingDetails.actualStartTime) - Date.parse(a.liveStreamingDetails.actualStartTime))[0] ?? null;
}
