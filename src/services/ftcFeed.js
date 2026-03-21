import axios from 'axios'

export async function fetchFTCActions(companyName) {
  try {
    const response = await axios.get(
      '/api/ftc/feeds/press-release.xml',
      { responseType: 'text', timeout: 8000 }
    )

      const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response.data, 'text/xml')
    
    const parseError = xmlDoc.querySelector('parseerror, parsererror')
    if (parseError) {
      throw new Error('FTC XML parsing failed')
    }

    const allItems = Array.from(xmlDoc.querySelectorAll('item'))
    if (allItems.length === 0) {
      return {
        source: 'FTC',
        count: 0,
        items: [],
        fetchedAt: new Date().toISOString()
      }
    }

    const KEYWORDS = [
      companyName.toLowerCase(),
      'media', 'streaming', 'platform', 'digital', 'tech',
      'data privacy', 'competition', 'merger', 'acquisition',
      'antitrust', 'enforcement'
    ]

    const filtered = allItems
      .filter(item => {
        const title = item.querySelector('title')?.textContent?.toLowerCase() || ''
        const desc = item.querySelector('description')?.textContent?.toLowerCase() || ''
        return KEYWORDS.some(k => title.includes(k) || desc.includes(k))
      })
      .slice(0, 10)
      .map(item => ({
        id: item.querySelector('guid')?.textContent || item.querySelector('link')?.textContent,
        title: item.querySelector('title')?.textContent?.trim() || 'Untitled',
        description: item.querySelector('description')?.textContent?.slice(0, 200)?.trim() || '',
        date: item.querySelector('pubDate')?.textContent,
        url: item.querySelector('link')?.textContent || item.querySelector('guid')?.textContent
      }))

    console.log(`[FTC] ${filtered.length} results for ${companyName}`)
    return {
      source: 'FTC',
      count: filtered.length,
      items: filtered,
      fetchedAt: new Date().toISOString()
    }

  } catch (err) {
    console.error('[FTC] Failed:', err.message)
    return {
      source: 'FTC',
      count: 0,
      items: [],
      error: err.message,
      fetchedAt: new Date().toISOString()
    }
  }
}
