import Link from "next/link";
import Carousel from "./Carousel";
import Thumbnail from "./Thumbnail";
import VideoCard from "./VideoCard";
import { KebabIcon, ShortsIcon } from "./Icons";
import { formatCount } from "@/lib/format";
import type { Short, Video } from "@/lib/types";

function SectionHeader({
  title,
  viewAllHref,
  icon,
}: {
  title: string;
  viewAllHref?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {icon}
      <h2 className="text-[20px] font-semibold tracking-tight text-white">{title}</h2>
      <div className="ml-auto flex items-center gap-1">
        {viewAllHref && (
          <>
          <Link
            href={viewAllHref}
            className="rounded-full px-3 py-1.5 text-[13.5px] font-medium text-ink-dim transition-colors hover:bg-white/10 hover:text-white"
          >
            View all
          </Link>
          <button
            type="button"
            aria-label={`More ${title} options`}
            className="rounded-full p-1.5 text-ink-dim transition-colors hover:bg-white/10 hover:text-white"
          >
            <KebabIcon className="h-[18px] w-[18px]" />
          </button>
          </>
        )}
      </div>
    </div>
  );
}

export function VideoShelf({
  title,
  videos,
  viewAllHref,
}: {
  title: string;
  videos: Video[];
  viewAllHref?: string;
}) {
  if (videos.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionHeader title={title} viewAllHref={viewAllHref} />
      <Carousel arrowTop="30%">
        {videos.map((video) => (
          <div
            key={video.id}
            className="w-[76%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-48px)/4)]"
          >
            <VideoCard video={video} />
          </div>
        ))}
      </Carousel>
    </section>
  );
}

export function ShortsShelf({ shorts }: { shorts: Short[] }) {
  if (shorts.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionHeader
        title="Shorts"
        viewAllHref="/shorts"
        icon={<ShortsIcon className="h-6 w-6 text-yt-red" />}
      />
      <Carousel arrowTop="40%">
        {shorts.map((short) => (
          <Link
            key={short.id}
            href={`/watch?v=${short.id}`}
            className="group relative aspect-[9/16] w-[46%] shrink-0 snap-start overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/[0.06] sm:w-[30%] lg:w-[calc((100%-48px)/4)]"
          >
            <Thumbnail
              src={short.thumbnail}
              alt={short.title}
              seed={short.id}
              sizes="(max-width: 640px) 46vw, 260px"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3 pt-10">
              <span className="clamp-2 block text-[13.5px] leading-snug font-medium text-white">
                {short.title}
              </span>
              <span className="mt-1 block text-[12px] text-white/70">
                {formatCount(short.views, "views")}
              </span>
            </span>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
