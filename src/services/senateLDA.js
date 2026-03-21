import axios from 'axios'

export async function fetchLobbying(companyName) {
  try {
    const response = await axios.get(`/api/lda/api/v1/filings/`, {
      params: {
        client_name: companyName,
        filing_dt_posted_after: '2023-01-01'
      }
    })

    const results = response.data.results || []
    
    const items = results.map(filing => ({
      id: filing.filing_uuid,
      registrant: filing.registrant?.name || 'Unknown Firm',
      client: filing.client?.name || companyName,
      amount: filing.income || filing.expenses || null,
      period: filing.filing_period_display || filing.period_display || '',
      issueAreas: filing.lobbying_activities
        ?.map(a => a.general_issue_area_description)
        .filter(Boolean)
        .slice(0, 5)
        || [],
      specificIssues: filing.lobbying_activities?.[0]?.description?.slice(0, 200) || '',
      date: filing.dt_posted,
      url: `https://lda.senate.gov/filings/public/filing/${filing.filing_uuid}/print/`
    }))

    console.log(`[SenateLDA] ${items.length} results for ${companyName}`)
    
    return {
      source: 'Senate LDA',
      count: items.length,
      items: items,
      fetchedAt: new Date().toISOString()
    }
  } catch (err) {
    // Handle 404 gracefully - company has no lobbying filings
    if (err.response?.status === 404) {
      console.log(`[SenateLDA] No lobbying filings found for ${companyName}`)
      return {
        source: 'Senate LDA',
        count: 0,
        items: [],
        fetchedAt: new Date().toISOString()
      }
    }
    
    console.error('[SenateLDA] Failed:', err.message)
    return {
      source: 'Senate LDA',
      count: 0,
      items: [],
      error: err.message,
      fetchedAt: new Date().toISOString()
    }
  }
}
