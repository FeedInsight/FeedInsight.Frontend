import FI from '@assets/FI.png'

export default function FeedInsightLogo({ size = 32, className = '' }) {
  return (
    <img
      src={FI}
      width={size}
      height={size}
      className={className}
    />
  )
}
