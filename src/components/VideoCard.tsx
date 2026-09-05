import Link from "next/link";
import Avatar from "./Avatar";
import Thumbnail from "./Thumbnail";
import { KebabIcon, VerifiedIcon } from "./Icons";
import { formatCount, timeAgo } from "@/lib/format";
import type { Video } from "@/lib/types";

export default function VideoCard({
  video,
  showAvatar = false,
}: {
  video: Video;
  showAvatar?: boolean;
}) {
  const href = `/watch?v=${video.id}`;

  return (
    <article className="group">
      <Link
        href={href}
        className="relative block aspect-video overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/[0.06]"
      >
        <Thumbnail
          src={video.thumbnail}
          alt={video.title}
          seed={video.id}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 260px"
        />
        {video.live ? (
          <span className="absolute bottom-2 right-2 rounded bg-yt-red px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-white">
            LIVE
          </span>
        ) : (
          video.duration && (
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[12px] font-medium text-white tabular-nums">
              {video.duration}
            </span>
          )
        )}
      </Link>

      <div className="mt-3 flex gap-3">
        {showAvatar && (
          <Avatar name={video.channel.title} src={video.channel.avatar} size={34} />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="clamp-2 text-[15px] leading-snug font-medium text-white">
            <Link href={href}>{video.title}</Link>
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="truncate text-[13px] text-ink-dim">
              {video.channel.title}
            </span>
            {video.channel.verified && (
              <VerifiedIcon
                className="h-[13px] w-[13px] shrink-0 text-ink-faint"
                aria-label="Verified"
              />
            )}
          </div>
          <p className="mt-0.5 text-[13px] text-ink-faint">
            {formatCount(video.views, "views")} • {timeAgo(video.publishedAt)}
          </p>
        </div>
        <button
          type="button"
          aria-label={`More actions for ${video.title}`}
          className="-mr-1 h-fit rounded-full p-1 text-ink-faint opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100 focus-visible:opacity-100"
        >
          <KebabIcon className="h-[18px] w-[18px]" />
        </button>
      </div>
    </article>
  );
}
