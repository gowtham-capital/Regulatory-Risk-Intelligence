import axios from 'axios'

export async function fetchCongressBills(companyName) {
  try {
    const apiKey = import.meta.env.VITE_CONGRESS_GOV_API_KEY
    
    if (!apiKey) {
      return {
        source: 'Congress.gov',
        count: 0,
        items: [],
        error: 'API key not configured',
        fetchedAt: new Date().toISOString()
      }
    }

    const response = await axios.get(`/api/congress/v3/bill`, {
      params: {
        query: companyName,
        sort: 'updateDate+desc',
        limit: 20,
        api_key: apiKey
      }
    })

    const bills = response.data.bills || []
    const items = bills.map(bill => ({
      id: bill.number,
      title: bill.title,
      status: bill.latestAction?.actionText || 'No action recorded',
      date: bill.latestAction?.actionDate || bill.introducedDate,
      sponsor: bill.sponsors?.[0]?.fullName || 'Unknown',
      congress: bill.congress,
      billType: bill.type,
      url: bill.url
    }))

    console.log(`[CongressGov] ${items.length} results for ${companyName}`)
    
    return {
      source: 'Congress.gov',
      count: items.length,
      items: items,
      fetchedAt: new Date().toISOString()
    }
  } catch (err) {
    let errorMessage = err.message
    if (err.response?.status === 429) {
      errorMessage = 'Rate limit reached — try again in 1 hour'
    }
    
    console.error('[CongressGov] Failed:', errorMessage)
    return {
      source: 'Congress.gov',
      count: 0,
      items: [],
      error: errorMessage,
      fetchedAt: new Date().toISOString()
    }
  }
}
