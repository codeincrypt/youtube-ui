import Link from "next/link";
import { CHIPS, type Chip } from "@/lib/youtube";

export default function ChipRow({ active }: { active: Chip }) {
  return (
    <div className="no-scrollbar -mx-1 mb-5 flex gap-3 overflow-x-auto px-1 pb-1">
      {CHIPS.map((chip) => {
        const selected = chip === active;
        return (
          <Link
            key={chip}
            href={chip === "All" ? "/" : `/?c=${encodeURIComponent(chip)}`}
            aria-current={selected ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-[13.5px] font-medium whitespace-nowrap transition-colors ${
              selected
                ? "bg-white text-[#0f1524]"
                : "border border-white/[0.08] bg-white/[0.06] text-ink hover:bg-white/[0.12]"
            }`}
          >
            {chip}
          </Link>
        );
      })}
    </div>
  );
}
