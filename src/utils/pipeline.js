export const getStatusPipeline = (risk) => {
  const text = (
    (risk.title || '') + ' ' +
    (risk.source || '') + ' ' +
    (risk.description || '') + ' ' +
    (risk.specificDataPoint || '')
  ).toLowerCase()

  const isEnforcement =
    text.includes('ftc') || text.includes('fcc') ||
    text.includes('enforcement') || text.includes('action') ||
    text.includes('proceeding')

  if (isEnforcement) {
    const stages = ['Investigation', 'Proposed Rule', 'Comment Period', 'Final Rule', 'Enforcement']
    let activeIndex = 0
    if (text.includes('final rule') || text.includes('finalized')) activeIndex = 3
    else if (text.includes('comment') || text.includes('seeking comment')) activeIndex = 2
    else if (text.includes('proposed') || text.includes('notice')) activeIndex = 1
    else if (text.includes('enforcement') || text.includes('action')) activeIndex = 4
    return { stages, activeIndex, track: 'enforcement' }
  }

  const stages = ['Draft', 'Committee', 'Public Comment', 'Rulemaking', 'Final Rule']
  let activeIndex = 0
  if (text.includes('final rule') || text.includes('enacted')) activeIndex = 4
  else if (text.includes('rulemaking')) activeIndex = 3
  else if (text.includes('comment') || text.includes('public comment')) activeIndex = 2
  else if (text.includes('committee') || text.includes('hearing')) activeIndex = 1
  return { stages, activeIndex, track: 'legislative' }
}
