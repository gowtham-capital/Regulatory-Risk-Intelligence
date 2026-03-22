import { getRiskColor } from '../../../utils/colors'
import { formatTimestamp } from '../../../utils/formatters'
import { getMomentumStatus } from '../../../utils/momentum'
import SeverityBadge from '../shared/SeverityBadge'
import CopyButton from '../shared/CopyButton'

export default function TheVerdict({ claudeResult }) {
  const r = claudeResult || {}
  const riskColor = getRiskColor(r.riskLevel)
  const score = r.overallRiskScore || 0
  const vel = r.velocityIndicator || {}
  const momentum = getMomentumStatus(vel.multiplier || 0, r.riskLevel)

  // SVG gauge params
  const radius = 70
  const stroke = 8
  const circumference = 2 * Math.PI * radius
  const arc = circumference * 0.75 // 270-degree arc
  const offset = arc - (arc * (score / 100))

  const narrative = r.executiveNarrative || r.executiveSummary || 'Analysis unavailable.'

  return (
    <section id="verdict" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out both' }}>
      {/* Top gold bar */}
      <div style={{ height: 2, background: 'var(--color-gold)', marginBottom: 24 }} />

      {/* Header row */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <div
            className="flex items-center gap-2 mb-2"
            style={{
              fontSize: 10,
              color: 'var(--color-text-muted)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-body)',
            }}
          >
            <div style={{ width: 2, height: 12, background: 'var(--color-gold)', flexShrink: 0 }} />
            US REGULATORY RISK INTELLIGENCE
          </div>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
              fontWeight: 'bold',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            {r.companyName || 'Company'}
          </h1>
        </div>
        <div
          className="text-right"
          style={{
            fontSize: 11,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {formatTimestamp(r.analysisTimestamp)}
        </div>
      </div>

      {/* Scorecard grid */}
      <div
        style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          padding: 24,
          marginBottom: 16,
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* SVG Gauge */}
          <div className="flex flex-col items-center shrink-0">
            <svg width="160" height="130" viewBox="0 0 180 150">
              {/* Background arc */}
              <circle
                cx="90" cy="90" r={radius}
                fill="none"
                stroke="var(--color-panel-border)"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={arc + ' ' + circumference}
                transform="rotate(135 90 90)"
              />
              {/* Score arc */}
              <circle
                cx="90" cy="90" r={radius}
                fill="none"
                stroke={riskColor}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={arc + ' ' + circumference}
                strokeDashoffset={offset}
                transform="rotate(135 90 90)"
                style={{
                  filter: `drop-shadow(0 0 6px ${riskColor}60)`,
                  transition: 'stroke-dashoffset 1.2s ease-out',
                }}
              />
              {/* Score text */}
              <text x="90" y="80" textAnchor="middle" fill={riskColor}
                style={{ fontSize: 36, fontFamily: 'var(--font-data)', fontWeight: 'bold' }}>
                {score}
              </text>
              <text x="90" y="100" textAnchor="middle" fill="var(--color-text-muted)"
                style={{ fontSize: 11, fontFamily: 'var(--font-body)' }}>
                / 100
              </text>
              <text x="90" y="130" textAnchor="middle" fill={riskColor}
                style={{ fontSize: 11, fontFamily: 'var(--font-body)', letterSpacing: '2px', fontWeight: 700 }}>
                {r.riskLevel || 'UNKNOWN'} RISK
              </text>
            </svg>
          </div>

          {/* 4 Mini-stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 w-full">
            {[
              { label: 'PIPELINE STAGE', value: r.pipelineStage || '—', color: riskColor },
              { label: 'VELOCITY', value: (vel.multiplier || 0).toFixed(1) + '×', color: momentum.color },
              { label: 'RISK WINDOW', value: r.regulatoryWindow?.range || '—', color: 'var(--color-gold)' },
              {
                label: 'SIGNALS TRACKED',
                value: (r.dataQuality?.totalDataPoints || 0).toString(),
                color: 'var(--color-teal)',
              },
            ].map(({ label, value, color }, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--color-panel-border)',
                  padding: '14px 16px',
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontFamily: 'var(--font-data)',
                    color,
                    fontWeight: 'bold',
                    lineHeight: 1.2,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Narrative */}
        <div
          className="mt-6 pt-5"
          style={{ borderTop: '1px solid var(--color-panel-border)' }}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <div
              style={{
                fontSize: 10,
                color: 'var(--color-text-muted)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
              }}
            >
              EXECUTIVE SUMMARY
            </div>
            <CopyButton text={narrative} label="Copy" />
          </div>
          <p
            style={{
              fontSize: 16,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.8,
              maxWidth: 800,
            }}
          >
            {narrative}
          </p>
        </div>

        {/* Data quality strip */}
        <div
          className="flex flex-wrap items-center gap-2 mt-5 pt-4"
          style={{
            borderTop: '1px solid var(--color-panel-border)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--color-teal)',
                boxShadow: '0 0 6px rgba(0,212,170,0.8)',
              }}
            />
            <span style={{ color: 'var(--color-teal)', letterSpacing: '1px', fontSize: 10 }}>LIVE</span>
          </div>
          <span style={{ color: 'var(--color-panel-divider)' }}>·</span>
          <span>{r.dataQuality?.totalDataPoints || 0} data points</span>
          <span style={{ color: 'var(--color-panel-divider)' }}>·</span>
          <span>{r.dataQuality?.sourcesSucceeded || 0}/6 sources</span>
          <span style={{ color: 'var(--color-panel-divider)' }}>·</span>
          <span>{formatTimestamp(r.analysisTimestamp)}</span>
        </div>
      </div>
    </section>
  )
}
