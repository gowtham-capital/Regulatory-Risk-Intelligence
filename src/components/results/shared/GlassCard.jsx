export default function GlassCard({ children, className = '', accentColor, style = {} }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'var(--color-panel-bg)',
        border: '1px solid var(--color-panel-border)',
        marginBottom: 16,
        ...style,
      }}
    >
      {accentColor && (
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 3, background: accentColor }}
        />
      )}
      <div style={{ padding: accentColor ? '24px 24px 24px 28px' : 24 }}>
        {children}
      </div>
    </div>
  )
}
