export default function FeedInsightLogo({ size = 32, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <circle cx="50" cy="50" r="48" fill="#1D4ED8" />

      <text
        x="50"
        y="50"
        fill="#FFFFFF"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
        fontSize="40"
        fontWeight="800"
        letterSpacing="-1"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ userSelect: 'none' }}
      >
        FI
      </text>
    </svg>
  )
}
