import axios from 'axios'

export async function fetchFederalRegister(companyName) {
  try {
    const response = await axios.get(`/api/federalregister/api/v1/documents.json`, {
      params: {
        'conditions[term]': companyName,
        'conditions[publication_date][gte]': '2023-01-01',
        'fields[]': ['abstract', 'agencies', 'publication_date', 'type', 'title', 'document_number', 'html_url'],
        per_page: 20,
        order: 'newest'
      }
    })

    const results = response.data.results || []
    
    // Filter out Presidential Documents
    const filteredResults = results.filter(result => result.type !== 'Presidential Document')
    
    const items = filteredResults.map(result => ({
      id: result.document_number,
      title: result.title,
      type: result.type,
      agencies: result.agencies?.map(a => a.name).join(', ') || 'Unknown Agency',
      abstract: result.abstract
        ? result.abstract.length > 300
          ? result.abstract.slice(0, 300) + '...'
          : result.abstract
        : 'No abstract available',
      date: result.publication_date,
      url: result.html_url
    }))

    console.log(`[FederalRegister] ${items.length} results for ${companyName}`)
    
    return {
      source: 'Federal Register',
      count: items.length,
      items: items,
      fetchedAt: new Date().toISOString()
    }
  } catch (err) {
    console.error('[FederalRegister] Failed:', err.message)
    return {
      source: 'Federal Register',
      count: 0,
      items: [],
      error: err.message,
      fetchedAt: new Date().toISOString()
    }
  }
}
