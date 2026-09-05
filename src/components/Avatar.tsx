import Image from "next/image";
import { gradientFor } from "@/lib/format";

export default function Avatar({
  name,
  src,
  size = 36,
  className = "",
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <span
      className={`relative shrink-0 overflow-hidden rounded-full ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span
          className="grid h-full w-full place-items-center font-medium text-white/85"
          style={{ background: gradientFor(name), fontSize: size * 0.38 }}
        >
          {initials}
        </span>
      )}
    </span>
  );
}
