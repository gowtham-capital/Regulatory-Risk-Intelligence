const DOMAINS = [
  'Content & Media',
  'Antitrust',
  'Data & Privacy',
  'Consumer Protection',
  'Broadcasting'
]

const DOMAIN_KEYWORDS = {
  'Content & Media': ['content', 'media', 'broadcast', 'streaming', 'sports', 'copyright', 'music'],
  'Antitrust': ['antitrust', 'competition', 'monopol', 'market power', 'merger'],
  'Data & Privacy': ['data', 'privacy', 'personal', 'COPPA', 'sensitive', 'broker'],
  'Consumer Protection': ['consumer', 'subscription', 'negative option', 'deceptive', 'cancel'],
  'Broadcasting': ['FCC', 'broadcast', 'spectrum', 'license', 'radio', 'television']
}

const severityScore = (s) => {
  const v = (s || '').toUpperCase()
  if (v.includes('CRITICAL')) return 4
  if (v === 'HIGH') return 3
  if (v.includes('MODERATE-HIGH') || v.includes('MODERATE+HIGH')) return 2.5
  if (v.includes('MODERATE')) return 2
  return 1
}

export const getHeatmapData = (risks) => {
  return DOMAINS.map(domain => {
    let maxScore = 0
    let matchedRisk = null
    const keywords = DOMAIN_KEYWORDS[domain]

    ;(risks || []).forEach(risk => {
      const text = ((risk.title || '') + ' ' +
        (risk.description || '') + ' ' +
        (risk.specificDataPoint || '')).toLowerCase()
      const matches = keywords.some(kw => text.includes(kw))
      if (matches) {
        const score = severityScore(risk.severity)
        if (score > maxScore) {
          maxScore = score
          matchedRisk = risk
        }
      }
    })

    return {
      domain,
      score: maxScore,
      severity: maxScore >= 3 ? 'HIGH'
        : maxScore >= 2 ? 'MODERATE'
          : maxScore > 0 ? 'LOW'
            : 'NONE',
      source: matchedRisk?.source || null
    }
  }).filter(d => d.score > 0)
}
