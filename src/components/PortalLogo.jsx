export default function PortalLogo({ size = 32, inverted = false }) {
  const bg = inverted ? "var(--paper)" : "var(--ink)";
  const fg = inverted ? "var(--ink)" : "var(--paper)";
  const accent = inverted ? "var(--accent)" : "var(--brass)";

  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-sm"
      style={{
        width: size,
        height: size,
        background: bg,
        border: inverted ? "1px solid var(--line)" : "1px solid var(--ink)",
      }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 3h7l3 3v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
          stroke={fg}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M14 3v4h4" stroke={fg} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12h6M9 15h4" stroke={fg} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16.5" cy="16.5" r="3.5" fill={accent} />
        <path
          d="M15.2 16.5l.9.9 1.8-1.8"
          stroke={inverted ? "var(--paper)" : "var(--ink)"}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
