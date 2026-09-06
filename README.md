# YouTube UI

A YouTube home/watch/search interface built with Next.js 16 (App Router), React 19 and
Tailwind CSS v4, wired to the **YouTube Data API v3**.

![Home](./docs/home.png)

## Setup

```bash
npm install
cp .env.example .env.local   # then paste your key
npm run dev
```

`.env.local`:

```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_key_here
NEXT_PUBLIC_YOUTUBE_REGION=US            # optional, drives the "most popular" chart
```

Without a key the app renders a bundled demo feed instead of failing, so you can work on
the UI offline. A small banner at the bottom of the page tells you which one you're seeing.

## Routes

| Route | What it does |
| --- | --- |
| `/` | Home: category chips, featured hero, Recommended rail, Shorts rail |
| `/?c=Music` | Same feed filtered by chip (`Music`, `Gaming`, `Live`, `Tech`, …) |
| `/results?q=…` | Search results (`search.list`) |
| `/watch?v=…` | Player (privacy-enhanced embed), metadata, "Up next" column |
| `/shorts`, `/feed/*`, `/playlist/*` | Sidebar destinations, rendered as video grids |

## How the API is used

`src/lib/youtube.ts` is the only place that talks to Google. Every call goes through one
`api()` helper with `next: { revalidate: 600 }`, so a page hit doesn't cost quota more
than once per 10 minutes.

- **Home** — `videos.list?chart=mostPopular` (with `videoCategoryId` for Music/Gaming/News/Movies).
- **Live / Mixes / Tech / Recently uploaded** — `search.list`, then `videos.list` to
  hydrate duration and view counts, which `search.list` does not return.
- **Channel avatars** — `channels.list`, batched to one request for up to 50 ids.
- **Verified badge** — the API exposes no verification flag, so a channel with 100k+
  subscribers gets the badge.

Quota note: `search.list` costs 100 units against a 10,000/day default, `videos.list`
costs 1. The chip filters that use search are the expensive ones.

## Project layout

```
src/
  app/          routes (server components; data fetched on the server)
  components/   AppShell, Sidebar, TopBar, HeroCard, VideoCard, Carousel, Shelf …
  lib/
    youtube.ts  YouTube Data API client + mappers
    demo.ts     offline fallback feed
    format.ts   view counts, relative dates, ISO-8601 durations
    types.ts
```

The API key is only ever read in server components, so it never reaches the browser.
