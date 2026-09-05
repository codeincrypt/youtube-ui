import Thumbnail from "./Thumbnail";
import { PlayIcon } from "./Icons";
import type { Video } from "@/lib/types";

/** Demo ids are not real YouTube videos, so they get a still frame instead. */
export default function WatchPlayer({ video }: { video: Video }) {
  const isDemo = video.id.startsWith("demo-");

  if (isDemo) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/50 ring-1 ring-white/[0.06]">
        <Thumbnail
          src={video.thumbnail}
          alt={video.title}
          seed={video.id}
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 grid place-items-center bg-black/25">
          <div className="text-center">
            <span className="mx-auto grid h-[74px] w-[74px] place-items-center rounded-full bg-black/50 ring-1 ring-white/25">
              <PlayIcon className="ml-1 h-7 w-7 text-white" />
            </span>
            <p className="mt-4 text-[13px] text-white/70">
              Demo video — add a YouTube API key to stream real results.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-white/[0.06]">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.id}`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
