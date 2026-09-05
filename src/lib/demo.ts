import type { Feed, Short, Video } from "./types";

const DAY = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * DAY).toISOString();

const channel = (id: string, title: string) => ({
  id,
  title,
  avatar: null,
  verified: true,
});

const featured: Video = {
  id: "demo-featured",
  title: "Exploring the Most Beautiful Places on Earth",
  description:
    "Join me as we explore some of the most beautiful places on planet Earth.",
  thumbnail: null,
  duration: "12:45",
  views: 3_100_000,
  publishedAt: ago(2),
  live: false,
  channel: channel("demo-ben", "Ben Brown"),
};

const recommended: Video[] = [
  {
    id: "demo-desk",
    title: "Minimal Desk Setup 2024",
    description: "The cleanest desk build of the year, part by part.",
    thumbnail: null,
    duration: "8:16",
    views: 1_200_000,
    publishedAt: ago(5),
    live: false,
    channel: channel("demo-techsource", "TechSource"),
  },
  {
    id: "demo-car",
    title: "0–100 in 2.3 Seconds!",
    description: "We take the quickest production car we have ever driven to the strip.",
    thumbnail: null,
    duration: "10:23",
    views: 2_700_000,
    publishedAt: ago(7),
    live: false,
    channel: channel("demo-carwow", "Carwow"),
  },
  {
    id: "demo-acoustic",
    title: "Acoustic Covers 2024",
    description: "An hour of stripped-back covers recorded live in one take.",
    thumbnail: null,
    duration: "4:24",
    views: 512_000,
    publishedAt: ago(3),
    live: false,
    channel: channel("demo-alexgoot", "Alex Goot"),
  },
  {
    id: "demo-islands",
    title: "Top 10 Islands to Visit",
    description: "Ten islands worth crossing an ocean for, ranked.",
    thumbnail: null,
    duration: "7:31",
    views: 3_400_000,
    publishedAt: ago(14),
    live: false,
    channel: channel("demo-travelopia", "Travelopia"),
  },
  {
    id: "demo-kitchen",
    title: "I Cooked for 100 Strangers",
    description: "One kitchen, one night, one hundred plates.",
    thumbnail: null,
    duration: "15:02",
    views: 890_000,
    publishedAt: ago(1),
    live: false,
    channel: channel("demo-kitchen", "Table for None"),
  },
  {
    id: "demo-space",
    title: "Why Rockets Are Getting Smaller",
    description: "The economics quietly reshaping every launch manifest.",
    thumbnail: null,
    duration: "18:47",
    views: 2_100_000,
    publishedAt: ago(9),
    live: false,
    channel: channel("demo-space", "Orbital Notes"),
  },
];

const shorts: Short[] = [
  { id: "demo-s1", title: "This trick changed my mornings", thumbnail: null, views: 4_200_000 },
  { id: "demo-s2", title: "60 seconds of pure focus", thumbnail: null, views: 1_800_000 },
  { id: "demo-s3", title: "The cheapest upgrade you can make", thumbnail: null, views: 940_000 },
  { id: "demo-s4", title: "Sunset from 12,000 feet", thumbnail: null, views: 3_600_000 },
  { id: "demo-s5", title: "He did not see it coming", thumbnail: null, views: 7_100_000 },
  { id: "demo-s6", title: "One pan, five minutes", thumbnail: null, views: 620_000 },
];

export const demoSubscriptions = [
  { id: "demo-mrbeast", title: "MrBeast", status: "live" as const },
  { id: "demo-markrober", title: "Mark Rober", status: "live" as const },
  { id: "demo-linus", title: "Linus Tech Tips", status: "new" as const },
  { id: "demo-mkbhd", title: "Marques Brownlee", status: "new" as const },
  { id: "demo-pewdiepie", title: "PewDiePie", status: "live" as const },
  { id: "demo-veritasium", title: "Veritasium", status: "new" as const },
  { id: "demo-kurzgesagt", title: "Kurzgesagt", status: "new" as const },
  { id: "demo-carwow", title: "Carwow", status: "live" as const },
  { id: "demo-npr", title: "NPR Music", status: "new" as const },
];

export function demoFeed(error?: string): Feed {
  return { source: "demo", featured, recommended, shorts, error };
}

export function demoVideo(id: string): Video {
  return [featured, ...recommended].find((v) => v.id === id) ?? featured;
}

export const demoVideos = [featured, ...recommended];
