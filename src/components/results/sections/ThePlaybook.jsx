import { getPriorityColor } from '../../../utils/colors'
import { daysFromNow } from '../../../utils/formatters'
import SectionHeader from '../shared/SectionHeader'

export default function ThePlaybook({ claudeResult }) {
  const actions = claudeResult?.strategicActions || []
  if (actions.length === 0) return null

  return (
    <section id="playbook" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.6s both' }}>
      <SectionHeader
        id="playbook-header"
        label="STRATEGIC PLAYBOOK"
        subtitle="Prioritized actions — what to do, in what order, by when"
      />

      {actions.map((action, i) => {
        const color = getPriorityColor(action.priority)
        const deadline = action.deadline || action.specificTrigger
        const daysLeft = deadline ? daysFromNow(deadline) : null

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              background: 'var(--color-panel-bg)',
              border: '1px solid var(--color-panel-border)',
              overflow: 'hidden',
              marginBottom: 12,
            }}
          >
            {/* Priority color bar */}
            <div style={{ width: 4, flexShrink: 0, background: color }} />

            {/* Card content */}
            <div style={{ flex: 1, padding: 20 }}>
              {/* Header row */}
              <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span style={{
                    fontSize: 14, fontFamily: 'var(--font-data)', fontWeight: 'bold',
                    color: 'var(--color-text-muted)',
                  }}>
                    #{i + 1}
                  </span>
                  <div style={{
                    padding: '4px 12px',
                    background: `${color}25`,
                    border: `1px solid ${color}50`,
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 'bold', color,
                      fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '1px',
                    }}>
                      {action.priority || 'ACTION'}
                    </span>
                  </div>
                </div>

                {daysLeft !== null && daysLeft > 0 && (
                  <span style={{
                    fontSize: 12, fontFamily: 'var(--font-data)', color,
                    fontWeight: 'bold',
                  }}>
                    ⏱ {daysLeft} days left
                  </span>
                )}
              </div>

              {/* Title */}
              <h4 style={{
                fontSize: 16, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)',
                fontWeight: 'bold', lineHeight: 1.3, marginBottom: 14,
              }}>
                {action.title || 'Strategic Action'}
              </h4>

              {/* Trigger */}
              {action.specificTrigger && (
                <div className="mb-4">
                  <div style={{
                    fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '2px',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 6,
                  }}>
                    WHY THIS, WHY NOW
                  </div>
                  <div style={{
                    fontSize: 13, color: 'var(--color-gold)', fontFamily: 'var(--font-body)',
                    lineHeight: 1.5,
                  }}>
                    ⚡ {action.specificTrigger}
                  </div>
                </div>
              )}

              {/* Rationale */}
              {action.rationale && action.rationale !== action.specificTrigger && (
                <div style={{
                  fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
                  lineHeight: 1.6, marginBottom: 14,
                }}>
                  {action.rationale}
                </div>
              )}

              {/* Competitor context */}
              {action.competitorContext && (
                <div className="mb-4" style={{ paddingTop: 12, borderTop: '1px solid var(--color-panel-border)' }}>
                  <div style={{
                    fontSize: 10, color: 'var(--color-text-muted)', letterSpacing: '2px',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 6,
                  }}>
                    COMPETITOR CONTEXT
                  </div>
                  <div style={{
                    background: 'rgba(224,90,90,0.06)',
                    borderLeft: '2px solid #E05A5A',
                    padding: '6px 10px',
                  }}>
                    <span style={{
                      fontSize: 13, color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', lineHeight: 1.6,
                    }}>
                      {action.competitorContext}
                    </span>
                  </div>
                </div>
              )}

              {/* Activate enablement */}
              {action.activateCapability && (
                <div style={{ paddingTop: 12, borderTop: '1px solid var(--color-panel-border)' }}>
                  <div style={{
                    fontSize: 10, color: 'var(--color-gold)', letterSpacing: '2px',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)', marginBottom: 6,
                  }}>
                    HOW ACTIVATE ENABLES THIS
                  </div>
                  <div style={{
                    background: 'rgba(200,153,58,0.06)',
                    borderLeft: '2px solid var(--color-gold)',
                    padding: '6px 10px',
                  }}>
                    <span style={{
                      fontSize: 13, color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)', lineHeight: 1.6,
                    }}>
                      {action.activateCapability}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}
