import { useState } from 'react'
import { formatDate, formatFullTimestamp } from '../../../utils/formatters'
import SectionHeader from '../shared/SectionHeader'

const SOURCE_TABS = [
  { key: 'congress', label: 'Congress', icon: '🏛' },
  { key: 'fedRegister', label: 'Fed Register', icon: '📋' },
  { key: 'fcc', label: 'FCC', icon: '📡' },
  { key: 'senateLDA', label: 'Senate LDA', icon: '🏢' },
  { key: 'ftc', label: 'FTC', icon: '⚖' },
  { key: 'news', label: 'News', icon: '📰' },
]

function getColumns(key) {
  switch (key) {
    case 'congress':
      return [
        { label: 'TITLE', render: (item) => item.title || item.number || '—' },
        { label: 'TYPE', render: (item) => item.billType || item.type || '—', width: 70 },
        { label: 'DATE', render: (item) => formatDate(item.date || item.introducedDate), width: 90 },
        { label: 'STATUS', render: (item) => item.status || '—', width: 80 },
      ]
    case 'fcc':
      return [
        { label: 'DESCRIPTION', render: (item) => item.description || '—' },
        { label: 'BUREAU', render: (item) => item.bureau || item.bureauName || '—', width: 100 },
        { label: 'FILINGS', render: (item) => item.filingCount || '—', width: 60 },
        { label: 'STATUS', render: (item) => item.status || '—', width: 80 },
      ]
    case 'senateLDA':
      return [
        { label: 'REGISTRANT', render: (item) => item.registrant || '—' },
        { label: 'AMOUNT', render: (item) => item.amount ? `$${Number(item.amount).toLocaleString()}` : '—', width: 90 },
        { label: 'PERIOD', render: (item) => item.period || '—', width: 80 },
        { label: 'ISSUES', render: (item) => (item.issueAreas || []).join(', ') || '—' },
      ]
    case 'ftc':
      return [
        { label: 'TITLE', render: (item) => item.title || '—' },
        { label: 'DATE', render: (item) => formatDate(item.date), width: 90 },
      ]
    case 'news':
      return [
        { label: 'HEADLINE', render: (item) => item.title || '—' },
        { label: 'SOURCE', render: (item) => item.source?.name || item.source || '—', width: 120 },
        { label: 'DATE', render: (item) => formatDate(item.date || item.publishedAt), width: 90 },
      ]
    default: // fedRegister
      return [
        { label: 'TITLE', render: (item) => item.title || '—' },
        { label: 'TYPE', render: (item) => item.type || '—', width: 100 },
        { label: 'DATE', render: (item) => formatDate(item.date || item.publicationDate), width: 90 },
      ]
  }
}

export default function TheEvidence({ claudeResult, rawData }) {
  const r = claudeResult || {}
  const sources = rawData?.sources || {}
  const [activeTab, setActiveTab] = useState('congress')

  const activeSource = sources[activeTab] || {}
  const items = activeSource.items || []
  const columns = getColumns(activeTab)

  return (
    <section id="evidence" className="scroll-mt-20 mb-6" style={{ animation: 'fadeUp 0.5s ease-out 0.8s both' }}>
      <SectionHeader
        id="evidence-header"
        label="THE EVIDENCE"
        subtitle="Complete source data — every data point with links to original government documents"
      />

      {/* Data quality strip */}
      <div style={{
        background: 'var(--color-panel-bg)',
        border: '1px solid var(--color-panel-border)',
        padding: '14px 20px',
        marginBottom: 4,
      }}>
        <div className="flex flex-wrap items-center gap-4" style={{
          fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
        }}>
          <span>{r.dataQuality?.totalDataPoints || 0} total data points</span>
          <span style={{ color: 'var(--color-panel-divider)' }}>·</span>
          <span>{r.dataQuality?.sourcesSucceeded || 0}/6 sources succeeded</span>
          <span style={{ color: 'var(--color-panel-divider)' }}>·</span>
          <span>Generated {formatFullTimestamp(r.analysisTimestamp)}</span>
          <span style={{ color: 'var(--color-panel-divider)' }}>·</span>
          <span>Velocity: W1=1.0× · W2=0.7× · W3=0.4× · W4=0.1×</span>
        </div>
      </div>

      {/* Source tabs */}
      <div className="flex overflow-x-auto" style={{
        background: 'var(--color-panel-bg)',
        borderLeft: '1px solid var(--color-panel-border)',
        borderRight: '1px solid var(--color-panel-border)',
        scrollbarWidth: 'none',
      }}>
        {SOURCE_TABS.map(({ key, label, icon }) => {
          const count = (sources[key]?.items || []).length
          const isActive = activeTab === key
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="shrink-0 cursor-pointer transition-all duration-150"
              style={{
                padding: '10px 16px',
                fontSize: 11,
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.5px',
                background: isActive ? 'rgba(200,153,58,0.08)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--color-gold)' : '2px solid transparent',
                color: isActive ? 'var(--color-gold)' : 'var(--color-text-muted)',
                border: 'none',
                borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: isActive ? 'var(--color-gold)' : 'transparent',
              }}
            >
              {icon} {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Data table */}
      <div style={{
        background: 'var(--color-panel-bg)',
        border: '1px solid var(--color-panel-border)',
        borderTop: 'none',
        overflow: 'auto',
      }}>
        {items.length === 0 ? (
          <div style={{
            padding: 24, textAlign: 'center', fontSize: 13,
            color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
          }}>
            No data returned from this source.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-panel-border)' }}>
                {columns.map(col => (
                  <th
                    key={col.label}
                    style={{
                      padding: '8px 12px', fontSize: 10, color: 'var(--color-text-muted)',
                      fontFamily: 'var(--font-body)', textTransform: 'uppercase',
                      letterSpacing: '1px', textAlign: 'left', fontWeight: 600,
                      width: col.width || 'auto',
                    }}
                  >
                    {col.label}
                  </th>
                ))}
                <th style={{ width: 40, padding: '8px 12px' }} />
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--color-panel-border)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                >
                  {columns.map(col => (
                    <td
                      key={col.label}
                      style={{
                        padding: '10px 12px', fontSize: 12,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.4,
                        maxWidth: col.width ? undefined : 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {(item.url || item.link) && (
                      <a
                        href={item.url || item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 12, color: 'var(--color-gold)', textDecoration: 'none',
                        }}
                        title="Open source document"
                      >
                        ↗
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex flex-wrap justify-between items-center gap-2 mt-4 pt-4"
        style={{
          borderTop: '1px solid var(--color-panel-border)',
          fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)',
        }}
      >
        <span>Sources: Congress.gov · Federal Register · FCC ECFS · Senate LDA · FTC · NewsAPI</span>
        <span>Competitor estimates derived from regulatory signals. No independent competitor analysis was performed.</span>
      </div>
    </section>
  )
}
