"use client";

import { useState } from "react";

import {
  extractYoutubeVideoId,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from "@/lib/spots/mv-url";

type YoutubeMvEmbedProps = {
  /** YouTube の watch / youtu.be / embed URL。検索 URL のときは何も出さない */
  url?: string | null;
  title?: string;
  className?: string;
};

export function YoutubeMvEmbed({ url, title, className }: YoutubeMvEmbedProps) {
  const videoId = extractYoutubeVideoId(url);
  const [playing, setPlaying] = useState(false);

  if (!videoId) return null;

  const label = title?.trim() || "MV";
  const watchHref = youtubeWatchUrl(videoId);

  return (
    <div className={className}>
      <p className="mock-section-label">ミュージックビデオ</p>
      <div className="mock-mv-embed">
        {playing ? (
          <iframe
            className="mock-mv-embed-frame"
            src={`${youtubeEmbedUrl(videoId)}&autoplay=1`}
            title={label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="mock-mv-embed-poster"
            onClick={() => setPlaying(true)}
            aria-label={`${label} を再生`}
          >
            {/* YouTube CDN thumbnail */}
            <img
              src={youtubeThumbnailUrl(videoId)}
              alt=""
              className="mock-mv-embed-thumb"
              loading="lazy"
              decoding="async"
            />
            <span className="mock-mv-embed-play" aria-hidden />
            <span className="mock-mv-embed-caption">{label}</span>
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-[var(--mock-muted)]">
        <a
          href={watchHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--mock-brand)]"
        >
          YouTubeで開く
        </a>
      </p>
    </div>
  );
}
