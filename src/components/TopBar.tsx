"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Avatar from "./Avatar";
import { BellIcon, CreateIcon, MenuIcon, SearchIcon } from "./Icons";

export default function TopBar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  return (
    <header className="flex items-center gap-3 pb-5 pt-1">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open menu"
        className="rounded-full p-2 text-ink-dim transition-colors hover:bg-white/10 hover:text-white lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const term = String(data.get("q") ?? "").trim();
          if (term) router.push(`/results?q=${encodeURIComponent(term)}`);
        }}
        className="mx-auto flex h-11 w-full max-w-[700px] items-center rounded-full border border-white/[0.09] bg-white/[0.05] backdrop-blur-md transition-colors focus-within:border-white/20"
      >
        <input
          // Remounting on navigation keeps the field in step with back/forward.
          key={query}
          name="q"
          defaultValue={query}
          placeholder="Search"
          aria-label="Search"
          className="h-full flex-1 bg-transparent px-6 text-[15px] text-white placeholder:text-ink-faint focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Search"
          className="flex h-full items-center rounded-r-full border-l border-white/[0.09] px-6 text-ink-dim transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <SearchIcon className="h-[22px] w-[22px]" />
        </button>
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Create"
          className="hidden rounded-full p-2 text-ink-dim transition-colors hover:bg-white/10 hover:text-white sm:block"
        >
          <CreateIcon className="h-[26px] w-[26px]" />
        </button>

        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative rounded-full p-2 text-ink-dim transition-colors hover:bg-white/10 hover:text-white"
        >
          <BellIcon className="h-[23px] w-[23px]" />
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-yt-red px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <Link href="/feed/you" aria-label="Your account" className="ml-1 block">
          <Avatar name="You" size={38} />
        </Link>
      </div>
    </header>
  );
}
