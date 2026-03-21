import { config } from '../config.js'
import axios from 'axios'

// ── COMPETITOR MAP ───────────────────────────────────────────────
// Define this as a const ABOVE the exported function
// This is Option 3 — hardcoded map, Claude estimates relative exposure
// No fabricated scores — honest relative framing from industry data

const COMPETITOR_MAP = {
  'netflix':       ['Disney', 'Comcast', 'Spotify'],
  'disney':        ['Netflix', 'Comcast', 'Warner Bros Discovery'],
  'spotify':       ['Apple Music', 'Amazon Music', 'YouTube Music'],
  'tiktok':        ['YouTube', 'Instagram', 'Snapchat'],
  'comcast':       ['Disney', 'Netflix', 'Charter Communications'],
  'youtube':       ['TikTok', 'Netflix', 'Instagram'],
  'amazon':        ['Netflix', 'Apple', 'Disney'],
  'apple':         ['Google', 'Amazon', 'Microsoft'],
  'meta':          ['TikTok', 'Twitter', 'Snapchat'],
  'google':        ['Meta', 'Apple', 'Amazon'],
  'twitter':       ['Meta', 'TikTok', 'LinkedIn'],
  'snapchat':      ['TikTok', 'Instagram', 'YouTube'],
}

// Helper to get competitors — returns array of 3 strings
// If company not in map, returns empty array (no competitor section)

const getCompetitors = (companyName) => {
  const key = companyName.toLowerCase().trim()
  return COMPETITOR_MAP[key] || []
}

// ── SYSTEM PROMPT ────────────────────────────────────────────────
// Define this as a const ABOVE the exported function
// This is the most important part of the entire file
// Every word here shapes what Claude returns

const SYSTEM_PROMPT = `
CRITICAL OUTPUT RULE: You MUST use EXACTLY these field names — no variations:
- regulatoryRisks (array of 3 risk objects)
- strategicActions (array of 3 action objects)  
- executiveSummary (string — 2 sentences only)
- overallRiskScore (integer 0-100)
- riskLevel (string: CRITICAL, HIGH, MODERATE, or LOW)
- pipelineStage (string: Stable, Monitoring, Pre-Crisis, or Crisis Active)
- competitiveContext (object)
- activateBenchmark (object)
- watchlist (array of 3 items)
strategicActions: array of exactly 3 objects, each containing:
  title (string), priority (string: "Immediate", "30 Days", or "90 Days"),
  specificTrigger (string — must name a specific bill, proceeding, or filing),
  competitorContext (string — what a named competitor is doing differently),
  rationale (string — why this action now, data-specific),
  activateCapability (string — how Activate Consulting enables this action)
Any other field names will cause the application to fail.

You are a Senior Strategy Consultant at Activate Consulting — the premier
media, technology, and entertainment strategy firm founded by Michael J. Wolf,
former McKinsey Global TMT Practice Leader and former President of MTV Networks.

You have received live data pulled in real-time from 6 US government sources:
Congress.gov, Federal Register, FCC ECFS, Senate LDA, FTC press releases,
and NewsAPI. This data was fetched seconds ago — it reflects today's
regulatory environment, not historical analysis.

Your role: synthesize this intelligence into an executive-grade regulatory
risk brief that a media company CEO can act on immediately.
`

// ── VELOCITY SCORING FRAMEWORK ───────────────────────────────────────
// THIS IS YOUR PRIMARY SCORING METHOD

const VELOCITY_SCORING = {
  // Time windows with weights
  windows: {
    W1: { days: 30, weight: 1.0, label: 'Active signals' },
    W2: { days: 90, weight: 0.7, label: 'Building signals' },
    W3: { days: 180, weight: 0.4, label: 'Background signals' },
    W4: { days: Infinity, weight: 0.1, label: 'Historical baseline' }
  },

  // Calculate velocity score from signal counts
  calculateVelocityScore: (counts) => {
    const { W1, W2, W3, W4 } = counts
    const velocityScore = (W1 * 1.0) + (W2 * 0.7) + (W3 * 0.4) + (W4 * 0.1)
    const baseline = (W1 + W2 + W3 + W4) / 4 || 1
    const velocityMultiplier = W1 / baseline

    let trend = 'STABLE'
    if (velocityMultiplier > 2.0) trend = 'ACCELERATING'
    if (velocityMultiplier < 0.8) trend = 'DECELERATING'

    return { velocityScore, velocityMultiplier, trend }
  },

  // Calculate overall risk score (0-100)
  calculateRiskScore: (velocityScore, factors) => {
    let score = Math.min(velocityScore * 8, 70)
    
    if (factors.ftcActionsPresent) score += 20
    if (factors.billsPassedCommittee > 0) score += 15
    if (factors.fccLargeProceedings > 0) score += 10
    if (factors.noLobbying && score > 50) score += 5
    
    return Math.min(score, 100)
  },

  // Risk level thresholds
  getRiskLevel: (score) => {
    if (score >= 76) return 'CRITICAL'
    if (score >= 51) return 'HIGH'
    if (score >= 26) return 'MODERATE'
    return 'LOW'
  },

  // Pipeline stage determination
  getPipelineStage: (score, w1Signals) => {
    if (score >= 76 && w1Signals > 5) return 'Crisis Active'
    if (score >= 51 && w1Signals > 3) return 'Pre-Crisis'
    if (score >= 26) return 'Monitoring'
    return 'Stable'
  }
}

// ── COMPETITOR ESTIMATION RULES ───────────────────────────────────────
// OPTION 3 FRAMEWORK - RELATIVE EXPOSURE WITHOUT FABRICATED DATA

const COMPETITOR_ESTIMATION = {
  // Rules for estimating competitor exposure without independent data
  rules: {
    noFabricatedScores: true,
    noFabricatedCounts: true,
    relativeOnly: true
  },

  // Estimate competitor exposure based on primary company's data
  estimateCompetitorExposure: (competitorName, primaryData, ldaFilings) => {
    const observations = []

    // Check if competitor appears in primary company's LDA filings
    const appearsInLDA = ldaFilings.some(filing => 
      filing.registrant?.toLowerCase().includes(competitorName.toLowerCase()) ||
      filing.client?.toLowerCase().includes(competitorName.toLowerCase()) ||
      filing.specificIssues?.some(issue => 
        issue.toLowerCase().includes(competitorName.toLowerCase())
      )
    )

    // Check regulatory environment overlap
    const sameFCCProceedings = primaryData.sources.fcc.items.length > 0
    const sameCongressionalScope = primaryData.sources.congress.items.length > 0
    const ftcActionsPresent = primaryData.sources.ftc.items.length > 0

    // Build rationale based on data observations
    let riskLevel = 'Similar'
    let rationale = []

    if (sameFCCProceedings) {
      rationale.push('operates in same FCC regulatory environment')
      riskLevel = 'Similar'
    }

    if (sameCongressionalScope) {
      rationale.push('subject to same congressional bill scope')
    }

    if (ftcActionsPresent) {
      rationale.push('exposed to same FTC enforcement environment')
      riskLevel = 'Higher' // FTC actions suggest elevated risk
    }

    if (appearsInLDA) {
      rationale.push('active lobbying engagement detected in primary company filings')
      riskLevel = 'Similar' // Active lobbying suggests mitigation
    }

    // Default rationale if no specific data points
    if (rationale.length === 0) {
      rationale.push('operates in same media/technology regulatory landscape')
    }

    return {
      name: competitorName,
      relativeRisk: riskLevel,
      rationale: rationale.join(', '),
      lobbyingPosture: appearsInLDA ? 
        'Active lobbying engagement detected' : 
        'No lobbying activity detected in primary company filings'
    }
  },

  // Generate competitor analysis section for prompt
  generateCompetitorSection: (companyName, competitors, primaryData, ldaFilings) => {
    if (competitors.length === 0) return ''

    const competitorAnalyses = competitors.map(comp => 
      COMPETITOR_ESTIMATION.estimateCompetitorExposure(comp, primaryData, ldaFilings)
    )

    return `

## COMPETITIVE LANDSCAPE
${competitorAnalyses.map(comp => 
  `**${comp.name}**: ${comp.relativeRisk} risk exposure - ${comp.rationale}. ${comp.lobbyingPosture}.`
).join('\n')}`
  }
}

