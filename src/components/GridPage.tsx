import DemoNotice from "./DemoNotice";
import VideoCard from "./VideoCard";
import { ShortsShelf } from "./Shelf";
import { getFeed } from "@/lib/youtube";

export default async function GridPage({
  title,
  subtitle,
  shorts = false,
}: {
  title: string;
  subtitle?: string;
  shorts?: boolean;
}) {
  const feed = await getFeed("All");
  const videos = feed.featured
    ? [feed.featured, ...feed.recommended]
    : feed.recommended;

  return (
    <>
      <h1 className="text-[24px] font-semibold tracking-tight text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-[14px] text-ink-dim">{subtitle}</p>}
      <div className="mt-6">
        {feed.source === "demo" && <DemoNotice error={feed.error} />}
        {shorts ? (
          <ShortsShelf shorts={feed.shorts} />
        ) : (
          <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} showAvatar />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
