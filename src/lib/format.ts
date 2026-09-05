const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCount(value: number | null | undefined, noun?: string): string {
  if (value === null || value === undefined) return noun ? `— ${noun}` : "—";
  const text = compact.format(value).replace("K", "K").replace("M", "M");
  return noun ? `${text} ${noun}` : text;
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const relative = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

export function timeAgo(iso: string, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  for (const [unit, size] of UNITS) {
    if (seconds >= size) return relative.format(-Math.floor(seconds / size), unit);
  }
  return "just now";
}

/** ISO-8601 duration (PT1H2M3S) -> "1:02:03" */
export function formatDuration(iso: string | undefined): string {
  if (!iso) return "";
  const match = /^P(?:([\d.]+)D)?T?(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?$/.exec(iso);
  if (!match) return "";
  const [, d, h, m, s] = match;
  const hours = Number(h ?? 0) + Number(d ?? 0) * 24;
  const minutes = Number(m ?? 0);
  const seconds = Math.floor(Number(s ?? 0));
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

/** Deterministic pastel pair so keyless placeholders still look intentional. */
export function gradientFor(seed: string): string {
  let hash = 7;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 131 + seed.charCodeAt(i) * (i + 3)) >>> 0;
  }
  // Golden-angle steps keep neighbouring cards far apart on the colour wheel.
  const a = (hash * 137.5) % 360;
  const b = (a + 42) % 360;
  return `linear-gradient(140deg, hsl(${a} 48% 38%), hsl(${b} 55% 24%))`;
}
