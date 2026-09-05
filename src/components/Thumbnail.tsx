import Image from "next/image";
import { gradientFor } from "@/lib/format";

export default function Thumbnail({
  src,
  alt,
  seed,
  sizes,
  priority = false,
}: {
  src?: string | null;
  alt: string;
  seed: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <span
        className="absolute inset-0"
        style={{ background: gradientFor(seed) }}
        aria-hidden
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}
