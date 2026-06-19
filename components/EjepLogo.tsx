export default function EjepLogo({ height = 36 }: { height?: number }) {
  const scale = height / 36;
  return (
    <svg
      width={Math.round(108 * scale)}
      height={height}
      viewBox="0 0 108 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EJEP"
    >
      {/* Red accent mark — small rotated square */}
      <rect x="0" y="10" width="10" height="10" fill="#c01818" transform="rotate(45 5 15)" />
      {/* Wordmark */}
      <rect x="18" y="9" width="2" height="18" fill="#f0e6e6" opacity="0.15" />
      <text
        x="26"
        y="26"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="22"
        fontWeight="600"
        letterSpacing="3"
        fill="#f0e6e6"
      >
        EJEP
      </text>
    </svg>
  );
}
