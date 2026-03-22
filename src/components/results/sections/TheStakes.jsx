import SectionHeader from '../shared/SectionHeader'
import ProgressBar from '../shared/ProgressBar'

export default function TheStakes({ claudeResult, rawData }) {
  const r = claudeResult || {}
  const fi = r.financialImpact || {}
  const ldaItems = rawData?.sources?.senateLDA?.items || []
  const peers = r.competitiveContext?.peers || []

  // Aggregate lobbying data from LDA filings
  const totalSpend = ldaItems.reduce((sum, item) => {
    const amount = parseFloat(String(item.amount || '0').replace(/[^0-9.]/g, ''))
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)
  const hasLobbyingGap = ldaItems.length === 0

  // Aggregate issue areas
  const issueMap = {}
  ldaItems.forEach(item => {
    (item.issueAreas || []).forEach(area => {
      issueMap[area] = (issueMap[area] || 0) + 1
    })
  })
  const topIssues = Object.entries(issueMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <section id="stakes" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.4s both' }}>
      <SectionHeader
        id="stakes-header"
        label="THE FINANCIAL STAKES"
        subtitle="What's the potential cost? Who's spending to influence outcomes?"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Financial Impact Card */}
        <div style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          borderLeft: '3px solid var(--color-gold)',
          padding: 24,
        }}>
          <div style={{
            fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '3px',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 16,
          }}>
            ESTIMATED EXPOSURE
          </div>

          <div style={{
            fontSize: 32, fontFamily: 'var(--font-data)', fontWeight: 'bold',
            color: 'var(--color-gold)', marginBottom: 6, lineHeight: 1.1,
          }}>
            {fi.estimatedExposure || '—'}
          </div>
          <div style={{
            fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16,
          }}>
            POTENTIAL REGULATORY COST
          </div>

          {fi.exposureBasis && (
            <div style={{
              fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)',
              lineHeight: 1.6, marginBottom: 16,
            }}>
              {fi.exposureBasis}
            </div>
          )}

          {/* Metric rows */}
          <div className="flex flex-col gap-3">
            {[
              { label: 'Revenue at Risk', value: fi.revenueAtRisk },
              { label: 'Compliance Cost', value: fi.complianceCostEstimate },
              { label: 'Precedent Case', value: fi.precedentCase },
            ].filter(m => m.value).map(({ label, value }, i) => (
              <div key={i} className="flex justify-between items-start gap-4">
                <span style={{
                  fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
                  flexShrink: 0,
                }}>
                  {label}
                </span>
                <span style={{
                  fontSize: 12, color: 'var(--color-text-primary)', fontFamily: 'var(--font-data)',
                  textAlign: 'right',
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lobbying Intelligence */}
        <div style={{
          background: 'var(--color-panel-bg)',
          border: hasLobbyingGap
            ? '1px solid rgba(224,90,90,0.4)'
            : '1px solid var(--color-panel-border)',
          padding: 24,
        }}>
          <div style={{
            fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '3px',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 16,
          }}>
            LOBBYING INTELLIGENCE
          </div>

          {hasLobbyingGap ? (
            <>
              <div
                className="mb-4"
                style={{
                  padding: '10px 14px',
                  background: 'rgba(224,90,90,0.06)',
                  borderLeft: '3px solid #E05A5A',
                }}
              >
                <div style={{
                  fontSize: 13, fontFamily: 'var(--font-body)', color: '#E05A5A',
                  fontWeight: 700, marginBottom: 4,
                }}>
                  ⚠ LOBBYING GAP DETECTED
                </div>
                <div style={{
                  fontSize: 12, fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-secondary)', lineHeight: 1.5,
                }}>
                  {r.companyName}: $0 in lobbying disclosures (2023-present)
                </div>
              </div>

              {/* Peer comparison */}
              {peers.length > 0 && (
                <div>
                  <div style={{
                    fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '2px',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 10,
                  }}>
                    PEER LOBBYING COMPARISON
                  </div>
                  {peers.map((peer, i) => {
                    const isActive = (peer.lobbyingPosture || '').toLowerCase().includes('active')
                    return (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <div style={{
                          width: 80, flexShrink: 0, fontSize: 11,
                          fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)',
                        }}>
                          {peer.company}
                        </div>
                        <div style={{
                          flex: 1, height: 6, background: 'var(--color-panel-border)',
                          position: 'relative',
                        }}>
                          <div style={{
                            height: '100%',
                            width: isActive ? '70%' : '0%',
                            background: isActive ? '#2ECC8A' : 'transparent',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 10, fontFamily: 'var(--font-body)',
                          color: isActive ? '#2ECC8A' : '#E05A5A',
                        }}>
                          {isActive ? '● Active' : '○ Absent'}
                        </span>
                      </div>
                    )
                  })}
                  {/* Primary company — always last, always zero */}
                  <div className="flex items-center gap-2 mb-2">
                    <div style={{
                      width: 80, flexShrink: 0, fontSize: 11,
                      fontFamily: 'var(--font-body)', color: 'var(--color-gold)', fontWeight: 600,
                    }}>
                      {r.companyName}
                    </div>
                    <div style={{
                      flex: 1, height: 6, background: 'var(--color-panel-border)',
                    }} />
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-body)', color: '#E05A5A',
                    }}>
                      ○ $0
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{
                fontSize: 28, fontFamily: 'var(--font-data)', fontWeight: 'bold',
                color: 'var(--color-text-primary)', marginBottom: 4,
              }}>
                {ldaItems.length} <span style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 400 }}>filings</span>
              </div>
              {totalSpend > 0 && (
                <div style={{
                  fontSize: 14, fontFamily: 'var(--font-data)', color: 'var(--color-gold)', marginBottom: 16,
                }}>
                  ${totalSpend.toLocaleString()} total reported spend
                </div>
              )}

              {/* Top issue areas */}
              {topIssues.length > 0 && (
                <div>
                  <div style={{
                    fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '2px',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 10,
                  }}>
                    TOP LOBBIED ISSUES
                  </div>
                  {topIssues.map(([area, count], i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <div style={{
                        width: 140, flexShrink: 0, fontSize: 11,
                        fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)',
                      }}>
                        {area}
                      </div>
                      <ProgressBar
                        value={count}
                        max={topIssues[0][1]}
                        color="var(--color-gold)"
                        height={4}
                      />
                      <span style={{
                        fontSize: 11, fontFamily: 'var(--font-data)',
                        color: 'var(--color-text-muted)', width: 20, textAlign: 'right',
                      }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
