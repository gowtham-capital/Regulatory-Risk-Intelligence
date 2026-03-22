export default function ProgressBar({ value, max, color, height = 6, animate = true, delay = 0 }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
        background: 'var(--color-panel-border)',
        flex: 1,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          background: color,
          width: pct + '%',
          boxShadow: `0 0 8px ${color}40`,
          transition: animate ? `width 0.7s ease-out ${delay}s` : 'none',
        }}
      />
    </div>
  )
}
