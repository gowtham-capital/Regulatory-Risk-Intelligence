import { useState } from 'react'

export default function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="transition-all duration-150 cursor-pointer"
      style={{
        padding: '4px 10px',
        background: copied ? 'rgba(46,204,138,0.12)' : 'transparent',
        border: `1px solid ${copied ? '#2ECC8A50' : 'var(--color-panel-border)'}`,
        color: copied ? '#2ECC8A' : 'var(--color-text-muted)',
        fontSize: 10,
        fontFamily: 'var(--font-body)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}
      onMouseEnter={e => {
        if (!copied) {
          e.target.style.borderColor = 'var(--color-gold)'
          e.target.style.color = 'var(--color-gold)'
        }
      }}
      onMouseLeave={e => {
        if (!copied) {
          e.target.style.borderColor = 'var(--color-panel-border)'
          e.target.style.color = 'var(--color-text-muted)'
        }
      }}
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}
