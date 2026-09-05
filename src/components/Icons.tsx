import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

const base = (props: Props) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 20" className={className} aria-hidden>
      <path
        d="M27.9 3.1a3.6 3.6 0 0 0-2.5-2.5C23.2 0 14.2 0 14.2 0S5.2 0 3 .6A3.6 3.6 0 0 0 .5 3.1C0 5.3 0 10 0 10s0 4.7.5 6.9a3.6 3.6 0 0 0 2.5 2.5c2.2.6 11.2.6 11.2.6s9 0 11.2-.6a3.6 3.6 0 0 0 2.5-2.5c.5-2.2.5-6.9.5-6.9s0-4.7-.5-6.9Z"
        fill="#FF0033"
      />
      <path d="M11.4 14.3 18.9 10l-7.5-4.3v8.6Z" fill="#fff" />
      <text
        x="33"
        y="15.6"
        fill="currentColor"
        fontSize="16.5"
        fontWeight="700"
        letterSpacing="-0.9"
        fontFamily="Roboto, system-ui, sans-serif"
      >
        YouTube
      </text>
    </svg>
  );
}

export const HomeIcon = (props: Props) => (
  <svg {...base(props)} fill="currentColor" stroke="none">
    <path d="M12 3.2 3 10.1V21h6.4v-6.1h5.2V21H21V10.1L12 3.2Z" />
  </svg>
);

export const ShortsIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M14.8 3.6 8 7.2a4.2 4.2 0 0 0 0 7.5l1.5.8" />
    <path d="M9.2 20.4 16 16.8a4.2 4.2 0 0 0 0-7.5l-1.5-.8" />
    <path d="m10.4 13.6 3.9-2.1-3.9-2.1v4.2Z" fill="currentColor" stroke="none" />
  </svg>
);

export const SubscriptionsIcon = (props: Props) => (
  <svg {...base(props)}>
    <rect x="3" y="7.5" width="18" height="13" rx="3" />
    <path d="M6.5 4.5h11" />
    <path d="m10.8 11.5 4 2.5-4 2.5v-5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const LibraryIcon = (props: Props) => (
  <svg {...base(props)}>
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 4v16" />
    <path d="m13 9.5 4 2.5-4 2.5v-5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const HistoryIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
    <path d="M3.2 4.6v4.2h4.2" />
    <path d="M12 7.6V12l3 1.8" />
  </svg>
);

export const YourVideosIcon = (props: Props) => (
  <svg {...base(props)}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const ClockIcon = (props: Props) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 7.4V12l3 1.8" />
  </svg>
);

export const ThumbUpIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M7 10.5 11 3a2.4 2.4 0 0 1 2.4 2.4V9h4.3a2 2 0 0 1 2 2.4l-1.2 6A2.4 2.4 0 0 1 16.1 19H7" />
    <rect x="3" y="10.5" width="4" height="9" rx="1.3" />
  </svg>
);

export const ChevronDownIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="m6 9.5 6 5.5 6-5.5" />
  </svg>
);

export const ChevronRightIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="m9.5 5 6.5 7-6.5 7" />
  </svg>
);

export const ChevronLeftIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M14.5 5 8 12l6.5 7" />
  </svg>
);

export const SearchIcon = (props: Props) => (
  <svg {...base(props)}>
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m15.8 15.8 4.4 4.4" />
  </svg>
);

export const CreateIcon = (props: Props) => (
  <svg {...base(props)}>
    <rect x="2.6" y="4.8" width="13.4" height="14.4" rx="3.4" />
    <path d="M6.2 12h6.2M9.3 8.9v6.2" />
    <path d="m17.6 10 3.8-2.6v9.2L17.6 14" />
  </svg>
);

export const BellIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M6.2 10a5.8 5.8 0 0 1 11.6 0c0 4 1.2 5.6 1.9 6.3.4.4.1 1.1-.5 1.1H4.8c-.6 0-.9-.7-.5-1.1.7-.7 1.9-2.3 1.9-6.3Z" />
    <path d="M10 20.2a2.3 2.3 0 0 0 4 0" />
  </svg>
);

export const KebabIcon = (props: Props) => (
  <svg {...base(props)} fill="currentColor" stroke="none">
    <circle cx="12" cy="5.2" r="1.75" />
    <circle cx="12" cy="12" r="1.75" />
    <circle cx="12" cy="18.8" r="1.75" />
  </svg>
);

export const PlayIcon = (props: Props) => (
  <svg {...base(props)} fill="currentColor" stroke="none">
    <path d="M8 4.8 20 12 8 19.2V4.8Z" />
  </svg>
);

export const ShareIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M3.5 18.5c1.6-6.4 6-9.3 11.4-9.4V4.5L21.5 11l-6.6 6.5V13c-4.3 0-8 1.2-11.4 5.5Z" />
  </svg>
);

export const VerifiedIcon = (props: Props) => (
  <svg {...base(props)} fill="currentColor" stroke="none">
    <path d="M12 2.2 14.4 4l2.9-.3 1 2.8 2.6 1.4-.8 2.8.8 2.8-2.6 1.4-1 2.8-2.9-.3L12 21.8 9.6 20l-2.9.3-1-2.8-2.6-1.4.8-2.8-.8-2.8 2.6-1.4 1-2.8L9.6 4 12 2.2Z" />
    <path
      d="m8.6 12.1 2.3 2.3 4.5-4.6"
      fill="none"
      stroke="#111827"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MenuIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </svg>
);

export const CloseIcon = (props: Props) => (
  <svg {...base(props)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
