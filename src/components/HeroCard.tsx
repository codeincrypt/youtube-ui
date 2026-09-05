import Link from "next/link";
import Avatar from "./Avatar";
import Thumbnail from "./Thumbnail";
import { ClockIcon, KebabIcon, PlayIcon, ShareIcon, VerifiedIcon } from "./Icons";
import { formatCount, timeAgo } from "@/lib/format";
import type { Video } from "@/lib/types";

export default function HeroCard({ video }: { video: Video }) {
  const href = `/watch?v=${video.id}`;

  return (
    <section className="glass mb-8 rounded-2xl p-4">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
        <Link
          href={href}
          className="group relative block aspect-video overflow-hidden rounded-xl bg-black/40"
        >
          <Thumbnail
            src={video.thumbnail}
            alt={video.title}
            seed={video.id}
            sizes="(max-width: 1024px) 100vw, 590px"
            priority
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-[74px] w-[74px] place-items-center rounded-full bg-black/45 backdrop-blur-sm ring-1 ring-white/25 transition-transform duration-200 group-hover:scale-105">
              <PlayIcon className="ml-1 h-7 w-7 text-white" />
            </span>
          </span>

          {video.live ? (
            <span className="absolute bottom-3 right-3 rounded bg-yt-red px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-white">
              LIVE
            </span>
          ) : (
            video.duration && (
              <span className="absolute bottom-3 right-3 rounded bg-black/80 px-1.5 py-0.5 text-[12px] font-medium text-white tabular-nums">
                {video.duration}
              </span>
            )
          )}

          {/* Resume bar, the way a partially-watched video reads on YouTube. */}
          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
            <span className="block h-full w-[38%] bg-yt-red" />
          </span>
        </Link>

        <div className="relative flex flex-col pr-8 lg:pt-1">
          <button
            type="button"
            aria-label="More actions"
            className="absolute -top-1 right-0 rounded-full p-1.5 text-ink-dim transition-colors hover:bg-white/10 hover:text-white"
          >
            <KebabIcon className="h-5 w-5" />
          </button>

          <h1 className="clamp-2 max-w-[420px] text-[26px] leading-[1.18] font-bold tracking-tight text-white">
            <Link href={href}>{video.title}</Link>
          </h1>

          <p className="mt-2 text-[14px] text-ink-dim">
            {formatCount(video.views, "views")} • {timeAgo(video.publishedAt)}
          </p>

          <div className="mt-4 flex items-center gap-2.5">
            <Avatar name={video.channel.title} src={video.channel.avatar} size={34} />
            <span className="text-[15px] font-medium text-white">
              {video.channel.title}
            </span>
            {video.channel.verified && (
              <VerifiedIcon className="h-4 w-4 text-ink-dim" aria-label="Verified" />
            )}
          </div>

          {video.description && (
            <p className="clamp-2 mt-4 max-w-[440px] text-[14px] leading-relaxed text-ink-dim">
              {video.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.07] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.13]"
            >
              <ClockIcon className="h-[18px] w-[18px]" />
              Watch later
            </button>
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.07] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.13]"
            >
              <ShareIcon className="h-[18px] w-[18px]" />
              Share
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
