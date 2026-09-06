"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType, type SVGProps } from "react";
import Avatar from "./Avatar";
import { demoSubscriptions } from "@/lib/demo";
import {
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  HistoryIcon,
  HomeIcon,
  LibraryIcon,
  ShortsIcon,
  SubscriptionsIcon,
  ThumbUpIcon,
  YouTubeLogo,
  YourVideosIcon,
} from "./Icons";

type Item = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent?: boolean;
};

const PRIMARY: Item[] = [
  { label: "Home", href: "/", icon: HomeIcon, accent: true },
  { label: "Shorts", href: "/shorts", icon: ShortsIcon },
  { label: "Subscriptions", href: "/feed/subscriptions", icon: SubscriptionsIcon },
];

const LIBRARY: Item[] = [
  { label: "Library", href: "/feed/library", icon: LibraryIcon },
  { label: "History", href: "/feed/history", icon: HistoryIcon },
  { label: "Your videos", href: "/feed/you", icon: YourVideosIcon },
  { label: "Watch later", href: "/playlist/watch-later", icon: ClockIcon },
  { label: "Liked videos", href: "/playlist/liked", icon: ThumbUpIcon },
];

function NavLink({ item, active }: { item: Item; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-4 rounded-xl px-3 py-2.5 text-[14.5px] transition-colors ${
        active
          ? "bg-white/[0.09] font-medium text-white"
          : "text-ink-dim hover:bg-white/[0.055] hover:text-white"
      }`}
    >
      <Icon
        className={`h-[22px] w-[22px] shrink-0 ${
          active && item.accent ? "text-yt-red" : ""
        }`}
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function Divider() {
  return <hr className="my-3 border-0 border-t border-white/[0.07]" />;
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const subscriptions = expanded
    ? demoSubscriptions
    : demoSubscriptions.slice(0, 5);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`glass fixed top-4 bottom-4 left-4 z-50 flex w-[236px] flex-col rounded-3xl px-3 py-4 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        <div className="mb-4 flex items-center justify-between px-2">
          <Link href="/" className="block" aria-label="YouTube home">
            <YouTubeLogo className="h-[26px] w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-1.5 text-ink-dim hover:bg-white/10 hover:text-white lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto pb-2">
          <div className="space-y-1">
            {PRIMARY.map((item) => (
              <NavLink key={item.label} item={item} active={pathname === item.href} />
            ))}
          </div>

          <Divider />

          <div className="space-y-1">
            {LIBRARY.map((item) => (
              <NavLink key={item.label} item={item} active={pathname === item.href} />
            ))}
          </div>

          <Divider />

          <p className="px-3 pb-2 pt-1 text-[11px] font-medium tracking-[0.12em] text-ink-faint">
            SUBSCRIPTIONS
          </p>
          <div className="space-y-1">
            {subscriptions.map((sub) => (
              <Link
                key={sub.id}
                href={`/results?q=${encodeURIComponent(sub.title)}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-ink-dim transition-colors hover:bg-white/[0.055] hover:text-white"
              >
                <Avatar name={sub.title} size={26} />
                <span className="flex-1 truncate">{sub.title}</span>
                <span
                  aria-label={sub.status === "live" ? "Live" : "New videos"}
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    sub.status === "live" ? "bg-yt-red" : "bg-sky-400"
                  }`}
                />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-1 flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-[14px] text-ink-dim transition-colors hover:bg-white/[0.055] hover:text-white"
          >
            <ChevronDownIcon
              className={`h-[22px] w-[22px] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
            <span>{expanded ? "Show less" : "Show more"}</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