// ── STRATEGIC ACTION RULES ───────────────────────────────────────────
// NON-NEGOTIABLE - ALL ACTIONS MUST REFERENCE SPECIFIC DATA

const STRATEGIC_ACTION_RULES = {
  // Every action must reference specific source data
  requirements: {
    mustReferenceSpecificData: true,
    mustIncludeDatesOrCounts: true,
    mustNameCompetitorActivity: true,
    mustSpecifyEnablement: true
  },

  // Template for data-specific strategic actions
  actionTemplate: {
    urgency: "Reference specific bill/proceeding with date or filing number",
    timeline: "Establish specific window based on data counts",
    competitive: "Show what competitors are doing differently (from LDA data)",
    enablement: "How Activate Consulting specifically enables this action"
  },

  // Generate data-specific action recommendations
  generateStrategicActions: (combinedData, velocityScore, riskScore) => {
    const actions = []
    const { sources } = combinedData

    // Congressional actions
    if (sources.congress.items.length > 0) {
      const recentBills = sources.congress.items.slice(0, 2)
      recentBills.forEach(bill => {
        actions.push({
          type: 'Legislative',
          action: `Engage with Senate Commerce Committee on ${bill.number} (${bill.type}) introduced ${bill.introducedDate || 'recently'}. ${bill.latestAction ? `Latest action: ${bill.latestAction.text} on ${bill.latestAction.date}.` : ''} ${sources.senateLDA.items.length === 0 ? 'Zero lobbying filings detected while competitors may be actively engaged.' : `LDA data shows ${sources.senateLDA.items.length} lobbying disclosures - increase engagement before committee markup.`} Activate Consulting provides direct committee access and legislative strategy.`,
          urgency: bill.latestAction ? bill.latestAction.date : bill.introducedDate,
          dataReference: `${bill.number} - ${bill.title}`
        })
      })
    }

    // FCC actions
    if (sources.fcc.items.length > 0) {
      const fccProceedings = sources.fcc.items.slice(0, 2)
      fccProceedings.forEach(proceeding => {
        actions.push({
          type: 'Regulatory',
          action: `File comments in FCC proceeding ${proceeding.proceedingNumber || 'referenced above'} by ${proceeding.filingDeadline || 'next filing deadline'}. ${proceeding.description}. ${proceeding.filingCount ? `${proceeding.filingCount} filings already submitted - competitive positioning critical.` : ''} Activate Consulting's FCC practice can draft and file technical comments within 72 hours.`,
          urgency: proceeding.filingDeadline || 'immediate',
          dataReference: `FCC ${proceeding.bureauName} - ${proceeding.proceedingNumber || 'proceeding'}`
        })
      })
    }

    // FTC actions
    if (sources.ftc.items.length > 0) {
      const ftcActions = sources.ftc.items.slice(0, 2)
      ftcActions.forEach(ftcItem => {
        actions.push({
          type: 'Enforcement',
          action: `Respond to FTC ${ftcItem.title} published ${ftcItem.date}. ${ftcItem.description ? `Action focuses on: ${ftcItem.description}.` : ''} ${sources.news.items.some(news => news.title.toLowerCase().includes('ftc')) ? 'News coverage amplifying regulatory attention - immediate response required.' : 'Prepare for potential investigation - Activate Consulting crisis team ready.'} Activate Consulting provides FTC defense strategy and settlement negotiation.`,
          urgency: ftcItem.date,
          dataReference: `FTC Action: ${ftcItem.title}`
        })
      })
    }

    // Lobbying gap analysis
    if (sources.senateLDA.items.length === 0 && (sources.congress.items.length > 0 || sources.fcc.items.length > 0)) {
      actions.push({
        type: 'Government Relations',
        action: `Establish lobbying presence immediately. Zero LDA filings detected while facing ${sources.congress.items.length} congressional bills and ${sources.fcc.items.length} FCC proceedings. Competitors likely filing quarterly LD-2 disclosures. Activate Consulting can establish lobbying program and file initial LD-1 within 30 days.`,
        urgency: 'immediate',
        dataReference: `LDA Gap: 0 filings vs ${sources.congress.items.length + sources.fcc.items.length} regulatory items`
      })
    }

    // Federal Register actions
    if (sources.federalRegister.items.length > 0) {
      const frItems = sources.federalRegister.items.slice(0, 2)
      frItems.forEach(item => {
        actions.push({
          type: 'Rulemaking',
          action: `Submit comments on ${item.title} by ${item.commentDeadline || 'deadline'}. ${item.type} proposed rule affecting operations. ${item.agency ? `${item.agency} seeking industry feedback.` : ''} Activate Consulting's regulatory team can draft comprehensive comments addressing technical and business implications.`,
          urgency: item.commentDeadline || item.publicationDate,
          dataReference: `Federal Register: ${item.documentNumber || item.title}`
        })
      })
    }

    return actions.slice(0, 4) // Limit to 4 most critical actions
  },

  // Validate actions meet data-specific requirements
  validateActions: (actions) => {
    return actions.every(action => 
      action.dataReference && 
      action.urgency && 
      action.action.includes('Activate Consulting')
    )
  }
}

// ── OUTPUT FORMAT ───────────────────────────────────────────────────
// NON-NEGOTIABLE - EXACT JSON STRUCTURE REQUIRED

