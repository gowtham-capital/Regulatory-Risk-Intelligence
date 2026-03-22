export const getRiskColor = (riskLevel) => {
  const level = (riskLevel || '').toUpperCase()
  switch (level) {
    case 'CRITICAL': return '#E05A5A'
    case 'HIGH': return '#E07830'
    case 'MODERATE': return '#E0A030'
    case 'LOW': return '#2ECC8A'
    default: return '#6B7394'
  }
}

export const getPriorityColor = (priority) => {
  const p = (priority || '').toLowerCase()
  if (p.includes('immediate')) return '#E05A5A'
  if (p.includes('30')) return '#E0A030'
  return '#6B7394'
}

export const getRelativeRiskDisplay = (r) => {
  const v = (r || '').toLowerCase()
  if (v.includes('higher') || v.includes('greater') || v.includes('more'))
    return { icon: '▲', label: 'Higher', color: '#E05A5A' }
  if (v.includes('lower') || v.includes('less'))
    return { icon: '▼', label: 'Lower', color: '#2ECC8A' }
  return { icon: '≈', label: 'Similar', color: '#E0A030' }
}

export const getLobbyingDisplay = (l) => {
  const v = (l || '').toLowerCase()
  if (v.includes('active') || v.includes('high') || v.includes('strong'))
    return { color: '#2ECC8A', label: '● Active' }
  if (v.includes('moderate') || v.includes('medium') || v.includes('some'))
    return { color: '#E0A030', label: '◐ Moderate' }
  if (v.includes('absent') || v.includes('none') || v.includes('low') || v.includes('minimal'))
    return { color: '#E05A5A', label: '○ Absent' }
  return { color: '#6B7394', label: '? Unknown' }
}

export const getVelDisplay = (trend, multiplier) => {
  const m = (multiplier || 1).toFixed(1)
  if (trend === 'ACCELERATING') return { icon: '↑', text: m + '×', color: '#E07830' }
  if (trend === 'DECELERATING') return { icon: '↓', text: m + '×', color: '#2ECC8A' }
  return { icon: '→', text: '1.0×', color: '#6B7394' }
}

export const getTrendDisplay = (t) => {
  if (t === 'ACCELERATING') return { icon: '↑', label: 'ACCELERATING', color: '#E07830' }
  if (t === 'DECELERATING') return { icon: '↓', label: 'DECELERATING', color: '#2ECC8A' }
  return { icon: '→', label: 'STABLE', color: '#6B7394' }
}
