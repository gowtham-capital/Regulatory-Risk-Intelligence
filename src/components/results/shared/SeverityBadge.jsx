import { getRiskColor } from '../../../utils/colors'

export default function SeverityBadge({ level, small = false }) {
  const color = getRiskColor(level)
  return (
    <div
      className="inline-flex items-center gap-1.5"
      style={{
        padding: small ? '2px 8px' : '4px 14px',
        border: `1px solid ${color}50`,
        background: `${color}12`,
      }}
    >
      <div
        className="rounded-full shrink-0"
        style={{
          width: small ? 4 : 5,
          height: small ? 4 : 5,
          background: color,
        }}
      />
      <span
        className="uppercase tracking-widest font-bold"
        style={{
          fontSize: small ? 9 : 10,
          color,
          fontFamily: 'var(--font-body)',
        }}
      >
        {level || 'UNKNOWN'}
      </span>
    </div>
  )
}
