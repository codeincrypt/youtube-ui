import Link from "next/link";
import Avatar from "@/components/Avatar";
import Thumbnail from "@/components/Thumbnail";
import { VerifiedIcon } from "@/components/Icons";
import { formatCount, timeAgo } from "@/lib/format";
import { searchVideos } from "@/lib/youtube";

export default async function Results({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { videos, error } = await searchVideos(q);

  return (
    <>
      <h1 className="mb-1 text-[20px] font-semibold tracking-tight text-white">
        Results for <span className="text-ink-dim">“{q}”</span>
      </h1>
      {error && (
        <p className="mb-5 mt-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2.5 text-[13px] text-amber-100/80">
          {error}
        </p>
      )}

      {videos.length === 0 ? (
        <p className="mt-8 text-[15px] text-ink-dim">
          {error ? "Search is unavailable right now." : "No videos matched that search."}
        </p>
      ) : (
        <ul className="mt-6 space-y-5">
          {videos.map((video) => (
            <li key={video.id}>
              <article className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href={`/watch?v=${video.id}`}
                  className="relative block aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/[0.06] sm:w-[340px]"
                >
                  <Thumbnail
                    src={video.thumbnail}
                    alt={video.title}
                    seed={video.id}
                    sizes="(max-width: 640px) 100vw, 340px"
                  />
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[12px] font-medium text-white tabular-nums">
                      {video.duration}
                    </span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <h2 className="clamp-2 text-[18px] leading-snug font-medium text-white">
                    <Link href={`/watch?v=${video.id}`}>{video.title}</Link>
                  </h2>
                  <p className="mt-1 text-[13px] text-ink-faint">
                    {formatCount(video.views, "views")} • {timeAgo(video.publishedAt)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Avatar
                      name={video.channel.title}
                      src={video.channel.avatar}
                      size={26}
                    />
                    <span className="text-[13px] text-ink-dim">
                      {video.channel.title}
                    </span>
                    {video.channel.verified && (
                      <VerifiedIcon className="h-[13px] w-[13px] text-ink-faint" />
                    )}
                  </div>
                  <p className="clamp-2 mt-3 text-[13px] leading-relaxed text-ink-faint">
                    {video.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
