// inline so the colors follow the theme
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 206 70"
      role="img"
      aria-label="storefront"
      className={className}
    >
      <path
        d="M6 16h9l7 28h26l6-20H19"
        fill="none"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary"
      />
      <circle cx="26" cy="54" r="4.5" className="fill-primary" />
      <circle cx="45" cy="54" r="4.5" className="fill-primary" />
      <text
        x="64"
        y="45"
        fontSize="27"
        textLength="136"
        lengthAdjust="spacingAndGlyphs"
      >
        <tspan fontWeight="700" className="fill-foreground">
          store
        </tspan>
        <tspan fontWeight="400" className="fill-primary">
          front
        </tspan>
      </text>
    </svg>
  );
}
