export default function DemoNotice({ error }: { error?: string }) {
  return (
    <p className="mb-5 rounded-xl border border-amber-300/20 bg-amber-300/[0.07] px-4 py-2.5 text-[13px] text-amber-100/80">
      {error
        ? `Showing the demo feed — ${error}`
        : "Showing the demo feed. Add NEXT_PUBLIC_YOUTUBE_API_KEY to .env.local to load live YouTube data."}
    </p>
  );
}
