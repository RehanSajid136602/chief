interface VideoEmbedProps {
  youtubeUrl: string;
  title: string;
}

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

export function VideoEmbed({ youtubeUrl, title }: VideoEmbedProps) {
  const videoId = getYouTubeVideoId(youtubeUrl);

  if (!videoId) {
    return null;
  }

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-900">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={`${title} - Cooking Video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
