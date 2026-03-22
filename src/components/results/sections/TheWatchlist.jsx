import SectionHeader from '../shared/SectionHeader'

export default function TheWatchlist({ claudeResult }) {
  const watchlist = claudeResult?.watchlist || []
  if (watchlist.length === 0) return null

  return (
    <section id="watchlist" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.7s both' }}>
      <SectionHeader
        id="watchlist-header"
        label="EARLY WARNING WATCHLIST"
        subtitle="Items that are NOT yet crises, but each has a specific trigger that would escalate them"
      />

      <div style={{
        background: 'var(--color-panel-bg)',
        border: '1px solid var(--color-panel-border)',
        padding: 24,
      }}>
        {watchlist.map((w, i, arr) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 md:gap-6"
            style={{
              paddingBottom: i < arr.length - 1 ? 18 : 0,
              marginBottom: i < arr.length - 1 ? 18 : 0,
              borderBottom: i < arr.length - 1 ? '1px solid var(--color-panel-border)' : 'none',
            }}
          >
            {/* Left column */}
            <div style={{ flex: '0 0 30%', minWidth: 0 }}>
              <div className="inline-block mb-1.5" style={{
                padding: '2px 8px',
                background: 'var(--color-panel-border)',
              }}>
                <span style={{
                  fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
                  letterSpacing: '1px', textTransform: 'uppercase',
                }}>
                  ⚠ WATCH #{i + 1}
                </span>
              </div>
              <div style={{
                fontSize: 14, color: 'var(--color-text-primary)', fontWeight: 'bold',
                fontFamily: 'var(--font-body)', lineHeight: 1.4, marginBottom: 4,
              }}>
                {w.item || '—'}
              </div>
              <div style={{
                fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
              }}>
                Source: {w.source || 'Government Source'}
              </div>
              <div style={{
                fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 4,
              }}>
                ◉ {w.currentStatus || 'Under review'}
              </div>
            </div>

            {/* Divider */}
            <div
              className="hidden md:block"
              style={{ width: 1, background: 'var(--color-panel-border)', alignSelf: 'stretch', flexShrink: 0 }}
            />

            {/* Right column — escalation trigger */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 10, color: '#E05A5A', textTransform: 'uppercase',
                letterSpacing: '1px', fontFamily: 'var(--font-body)', marginBottom: 6,
              }}>
                ESCALATION TRIGGER
              </div>
              <div style={{
                background: 'rgba(224,90,90,0.06)',
                borderLeft: '2px solid #E05A5A',
                padding: '8px 12px',
              }}>
                <span style={{
                  fontSize: 13, color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', lineHeight: 1.6,
                }}>
                  {w.trigger || 'Monitor for legislative or enforcement advancement.'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
