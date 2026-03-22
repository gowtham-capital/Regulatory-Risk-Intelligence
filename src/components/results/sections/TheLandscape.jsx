import { getRiskColor } from '../../../utils/colors'
import { getHeatmapData } from '../../../utils/heatmap'
import SectionHeader from '../shared/SectionHeader'
import ProgressBar from '../shared/ProgressBar'

const BODY_CONFIG = [
  { key: 'congress', label: 'CONGRESS', icon: '🏛' },
  { key: 'fcc', label: 'FCC', icon: '📡' },
  { key: 'ftc', label: 'FTC', icon: '⚖' },
  { key: 'fedRegister', label: 'FEDERAL REGISTER', icon: '📋' },
  { key: 'senateLDA', label: 'SENATE LDA', icon: '🏢' },
  { key: 'news', label: 'NEWS COVERAGE', icon: '📰' },
]

export default function TheLandscape({ claudeResult, rawData }) {
  const r = claudeResult || {}
  const bodyBreakdown = r.regulatoryBodyBreakdown || []
  const sentiment = r.newsSentiment || {}
  const sources = rawData?.sources || {}
  const heatmap = getHeatmapData(r.regulatoryRisks)

  // Build body cards from a mix of Claude analysis + raw data counts
  const bodyCards = BODY_CONFIG.map(({ key, label, icon }) => {
    const bd = bodyBreakdown.find(b =>
      (b.body || '').toLowerCase().includes(key === 'fedRegister' ? 'federal' : key === 'senateLDA' ? 'senate' : key)
    )
    const sourceData = sources[key] || {}
    const itemCount = sourceData.items?.length || sourceData.count || 0

    // For news, use sentiment data
    if (key === 'news') {
      return {
        label, icon, key,
        riskLevel: sentiment.coverageVolume === 'HIGH' ? 'HIGH'
          : sentiment.coverageVolume === 'MODERATE' ? 'MODERATE' : 'LOW',
        count: itemCount,
        keyItem: sentiment.topNarratives?.[0] || '—',
        assessment: `Sentiment: ${sentiment.overall || 'NEUTRAL'}`,
        isGap: false,
      }
    }

    // For Senate LDA, detect lobbying gap
    const isGap = key === 'senateLDA' && itemCount === 0

    return {
      label, icon, key,
      riskLevel: bd?.riskLevel || (itemCount > 5 ? 'HIGH' : itemCount > 0 ? 'MODERATE' : 'LOW'),
      count: itemCount,
      keyItem: bd?.keyItem || '—',
      assessment: bd?.assessment || (isGap
        ? 'No lobbying filings detected — potential vulnerability'
        : `${itemCount} active items`),
      nextDeadline: bd?.nextDeadline || null,
      isGap,
    }
  })

  return (
    <section id="landscape" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.1s both' }}>
      <SectionHeader
        id="landscape-header"
        label="THE REGULATORY LANDSCAPE"
        subtitle="Which government agencies are active, and how intense is each?"
      />

      {/* 6 Body Cards — 2x3 grid on desktop, 1 col mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {bodyCards.map((card) => {
          const color = getRiskColor(card.riskLevel)
          return (
            <div
              key={card.key}
              style={{
                background: 'var(--color-panel-bg)',
                border: card.isGap
                  ? '1px solid rgba(224,90,90,0.4)'
                  : '1px solid var(--color-panel-border)',
                padding: 18,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 2, background: color,
              }} />

              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 14 }}>{card.icon}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-secondary)',
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {card.label}
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5"
                  style={{
                    padding: '2px 8px',
                    background: `${color}12`,
                    border: `1px solid ${color}40`,
                  }}
                >
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, color,
                    fontFamily: 'var(--font-body)', letterSpacing: '1px',
                  }}>
                    {card.riskLevel}
                  </span>
                </div>
              </div>

              {/* Count */}
              <div
                style={{
                  fontSize: 24,
                  fontFamily: 'var(--font-data)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}
              >
                {card.count} <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 400 }}>items</span>
              </div>

              {/* Key item */}
              <div
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-gold)',
                  marginBottom: 6,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {card.keyItem}
              </div>

              {/* Assessment */}
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-body)',
                  color: card.isGap ? '#E05A5A' : 'var(--color-text-muted)',
                  lineHeight: 1.4,
                }}
              >
                {card.isGap && '⚠ '}{card.assessment}
              </div>

              {/* Deadline if present */}
              {card.nextDeadline && (
                <div
                  className="mt-2 pt-2"
                  style={{
                    borderTop: '1px solid var(--color-panel-border)',
                    fontSize: 10,
                    fontFamily: 'var(--font-data)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Next: {card.nextDeadline}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Exposure Heatmap */}
      {heatmap.length > 0 && (
        <div
          style={{
            background: 'var(--color-panel-bg)',
            border: '1px solid var(--color-panel-border)',
            padding: '20px 24px',
            borderLeft: '3px solid var(--color-panel-border)',
          }}
        >
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div style={{
              fontSize: 10, color: 'var(--color-text-muted)',
              letterSpacing: '3px', textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
            }}>
              REGULATORY EXPOSURE MAP
            </div>
            <div className="flex items-center gap-4" style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {[
                { label: 'HIGH', color: '#E05A5A' },
                { label: 'MODERATE', color: '#E0A030' },
                { label: 'LOW', color: '#2ECC8A' },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div style={{ width: 8, height: 2, background: color }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {heatmap.map((item, i) => {
            const barColor = item.severity === 'HIGH' ? '#E05A5A'
              : item.severity === 'MODERATE' ? '#E0A030' : '#2ECC8A'
            const barPct = Math.round((item.score / 4) * 100)
            return (
              <div key={i} className="flex items-center gap-3 mb-2.5 last:mb-0">
                <div style={{
                  width: 140, flexShrink: 0, fontSize: 11,
                  color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)',
                }}>
                  {item.domain}
                </div>
                <ProgressBar value={item.score} max={4} color={barColor} delay={0.1 * i} />
                <div style={{
                  width: 70, flexShrink: 0, textAlign: 'right',
                  fontSize: 10, color: barColor, fontFamily: 'var(--font-body)',
                  fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
                }}>
                  {item.severity}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
