import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import Thumbnail from "@/components/Thumbnail";
import WatchPlayer from "@/components/WatchPlayer";
import { ClockIcon, ShareIcon, ThumbUpIcon, VerifiedIcon } from "@/components/Icons";
import { formatCount, timeAgo } from "@/lib/format";
import { getRelated, getVideo } from "@/lib/youtube";

const pill =
  "flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.07] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.13]";

export default async function Watch({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  if (!v) notFound();

  const video = await getVideo(v);
  if (!video) notFound();

  const related = await getRelated(video);

  return (
    <div>
      <WatchPlayer video={video} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]">
        <div>
          <h1 className="text-[22px] leading-tight font-bold tracking-tight text-white">
            {video.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={video.channel.title} src={video.channel.avatar} size={40} />
              <div>
                <p className="flex items-center gap-1.5 text-[15px] font-medium text-white">
                  {video.channel.title}
                  {video.channel.verified && (
                    <VerifiedIcon className="h-4 w-4 text-ink-dim" />
                  )}
                </p>
                <p className="text-[12.5px] text-ink-faint">
                  {timeAgo(video.publishedAt)}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-full bg-white px-5 py-2 text-[14px] font-medium text-[#0f1524] transition-opacity hover:opacity-90"
            >
              Subscribe
            </button>

            <div className="ml-auto flex flex-wrap gap-2">
              <button type="button" className={pill}>
                <ThumbUpIcon className="h-[18px] w-[18px]" />
                {formatCount(video.views ? Math.round(video.views * 0.03) : null)}
              </button>
              <button type="button" className={pill}>
                <ShareIcon className="h-[18px] w-[18px]" />
                Share
              </button>
              <button type="button" className={pill}>
                <ClockIcon className="h-[18px] w-[18px]" />
                Save
              </button>
            </div>
          </div>

          <div className="glass mt-5 rounded-2xl p-4">
            <p className="text-[14px] font-medium text-white">
              {formatCount(video.views, "views")} • {timeAgo(video.publishedAt)}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed whitespace-pre-line text-ink-dim">
              {video.description || "No description."}
            </p>
          </div>
        </div>

        <aside>
          <h2 className="mb-4 text-[16px] font-semibold text-white">Up next</h2>
          <ul className="space-y-3">
            {related.slice(0, 12).map((item) => (
              <li key={item.id}>
                <Link href={`/watch?v=${item.id}`} className="flex gap-3">
                  <span className="relative block aspect-video w-[150px] shrink-0 overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/[0.06]">
                    <Thumbnail
                      src={item.thumbnail}
                      alt={item.title}
                      seed={item.id}
                      sizes="150px"
                    />
                    {item.duration && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium text-white tabular-nums">
                        {item.duration}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="clamp-2 block text-[13.5px] leading-snug font-medium text-white">
                      {item.title}
                    </span>
                    <span className="mt-1 block truncate text-[12.5px] text-ink-faint">
                      {item.channel.title}
                    </span>
                    <span className="block text-[12.5px] text-ink-faint">
                      {formatCount(item.views, "views")}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
