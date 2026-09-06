import { connection } from "next/server";

import { formatDuration } from "./format";
import { demoFeed, demoVideos } from "./demo";
import type { Channel, Feed, Short, Video } from "./types";

const BASE = "https://www.googleapis.com/youtube/v3";
const REVALIDATE = 600; // 10 minutes — the quota is small, the feed is not urgent.

/**
 * We fetch a deeper pool than the page shows, cache the pool, then serve a
 * different random slice of it per request. That keeps the feed fresh on every
 * refresh without spending a quota unit on each one.
 */
const POOL_PAGES = 2; // mostPopular pages of 50 => up to 100 candidates
const FEED_SIZE = 24; // videos the home feed renders (1 hero + 23 cards)
const SHORTS_SIZE = 12;

/** Fisher-Yates. Only ever called at request time, after `connection()`. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const CHIPS = [
  "All",
  "Music",
  "Gaming",
  "Live",
  "Mixes",
  "Tech",
  "News",
  "Movies",
  "Recently uploaded",
] as const;

export type Chip = (typeof CHIPS)[number];

export function isChip(value: string | undefined): value is Chip {
  return !!value && (CHIPS as readonly string[]).includes(value);
}

/** Chips that map onto a mostPopular chart category; everything else is a search. */
const CHART_CATEGORIES: Partial<Record<Chip, string>> = {
  Music: "10",
  Gaming: "20",
  News: "25",
  Movies: "1",
};

const SEARCH_CHIPS: Partial<Record<Chip, Record<string, string>>> = {
  Live: { q: "live", eventType: "live", order: "viewCount" },
  Mixes: { q: "mix playlist", order: "viewCount" },
  Tech: { q: "technology review", order: "relevance" },
  "Recently uploaded": { q: "new", order: "date" },
};

export function hasApiKey(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_YOUTUBE_API_KEY);
}

type ApiError = {
  message?: string;
  details?: { reason?: string }[];
};
type ApiList<T> = { items?: T[]; nextPageToken?: string; error?: ApiError };

/**
 * These calls run on the server, so the request carries no Referer and no
 * browser origin. A key locked to "Websites (HTTP referrers)" can therefore
 * never satisfy the restriction — Google's own message ("Requests from referer
 * <empty> are blocked") does not say that, so spell out the fix.
 */
function explain(error: ApiError | undefined, status: number): string {
  const reason = error?.details?.find((d) => d.reason)?.reason;
  const message = error?.message ?? `YouTube API responded ${status}`;

  if (reason === "API_KEY_HTTP_REFERRER_BLOCKED" || /referer/i.test(message)) {
    return "This YouTube API key is restricted to website referrers, but these requests come from the server. In Google Cloud Console → Credentials → your key → Application restrictions, choose None (or IP addresses).";
  }
  if (reason === "API_KEY_IP_ADDRESS_BLOCKED") {
    return "This YouTube API key is restricted to specific IP addresses that do not include this server. Update Application restrictions in Google Cloud Console.";
  }
  return message;
}