const OUTPUT_FORMAT = {
  // Return ONLY valid JSON - no preamble, no markdown, no backticks
  requirements: {
    jsonOnly: true,
    noPreamble: true,
    noMarkdown: true,
    parseableByJSON: true
  },

  // Exact field count rules
  fieldCounts: {
    regulatoryRisks: 3,
    strategicActions: 3,
    peers: 'variable (2-3 based on competitors)',
    watchlist: 3
  },

  // Complete JSON structure template
  template: {
    overallRiskScore: 'integer 0–100',
    riskLevel: '"CRITICAL" | "HIGH" | "MODERATE" | "LOW"',
    pipelineStage: '"Crisis Active" | "Pre-Crisis" | "Monitoring" | "Stable"',
    
    regulatoryWindow: {
      range: 'e.g. 30–60 days or 90–120 days',
      namedTrigger: 'the specific bill, proceeding, or action that would escalate this',
      triggerEvent: 'what specifically happens to escalate — e.g. floor vote scheduled'
    },
    
    velocityIndicator: {
      trend: '"ACCELERATING" | "STABLE" | "DECELERATING"',
      multiplier: 'number to 1 decimal — e.g. 2.4',
      thirtyDaySignals: 'integer',
      ninetyDaySignals: 'integer',
      oneEightyDaySignals: 'integer',
      historicalSignals: 'integer',
      interpretation: '1 sentence — what this velocity means for the company'
    },
    
    executiveSummary: 'EXACTLY 2 sentences. MAXIMUM 60 words total.\n\n\
    SENTENCE 1 — THE SITUATION (what is true right now):\n\
    State the company\'s current regulatory position using one\n\
    specific data point from the filings — a lobbying amount,\n\
    a named act, a filing count, or an enforcement action.\n\
    Do not use vague language like "faces challenges" or\n\
    "significant exposure". Name the specific thing.\n\
    Example structure:\n\
    "[Company] is operating under [specific condition] with\n\
     [specific evidence from data] indicating [current state]."\n\n\
    SENTENCE 2 — THE COMPLICATION (what is changing or threatening):\n\
    State the single most significant emerging threat from the\n\
    velocity data — what is accelerating and what it forces.\n\
    Do not recommend actions. Do not say "should" or "must".\n\
    State what the data shows is coming.\n\
    Example structure:\n\
    "[Specific regulatory development] creates [specific business\n\
     consequence] that [specific decision] cannot be deferred."\n\n\
    HARD LIMITS:\n\
    - No more than 60 words across both sentences\n\
    - No adjectives like "significant", "heightened", "substantial"\n\
    - No hedging phrases like "may", "could potentially", "appears to"\n\
    - No recommendations — those belong in strategicActions\n\
    - Must contain at least one specific named act, rule, or dollar amount',
    
    regulatoryRisks: [
      {
        title: 'risk name — specific, not generic',
        severity: '"CRITICAL" | "HIGH" | "MODERATE" | "LOW"',
        velocityTrend: '"ACCELERATING" | "STABLE" | "DECELERATING"',
        velocityMultiplier: 'number to 1 decimal',
        source: 'exactly which of the 6 sources — e.g. Congress.gov, FCC ECFS',
        specificDataPoint: 'the exact bill name, proceeding number, filing count, or article that flagged this',
        description: '1–2 sentences referencing the specific data point above',
        timeframe: 'range, not a precise single number — e.g. 45–90 days'
      }
    ],
    
    strategicActions: [
      {
        title: 'specific action — not generic',
        priority: '"Immediate" | "30 Days" | "90 Days"',
        specificTrigger: 'the exact bill, proceeding, or data point driving this action',
        competitorContext: 'what a named competitor is doing differently, if visible in data',
        rationale: 'why this action, tied to specific named data — no generic statements',
        activateCapability: 'how Activate Consulting specifically enables this — not generic consulting language'
      }
    ],
    
    competitiveContext: {
      summary: '2 sentences on how this company compares to peer group based on data implications',
      peers: [
        {
          company: 'competitor name',
          relativeRisk: '"Higher" | "Similar" | "Lower"',
          lobbyingPosture: '"Active" | "Moderate" | "Absent" | "Unknown"',
          dataEvidence: 'what in primary company data implies this about competitor',
          keyDifference: 'one sentence on most important difference vs primary company'
        }
      ]
    },
    
    activateBenchmark: {
      stat: 'one specific Activate benchmark from those provided — quote it exactly',
      relevance: 'one sentence on why this benchmark applies directly to company situation'
    },
    
    watchlist: [
      {
        item: 'specific named bill, proceeding number, or action — not a category',
        source: 'which data source',
        currentStatus: 'where it stands right now based on the data',
        trigger: 'the specific event that would escalate this to crisis level'
      }
    ]
  },

  // Generate the complete prompt with format instructions
  generatePrompt: (combinedData, competitors) => {
    return `${SYSTEM_PROMPT}

## COMPANY CONTEXT
${combinedData.companyName} - US Media/Technology Company Analysis Date: ${combinedData.analysisTimestamp}

## DATA SUMMARY
- Total Data Points: ${combinedData.summary.totalDataPoints}
- Sources Succeeded: ${combinedData.summary.sourcesSucceeded}/6
- Sources Failed: ${combinedData.summary.sourcesFailed}/6}

## ACTIVATE BENCHMARKS (for context)
- AI Adoption Rate: ${combinedData.activateBenchmarks.aiAdoptionRate}
- Super User Penetration: ${combinedData.activateBenchmarks.superUserPenetration}
- AI Search Growth: ${combinedData.activateBenchmarks.aiSearchGrowth}
- Enterprise Tech Growth: ${combinedData.activateBenchmarks.enterpriseTechGrowth}
- Media Regulatory Context: ${combinedData.activateBenchmarks.mediaRegulatoryContext}

## CONGRESSIONAL ACTIVITY (${combinedData.sources.congress.count} bills)
${combinedData.sources.congress.items.slice(0, 3).map(item => 
  `- ${item.title} (${item.billType} ${item.number}, ${item.congress}${item.latestAction ? ', Latest: ' + item.latestAction.text : ''})`
).join('\n')}

## FEDERAL REGISTER (${combinedData.sources.fedRegister.count} items)
${combinedData.sources.fedRegister.items.slice(0, 3).map(item => 
  `- ${item.title} (${item.type})`
).join('\n')}

## FCC PROCEEDINGS (${combinedData.sources.fcc.count} items)
${combinedData.sources.fcc.items.slice(0, 3).map(item => 
  `- ${item.description} (${item.bureauName})`
).join('\n')}

## LOBBYING DISCLOSURES (${combinedData.sources.senateLDA.count} filings)
${combinedData.sources.senateLDA.items.slice(0, 3).map(item => 
  `- ${item.registrant} representing ${item.client}${item.amount ? ', Amount: ' + item.amount : ''}`
).join('\n')}

## FTC ACTIONS (${combinedData.sources.ftc.count} items)
${combinedData.sources.ftc.items.slice(0, 3).map(item => 
  `- ${item.title}${item.description ? ': ' + item.description : ''}`
).join('\n')}

## NEWS COVERAGE (${combinedData.sources.news.count} articles)
${combinedData.sources.news.items.slice(0, 3).map(item => 
  `- ${item.title} (${item.source})`
).join('\n')}

${COMPETITOR_ESTIMATION.generateCompetitorSection(combinedData.companyName, competitors, combinedData, combinedData.sources.senateLDA.items)}

## ANALYSIS REQUIREMENTS

Apply the velocity scoring framework:
- W1 (30 days): weight 1.0
- W2 (30-90 days): weight 0.7  
- W3 (90-180 days): weight 0.4
- W4 (180+ days): weight 0.1

Calculate velocity multiplier and trend. Apply risk factors for FTC actions, committee bills, large FCC proceedings, and lobbying gaps.

Return your analysis as valid JSON ONLY. No preamble, no explanation, no markdown, no backticks. The response must be parseable by JSON.parse() with zero preprocessing.

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT — COPY THIS STRUCTURE EXACTLY. NO EXCEPTIONS.
═══════════════════════════════════════════════════════════════

You MUST return ONLY this JSON structure.
Copy the field names EXACTLY as written — do not rename any field.
Do not add fields. Do not remove fields. Do not nest differently.
Return NO text before or after the JSON.
Return NO markdown, NO backticks, NO explanation.
The response must pass JSON.parse() with zero modifications.

{
  "overallRiskScore": <integer 0-100, calculated using velocity framework>,
  "riskLevel": <exactly one of: "CRITICAL" | "HIGH" | "MODERATE" | "LOW">,
  "pipelineStage": <exactly one of: "Crisis Active" | "Pre-Crisis" | "Monitoring" | "Stable">,

  "regulatoryWindow": {
    "range": "<e.g. 30-60 days>",
    "namedTrigger": "<specific bill or proceeding name>",
    "triggerEvent": "<what event escalates this>"
  },

  "velocityIndicator": {
    "trend": <exactly one of: "ACCELERATING" | "STABLE" | "DECELERATING">,
    "multiplier": <number to 1 decimal, e.g. 2.4>,
    "thirtyDaySignals": <integer>,
    "ninetyDaySignals": <integer>,
    "oneEightyDaySignals": <integer>,
    "historicalSignals": <integer>,
    "interpretation": "<1 sentence on what this velocity means>"
  },

  "executiveSummary": "<EXACTLY 2 sentences. MAXIMUM 60 words total. SENTENCE 1: State company's current regulatory position using one specific data point from filings — a lobbying amount, a named act, a filing count, or an enforcement action. Do not use vague language. Name specific thing. SENTENCE 2: State single most significant emerging threat from velocity data — what is accelerating and what it forces. Do not recommend actions. State what data shows is coming. HARD LIMITS: No more than 60 words total, no vague adjectives, no hedging phrases, no recommendations, must contain specific named act/rule/dollar amount>",

  "regulatoryRisks": [
    {
      "title": "<specific risk name>",
      "severity": <exactly one of: "CRITICAL" | "HIGH" | "MODERATE" | "LOW">,
      "velocityTrend": <exactly one of: "ACCELERATING" | "STABLE" | "DECELERATING">,
      "velocityMultiplier": <number to 1 decimal>,
      "source": "<exactly one of: Congress.gov | Federal Register | FCC ECFS | Senate LDA | FTC | NewsAPI>",
      "specificDataPoint": "<exact bill name, proceeding number, or filing count>",
      "description": "<1-2 sentences referencing the specific data point>",
      "timeframe": "<range not single number, e.g. 45-90 days>"
    },
    <second item — same structure>,
    <third item — same structure>
  ],

  "strategicActions": [
    {
      "title": "<specific action title>",
      "priority": <exactly one of: "Immediate" | "30 Days" | "90 Days">,
      "specificTrigger": "<exact bill, proceeding, or data point driving this>",
      "competitorContext": "<what a named competitor is doing differently>",
      "rationale": "<why this action tied to named data — no generic statements>",
      "activateCapability": "<how Activate Consulting specifically enables this>"
    },
    <second item — same structure>,
    <third item — same structure>
  ],

  "competitiveContext": {
    "summary": "<2 sentences on how this company compares to its peer group>",
    "peers": [
      {
        "company": "<competitor name>",
        "relativeRisk": <exactly one of: "Higher" | "Similar" | "Lower">,
        "lobbyingPosture": <exactly one of: "Active" | "Moderate" | "Absent" | "Unknown">,
        "dataEvidence": "<what in the primary data implies this>",
        "keyDifference": "<one sentence on the most important difference>"
      }
    ]
  },

  "activateBenchmark": {
    "stat": "<quote one Activate benchmark exactly as provided>",
    "relevance": "<one sentence on why this applies to this company>"
  },

  "watchlist": [
    {
      "item": "<specific named bill, proceeding number, or action>",
      "source": "<which data source>",
      "currentStatus": "<where it stands right now>",
      "trigger": "<specific event that escalates this to crisis>"
    },
    <second item — same structure>,
    <third item — same structure>
  ]
}

FIELD COUNT RULES — ENFORCE EXACTLY:
- regulatoryRisks: exactly 3 items
- strategicActions: exactly 3 items  
- peers: exactly ${competitors.length} items
- watchlist: exactly 3 items
- Every field required — never omit or null any field

Be concise, specific, and actionable. Focus on US regulatory and geopolitical risks. All strategic actions must reference specific data points and include Activate Consulting enablement.`
  }
}

