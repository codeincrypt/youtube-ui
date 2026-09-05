import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-[64px] font-bold leading-none text-white/15">404</p>
      <h1 className="mt-4 text-[22px] font-semibold text-white">
        This page isn&apos;t available
      </h1>
      <p className="mt-2 text-[14px] text-ink-dim">
        The video may have been removed, or the link is wrong.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-[#0f1524]"
      >
        Back to home
      </Link>
    </div>
  );
}
