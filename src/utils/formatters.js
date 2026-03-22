export const formatTimestamp = (isoString) => {
  try {
    return new Date(isoString).toISOString().slice(11, 16) + ' UTC'
  } catch {
    return 'Recently'
  }
}

export const formatFullTimestamp = (iso) => {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    }) + ' at ' + d.toISOString().slice(11, 16) + ' UTC'
  } catch {
    return 'Recently'
  }
}

export const formatDate = (iso) => {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  } catch {
    return '—'
  }
}

export const daysFromNow = (dateString) => {
  try {
    const target = new Date(dateString)
    const now = new Date()
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
    return diff
  } catch {
    return null
  }
}
