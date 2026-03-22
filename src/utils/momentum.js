export const getMomentumStatus = (multiplier, riskLevel) => {
  if (multiplier >= 3 || riskLevel === 'CRITICAL')
    return { label: 'PRESSURE BUILDING', color: '#E05A5A', urgency: 'ACT NOW' }
  if (multiplier >= 2 || riskLevel === 'HIGH')
    return { label: 'ACCELERATING', color: '#E07830', urgency: 'ACT THIS QUARTER' }
  if (multiplier >= 1.2 || riskLevel === 'MODERATE')
    return { label: 'MONITORING', color: '#E0A030', urgency: 'WATCH CLOSELY' }
  return { label: 'STABLE', color: '#2ECC8A', urgency: 'TRACK QUARTERLY' }
}
