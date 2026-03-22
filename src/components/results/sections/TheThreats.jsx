import { useState } from 'react'
import { getRiskColor, getVelDisplay } from '../../../utils/colors'
import { getStatusPipeline } from '../../../utils/pipeline'
import SectionHeader from '../shared/SectionHeader'

export default function TheThreats({ claudeResult }) {
  const risks = claudeResult?.regulatoryRisks || []
  const [expanded, setExpanded] = useState({})

  const toggle = (i) => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))

  if (risks.length === 0) return null

  return (
    <section id="threats" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.2s both' }}>
      <SectionHeader
        id="threats-header"
        label="ACTIVE REGULATORY THREATS"
        subtitle={`${risks.length} critical exposures identified — click to expand full analysis`}
      />

      <div className="flex flex-col gap-4">
        {risks.map((risk, i) => {
          const riskColor = getRiskColor(risk.severity)
          const velDisplay = getVelDisplay(risk.velocityTrend, risk.velocityMultiplier)
          const pipeline = getStatusPipeline(risk)
          const isOpen = expanded[i]

          return (
            <div
              key={i}
              style={{
                background: 'var(--color-panel-bg)',
                border: `1px solid ${isOpen ? riskColor + '40' : 'var(--color-panel-border)'}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 2, background: riskColor }} />

              {/* Clickable header */}
              <div
                onClick={() => toggle(i)}
                className="cursor-pointer"
                style={{ padding: '18px 20px' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  {/* Severity + velocity */}
                  <div className="flex items-center gap-3">
                    <div
                      className="inline-flex items-center gap-1.5"
                      style={{
                        padding: '3px 10px',
                        background: `${riskColor}1F`,
                        border: `1px solid ${riskColor}40`,
                      }}
                    >
                      <span style={{
                        fontSize: 11, fontWeight: 'bold', color: riskColor,
                        fontFamily: 'var(--font-body)', textTransform: 'uppercase',
                      }}>
                        ● {risk.severity || 'UNKNOWN'}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 'bold', color: velDisplay.color,
                      fontFamily: 'var(--font-data)',
                    }}>
                      {velDisplay.icon} {velDisplay.text}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 12, color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                  }}>
                    ⏱ {risk.timeframe || '—'}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: 17,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 'bold',
                    lineHeight: 1.3,
                    marginBottom: 8,
                  }}
                >
                  {risk.title || 'Regulatory Risk'}
                </h3>

                {/* Source */}
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  📡 {risk.source || 'Multiple Sources'}
                  {!isOpen && <span style={{ marginLeft: 12, color: 'var(--color-gold)' }}>▸ Click to expand</span>}
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div
                  style={{
                    padding: '0 20px 20px',
                    borderTop: '1px solid var(--color-panel-border)',
                    animation: 'fadeUp 0.3s ease-out both',
                  }}
                >
                  {/* Narrative / Description */}
                  <div
                    className="mt-4 mb-4"
                    style={{
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.7,
                    }}
                  >
                    {risk.narrative || risk.description || 'No detailed analysis available.'}
                  </div>

                  {/* Data point */}
                  {risk.specificDataPoint && (
                    <div
                      className="mb-4"
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(200,153,58,0.06)',
                        borderLeft: '2px solid var(--color-gold)',
                        fontSize: 13,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-gold)',
                        lineHeight: 1.5,
                      }}
                    >
                      {risk.specificDataPoint}
                    </div>
                  )}

                  {/* Pipeline visualization */}
                  <div className="mb-4">
                    <div className="flex items-center gap-0 mb-2">
                      {pipeline.stages.map((stage, si) => {
                        const isActive = si === pipeline.activeIndex
                        const isPast = si < pipeline.activeIndex
                        const isLast = si === pipeline.stages.length - 1
                        return (
                          <div key={si} className="flex items-center" style={{ flex: isLast ? 0 : 1 }}>
                            <div
                              style={{
                                width: isActive ? 10 : 6,
                                height: isActive ? 10 : 6,
                                borderRadius: '50%',
                                flexShrink: 0,
                                background: isActive ? riskColor : isPast ? `${riskColor}60` : 'var(--color-panel-divider)',
                                boxShadow: isActive ? `0 0 8px ${riskColor}80` : 'none',
                              }}
                            />
                            {!isLast && (
                              <div style={{
                                flex: 1, height: 1,
                                background: isPast ? `${riskColor}40` : 'var(--color-panel-border)',
                              }} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{
                        fontSize: 9, color: riskColor,
                        fontFamily: 'var(--font-body)',
                        letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 600,
                      }}>
                        ● {pipeline.stages[pipeline.activeIndex]}
                      </span>
                      <span style={{
                        fontSize: 9, color: 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)', letterSpacing: '1px',
                      }}>
                        {pipeline.track === 'enforcement' ? 'ENFORCEMENT TRACK' : 'LEGISLATIVE TRACK'}
                      </span>
                    </div>
                  </div>

                  {/* Legal basis */}
                  {(risk.legalBasis || risk.legalReference || risk.legal_reference) && (
                    <div
                      className="mb-4"
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(107,115,148,0.08)',
                        borderLeft: '2px solid var(--color-text-muted)',
                        fontSize: 11,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      ⚖ {risk.legalBasis || risk.legalReference || risk.legal_reference}
                    </div>
                  )}

                  {/* Precedent context */}
                  {risk.precedentContext && (
                    <div
                      className="mb-4"
                      style={{
                        fontSize: 12,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-muted)',
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                      }}
                    >
                      Precedent: {risk.precedentContext}
                    </div>
                  )}

                  {/* Escalation trigger */}
                  {risk.escalationTrigger && (
                    <div
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(224,90,90,0.06)',
                        borderLeft: '2px solid #E05A5A',
                        fontSize: 12,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ fontSize: 10, color: '#E05A5A', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        ESCALATION TRIGGER:
                      </span>
                      <br />
                      {risk.escalationTrigger}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