async function api<T>(path: string, params: Record<string, string>): Promise<ApiList<T>> {
  const key = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_YOUTUBE_API_KEY is not set");

  const url = new URL(`${BASE}/${path}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  url.searchParams.set("key", key);

  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  const body = (await res.json()) as ApiList<T>;
  if (!res.ok) {
    throw new Error(explain(body?.error, res.status));
  }
  return body;
}

/* ----------------------------- raw API shapes ----------------------------- */

type RawThumb = { url?: string; width?: number };
type RawVideo = {
  id: string | { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    channelId?: string;
    channelTitle?: string;
    liveBroadcastContent?: string;
    thumbnails?: Record<string, RawThumb>;
  };
  contentDetails?: { duration?: string };
  statistics?: { viewCount?: string };
};
type RawChannel = {
  id: string;
  snippet?: { title?: string; thumbnails?: Record<string, RawThumb> };
  statistics?: { subscriberCount?: string };
};

function bestThumb(thumbs: Record<string, RawThumb> | undefined): string | null {
  if (!thumbs) return null;
  const ranked = ["maxres", "standard", "high", "medium", "default"];
  for (const name of ranked) {
    const url = thumbs[name]?.url;
    if (url) return url;
  }
  return null;
}

function videoId(raw: RawVideo): string {
  return typeof raw.id === "string" ? raw.id : (raw.id?.videoId ?? "");
}

function toVideo(raw: RawVideo, channels: Map<string, Channel>): Video {
  const snippet = raw.snippet ?? {};
  const id = videoId(raw);
  const channelId = snippet.channelId ?? "";
  return {
    id,
    title: decodeEntities(snippet.title ?? "Untitled"),
    description: decodeEntities(snippet.description ?? ""),
    thumbnail: bestThumb(snippet.thumbnails),
    duration: formatDuration(raw.contentDetails?.duration),
    views: raw.statistics?.viewCount ? Number(raw.statistics.viewCount) : null,
    publishedAt: snippet.publishedAt ?? new Date().toISOString(),
    live: snippet.liveBroadcastContent === "live",
    channel: channels.get(channelId) ?? {
      id: channelId,
      title: decodeEntities(snippet.channelTitle ?? "Unknown channel"),
      avatar: null,
      verified: false,
    },
  };
}

/** The API returns titles HTML-escaped ("Q&amp;A"); undo the handful that show up. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function loadChannels(ids: string[]): Promise<Map<string, Channel>> {
  const unique = [...new Set(ids.filter(Boolean))];
  const map = new Map<string, Channel>();

  // channels.list accepts at most 50 ids per call, and the pool can exceed that.
  for (let start = 0; start < unique.length; start += 50) {
    const { items = [] } = await api<RawChannel>("channels", {
      part: "snippet,statistics",
      id: unique.slice(start, start + 50).join(","),
      maxResults: "50",
    });

    for (const item of items) {
      const subscribers = Number(item.statistics?.subscriberCount ?? 0);
      map.set(item.id, {
        id: item.id,
        title: decodeEntities(item.snippet?.title ?? "Unknown channel"),
        avatar: bestThumb(item.snippet?.thumbnails),
        // The API exposes no verification flag, so treat a large audience as the badge.
        verified: subscribers >= 100_000,
      });
    }
  }
  return map;
}

/** Hydrates bare video ids into full records (duration + stats live on videos.list). */
async function hydrate(ids: string[]): Promise<Video[]> {
  const wanted = ids.filter(Boolean).slice(0, 50);
  if (wanted.length === 0) return [];

  const { items = [] } = await api<RawVideo>("videos", {
    part: "snippet,contentDetails,statistics",
    id: wanted.join(","),
    maxResults: "50",
  });

  const channels = await loadChannels(items.map((i) => i.snippet?.channelId ?? ""));
  const byId = new Map(items.map((i) => [videoId(i), toVideo(i, channels)]));
  // Preserve the order the caller asked for.
  return wanted.map((id) => byId.get(id)).filter((v): v is Video => Boolean(v));
}

async function searchIds(params: Record<string, string>): Promise<string[]> {
  const { items = [] } = await api<RawVideo>("search", {
    part: "snippet",
    type: "video",
    maxResults: "50",
    ...params,
  });
  return items.map(videoId).filter(Boolean);
}

async function mostPopular(categoryId?: string): Promise<Video[]> {
  const items: RawVideo[] = [];
  let pageToken: string | undefined;

  // videos.list costs one unit per call whatever the page size, so paging here
  // buys a much deeper pool almost for free.
  for (let page = 0; page < POOL_PAGES; page++) {
    const res = await api<RawVideo>("videos", {
      part: "snippet,contentDetails,statistics",
      chart: "mostPopular",
      regionCode: process.env.YOUTUBE_REGION || "US",
      maxResults: "50",
      ...(categoryId ? { videoCategoryId: categoryId } : {}),
      ...(pageToken ? { pageToken } : {}),
    });
    items.push(...(res.items ?? []));
    pageToken = res.nextPageToken;
    if (!pageToken) break;
  }

  const channels = await loadChannels(items.map((i) => i.snippet?.channelId ?? ""));
  return items.map((item) => toVideo(item, channels));
}

async function videosForChip(chip: Chip): Promise<Video[]> {
  const search = SEARCH_CHIPS[chip];
  if (search) return hydrate(await searchIds(search));

  const category = CHART_CATEGORIES[chip];
  const chart = await mostPopular(category);
  if (chart.length > 0) return chart;
  // Some category charts are empty in some regions — fall back to a plain search.
  return hydrate(await searchIds({ q: chip, order: "viewCount" }));
}

async function loadShorts(): Promise<Short[]> {
  const ids = await searchIds({
    q: "#shorts",
    videoDuration: "short",
    order: "viewCount",
  });
  const videos = await hydrate(ids);
  return videos.map((v) => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail,
    views: v.views,
  }));
}

/* -------------------------------- public API ------------------------------- */

/** Draws the slice the page renders out of a larger cached pool. */
function arrange(videos: Video[], shorts: Short[]): Pick<Feed, "featured" | "recommended" | "shorts"> {
  const [featured = null, ...recommended] = shuffle(videos).slice(0, FEED_SIZE);
  return { featured, recommended, shorts: shuffle(shorts).slice(0, SHORTS_SIZE) };
}

export async function getFeed(chip: Chip = "All"): Promise<Feed> {
  // The pools below are cached; the arrangement is not. Waiting for a real
  // request keeps this route out of the prerender so every refresh reshuffles.
  await connection();

  if (!hasApiKey()) {
    const demo = demoFeed();
    const pool = demo.featured ? [demo.featured, ...demo.recommended] : demo.recommended;
    return { ...demo, ...arrange(pool, demo.shorts) };
  }

  try {
    const [videos, shorts] = await Promise.all([
      videosForChip(chip),
      loadShorts().catch(() => [] as Short[]),
    ]);
    if (videos.length === 0) return demoFeed("The API returned no videos for this filter.");

    return {
      source: "youtube",
      ...arrange(videos, shorts.length > 0 ? shorts : demoFeed().shorts),
    };
  } catch (error) {
    return demoFeed(error instanceof Error ? error.message : "YouTube request failed");
  }
}

export async function searchVideos(query: string): Promise<{ videos: Video[]; error?: string }> {
  if (!query.trim()) return { videos: [] };
  if (!hasApiKey()) {
    const needle = query.toLowerCase();
    return {
      videos: demoVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(needle) ||
          v.channel.title.toLowerCase().includes(needle),
      ),
      error: "Showing demo results — set NEXT_PUBLIC_YOUTUBE_API_KEY to search YouTube.",
    };
  }

  try {
    return { videos: await hydrate(await searchIds({ q: query })) };
  } catch (error) {
    return {
      videos: [],
      error: error instanceof Error ? error.message : "YouTube search failed",
    };
  }
}

export async function getVideo(id: string): Promise<Video | null> {
  if (!hasApiKey()) return demoVideos.find((v) => v.id === id) ?? null;
  try {
    const [video] = await hydrate([id]);
    return video ?? null;
  } catch {
    return null;
  }
}

/** "Up next" column — a topical search keeps it cheap and relevant. */
export async function getRelated(video: Video): Promise<Video[]> {
  if (!hasApiKey()) return demoVideos.filter((v) => v.id !== video.id);
  try {
    const ids = await searchIds({ q: video.title, maxResults: "12" });
    return (await hydrate(ids)).filter((v) => v.id !== video.id);
  } catch {
    return [];
  }
}
