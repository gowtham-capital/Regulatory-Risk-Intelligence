import { getTrendDisplay } from '../../../utils/colors'
import { getMomentumStatus } from '../../../utils/momentum'
import { daysFromNow, formatDate } from '../../../utils/formatters'
import SectionHeader from '../shared/SectionHeader'
import ProgressBar from '../shared/ProgressBar'
import GlassCard from '../shared/GlassCard'

export default function TheTrajectory({ claudeResult }) {
  const r = claudeResult || {}
  const vel = r.velocityIndicator || {}
  const multiplier = vel.multiplier || 0
  const trendDisplay = getTrendDisplay(vel.trend)
  const momentum = getMomentumStatus(multiplier, r.riskLevel)
  const timeline = r.regulatoryTimeline || []

  const velBars = [
    { label: 'LAST 30D', count: vel.thirtyDaySignals || 0, color: '#E07830' },
    { label: '30–90D', count: vel.ninetyDaySignals || 0, color: '#E0A030' },
    { label: '90–180D', count: vel.oneEightyDaySignals || 0, color: '#C8993A' },
    { label: '180D+', count: vel.historicalSignals || 0, color: '#6B7394' },
  ]
  const maxSignals = Math.max(...velBars.map(b => b.count), 1)

  return (
    <section id="trajectory" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.3s both' }}>
      <SectionHeader
        id="trajectory-header"
        label="REGULATORY TRAJECTORY"
        subtitle="Is the pressure building, stable, or declining?"
      />

      {/* Momentum + Signals side by side */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
      >
        {/* Momentum Panel */}
        <div style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          padding: 24,
        }}>
          <div style={{
            fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '3px',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 16,
          }}>
            RISK MOMENTUM
          </div>

          {/* Hero multiplier */}
          <div className="flex items-baseline gap-2 mb-1">
            <span style={{ fontSize: 28, color: trendDisplay.color, fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              {trendDisplay.icon}
            </span>
            <span style={{
              fontSize: 48, fontFamily: 'var(--font-data)', fontWeight: 'bold',
              color: trendDisplay.color, lineHeight: 1, letterSpacing: '-2px',
            }}>
              {multiplier.toFixed(1)}
            </span>
            <span style={{ fontSize: 18, color: 'var(--color-text-muted)', fontFamily: 'var(--font-data)' }}>
              ×
            </span>
          </div>
          <div style={{
            fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
            letterSpacing: '1px', marginBottom: 16,
          }}>
            ABOVE HISTORICAL BASELINE
          </div>

          {/* Momentum badge */}
          <div
            className="inline-flex items-center gap-2 mb-5"
            style={{
              padding: '6px 14px',
              border: `1px solid ${momentum.color}50`,
              background: `${momentum.color}10`,
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: momentum.color,
              boxShadow: `0 0 8px ${momentum.color}`,
            }} />
            <span style={{
              fontSize: 10, fontWeight: 700, color: momentum.color,
              fontFamily: 'var(--font-body)', letterSpacing: '2px', textTransform: 'uppercase',
            }}>
              {momentum.label}
            </span>
          </div>

          {/* Signal comparison */}
          <div style={{
            padding: '14px 16px', background: 'rgba(255,255,255,0.02)',
            borderLeft: '2px solid var(--color-panel-border)', marginBottom: 16,
          }}>
            <div style={{
              fontSize: 9, color: 'var(--color-text-muted)', letterSpacing: '2px',
              textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 10,
            }}>
              SIGNAL COMPARISON
            </div>
            {[
              { label: 'LAST 30 DAYS', count: vel.thirtyDaySignals || 0, color: trendDisplay.color, highlight: true },
              {
                label: 'HISTORICAL AVG',
                count: Math.round((vel.historicalSignals || 0) / 6),
                color: 'var(--color-panel-divider)',
                highlight: false,
              },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2" style={{ marginBottom: i === 0 ? 8 : 0 }}>
                <div style={{
                  width: 72, flexShrink: 0, fontSize: 9,
                  color: row.highlight ? row.color : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-body)', letterSpacing: '1px', textTransform: 'uppercase',
                }}>
                  {row.label}
                </div>
                <ProgressBar
                  value={row.count}
                  max={Math.max(vel.thirtyDaySignals || 0, vel.historicalSignals || 0, 1)}
                  color={row.highlight ? row.color : 'var(--color-panel-divider)'}
                  height={4}
                />
                <div style={{
                  width: 24, textAlign: 'right', flexShrink: 0, fontSize: 11,
                  color: row.highlight ? row.color : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-data)', fontWeight: row.highlight ? 'bold' : 400,
                }}>
                  {row.count}
                </div>
              </div>
            ))}
          </div>

          {/* Urgency */}
          <div className="flex items-center gap-2" style={{
            padding: '8px 12px',
            background: `${momentum.color}08`,
            borderLeft: `2px solid ${momentum.color}`,
          }}>
            <span style={{
              fontSize: 9, color: momentum.color, fontFamily: 'var(--font-body)',
              letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700,
            }}>
              {momentum.urgency}
            </span>
          </div>
        </div>

        {/* Signal Timeline Bars */}
        <div style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          padding: 24,
        }}>
          <div style={{
            fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '3px',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 16,
          }}>
            SIGNAL TIMELINE
          </div>

          {velBars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-2 mb-3">
              <div style={{
                width: 64, flexShrink: 0, fontSize: 10,
                color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
                textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {bar.label}
              </div>
              <ProgressBar value={bar.count} max={maxSignals} color={bar.color} height={8} />
              <div style={{
                width: 32, textAlign: 'right', flexShrink: 0, fontSize: 12,
                color: bar.color, fontFamily: 'var(--font-data)',
              }}>
                {bar.count}
              </div>
            </div>
          ))}
          <div style={{
            fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 12,
          }}>
            Weight: 30d = 1.0× · 90d = 0.7× · 180d = 0.4× · 180d+ = 0.1×
          </div>

          {/* Interpretation */}
          {vel.interpretation && (
            <div style={{
              marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-panel-border)',
              fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
              fontStyle: 'italic', lineHeight: 1.6,
            }}>
              {vel.interpretation}
            </div>
          )}
        </div>
      </div>

      {/* Regulatory Timeline (Gantt-style) */}
      {timeline.length > 0 && (
        <div style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          padding: 24,
        }}>
          <div style={{
            fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '3px',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 16,
          }}>
            KEY DATES AHEAD
          </div>

          {timeline.map((item, i) => {
            const days = daysFromNow(item.estimatedDate)
            const severityColor = item.severity === 'CRITICAL' ? '#E05A5A'
              : item.severity === 'HIGH' ? '#E07830'
                : item.severity === 'MODERATE' ? '#E0A030' : '#2ECC8A'
            return (
              <div
                key={i}
                className="flex items-start gap-4 mb-4 last:mb-0"
                style={{ paddingBottom: i < timeline.length - 1 ? 16 : 0, borderBottom: i < timeline.length - 1 ? '1px solid var(--color-panel-border)' : 'none' }}
              >
                {/* Date column */}
                <div style={{ width: 80, flexShrink: 0, textAlign: 'center' }}>
                  <div style={{
                    fontSize: 20, fontFamily: 'var(--font-data)', fontWeight: 'bold',
                    color: severityColor,
                  }}>
                    {days !== null ? (days > 0 ? `${days}d` : 'NOW') : '—'}
                  </div>
                  <div style={{
                    fontSize: 9, fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)',
                    letterSpacing: '1px', textTransform: 'uppercase',
                  }}>
                    {item.dateConfidence === 'confirmed' ? '● CONFIRMED' : '◐ ESTIMATED'}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, borderLeft: `2px solid ${severityColor}40`, paddingLeft: 16 }}>
                  <div style={{
                    fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--color-text-primary)',
                    fontWeight: 600, marginBottom: 4, lineHeight: 1.3,
                  }}>
                    {item.event}
                  </div>
                  <div style={{
                    fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)',
                  }}>
                    {item.source} · {formatDate(item.estimatedDate)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