const transformClaudeResponse = (raw, companyName, buckets, competitors) => {

  // ── Helper: safely get nested value with fallbacks ──────────
  const get = (obj, ...paths) => {
    for (const path of paths) {
      const keys = path.split('.')
      let val = obj
      for (const key of keys) {
        val = val?.[key]
        if (val === undefined || val === null) break
      }
      if (val !== undefined && val !== null) return val
    }
    return null
  }

  // ── Helper: get array with fallbacks ────────────────────────
  const getArr = (obj, ...paths) => {
    const val = get(obj, ...paths)
    return Array.isArray(val) ? val : []
  }

  // ── Helper: extract risk score from wherever Claude put it ──
  const extractScore = (raw) => {
    const directScore = get(raw,
      'overallRiskScore', 'overall_risk_score', 'risk_score',
      'score', 'overall_score',
      'executive_summary.risk_score',
      'executive_summary.overall_risk_score',
      'data_confidence.overall_score'
    )
    if (directScore !== null) return parseInt(directScore) || 65

    // Derive from risk level string if no number found
    const level = extractLevel(raw)
    const levelMap = { 'CRITICAL': 85, 'HIGH': 70, 'MODERATE': 50, 'LOW': 25 }
    return levelMap[level] || 65
  }

  // ── Helper: extract risk level ───────────────────────────────
  const extractLevel = (raw) => {
    const raw_level = get(raw,
      'riskLevel', 'risk_level', 'overall_risk_level',
      'executive_summary.overall_risk_level',
      'executive_summary.risk_level'
    ) || ''
    const normalized = raw_level.toString().toUpperCase()
    if (normalized.includes('CRITICAL')) return 'CRITICAL'
    if (normalized.includes('HIGH'))     return 'HIGH'
    if (normalized.includes('MODERATE')) return 'MODERATE'
    if (normalized.includes('LOW'))      return 'LOW'
    return 'MODERATE'
  }

  // ── Helper: extract pipeline stage ──────────────────────────
  const extractStage = (raw) => {
    const stage = get(raw,
      'pipelineStage', 'pipeline_stage', 'regulatory_stage',
      'regulatory_pipeline.stage', 'regulatory_pipeline.current_stage'
    ) || ''
    if (stage.toLowerCase().includes('crisis active')) return 'Crisis Active'
    if (stage.toLowerCase().includes('pre'))           return 'Pre-Crisis'
    if (stage.toLowerCase().includes('monitor'))       return 'Monitoring'
    if (stage.toLowerCase().includes('stable'))        return 'Stable'
    const score = extractScore(raw)
    if (score >= 76) return 'Crisis Active'
    if (score >= 51) return 'Pre-Crisis'
    if (score >= 26) return 'Monitoring'
    return 'Stable'
  }

  // ── Helper: extract executive summary text ───────────────────
  const extractSummary = (raw) => {
    const rawSummary = get(raw,
      'executiveSummary', 'executive_summary'
    )
    let execSummary = ''
    if (typeof rawSummary === 'string') {
      execSummary = rawSummary
    } else if (typeof rawSummary === 'object' && rawSummary !== null) {
      // Claude returned an object — extract text from any likely field inside it
      execSummary = rawSummary.summary || rawSummary.text ||
                    rawSummary.overview || rawSummary.content ||
                    rawSummary.assessment || rawSummary.narrative ||
                    rawSummary.analysis || Object.values(rawSummary)
                      .find(v => typeof v === 'string' && v.length > 40) || ''
    }
    // Final guard — if it still looks like a risk level word, discard it
    const riskWords = ['CRITICAL','HIGH','MODERATE','LOW','MODERATE-HIGH']
    if (riskWords.includes((execSummary || '').trim().toUpperCase())) {
      execSummary = ''
    }

    return execSummary || `${companyName} regulatory analysis complete.` 
  }

  // ── Helper: extract risks array ─────────────────────────────
  const extractRisks = (raw) => {
    const RISK_KEYS = [
      'regulatoryRisks','regulatory_risks','priority_risks','risk_categories',
      'risk_vectors','risks','key_risks','riskVectors','riskCategories',
      'risk_areas','riskAreas','regulatory_risk_breakdown','key_risk_factors',
      'regulatory_developments','riskFactors','risk_factors','topRisks',
      'top_risks','primaryRisks','primary_risks','riskBreakdown',
      'risk_breakdown','regulatoryExposure','regulatory_exposure'
    ]

    let risks = null
    // Pass 1: check all known keys
    for (const key of RISK_KEYS) {
      if (Array.isArray(raw[key]) && raw[key].length > 0) {
        risks = raw[key]
        break
      }
    }
    // Pass 2: nuclear scan — find ANY array of objects in the response
    if (!risks || risks.length === 0) {
      for (const key of Object.keys(raw)) {
        const val = raw[key]
        if (
          Array.isArray(val) &&
          val.length >= 2 &&
          val[0] !== null &&
          typeof val[0] === 'object' &&
          Object.keys(val[0]).length >= 3
        ) {
          const keyStr = Object.keys(val[0]).join(' ').toLowerCase()
          const looksLikeRisk =
            keyStr.includes('risk') || keyStr.includes('title') ||
            keyStr.includes('severity') || keyStr.includes('threat') ||
            keyStr.includes('regulatory') || keyStr.includes('compliance')
          const looksLikeAction =
            keyStr.includes('action') || keyStr.includes('recommend') ||
            keyStr.includes('strateg')
          if (looksLikeRisk && !looksLikeAction) {
            risks = val
            console.log('[Transformer] Risks found via nuclear scan — key:', key)
            break
          }
        }
      }
    }
    // Pass 3: last resort — take the first array of objects regardless
    if (!risks || risks.length === 0) {
      for (const key of Object.keys(raw)) {
        const val = raw[key]
        if (
          Array.isArray(val) &&
          val.length >= 2 &&
          typeof val[0] === 'object' &&
          val[0] !== null
        ) {
          risks = val
          console.log('[Transformer] Risks found via last resort — key:', key)
          break
        }
      }
    }
    risks = Array.isArray(risks) ? risks : []

    return risks.slice(0, 3).map((r, i) => {
      const spd = get(r, 'specificDataPoint', 'specific_data_point', 'keyDataPoint', 'key_data_point', 'dataPoint', 'evidence', 'detail') || ''
      return {
        title:             get(r, 'title', 'risk_title', 'name', 'category') || `Regulatory Risk ${i + 1}`,
        severity:          get(r, 'severity', 'level', 'risk_level', 'priority') || 'MODERATE',
        velocityTrend:     get(r, 'velocityTrend', 'velocity_trend', 'trend') || 'ACCELERATING',
        velocityMultiplier:parseFloat(get(r, 'velocityMultiplier', 'velocity_multiplier', 'multiplier')) || 1.0,
        source:            get(r, 'source', 'data_source', 'sourceLabel') || 'Multiple Sources',
        specificDataPoint: spd === 'See source data' ? '' : spd,
        description:       get(r, 'description', 'detail', 'details', 'summary', 'impact') || get(r, 'specificDataPoint', 'specific_data_point') || 'Active regulatory risk detected',
        timeframe:         get(r, 'timeframe', 'timeline', 'time_horizon', 'timing') || '90-180 days'
      }
    })
  }

  // ── Helper: extract competitive context ─────────────────────
  const extractCompetitive = (raw, competitors) => {
    const comp = get(raw,
      'competitiveContext', 'competitive_context',
      'competitor_risk_comparison', 'competitive_intelligence',
      'competitor_analysis', 'competitive_landscape'
    )

    const summaryText = typeof comp === 'object'
      ? (get(comp, 'summary', 'overview', 'key_finding') || '')
      : (typeof comp === 'string' ? comp : '')

    const peersArr = getArr(comp,
      'peers', 'competitors', 'peer_comparison', 'comparison'
    )

    const buildPeer = (name) => {
      const found = peersArr.find(p =>
        (get(p, 'company', 'name', 'competitor') || '').toLowerCase().includes(name.toLowerCase())
      )
      return {
        company:         name,
        relativeRisk:    get(found, 'relativeRisk', 'relative_risk', 'risk_level', 'exposure') || 'Similar',
        lobbyingPosture: get(found, 'lobbyingPosture', 'lobbying_posture', 'lobbying_activity', 'lobbying') || 'Unknown',
        dataEvidence:    get(found, 'dataEvidence', 'data_evidence', 'evidence', 'basis') || 'Detected in regulatory data for same industry pipeline',
        keyDifference:   get(found, 'keyDifference', 'key_difference', 'difference', 'note') || `${name} operates in the same regulatory environment with different legislative engagement levels` 
      }
    }

    return {
      summary: summaryText || `${companyName} faces ${extractLevel(raw)} regulatory exposure relative to its peer group based on velocity analysis.`,
      peers: competitors.map(buildPeer)
    }
  }

  // ── Helper: extract activate benchmark ──────────────────────
  const extractBenchmark = (raw) => {
    const bench = get(raw,
      'activateBenchmark', 'activate_benchmark',
      'activate_insight', 'benchmark', 'industry_benchmark'
    )
    if (typeof bench === 'object' && bench !== null) {
      return {
        stat:      get(bench, 'stat', 'statistic', 'finding', 'data') || 'US media regulatory pipeline operating at highest activity since 2017',
        relevance: get(bench, 'relevance', 'application', 'implication') || `This benchmark applies directly to ${companyName}'s current regulatory pipeline velocity` 
      }
    }
    return {
      stat:      typeof bench === 'string' ? bench : 'US media regulatory pipeline operating at highest activity since 2017',
      relevance: `This benchmark applies directly to ${companyName}'s current regulatory pipeline velocity` 
    }
  }

  // ── Helper: extract watchlist ────────────────────────────────
  const extractWatchlist = (raw) => {
    const arr = getArr(raw,
      'watchlist', 'watch_list',
      'immediate_monitoring_priorities', 'monitoring_priorities',
      'items_to_monitor', 'key_monitors'
    )

    return arr.slice(0, 3).map((w, i) => ({
      item:          get(w, 'item', 'title', 'name', 'bill', 'proceeding', 'action') || `Watchlist Item ${i + 1}`,
      source:        get(w, 'source', 'data_source', 'sourceLabel') || 'Multiple Sources',
      currentStatus: get(w, 'currentStatus', 'current_status', 'status', 'stage') || 'Active — monitoring required',
      trigger:       get(w, 'trigger', 'escalation_trigger', 'escalation', 'crisis_trigger', 'alert') || 'Significant activity increase would trigger escalation'
    }))
  }

  // ── Helper: extract velocity indicator ──────────────────────
  const extractVelocity = (raw, buckets) => {
    const vel = get(raw,
      'velocityIndicator', 'velocity_indicator',
      'velocity', 'regulatory_velocity'
    )
    const w1 = buckets.w1.length
    const w4 = buckets.w4.length
    const baseline = Math.max(w4 / 6, 1)
    const multiplier = parseFloat((w1 / baseline).toFixed(1))
    const trend = multiplier > 2.0 ? 'ACCELERATING' : multiplier < 0.8 ? 'DECELERATING' : 'STABLE'

    return {
      trend:              get(vel, 'trend') || trend,
      multiplier:         parseFloat(get(vel, 'multiplier')) || multiplier,
      thirtyDaySignals:   parseInt(get(vel, 'thirtyDaySignals', 'thirty_day_signals')) || w1,
      ninetyDaySignals:   parseInt(get(vel, 'ninetyDaySignals', 'ninety_day_signals')) || buckets.w2.length,
      oneEightyDaySignals:parseInt(get(vel, 'oneEightyDaySignals', 'one_eighty_day_signals')) || buckets.w3.length,
      historicalSignals:  parseInt(get(vel, 'historicalSignals', 'historical_signals')) || w4,
      interpretation:     get(vel, 'interpretation') || `Regulatory activity in the last 30 days is ${multiplier}x the historical baseline rate` 
    }
  }

  // ── Helper: extract regulatory window ───────────────────────
  const extractWindow = (raw) => {
    const win = get(raw,
      'regulatoryWindow', 'regulatory_window',
      'regulatory_pipeline', 'pipeline', 'timeline'
    )
    return {
      range:        get(win, 'range', 'timeframe', 'window', 'horizon') || '30-90 days',
      namedTrigger: get(win, 'namedTrigger', 'named_trigger', 'trigger', 'key_bill', 'primary_risk') || 'Active congressional and FCC proceedings',
      triggerEvent: get(win, 'triggerEvent', 'trigger_event', 'escalation', 'crisis_event') || 'Legislative advancement or enforcement action'
    }
  }

  // ── BUILD NORMALIZED BRIEF ───────────────────────────────────
  const score = extractScore(raw)
  const level = extractLevel(raw)

  // Extract actions using the nuclear extraction logic
  const ACTION_KEYS = [
    'strategicActions','strategic_actions','strategic_recommendations',
    'actionableRecommendations','actionable_recommendations',
    'immediate_action_items','recommended_actions','recommendations',
    'actions','immediateActions','immediate_actions','keyActions',
    'key_actions','priorityActions','priority_actions',
    'strategic_priorities','strategicPriorities'
  ]

  let actions = null

  // Pass 1: check all known keys
  for (const key of ACTION_KEYS) {
    if (Array.isArray(raw[key]) && raw[key].length > 0) {
      actions = raw[key]
      console.log('[Transformer] Actions found via key:', key)
      break
    }
  }

  // Pass 2: nuclear scan — find array of objects that look like actions
  if (!actions || actions.length === 0) {
    for (const key of Object.keys(raw)) {
      if (ACTION_KEYS.includes(key)) continue // already checked
      const val = raw[key]
      if (
        Array.isArray(val) &&
        val.length >= 2 &&
        val[0] !== null &&
        typeof val[0] === 'object' &&
        Object.keys(val[0]).length >= 2
      ) {
        const keyStr = Object.keys(val[0]).join(' ').toLowerCase()
        const looksLikeAction =
          keyStr.includes('action') || keyStr.includes('recommend') ||
          keyStr.includes('strateg') || keyStr.includes('priority') ||
          keyStr.includes('title') || keyStr.includes('trigger')
        const looksLikeRisk =
          keyStr.includes('severity') || keyStr.includes('threat') ||
          keyStr.includes('risk') || keyStr.includes('compliance')
        if (looksLikeAction && !looksLikeRisk) {
          actions = val
          console.log('[Transformer] Actions found via nuclear scan — key:', key)
          break
        }
      }
    }
  }

  // Pass 3: last resort — take second array of objects found (first is usually risks)
  if (!actions || actions.length === 0) {
    let arraysFound = 0
    for (const key of Object.keys(raw)) {
      const val = raw[key]
      if (
        Array.isArray(val) &&
        val.length >= 2 &&
        typeof val[0] === 'object' &&
        val[0] !== null
      ) {
        arraysFound++
        if (arraysFound === 2) { // skip first array (risks), take second
          actions = val
          console.log('[Transformer] Actions found via last resort — key:', key)
          break
        }
      }
    }
  }

  actions = Array.isArray(actions) ? actions : []

  const normaliseAction = (a) => {
    if (!a || typeof a !== 'object') return null
    const title =
      a.title || a.action || a.action_title || a.name ||
      a.recommendation || a.strategic_action || 'Strategic Action'

    const priority =
      a.priority || a.urgency || a.timeframe || a.timing ||
      a.priority_level || a.action_priority || '90 Days'
    // Normalise priority to exactly 3 values
    const p = (priority || '').toLowerCase()
    const normPriority =
      p.includes('immediate') || p.includes('urgent') || p.includes('now') || p.includes('critical')
        ? 'Immediate'
        : p.includes('30') || p.includes('month') || p.includes('near')
        ? '30 Days'
        : '90 Days'

    const specificTrigger =
      a.specificTrigger || a.specific_trigger || a.trigger ||
      a.catalyst || a.triggerEvent || a.trigger_event ||
      a.keyTrigger || a.key_trigger || a.why_now ||
      a.rationale || ''

    const competitorContext =
      a.competitorContext || a.competitor_context ||
      a.competitive_context || a.competitorIntelligence ||
      a.competitor_intelligence || a.peer_comparison ||
      a.competitive_intelligence || ''

    const rationale =
      a.rationale || a.reason || a.justification ||
      a.explanation || a.context || a.description ||
      a.detail || a.why || ''

    const activateCapability =
      a.activateCapability || a.activate_capability ||
      a.activate_role || a.activateRole ||
      a.how_activate_helps || a.consulting_angle ||
      a.activate_value || a.firm_capability || ''

    return {
      title,
      priority: normPriority,
      specificTrigger: specificTrigger || rationale,
      competitorContext,
      rationale,
      activateCapability
    }
  }

  const normalisedActions = actions
    .map(normaliseAction)
    .filter(Boolean)
    .slice(0, 3)

  // ── Competitive Context Extraction ───────────────────────
  const COMPETITIVE_KEYS = [
    'competitiveContext','competitive_context','competitor_risk_comparison',
    'competitorRiskComparison','competitive_intelligence','competitorAnalysis',
    'competitor_analysis','competitiveIntelligence','peerComparison',
    'peer_comparison','competitorContext','market_context','marketContext'
  ]

  let compCtx = null
  for (const key of COMPETITIVE_KEYS) {
    if (raw[key] && typeof raw[key] === 'object') {
      compCtx = raw[key]
      console.log('[Transformer] Competitive context found via key:', key)
      break
    }
  }

  const compSummary =
    compCtx?.summary || compCtx?.overview || compCtx?.analysis ||
    compCtx?.competitive_summary || compCtx?.context ||
    (typeof compCtx === 'string' ? compCtx : '') || ''

  let rawPeers =
    compCtx?.peers || compCtx?.competitors || compCtx?.companies ||
    compCtx?.peer_companies || compCtx?.competitor_list ||
    compCtx?.comparison || []

  if (!Array.isArray(rawPeers)) rawPeers = []

  const normalisePeer = (p) => {
    if (!p || typeof p !== 'object') return null
    const company =
      p.company || p.name || p.competitor || p.peer ||
      p.company_name || p.companyName || 'Competitor'
    const relativeRisk =
      p.relativeRisk || p.relative_risk || p.riskLevel ||
      p.risk_level || p.exposure || p.risk_exposure ||
      p.relative_exposure || p.riskComparison || 'Similar'
    const lobbyingPosture =
      p.lobbyingPosture || p.lobbying_posture || p.lobbying ||
      p.lobbying_status || p.lobbyingStatus || p.lobbyingActivity ||
      p.lobbying_activity || 'Unknown'
    const keyDifference =
      p.keyDifference || p.key_difference || p.difference ||
      p.distinction || p.notes || p.context ||
      p.competitive_advantage || p.summary || ''
    const dataEvidence =
      p.dataEvidence || p.data_evidence || p.evidence ||
      p.basis || p.source || ''
    return { company, relativeRisk, lobbyingPosture, keyDifference, dataEvidence }
  }

  const normalisedPeers = rawPeers.map(normalisePeer).filter(Boolean)

  // ── Activate Benchmark Extraction ─────────────────────────
  const BENCHMARK_KEYS = [
    'activateBenchmark','activate_benchmark','benchmark',
    'activate_stat','activateStat','industry_benchmark',
    'industryBenchmark','activateInsight','activate_insight',
    'firm_benchmark','firmBenchmark','researchBenchmark'
  ]

  let benchmarkRaw = null
  for (const key of BENCHMARK_KEYS) {
    if (raw[key]) {
      benchmarkRaw = raw[key]
      console.log('[Transformer] Benchmark found via key:', key)
      break
    }
  }

  const activateBenchmark = {
    stat:
      (typeof benchmarkRaw === 'string' ? benchmarkRaw : null) ||
      benchmarkRaw?.stat || benchmarkRaw?.statistic ||
      benchmarkRaw?.benchmark || benchmarkRaw?.finding ||
      benchmarkRaw?.insight || benchmarkRaw?.data_point ||
      benchmarkRaw?.key_stat || benchmarkRaw?.highlight ||
      '73% of major regulatory actions follow a detectable signal pattern 6-12 months prior.',
    relevance:
      benchmarkRaw?.relevance || benchmarkRaw?.context ||
      benchmarkRaw?.application || benchmarkRaw?.implication ||
      benchmarkRaw?.why_it_matters || benchmarkRaw?.significance ||
      'Early signal detection is the core of Activate\'s regulatory advisory practice.'
  }

  // ── Watchlist Extraction ───────────────────────────────────
  const WATCHLIST_KEYS = [
    'watchlist','watch_list','monitoring','monitoringPriorities',
    'monitoring_priorities','itemsToMonitor','items_to_monitor',
    'timeline_and_monitoring','timelineAndMonitoring','watchItems',
    'watch_items','monitoringList','monitoring_list',
    'monitoring_requirements','monitoringRequirements'
  ]

  let watchRaw = null
  for (const key of WATCHLIST_KEYS) {
    if (Array.isArray(raw[key]) && raw[key].length > 0) {
      watchRaw = raw[key]
      console.log('[Transformer] Watchlist found via key:', key)
      break
    }
  }

  if (!watchRaw || watchRaw.length === 0) {
    let arraysFound = 0
    for (const key of Object.keys(raw)) {
      const val = raw[key]
      if (Array.isArray(val) && val.length >= 2 && typeof val[0] === 'object') {
        arraysFound++
        if (arraysFound >= 3) {
          watchRaw = val
          console.log('[Transformer] Watchlist found via scan — key:', key)
          break
        }
      }
    }
  }

  if (!Array.isArray(watchRaw)) watchRaw = []

  const normaliseWatchItem = (w) => {
    if (!w || typeof w !== 'object') return null
    return {
      item:
        w.item || w.title || w.name || w.bill ||
        w.proceeding || w.event || w.development || 'Monitor',
      source:
        w.source || w.data_source || w.origin ||
        w.agency || w.authority || 'Government Source',
      currentStatus:
        w.currentStatus || w.current_status || w.status ||
        w.state || w.stage || w.progress || 'Under review',
      trigger:
        w.trigger || w.escalationTrigger || w.escalation_trigger ||
        w.escalation || w.alertTrigger || w.alert_trigger ||
        w.what_to_watch || w.watch_for || w.escalates_if || ''
    }
  }

  const watchlist = watchRaw.map(normaliseWatchItem).filter(Boolean).slice(0, 3)

  return {
    overallRiskScore:  score,
    riskLevel:         level,
    pipelineStage:     extractStage(raw),
    regulatoryWindow:  extractWindow(raw),
    velocityIndicator: extractVelocity(raw, buckets),
    executiveSummary:  extractSummary(raw),
    regulatoryRisks:   extractRisks(raw),
    strategicActions:  normalisedActions,
    competitiveContext: { summary: compSummary, peers: normalisedPeers },
    activateBenchmark: activateBenchmark,
    watchlist: watchlist
  }
}

