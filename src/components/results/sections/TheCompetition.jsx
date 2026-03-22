import { getRelativeRiskDisplay, getLobbyingDisplay } from '../../../utils/colors'
import SectionHeader from '../shared/SectionHeader'

export default function TheCompetition({ claudeResult, rawData }) {
  const r = claudeResult || {}
  const cc = r.competitiveContext || {}
  const peers = cc.peers || []
  const advantages = r.competitiveAdvantages || []
  const disadvantages = r.competitiveDisadvantages || []

  return (
    <section id="competition" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.5s both' }}>
      <SectionHeader
        id="competition-header"
        label="COMPETITIVE POSITIONING"
        subtitle="How does this company's regulatory exposure compare to key peers?"
      />

      {/* Summary narrative */}
      {cc.summary && (
        <div style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          padding: 20,
          marginBottom: 16,
          borderLeft: '3px solid var(--color-gold)',
        }}>
          <p style={{
            fontSize: 15, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)',
            lineHeight: 1.7,
          }}>
            {cc.summary}
          </p>
        </div>
      )}

      {/* Peer comparison table */}
      {peers.length > 0 && (
        <div style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          marginBottom: 16,
          overflow: 'auto',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-panel-border)' }}>
                {['COMPANY', 'RELATIVE RISK', 'LOBBYING', 'KEY DIFFERENCE'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', fontSize: 11, color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)', textTransform: 'uppercase',
                    letterSpacing: '1px', textAlign: 'left', fontWeight: 600,
                    borderBottom: '1px solid var(--color-panel-border)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Primary company */}
              <tr style={{ background: 'rgba(200,153,58,0.08)', borderBottom: '1px solid var(--color-panel-border)' }}>
                <td style={{ padding: '12px 14px', fontSize: 14, color: 'var(--color-gold)', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>
                  {r.companyName}
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--color-gold)', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>
                  ● Primary Subject
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                  —
                </td>
                <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                  Analysis subject
                </td>
              </tr>

              {/* Peers */}
              {peers.map((peer, i) => {
                const rd = getRelativeRiskDisplay(peer.relativeRisk)
                const ld = getLobbyingDisplay(peer.lobbyingPosture)
                return (
                  <tr key={i} style={{
                    borderBottom: '1px solid var(--color-panel-border)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}>
                    <td style={{ padding: '12px 14px', fontSize: 14, color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', fontWeight: 'bold' }}>
                      {peer.company}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div className="inline-flex items-center gap-1.5" style={{
                        padding: '3px 10px', background: `${rd.color}1F`, border: `1px solid ${rd.color}40`,
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 'bold', color: rd.color, fontFamily: 'var(--font-body)' }}>
                          {rd.icon} {rd.label}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 12, color: ld.color, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                        {ld.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                      {peer.keyDifference || '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div style={{
            padding: '10px 14px', fontSize: 11, color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)', fontStyle: 'italic',
          }}>
            Competitor estimates derived from regulatory signals in primary company data.
          </div>
        </div>
      )}

      {/* Advantages / Disadvantages */}
      {(advantages.length > 0 || disadvantages.length > 0) && (
        <div style={{
          background: 'var(--color-panel-bg)',
          border: '1px solid var(--color-panel-border)',
          padding: 20,
          marginBottom: 16,
        }}>
          <div style={{
            fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '3px',
            textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 14,
          }}>
            COMPETITIVE ADVANTAGE / DISADVANTAGE
          </div>

          {disadvantages.map((d, i) => (
            <div key={'d' + i} className="flex items-start gap-2 mb-3">
              <span style={{ color: '#E05A5A', fontSize: 14, flexShrink: 0 }}>✗</span>
              <div>
                <span style={{
                  fontSize: 10, color: '#E05A5A', fontFamily: 'var(--font-body)',
                  letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700,
                }}>
                  DISADVANTAGE
                </span>
                <p style={{
                  fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)',
                  lineHeight: 1.5, marginTop: 2,
                }}>
                  {d}
                </p>
              </div>
            </div>
          ))}

          {advantages.map((a, i) => (
            <div key={'a' + i} className="flex items-start gap-2 mb-3">
              <span style={{ color: '#2ECC8A', fontSize: 14, flexShrink: 0 }}>✓</span>
              <div>
                <span style={{
                  fontSize: 10, color: '#2ECC8A', fontFamily: 'var(--font-body)',
                  letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700,
                }}>
                  ADVANTAGE
                </span>
                <p style={{
                  fontSize: 13, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)',
                  lineHeight: 1.5, marginTop: 2,
                }}>
                  {a}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activate Benchmark */}
      {r.activateBenchmark && (
        <div style={{
          background: '#1A2744',
          border: '1px solid rgba(200,153,58,0.3)',
          borderLeft: '4px solid var(--color-gold)',
          padding: 24,
        }}>
          <div className="flex gap-2 items-start mb-3">
            <div style={{ fontSize: 48, color: 'var(--color-gold)', fontFamily: 'var(--font-display)', lineHeight: 0.8, flexShrink: 0, marginTop: 4 }}>
              "
            </div>
            <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
              {r.activateBenchmark.stat || 'Early signal detection is the core of regulatory advantage.'}
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div style={{ fontSize: 12, color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}>
              — Activate Tech & Media Outlook 2025
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic', lineHeight: 1.5, flex: 1, textAlign: 'right' }}>
              {r.activateBenchmark.relevance || ''}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
