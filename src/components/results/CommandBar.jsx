import { useState, useEffect } from 'react'
import { getRiskColor } from '../../utils/colors'
import SeverityBadge from './shared/SeverityBadge'

const SECTIONS = [
  { id: 'verdict', label: 'Verdict' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'threats', label: 'Threats' },
  { id: 'trajectory', label: 'Trajectory' },
  { id: 'stakes', label: 'Stakes' },
  { id: 'competition', label: 'Competition' },
  { id: 'playbook', label: 'Playbook' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'evidence', label: 'Evidence' },
]

export default function CommandBar({ claudeResult, activeSection, onReset }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuOpen(false)
  }

  const riskColor = getRiskColor(claudeResult?.riskLevel)
  const velocity = claudeResult?.velocityIndicator?.multiplier
  const velocityText = velocity ? velocity.toFixed(1) + '×' : '—'

  const handleCopyBrief = async () => {
    const narrative = claudeResult?.executiveNarrative || claudeResult?.executiveSummary || ''
    try {
      await navigator.clipboard.writeText(narrative)
    } catch { /* silent */ }
  }

  const handlePrint = () => window.print()

  return (
    <div
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,11,15,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-panel-border)' : '1px solid transparent',
        padding: '12px 0',
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Top row: company + meta + actions */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left — company identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="shrink-0"
              style={{ width: 2, height: 20, background: 'var(--color-gold)' }}
            />
            <span
              className="truncate"
              style={{
                fontSize: 16,
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)',
                fontWeight: 'bold',
              }}
            >
              {claudeResult?.companyName || 'Company'}
            </span>
            <SeverityBadge level={claudeResult?.riskLevel} small />
            <span
              style={{
                fontSize: 11,
                fontFamily: 'var(--font-data)',
                color: riskColor,
                fontWeight: 'bold',
              }}
            >
              {velocityText}
            </span>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">
            {/* Export dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="transition-all duration-150 cursor-pointer"
                style={{
                  padding: '6px 14px',
                  background: 'transparent',
                  border: '1px solid var(--color-panel-border)',
                  color: 'var(--color-text-muted)',
                  fontSize: 10,
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-gold)'
                  e.currentTarget.style.color = 'var(--color-gold)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-panel-border)'
                  e.currentTarget.style.color = 'var(--color-text-muted)'
                }}
              >
                Export ▾
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-50"
                  style={{
                    background: 'var(--color-panel-bg)',
                    border: '1px solid var(--color-panel-border)',
                    minWidth: 160,
                  }}
                >
                  {[
                    { label: 'Print Report', action: handlePrint },
                    { label: 'Copy Brief', action: handleCopyBrief },
                  ].map(({ label, action }) => (
                    <button
                      key={label}
                      onClick={() => { action(); setMenuOpen(false) }}
                      className="block w-full text-left cursor-pointer transition-colors duration-150"
                      style={{
                        padding: '8px 14px',
                        fontSize: 11,
                        fontFamily: 'var(--font-body)',
                        color: 'var(--color-text-secondary)',
                        background: 'transparent',
                        border: 'none',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(200,153,58,0.08)'
                        e.currentTarget.style.color = 'var(--color-gold)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--color-text-secondary)'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onReset}
              className="transition-all duration-150 cursor-pointer"
              style={{
                padding: '6px 14px',
                background: 'transparent',
                border: '1px solid var(--color-panel-border)',
                color: 'var(--color-text-primary)',
                fontSize: 10,
                fontFamily: 'var(--font-body)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-gold)'
                e.currentTarget.style.color = 'var(--color-gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-panel-border)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
            >
              ← New Analysis
            </button>
          </div>
        </div>

        {/* Section nav strip */}
        <div
          className="flex gap-1 mt-3 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="shrink-0 cursor-pointer transition-all duration-150"
              style={{
                padding: '4px 12px',
                fontSize: 10,
                fontFamily: 'var(--font-body)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                background: activeSection === id ? 'rgba(200,153,58,0.1)' : 'transparent',
                border: activeSection === id
                  ? '1px solid rgba(200,153,58,0.3)'
                  : '1px solid transparent',
                color: activeSection === id ? 'var(--color-gold)' : 'var(--color-text-muted)',
              }}
              onMouseEnter={e => {
                if (activeSection !== id) {
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }
              }}
              onMouseLeave={e => {
                if (activeSection !== id) {
                  e.currentTarget.style.color = 'var(--color-text-muted)'
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
