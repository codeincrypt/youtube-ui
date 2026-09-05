import ChipRow from "@/components/ChipRow";
import DemoNotice from "@/components/DemoNotice";
import HeroCard from "@/components/HeroCard";
import VideoCard from "@/components/VideoCard";
import { ShortsShelf, VideoShelf } from "@/components/Shelf";
import { getFeed, isChip } from "@/lib/youtube";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  const chip = isChip(c) ? c : "All";
  const feed = await getFeed(chip);

  const shelf = feed.recommended.slice(0, 8);
  const rest = feed.recommended.slice(8);

  return (
    <>
      <ChipRow active={chip} />
      {feed.featured && <HeroCard video={feed.featured} />}

      <VideoShelf title="Recommended" videos={shelf} />
      <ShortsShelf shorts={feed.shorts} />

      {rest.length > 0 && (
        <section>
          <h2 className="mb-4 text-[20px] font-semibold tracking-tight text-white">
            More to explore
          </h2>
          <div className="grid gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>
      )}

      {feed.source === "demo" && (
        <div className="mt-10">
          <DemoNotice error={feed.error} />
        </div>
      )}
    </>
  );
}