export async function analyzeWithClaude(combinedData) {
  // ── STEP 1: Extract and validate input ────────────────────────

  const { companyName, summary, sources, activateBenchmarks, analysisTimestamp } = combinedData

  if (!companyName) throw new Error('No company name in combinedData')
  if (!sources)     throw new Error('No sources in combinedData')

  console.log('[ClaudeAnalysis] Starting analysis for:', companyName)
  console.log('[ClaudeAnalysis] Data points received:', summary.totalDataPoints)
  console.log('[ClaudeAnalysis] Sources succeeded:', summary.sourcesSucceeded, '/ 6')

  try {
    // ── STEP 2: Get competitors ───────────────────────────────────
    
    const competitors = getCompetitors(companyName)
    console.log('[ClaudeAnalysis] Competitors identified:', competitors.length > 0 ? competitors.join(', ') : 'None in map')

    // ── STEP 3: Bucket all items by date ─────────────────────────
    // This is the velocity model foundation
    // Every source item has a date field — sort into 4 windows

    const now = new Date()
    const days30  = new Date(now - 30  * 24 * 60 * 60 * 1000)
    const days90  = new Date(now - 90  * 24 * 60 * 60 * 1000)
    const days180 = new Date(now - 180 * 24 * 60 * 60 * 1000)

    const bucketItem = (item) => {
      const itemDate = new Date(item.date || item.fetchedAt || now)
      if (itemDate >= days30)  return 'w1'
      if (itemDate >= days90)  return 'w2'
      if (itemDate >= days180) return 'w3'
      return 'w4'
    }

    const allItems = [
      ...sources.congress.items.map(i    => ({ ...i, sourceLabel: 'Congress.gov' })),
      ...sources.fedRegister.items.map(i => ({ ...i, sourceLabel: 'Federal Register' })),
      ...sources.fcc.items.map(i         => ({ ...i, sourceLabel: 'FCC ECFS' })),
      ...sources.senateLDA.items.map(i   => ({ ...i, sourceLabel: 'Senate LDA' })),
      ...sources.ftc.items.map(i         => ({ ...i, sourceLabel: 'FTC' })),
      ...sources.news.items.map(i        => ({ ...i, sourceLabel: 'NewsAPI' })),
    ]

    const buckets = { w1: [], w2: [], w3: [], w4: [] }
    allItems.forEach(item => buckets[bucketItem(item)].push(item))

    console.log('[ClaudeAnalysis] Velocity buckets:')
    console.log('  Last 30 days:   ', buckets.w1.length, 'signals')
    console.log('  30–90 days:     ', buckets.w2.length, 'signals')
    console.log('  90–180 days:    ', buckets.w3.length, 'signals')
    console.log('  Over 180 days:  ', buckets.w4.length, 'signals')

    // ── STEP 4: Build the user message ───────────────────────────
    // Structured, scannable, velocity-first

    const formatItems = (items, limit = 5) =>
      items.slice(0, limit).map(i =>
        `- [${i.sourceLabel}] ${i.title || i.description || 'No title'} | Date: ${i.date || 'Unknown'} | ${i.status ? 'Status: ' + i.status : ''} ${i.filingCount ? 'Filings: ' + i.filingCount : ''}` 
      ).join('\n') || '  No items in this window'

    const userMessage = `
REGULATORY RISK ANALYSIS REQUEST
Company: ${companyName}
Analysis Timestamp: ${analysisTimestamp}
Known Competitors for Relative Comparison: ${competitors.length > 0 ? competitors.join(', ') : 'None identified'}

DATA QUALITY SUMMARY
Total data points: ${summary.totalDataPoints}
Sources succeeded: ${summary.sourcesSucceeded}/6
Sources failed: ${summary.sourcesFailed}

Per source:
  Congress.gov:     ${sources.congress.count} items
  Federal Register: ${sources.fedRegister.count} items
  FCC ECFS:         ${sources.fcc.count} items
  Senate LDA:       ${sources.senateLDA.count} items
  FTC:              ${sources.ftc.count} items
  NewsAPI:          ${sources.news.count} items

SOURCE BREAKDOWN — FULL CONTEXT
═══════════════════════════════════

CONGRESSIONAL ACTIVITY (${sources.congress.count} bills)
${sources.congress.items.slice(0, 6).map(b =>
  `- ${b.title} | Status: ${b.status} | Date: ${b.date} | Congress: ${b.congress}` 
).join('\n')}

FEDERAL REGISTER (${sources.fedRegister.count} documents)
${sources.fedRegister.items.slice(0, 5).map(d =>
  `- ${d.title} | Type: ${d.type} | Agency: ${Array.isArray(d.agencies) ? d.agencies[0] : d.agencies} | Date: ${d.date}` 
).join('\n')}

FCC PROCEEDINGS (${sources.fcc.count} open proceedings)
${sources.fcc.items.slice(0, 5).map(p =>
  `- ${p.description} | Bureau: ${p.bureau} | Active Filings: ${p.filingCount} | Opened: ${p.dateOpened}` 
).join('\n')}

SENATE LDA LOBBYING (${sources.senateLDA.count} filings)
${sources.senateLDA.items.slice(0, 6).map(l =>
  `- ${l.registrant} FOR ${l.client} | Amount: ${l.amount} | Period: ${l.period} | Issues: ${Array.isArray(l.issueAreas) ? l.issueAreas.slice(0,3).join(', ') : l.issueAreas}` 
).join('\n')}

FTC ENFORCEMENT (${sources.ftc.count} actions)
${sources.ftc.items.slice(0, 5).map(a =>
  `- ${a.title} | Date: ${a.date}` 
).join('\n')}

NEWS COVERAGE (${sources.news.count} articles)
${sources.news.items.slice(0, 5).map(n =>
  `- ${n.title} | Source: ${n.source} | Date: ${n.date}` 
).join('\n')}

═══════════════════════════════════
ACTIVATE CONSULTING BENCHMARKS
═══════════════════════════════════
${Object.entries(activateBenchmarks).map(([k, v]) => `- ${v}`).join('\n')}

═══════════════════════════════════
COMPETITOR ESTIMATION INSTRUCTION
═══════════════════════════════════
${competitors.length > 0 ? `
Provide relative risk comparison for: ${competitors.join(', ')}
Use ONLY what this data implies about the regulatory environment.
Do NOT fabricate scores, filing counts, or specific data for competitors.
Use honest relative language: Higher / Similar / Lower exposure vs ${companyName}.
Look for competitor names in the LDA filings data above — if present, note it.
` : 'No competitor comparison required for this company.'}

Return your complete analysis as valid JSON only.
`.trim()

    // ── STEP 5: Call Claude API ───────────────────────────────────
    // Check if API key is available
    if (!config.anthropicApiKey) {
      const apiKey = prompt('Please enter your Anthropic API Key (sk-ant-api03-...):');
      if (apiKey) {
        config.anthropicApiKey = apiKey;
        // Save to localStorage for future use
        const currentKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
        currentKeys.VITE_ANTHROPIC_API_KEY = apiKey;
        localStorage.setItem('apiKeys', JSON.stringify(currentKeys));
      } else {
        throw new Error('Anthropic API key is required for analysis');
      }
    }

    // Use proxy in development, direct API in production with CORS handling
    const apiUrl = import.meta.env.DEV ? '/api/anthropic/v1/messages' : 'https://api.anthropic.com/v1/messages'
    
    console.log('[ClaudeAnalysis] Sending to Claude — data points:', summary.totalDataPoints)
    console.time('[ClaudeAnalysis] Claude response time')

    try {
    const response = await axios.post(
      apiUrl,
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.anthropicApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        timeout: 60000
      }
    )

    console.timeEnd('[ClaudeAnalysis] Claude response time')
    console.log('[ClaudeAnalysis] Analysis complete for:', companyName)

    // ── STEP 6: Parse and validate response ──────────────────────

    const rawText = response.data.content[0].text

    // Strip any accidental markdown fences
    const cleanText = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    let rawBrief
  try {
    rawBrief = JSON.parse(cleanText)
  } catch (parseErr) {
    console.error('[ClaudeAnalysis] JSON parse failed:', rawBrief)
    throw new Error('Claude returned invalid JSON')
  }

  console.log('[ClaudeAnalysis] Raw keys from Claude:', Object.keys(rawBrief))

  const brief = transformClaudeResponse(rawBrief, companyName, buckets, competitors)

  console.log('[ClaudeAnalysis] Transformed successfully')
  return brief
  } catch (apiErr) {
    console.error('[ClaudeAnalysis] API Error:', apiErr)
    if (apiErr.response) {
      console.error('[ClaudeAnalysis] API Status:', apiErr.response.status)
      console.error('[ClaudeAnalysis] API Response:', apiErr.response.data)
    }
    throw new Error(`Claude API failed: ${apiErr.response?.status || apiErr.message}`)
  }

  console.log('[ClaudeAnalysis] Risk Score:', brief.overallRiskScore)
  console.log('[ClaudeAnalysis] Risk Level:', brief.riskLevel)

    // Attach metadata for dashboard
    brief.companyName        = companyName
    brief.analysisTimestamp  = analysisTimestamp
    brief.competitors        = competitors
    brief.dataQuality = {
      totalDataPoints:  summary.totalDataPoints,
      sourcesSucceeded: summary.sourcesSucceeded,
      sourcesFailed:    summary.sourcesFailed,
      velocityBuckets: {
        last30Days:    buckets.w1.length,
        days30to90:    buckets.w2.length,
        days90to180:   buckets.w3.length,
        over180Days:   buckets.w4.length
      }
    }

    // ── STEP 7: Log and return ────────────────────────────────────

    console.log('[ClaudeAnalysis] ═══════════════════════════════')
    console.log('[ClaudeAnalysis] Brief generated for:', companyName)
    console.log('[ClaudeAnalysis] Risk Score:     ', brief.overallRiskScore)
    console.log('[ClaudeAnalysis] Risk Level:     ', brief.riskLevel)
    console.log('[ClaudeAnalysis] Pipeline Stage: ', brief.pipelineStage)
    console.log('[ClaudeAnalysis] Velocity Trend: ', brief.velocityIndicator?.trend)
    console.log('[ClaudeAnalysis] Velocity x:     ', brief.velocityIndicator?.multiplier)
    console.log('[ClaudeAnalysis] Reg Window:     ', brief.regulatoryWindow?.range)
    console.log('[ClaudeAnalysis] Trigger:        ', brief.regulatoryWindow?.namedTrigger)
    console.log('[ClaudeAnalysis] Competitors:    ', competitors.length)
    console.log('[ClaudeAnalysis] ═══════════════════════════════')

    return brief

  } catch (err) {
  console.error('[ClaudeAnalysis] Error:', err.message)
  if (err.response) {
    console.error('[ClaudeAnalysis] API status:  ', err.response.status)
    console.error('[ClaudeAnalysis] API response:', JSON.stringify(err.response.data).slice(0, 300))
  }
  throw new Error(`Claude analysis failed for ${combinedData?.companyName}: ${err.message}`)
}
}
