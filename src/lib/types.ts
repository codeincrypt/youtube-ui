export type Channel = {
  id: string;
  title: string;
  avatar: string | null;
  verified: boolean;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  /** Pre-formatted runtime, e.g. "12:45". Empty for live streams. */
  duration: string;
  views: number | null;
  publishedAt: string;
  live: boolean;
  channel: Channel;
};

export type Short = {
  id: string;
  title: string;
  thumbnail: string | null;
  views: number | null;
};

export type FeedSource = "youtube" | "demo";

export type Feed = {
  source: FeedSource;
  featured: Video | null;
  recommended: Video[];
  shorts: Short[];
  /** Present when a live key was configured but the call failed. */
  error?: string;
};
