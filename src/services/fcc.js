import axios from 'axios'

import { config } from '../config.js'

export async function fetchFCCProceedings(companyName) {
  try {
    const apiKey = config.fccApiKey
    
    if (!apiKey) {
      return {
        source: 'FCC',
        count: 0,
        items: [],
        error: 'API key not configured',
        fetchedAt: new Date().toISOString()
      }
    }

    const response = await axios.get(`/api/fcc/ecfs/proceedings`, {
      params: {
        api_key: apiKey,
        open_closed: 'O'
      }
    })

    const proceedings = response.data.proceeding || []
    
    // Client-side filtering
    const MEDIA_KEYWORDS = ['streaming', 'video', 'broadcast', 'media', 'platform', 'internet', 'cable', 'satellite', 'ott', 'vod']
    const companyNameLower = companyName.toLowerCase()
    
    const filteredProceedings = proceedings.filter(proceeding => {
      const description = (proceeding.description || '').toLowerCase()
      return MEDIA_KEYWORDS.some(keyword => description.includes(keyword)) || 
             description.includes(companyNameLower)
    })

    // Take maximum 15 results after filtering
    const limitedProceedings = filteredProceedings.slice(0, 15)
    
    const items = limitedProceedings.map(proceeding => ({
      id: proceeding.id,
      description: proceeding.description,
      bureau: proceeding.bureau?.name || 'FCC',
      status: proceeding.status || 'Open',
      filingCount: proceeding.filing_count || 0,
      dateOpened: proceeding.date_opened,
      url: `https://www.fcc.gov/ecfs/search/search-filings/proceedings/${proceeding.id}`
    }))

    console.log(`[FCC] ${proceedings.length} fetched, ${filteredProceedings.length} passed media filter for ${companyName}`)
    
    return {
      source: 'FCC',
      count: items.length,
      items: items,
      fetchedAt: new Date().toISOString()
    }
  } catch (err) {
    console.error('[FCC] Failed:', err.message)
    return {
      source: 'FCC',
      count: 0,
      items: [],
      error: err.message,
      fetchedAt: new Date().toISOString()
    }
  }
}
