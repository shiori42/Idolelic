import { lookupMvUrl } from "@/data/mv-links";

/**
 * 公式直リンクが無いときのフォールバック。
 * グループ名 + 作品名で YouTube 検索結果を開く。
 */
export function createMvSearchUrl(group: string, workTitle: string): string {
  const query = `${group.trim()} ${workTitle.trim()} MV`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/**
 * 優先順位:
 * 1. 明示的な URL（登録フォーム・データ側の mvUrl）
 * 2. mvLinks カタログ（group + workTitle）
 * 3. YouTube 検索 URL
 */
export function resolveMvUrl(input: {
  group: string;
  workTitle: string;
  mvUrl?: string | null;
}): string {
  const explicit = input.mvUrl?.trim();
  if (explicit) return explicit;

  const catalog = lookupMvUrl(input.group, input.workTitle);
  if (catalog) return catalog;

  return createMvSearchUrl(input.group, input.workTitle);
}

const YOUTUBE_VIDEO_ID_RE = /^[\w-]{11}$/;

/** watch / youtu.be / embed / shorts / live から動画 ID を取り出す。検索 URL は null。 */
export function extractYoutubeVideoId(
  url: string | null | undefined,
): string | null {
  const raw = url?.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return YOUTUBE_VIDEO_ID_RE.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch" || parsed.pathname === "/watch/") {
        const id = parsed.searchParams.get("v") ?? "";
        return YOUTUBE_VIDEO_ID_RE.test(id) ? id : null;
      }

      const match = parsed.pathname.match(
        /^\/(?:embed|shorts|live|v)\/([\w-]{11})/,
      );
      if (match?.[1] && YOUTUBE_VIDEO_ID_RE.test(match[1])) {
        return match[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
