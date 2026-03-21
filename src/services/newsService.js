import axios from 'axios'

export async function fetchNews(companyName) {
  try {
    const apiKey = import.meta.env.VITE_NEWS_API_KEY
    
    if (!apiKey) {
      return {
        source: 'NewsAPI',
        count: 0,
        items: [],
        error: 'API key not configured',
        fetchedAt: new Date().toISOString()
      }
    }

    const query = `${companyName} AND (regulation OR FTC OR FCC OR antitrust OR congress OR legislation OR lawsuit)`
    
    const response = await axios.get(`/api/news/v2/everything`, {
      params: {
        q: query,
        sortBy: 'publishedAt',
        pageSize: 20,
        language: 'en',
        apiKey: apiKey
      }
    })

    // Check for API-level errors
    if (response.data.status === 'error') {
      return {
        source: 'NewsAPI',
        count: 0,
        items: [],
        error: response.data.message || 'NewsAPI error',
        fetchedAt: new Date().toISOString()
      }
    }

    const articles = response.data.articles || []
    
    // Filter out removed articles
    const filteredArticles = articles.filter(article => article.title !== '[Removed]')
    
    const items = filteredArticles.map(article => ({
      id: article.url,
      title: article.title,
      source: article.source?.name || 'Unknown',
      description: article.description?.slice(0, 200) || '',
      date: article.publishedAt,
      url: article.url
    }))

    console.log(`[NewsAPI] ${items.length} results for ${companyName}`)
    
    return {
      source: 'NewsAPI',
      count: items.length,
      items: items,
      fetchedAt: new Date().toISOString()
    }
  } catch (err) {
    let errorMessage = err.message
    if (err.response?.status === 426 || err.response?.status === 429) {
      errorMessage = 'NewsAPI rate limit reached (100/day on free tier)'
    }
    
    console.error('[NewsAPI] Failed:', errorMessage)
    return {
      source: 'NewsAPI',
      count: 0,
      items: [],
      error: errorMessage,
      fetchedAt: new Date().toISOString()
    }
  }
}
