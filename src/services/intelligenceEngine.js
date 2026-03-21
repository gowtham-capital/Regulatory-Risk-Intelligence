import { fetchCongressBills }   from './congressGov.js'
import { fetchFederalRegister } from './federalRegister.js'
import { fetchFCCProceedings }  from './fcc.js'
import { fetchLobbying }        from './senateLDA.js'
import { fetchFTCActions }      from './ftcFeed.js'
import { fetchNews }            from './newsService.js'

export async function runAnalysis(companyName) {
  try {
    // 1. Validate input
    const trimmed = companyName?.trim()
    if (!trimmed) {
      throw new Error('Company name is required')
    }
    const normalizedName = trimmed

    // 2. Log start + start timer
    console.log(`[IntelligenceEngine] Starting analysis for: ${normalizedName}`)
    console.time(`[IntelligenceEngine] Total fetch time`)
    
    console.log(`\n=== INTELLIGENCE ENGINE: Starting analysis for ${normalizedName} ===`)
    
    // 3. Fire all 6 with Promise.allSettled()
    const [
      congressResult,
      federalRegisterResult,
      fccResult,
      senateLDAResult,
      ftcResult,
      newsResult
    ] = await Promise.allSettled([
      fetchCongressBills(normalizedName),
      fetchFederalRegister(normalizedName),
      fetchFCCProceedings(normalizedName),
      fetchLobbying(normalizedName),
      fetchFTCActions(normalizedName),
      fetchNews(normalizedName)
    ])

    // 4. Unwrap all 6 results safely
    // Helper to safely extract Promise.allSettled results
    const unwrap = (result, sourceName) => {
      if (result.status === 'fulfilled') {
        return result.value
      }
      // Service threw unexpectedly — return safe empty shape
      console.error(`[IntelligenceEngine] ${sourceName} rejected:`, result.reason)
      return {
        source: sourceName,
        count: 0,
        items: [],
        error: result.reason?.message || 'Unknown error',
        fetchedAt: new Date().toISOString()
      }
    }

    const congress      = unwrap(congressResult,      'Congress.gov')
    const fedRegister   = unwrap(federalRegisterResult,'Federal Register')
    const fcc           = unwrap(fccResult,            'FCC ECFS')
    const senateLDA     = unwrap(senateLDAResult,      'Senate LDA')
    const ftc           = unwrap(ftcResult,            'FTC')
    const news          = unwrap(newsResult,           'NewsAPI')

    // 5. Build combinedData object
    const analysisResults = {
      'Congress.gov': congress,
      'Federal Register': fedRegister,
      'FCC ECFS': fcc,
      'Senate LDA': senateLDA,
      'FTC': ftc,
      'NewsAPI': news
    }

    // Calculate totals
    let totalItems = 0
    let successfulServices = 0
    let failedServices = 0

    Object.values(analysisResults).forEach(result => {
      totalItems += result.count
      if (result.error) {
        failedServices++
      } else {
        successfulServices++
      }
    })

    // Assemble complete intelligence package for Claude
    const combinedData = {

      // ── Meta ──────────────────────────────────────────────
      companyName: normalizedName,
      analysisTimestamp: new Date().toISOString(),

      // ── Summary counts — used by Claude to weight its analysis ────
      summary: {
        totalDataPoints: congress.count + fedRegister.count + fcc.count +
                           senateLDA.count + ftc.count + news.count,
        sourcesSucceeded: [congress, fedRegister, fcc, senateLDA, ftc, news]
                              .filter(s => !s.error).length,
        sourcesFailed: [congress, fedRegister, fcc, senateLDA, ftc, news]
                           .filter(s => s.error).length,
        fetchedAt: new Date().toISOString()
      },

      // ── The 6 data sources ────────────────────────────────────────
      sources: {
        congress,        // Bills mentioning company — 12–18 mo early signal
        fedRegister,     // Proposed rules from agencies — 2–4 mo signal
        fcc,             // Open FCC proceedings — 1–3 mo signal
        senateLDA,       // Lobbying disclosures — 12–18 mo early signal
        ftc,             // FTC enforcement actions — crisis-level signal
        news             // Public news coverage — confirms signals gone public
      },

      // ── Context for Claude's analysis ────────────────────────────
      activateBenchmarks: {
        aiAdoptionRate: 'Only 5% of companies achieve sustained AI P&L impact',
        superUserPenetration: '28% of population drives 59% of eCommerce spend',
        aiSearchGrowth: '34M Americans use AI as primary search (2025), projected 72M by 2029',
        enterpriseTechGrowth: 'Enterprise tech spend growing 11.3% CAGR',
        mediaRegulatoryContext: 'US media regulatory pipeline operating at highest activity since 2017'
      }
    }

    // 6. Log summary + stop timer
    console.timeEnd(`[IntelligenceEngine] Total fetch time`)
    console.log(`[IntelligenceEngine] Analysis complete for ${normalizedName}:`)
    console.log(`  Total data points: ${combinedData.summary.totalDataPoints}`)
    console.log(`  Sources succeeded: ${combinedData.summary.sourcesSucceeded}/6`)
    console.log(`  Congress bills: ${congress.count}`)
    console.log(`  Federal Register: ${fedRegister.count}`)
    console.log(`  FCC proceedings: ${fcc.count}`)
    console.log(`  Senate LDA filings: ${senateLDA.count}`)
    console.log(`  FTC actions: ${ftc.count}`)
    console.log(`  News articles: ${news.count}`)

    // 7. Return combinedData
    return combinedData

  } catch (err) {
    console.error(`[IntelligenceEngine] Critical error:`, err)
    throw new Error(`Analysis failed for ${companyName}: ${err.message}`)
  }
}
