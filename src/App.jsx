import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import { runAnalysis } from './services/intelligenceEngine.js'
import { analyzeWithClaude } from './services/claudeAnalysis.js'
import GLSLHills from './components/GLSLHills.jsx'

function App() {
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [rawData, setRawData] = useState(null)
  const [claudeResult, setClaudeResult] = useState(null)
  const [error, setError] = useState(null)
  const [liveTime, setLiveTime] = useState('')
  const [feedLines, setFeedLines] = useState([])
  const [activeFeedId, setActiveFeedId] = useState(null)
  const feedEndRef = useRef(null)

  const emitFeedLine = useCallback((message, type = 'default') => {
    return new Promise(resolve => {
      const id = Date.now() + Math.random()
      const timestamp = new Date().toISOString().slice(11, 19) + ' UTC'

      // Add line — empty message, typing state
      setFeedLines(prev => [...prev, {
        id,
        message: '',
        fullMessage: message,
        type,
        timestamp,
        state: 'typing'   // 'typing' | 'complete'
      }])

      // Mark this line as active — dot moves here
      setActiveFeedId(id)

      // Type character by character
      let i = 0
      const speed = Math.max(14, Math.min(24, 1400 / message.length))
      // auto-speed: short messages type slower, long messages type faster
      // keeps all lines feeling the same "weight"

      const typeNext = () => {
        i++
        if (i <= message.length) {
          setFeedLines(prev => prev.map(line =>
            line.id === id
              ? { ...line, message: message.slice(0, i) }
              : line
          ))
          setTimeout(typeNext, speed)
        } else {
          // Typing done — mark complete (triggers gold color change)
          setFeedLines(prev => prev.map(line =>
            line.id === id
              ? { ...line, state: 'complete' }
              : line
          ))
          setActiveFeedId(null)   // dot disappears until next line starts
          resolve()   // only resolves AFTER typing finishes
        }
      }

      // Small pause before typing starts — feels like the system
      // is "receiving" the line before printing it
      setTimeout(typeNext, 80)
    })
  }, [])

  useEffect(() => {
    const tick = () => setLiveTime(
      new Date().toUTCString().slice(17, 25) + ' UTC'
    )
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (feedEndRef.current) {
      feedEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [feedLines])

  // Helper functions for results screen
  const getRiskColor = (riskLevel) => {
    const level = (riskLevel || '').toUpperCase()
    switch (level) {
      case 'CRITICAL': return '#E05A5A'
      case 'HIGH': return '#E07830'
      case 'MODERATE': return '#E0A030'
      case 'LOW': return '#2ECC8A'
      default: return '#6B7394'
    }
  }

  const formatTimestamp = (isoString) => {
    try {
      return new Date(isoString).toISOString().slice(11,16) + ' UTC'
    } catch {
      return 'Recently'
    }
  }

  const LOADING_MESSAGES = [
    'Scanning Congressional pipeline...',
    'Reading Federal Register proposals...',
    'Checking FCC active proceedings...',
    'Analyzing lobbying signals...',
    'Reviewing FTC enforcement actions...',
    'Synthesizing with Activate benchmarks...'
  ]
  
  const QUICK_SELECT = ['Netflix', 'Spotify', 'TikTok', 'Disney', 'Comcast', 'YouTube', 'JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citigroup', 'Goldman Sachs']

  // Log environment initialization
  useEffect(() => {
    console.log('App initialized — environment:', import.meta.env.MODE)
  }, [])

  const handleAnalyze = async () => {
  const trimmedName = companyName.trim()
  if (!trimmedName) {
    setError('Please enter a company name to analyze.')
    return
  }

  setIsLoading(true)
  setError(null)
  setRawData(null)
  setClaudeResult(null)
  setFeedLines([])   // clear previous feed

  try {

    // ── PHASE 1: DATA COLLECTION ──────────────────────────────────
    await emitFeedLine(
      `Initiating regulatory investigation for ${trimmedName}`,
      'agent'
    )
    await new Promise(r => setTimeout(r, 300))

    await emitFeedLine(
      'Legislative Monitor scanning active congressional proceedings',
      'agent'
    )
    await new Promise(r => setTimeout(r, 300))

    await emitFeedLine(
      'Enforcement Tracker connecting to FTC and FCC enforcement databases',
      'agent'
    )
    await new Promise(r => setTimeout(r, 300))

    await emitFeedLine(
      'Lobbying Analyst pulling Senate LDA filings and disclosure records',
      'agent'
    )
    await new Promise(r => setTimeout(r, 300))

    await emitFeedLine(
      'Signal Monitor scanning Federal Register and NewsAPI feeds',
      'agent'
    )
    await new Promise(r => setTimeout(r, 300))

    // ── REAL OPERATION: Run all 6 APIs simultaneously ──────────────
    const intelligenceData = await runAnalysis(trimmedName)

    // ── PHASE 2: DATA RESULTS ──────────────────────────────────────
    const total = intelligenceData?.summary?.totalDataPoints || 0
    const sources = intelligenceData?.summary?.sourcesSucceeded || 0

    await emitFeedLine(
      `${total} regulatory signals retrieved across ${sources}/6 government sources`,
      'data'
    )
    await new Promise(r => setTimeout(r, 500))

    const congress = intelligenceData?.congressBills?.length || 0
    const lda = intelligenceData?.senateLDA?.length || 0
    const ftc = intelligenceData?.ftcActions?.length || 0
    const fcc = intelligenceData?.fccProceedings?.length || 0

    if (congress > 0) {
      await emitFeedLine(
        `${congress} active congressional proceedings identified — filtering for relevance`,
        'data'
      )
      await new Promise(r => setTimeout(r, 400))
    }

    if (lda > 0) {
      await emitFeedLine(
        `${lda} lobbying disclosure filings detected — $${trimmedName} spend pattern flagged`,
        'data'
      )
      await new Promise(r => setTimeout(r, 400))
    }

    if (ftc > 0) {
      await emitFeedLine(
        `${ftc} FTC enforcement actions reviewed — cross-referencing with ${trimmedName} operations`,
        'data'
      )
      await new Promise(r => setTimeout(r, 400))
    }

    if (fcc > 0) {
      await emitFeedLine(
        `${fcc} FCC proceedings active — media and content regulation signals extracted`,
        'data'
      )
      await new Promise(r => setTimeout(r, 300))
    }

    await emitFeedLine(
      'Bucketing signals across 4 velocity windows — 30d / 90d / 180d / historical',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 500))

    // Start Claude analysis (do not await yet)
    const claudePromise = analyzeWithClaude(intelligenceData)

    // Fire progressive lines while Claude works
    await emitFeedLine(
      'Synthesizing signals across legislative, enforcement, and lobbying tracks',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      `Mapping ${trimmedName}'s regulatory exposure against historical enforcement patterns`,
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Evaluating FTC consumer protection posture — reviewing recent enforcement precedent',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Cross-referencing congressional committee activity with lobbying disclosure timing',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Identifying velocity acceleration patterns across 30-day and 180-day windows',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Estimating competitor regulatory exposure from industry signal co-occurrence',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Scoring risk vectors across content regulation, antitrust, and data policy domains',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Drafting executive intelligence brief — applying Activate regulatory framework',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Finalising strategic action recommendations — prioritising by time to impact',
      'analysis'
    )
    await new Promise(r => setTimeout(r, 400))

    await emitFeedLine(
      'Validating signal sources — confirming government data recency',
      'analysis'
    )

    // Now wait for Claude to actually finish
    const brief = await claudePromise

    // ── PHASE 5: COMPLETE ──────────────────────────────────────────
    const riskLevel = brief?.riskLevel || 'UNKNOWN'
    const velocity = brief?.velocityIndicator?.multiplier?.toFixed(1) || '—'
    const stage = brief?.pipelineStage || '—'

    await new Promise(r => setTimeout(r, 1000))  // ← psychological pause
    await emitFeedLine(
      `Analysis complete — ${trimmedName} · Risk Level: ${riskLevel} · Velocity: ${velocity}× · Stage: ${stage}`,
      'complete'
    )
    await new Promise(r => setTimeout(r, 600))
    setClaudeResult(brief)
    setIsLoading(false)

  } catch (err) {
    emitFeedLine(
      `Investigation failed — ${err.message || 'connection error'}`,
      'error'
    )
    setError(err.message || 'Analysis failed. Please try again.')
    setIsLoading(false)
  }
}

  const handleReset = () => {
    setCompanyName('')
    setIsLoading(false)
    setLoadingMessage('')
    setRawData(null)
    setClaudeResult(null)
    setError(null)
  }

  const handleQuickSelect = (name) => {
    setCompanyName(name)
    // Use the trimmed name for analysis
    setTimeout(() => handleAnalyze(), 0)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setCompanyName(value)
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError(null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze()
    }
  }

  // Screen A: Input form
  if (!claudeResult && !isLoading) {
    return (
  <div style={{
    position: 'relative',
    width: '100vw',
    minHeight: '100vh',
    background: '#0A0B0F',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }}>

    {/* ── FULL SCREEN ANIMATED BACKGROUND ── */}
    <GLSLHills />

    {/* ── GRADIENT OVERLAYS ── */}
    {/* Top fade */}
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '35vh',
      background: 'linear-gradient(to bottom, #0A0B0F 0%, transparent 100%)',
      zIndex: 2, pointerEvents: 'none'
    }} />
    {/* Bottom fade */}
    <div style={{
      position: 'fixed', bottom: 0, left: 0,
      width: '100vw', height: '40vh',
      background: 'linear-gradient(to top, #0A0B0F 0%, transparent 100%)',
      zIndex: 2, pointerEvents: 'none'
    }} />
    {/* Left fade */}
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '20vw', height: '100vh',
      background: 'linear-gradient(to right, #0A0B0F 0%, transparent 100%)',
      zIndex: 2, pointerEvents: 'none'
    }} />
    {/* Right fade */}
    <div style={{
      position: 'fixed', top: 0, right: 0,
      width: '20vw', height: '100vh',
      background: 'linear-gradient(to left, #0A0B0F 0%, transparent 100%)',
      zIndex: 2, pointerEvents: 'none'
    }} />

    {/* ── TERMINAL HEADER ── */}
    <header style={{
      height: 48,
      background: '#0D0F14',
      borderBottom: '1px solid #2A2D3A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      width: '100%',
      flexShrink: 0,
      position: 'relative',
      zIndex: 20
    }}>

      {/* LEFT — Brand identity */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:2, height:16, background:'#C8993A', flexShrink:0 }} />
        <span style={{
          color:'#C8993A', fontFamily:'DM Sans, system-ui',
          fontSize:11, fontWeight:700, letterSpacing:'3px'
        }}>
          ACTIVATE RISK INTELLIGENCE
        </span>
        <div style={{ width:1, height:16, background:'#2A2D3A', margin:'0 12px' }} />
        <span style={{
          color:'#6B7394', fontFamily:'DM Sans, system-ui',
          fontSize:10, letterSpacing:'2px'
        }}>
          REGULATORY RISK MONITOR
        </span>
      </div>

      {/* CENTER — 4 live source status indicators */}
      <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        {[
          { label:'CONGRESS', status:'LIVE' },
          { label:'FCC',      status:'LIVE' },
          { label:'SENATE LDA', status:'LIVE' },
          { label:'FTC',      status:'LIVE' },
        ].map(({ label, status }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{
              width:5, height:5, borderRadius:'50%',
              background:'#00D4AA',
              boxShadow:'0 0 6px rgba(0,212,170,0.8)'
            }} />
            <span style={{
              fontSize:9, color:'#6B7394',
              fontFamily:'DM Sans, system-ui', letterSpacing:'1.5px'
            }}>
              {label}
            </span>
            <span style={{
              fontSize:9, color:'#00D4AA',
              fontFamily:'DM Sans, system-ui', letterSpacing:'1px'
            }}>
              {status}
            </span>
          </div>
        ))}
      </div>

      {/* RIGHT — Live UTC clock + location */}
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <span style={{
          fontSize:11, color:'#E0A030',
          fontFamily:'DM Mono, Courier New, monospace',
          letterSpacing:'1px'
        }}>
          {liveTime}
        </span>
        <div style={{ width:1, height:16, background:'#2A2D3A' }} />
        <span style={{
          fontSize:9, color:'#6B7394',
          fontFamily:'DM Sans, system-ui', letterSpacing:'2px'
        }}>
          WASHINGTON DC
        </span>
      </div>

    </header>

    {/* ── MAIN CONTENT — perfectly centered full width ── */}
    <main style={{
      position: 'relative', zIndex: 10,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px 60px',
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'center'
    }}>

      {/* Eyebrow pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 18px',
        border: '1px solid rgba(200,153,58,0.25)',
        borderRadius: 20, marginBottom: 32,
        background: 'rgba(200,153,58,0.06)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: '#C8993A'
        }} />
        <span style={{
          fontSize: 11, color: '#C8993A',
          fontFamily: 'DM Sans, system-ui',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 600
        }}>
          US Geopolitical Media Risk Intelligence
        </span>
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'Playfair Display, Georgia, serif',
        fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
        color: '#E8EAF0',
        fontWeight: 400,
        lineHeight: 1.1,
        marginBottom: 24,
        letterSpacing: '-0.02em',
        maxWidth: 1100
      }}>
        The identity risk exposure can be detected months in advance.
      </h1>

      {/* Sub-headline */}
      <p style={{
        fontSize: 'clamp(14px, 1.8vw, 17px)',
        color: '#6B7394',
        fontFamily: 'DM Sans, system-ui',
        lineHeight: 1.8,
        marginBottom: 48,
        maxWidth: 520
      }}>
        Every signal that preceded TikTok's near-ban was visible in public data
        months before the boardroom knew. This tool reads that data in real time.
      </p>

      {/* Input group */}
      <div style={{
        width: '100%',
        maxWidth: 640,
        marginBottom: 20
      }}>

        {/* Input field */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input
            type="text"
            value={companyName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Netflix, Spotify, JPMorgan Chase, Bank of America..."
            style={{
              width: '100%',
              padding: '18px 24px',
              background: 'rgba(18,20,26,0.85)',
              border: '1px solid rgba(200,153,58,0.25)',
              borderRadius: 8,
              color: '#E8EAF0',
              fontSize: 16,
              fontFamily: 'DM Sans, system-ui',
              outline: 'none',
              boxSizing: 'border-box',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.25s ease',
              letterSpacing: '0.2px'
            }}
            onFocus={e => {
              e.target.style.borderColor = '#C8993A'
              e.target.style.boxShadow = '0 0 0 3px rgba(200,153,58,0.12)'
              e.target.style.background = 'rgba(18,20,26,0.95)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(200,153,58,0.25)'
              e.target.style.boxShadow = 'none'
              e.target.style.background = 'rgba(18,20,26,0.85)'
            }}
          />
        </div>

        {/* CTA button */}
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '18px',
            background: isLoading ? '#6B7394' : '#C8993A',
            border: 'none',
            borderRadius: 8,
            color: '#0A0B0F',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: 'DM Sans, system-ui',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: isLoading ? 'none' : '0 4px 24px rgba(200,153,58,0.25)'
          }}
          onMouseEnter={e => {
            if (!isLoading) {
              e.target.style.background = '#D4A84A'
              e.target.style.boxShadow = '0 6px 32px rgba(200,153,58,0.4)'
              e.target.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={e => {
            e.target.style.background = isLoading ? '#6B7394' : '#C8993A'
            e.target.style.boxShadow = isLoading ? 'none' : '0 4px 24px rgba(200,153,58,0.25)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          {isLoading ? 'Analyzing...' : 'Generate Identity Risk Brief →'}
        </button>
      </div>

      {/* Quick select */}
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        gap: 8, justifyContent: 'center',
        marginBottom: 12
      }}>
        <span style={{
          fontSize: 11, color: '#6B7394',
          fontFamily: 'DM Sans, system-ui',
          alignSelf: 'center',
          marginRight: 4,
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Try:
        </span>
        {QUICK_SELECT.map(name => (
          <button
            key={name}
            onClick={() => handleQuickSelect(name)}
            style={{
              padding: '6px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              color: '#6B7394',
              fontSize: 13,
              fontFamily: 'DM Sans, system-ui',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = 'rgba(200,153,58,0.5)'
              e.target.style.color = '#C8993A'
              e.target.style.background = 'rgba(200,153,58,0.06)'
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.08)'
              e.target.style.color = '#6B7394'
              e.target.style.background = 'transparent'
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          fontSize: 13, color: '#E05A5A',
          fontFamily: 'DM Sans, system-ui',
          marginTop: 8,
          padding: '8px 16px',
          background: 'rgba(224,90,90,0.08)',
          borderRadius: 4,
          border: '1px solid rgba(224,90,90,0.2)'
        }}>
          {error}
        </div>
      )}

    </main>

    {/* ── TERMINAL FOOTER ── */}
    <footer style={{
      height: 48,
      background: '#0D0F14',
      borderTop: '1px solid #2A2D3A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      width: '100%',
      flexShrink: 0,
      position: 'relative',
      zIndex: 20
    }}>

      {/* LEFT — Source list plain text */}
      <span style={{
        fontSize:10, color:'#6B7394',
        fontFamily:'DM Sans, system-ui', letterSpacing:'1px'
      }}>
        Congress.gov · Federal Register · FCC ECFS · Senate LDA · FTC · NewsAPI
      </span>

      {/* RIGHT — Data freshness indicator */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{
          width:5, height:5, borderRadius:'50%',
          background:'#00D4AA',
          boxShadow:'0 0 6px rgba(0,212,170,0.8)'
        }} />
        <span style={{
          fontSize:10, color:'#6B7394',
          fontFamily:'DM Sans, system-ui', letterSpacing:'1.5px'
        }}>
          DATA REFRESHED ON DEMAND
        </span>
      </div>

    </footer>

    </div>
)
  }

  // Screen B: Loading
  if (isLoading) {
  // Color map for line types
  const lineColors = {
    agent:    '#C8993A',   // gold — agent actions
    data:     '#00D4AA',   // teal — real data results
    analysis: '#9CA3B8',   // muted blue — AI processing
    complete: '#2ECC8A',   // green — done
    error:    '#E05A5A',   // red — failure
    default:  '#6B7394'
  }

  const lineIcons = {
    agent:    '▸',
    data:     '◆',
    analysis: '◎',
    complete: '✓',
    error:    '✕',
    default:  '·'
  }

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      background: '#0A0B0F',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden'
    }}>

      {/* ── HEADER BAR — same as landing page ── */}
      <header style={{
        height: 48, background: '#0D0F14',
        borderBottom: '1px solid #1E2130',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px', flexShrink: 0
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:2, height:16, background:'#C8993A' }} />
          <span style={{
            color:'#C8993A', fontFamily:'DM Sans, system-ui',
            fontSize:11, fontWeight:700, letterSpacing:'3px'
          }}>
            ACTIVATE RISK INTELLIGENCE
          </span>
          <div style={{ width:1, height:16, background:'#2A2D3A', margin:'0 12px' }} />
          <span style={{
            color:'#6B7394', fontFamily:'DM Sans, system-ui',
            fontSize:10, letterSpacing:'2px'
          }}>
            INVESTIGATION IN PROGRESS
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width:6, height:6, borderRadius:'50%',
            background:'#E0A030',
            animation:'scanPulse 1.5s ease-in-out infinite'
          }} />
          <span style={{
            fontSize:10, color:'#E0A030',
            fontFamily:'DM Sans, system-ui', letterSpacing:'2px'
          }}>
            SCANNING {companyName.toUpperCase()}
          </span>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div style={{
        flex: 1, display: 'flex',
        flexDirection: 'column',
        maxWidth: 920, width: '100%',
        margin: '0 auto', padding: '48px 24px 24px'
      }}>

        {/* Company + spinner row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 20, marginBottom: 40
        }}>
          {/* Custom spinner */}
          <div style={{
            position: 'relative',
            width: 40, height: 40,
            flexShrink: 0
          }}>
            {/* Outer ring — slow clockwise */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '1px solid #1E2130',
              borderTop: '1px solid #C8993A',
              borderRight: '1px solid rgba(200,153,58,0.3)',
              animation: 'radarSpin 2s linear infinite'
            }} />

            {/* Middle ring — faster counter-clockwise */}
            <div style={{
              position: 'absolute', inset: 6,
              borderRadius: '50%',
              border: '1px solid #1E2130',
              borderBottom: '1px solid #C8993A',
              borderLeft: '1px solid rgba(200,153,58,0.2)',
              animation: 'radarSpinReverse 1.4s linear infinite'
            }} />

            {/* Inner dot — slow pulse */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 6, height: 6,
              borderRadius: '50%',
              background: '#C8993A',
              boxShadow: '0 0 8px rgba(200,153,58,0.8)',
              animation: 'radarPing 2s ease-in-out infinite'
            }} />
          </div>

          <div>
            <div style={{
              fontSize: 22,
              fontFamily: 'Playfair Display, Georgia, serif',
              color: '#E8EAF0', fontWeight: 400, marginBottom: 4
            }}>
              Investigating {companyName}
            </div>
            <div style={{
              fontSize: 11, color: '#6B7394',
              fontFamily: 'DM Sans, system-ui', letterSpacing: '2px'
            }}>
              MULTI-AGENT REGULATORY ANALYSIS
            </div>
          </div>
        </div>

        {/* ── INVESTIGATION FEED ── */}
        <div style={{
          background: '#0D0F14',
          border: '1px solid #1E2130',
          flex: 1, padding: '20px 24px',
          overflowY: 'auto',
          whiteSpace: 'nowrap',
          overflowX: 'hidden',
          fontFamily: 'DM Mono, Courier New, monospace'
        }}>

          {/* Feed header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 20,
            paddingBottom: 12, borderBottom: '1px solid #1E2130'
          }}>
            <div style={{
              fontSize: 9, color: '#6B7394',
              letterSpacing: '3px', textTransform: 'uppercase',
              fontFamily: 'DM Sans, system-ui'
            }}>
              INVESTIGATION LOG
            </div>
            <div style={{
              fontSize: 9, color: '#6B7394',
              fontFamily: 'DM Sans, system-ui', letterSpacing: '1px'
            }}>
              {feedLines.length} EVENTS
            </div>
          </div>

          {/* Feed lines */}
          {(() => {
            const getLineColor = (line) => {
              if (line.type === 'complete') return '#2ECC8A'
              if (line.type === 'error')    return '#E05A5A'
              if (line.state === 'complete') return '#8A6A28'
              return '#9CA3B8'   // ALL lines type in same muted color
            }

            return feedLines.map((line) => (
              <div
                key={line.id}
                style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  marginBottom: 10,
                  animation: 'fadeInLine 0.3s ease-out both'
                }}
              >
                {/* Timestamp */}
                <span style={{
                  width: 80,        // ← fixed width
                  flexShrink: 0,
                  fontSize: 10,
                  color: '#2A2D3A',
                  letterSpacing: '0.5px',
                  fontFamily: 'DM Mono, Courier New, monospace'
                }}>
                  {line.timestamp}
                </span>

                {/* Active line indicator */}
                <div style={{
                  width: 20,        // ← fixed width, never changes
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeFeedId === line.id ? (
                    /* Active dot — pulsing, moves with current line */
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#C8993A',
                      boxShadow: '0 0 10px #C8993A, 0 0 20px rgba(200,153,58,0.4)',
                      animation: 'activeDotPulse 0.8s ease-in-out infinite',
                      flexShrink: 0
                    }} />
                  ) : line.state === 'complete' ? (
                    /* Completed — small dim dot */
                    <div style={{
                      width: 3, height: 3, borderRadius: '50%',
                      background: '#2A2D3A', flexShrink: 0
                    }} />
                  ) : (
                    /* Not yet started — nothing */
                    null
                  )}
                </div>

                {/* Message */}
                <span style={{
                  fontSize: 12,
                  color: getLineColor(line),
                  lineHeight: 1.5,
                  letterSpacing: '0.3px',
                  transition: 'color 0.4s ease',   // smooth fade to gold when complete
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {line.message}
                  {/* Inline cursor only shows while line is still typing */}
                  {line.state === 'typing' && (
                    <span style={{
                      display: 'inline-block',
                      width: 6, height: 12,
                      background: '#C8993A',  // Always gold cursor
                      marginLeft: 2,
                      verticalAlign: 'middle',
                      animation: 'cursorBlink 0.7s ease-in-out infinite'
                    }} />
                  )}
                </span>
              </div>
            ))
          })()}

          {/* Blinking cursor at end */}
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center',
            marginTop: 4
          }}>
            <span style={{
              fontSize: 10, color: '#2A2D3A'
            }}>
              {new Date().toISOString().slice(11,19)} UTC
            </span>
            <span style={{
              fontSize: 12, color: '#C8993A',
              animation: 'cursorBlink 1s ease-in-out infinite'
            }}>
              █
            </span>
          </div>

          <div ref={feedEndRef} />

        </div>

        {/* Bottom note */}
        <div style={{
          marginTop: 16, textAlign: 'center',
          fontSize: 11, color: '#6B7394',
          fontFamily: 'DM Sans, system-ui', letterSpacing: '1px'
        }}>
          Scanning government agencies · Intelligence analysis in progress
        </div>

      </div>

      {/* ── FOOTER BAR ── */}
      <footer style={{
        height: 40, background: '#0D0F14',
        borderTop: '1px solid #1E2130',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0
      }}>
        <span style={{
          fontSize: 10, color: '#6B7394',
          fontFamily: 'DM Sans, system-ui', letterSpacing: '1px'
        }}>
          Congress.gov · Federal Register · FCC ECFS · Senate LDA · FTC · NewsAPI
        </span>
      </footer>

    </div>
  )
}

  // Screen C: Results
  const vel = claudeResult?.velocityIndicator || {}
  const maxSignals = Math.max(vel.thirtyDaySignals||0, vel.ninetyDaySignals||0, vel.oneEightyDaySignals||0, vel.historicalSignals||0, 1)
  const velBars = [
    { label:'LAST 30D', count: vel.thirtyDaySignals||0,    color:'#E07830' },
    { label:'30–90D',   count: vel.ninetyDaySignals||0,    color:'#E0A030' },
    { label:'90–180D',  count: vel.oneEightyDaySignals||0, color:'#C8993A' },
    { label:'180D+',    count: vel.historicalSignals||0,   color:'#6B7394' },
  ]
  const getTrend = (t) => {
    if (t === 'ACCELERATING') return { icon:'↑', label:'ACCELERATING', color:'#E07830' }
    if (t === 'DECELERATING') return { icon:'↓', label:'DECELERATING', color:'#2ECC8A' }
    return { icon:'→', label:'STABLE', color:'#6B7394' }
  }
  const trendDisplay = getTrend(vel.trend)
  const multiplier = vel.multiplier || 0
  const thirtyDay = vel.thirtyDaySignals || 0
  const historical = vel.historicalSignals || 0
  const getVelDisplay = (trend, multiplier) => {
    const m = (multiplier || 1).toFixed(1)
    if (trend === 'ACCELERATING') return { icon:'↑', text: m + '×', color:'#E07830' }
    if (trend === 'DECELERATING') return { icon:'↓', text: m + '×', color:'#2ECC8A' }
    return { icon:'→', text:'1.0×', color:'#6B7394' }
  }
  const getPriorityColor = (priority) => {
    const p = (priority || '').toLowerCase()
    if (p.includes('immediate')) return '#E05A5A'
    if (p.includes('30'))        return '#E0A030'
    return '#6B7394'
  }
  const getRelativeRiskDisplay = (r) => {
    const v = (r || '').toLowerCase()
    if (v.includes('higher') || v.includes('greater') || v.includes('more'))
      return { icon:'▲', label:'Higher',  color:'#E05A5A' }
    if (v.includes('lower') || v.includes('less'))
      return { icon:'▼', label:'Lower',   color:'#2ECC8A' }
    return   { icon:'≈', label:'Similar', color:'#E0A030' }
  }
  const getLobbyingDisplay = (l) => {
    const v = (l || '').toLowerCase()
    if (v.includes('active') || v.includes('high') || v.includes('strong'))
      return { color:'#2ECC8A', label:'● Active' }
    if (v.includes('moderate') || v.includes('medium') || v.includes('some'))
      return { color:'#E0A030', label:'◐ Moderate' }
    if (v.includes('absent') || v.includes('none') || v.includes('low') || v.includes('minimal'))
      return { color:'#E05A5A', label:'○ Absent' }
    return   { color:'#6B7394', label:'? Unknown' }
  }
  const formatFullTimestamp = (iso) => {
    try {
      const d = new Date(iso)
      return d.toLocaleDateString('en-US', {
        month:'long', day:'numeric', year:'numeric'
      }) + ' at ' + d.toISOString().slice(11,16) + ' UTC'
    } catch { return 'Recently' }
  }

  const getHeatmapData = (risks) => {
    // Extract category and severity from risk titles and descriptions
    // Map each risk to one of 5 regulatory domains
    const domains = [
      'Content & Media',
      'Antitrust',
      'Data & Privacy',
      'Consumer Protection',
      'Broadcasting'
    ]

    // Score each domain based on which risks mention it
    // severity: CRITICAL=4, HIGH=3, MODERATE-HIGH=2.5, MODERATE=2, LOW=1
    const severityScore = (s) => {
      const v = (s || '').toUpperCase()
      if (v.includes('CRITICAL'))        return 4
      if (v === 'HIGH')                  return 3
      if (v.includes('MODERATE-HIGH') || v.includes('MODERATE+HIGH')) return 2.5
      if (v.includes('MODERATE'))        return 2
      return 1
    }

    // Map risk titles/descriptions to domains
    const domainKeywords = {
      'Content & Media':    ['content','media','broadcast','streaming','sports','copyright','music'],
      'Antitrust':          ['antitrust','competition','monopol','market power','merger'],
      'Data & Privacy':     ['data','privacy','personal','COPPA','sensitive','broker'],
      'Consumer Protection':['consumer','subscription','negative option','deceptive','cancel'],
      'Broadcasting':       ['FCC','broadcast','spectrum','license','radio','television']
    }

    return domains.map(domain => {
      let maxScore = 0
      let matchedRisk = null
      const keywords = domainKeywords[domain]

      ;(risks || []).forEach(risk => {
        const text = ((risk.title || '') + ' ' +
                      (risk.description || '') + ' ' +
                      (risk.specificDataPoint || '')).toLowerCase()
        const matches = keywords.some(kw => text.includes(kw))
        if (matches) {
          const score = severityScore(risk.severity)
          if (score > maxScore) {
            maxScore = score
            matchedRisk = risk
          }
        }
      })

      return {
        domain,
        score: maxScore,
        severity: maxScore >= 3 ? 'HIGH'
                : maxScore >= 2 ? 'MODERATE'
                : maxScore > 0  ? 'LOW'
                : 'NONE',
        source: matchedRisk?.source || null
      }
    }).filter(d => d.score > 0) // only show domains with active signals
  }

  const getStatusPipeline = (risk) => {
    // Detect which pipeline track this risk is on
    const text = (
      (risk.title || '') + ' ' +
      (risk.source || '') + ' ' +
      (risk.description || '') + ' ' +
      (risk.specificDataPoint || '')
    ).toLowerCase()

    // FTC/FCC enforcement track
    const isEnforcement =
      text.includes('ftc') || text.includes('fcc') ||
      text.includes('enforcement') || text.includes('action') ||
      text.includes('proceeding')

    // DOJ/legislative track
    const isLegislative =
      text.includes('congress') || text.includes('bill') ||
      text.includes('senate') || text.includes('house') ||
      text.includes('act') || text.includes('legislation')

    if (isEnforcement) {
      const stages = [
        'Investigation',
        'Proposed Rule',
        'Comment Period',
        'Final Rule',
        'Enforcement'
      ]
      // Detect current stage from text
      let activeIndex = 0
      if (text.includes('final rule') || text.includes('finalized')) activeIndex = 3
      else if (text.includes('comment') || text.includes('seeking comment')) activeIndex = 2
      else if (text.includes('proposed') || text.includes('notice')) activeIndex = 1
      else if (text.includes('enforcement') || text.includes('action')) activeIndex = 4
      return { stages, activeIndex, track: 'enforcement' }
    }

    // Default: legislative track
    const stages = ['Draft', 'Committee', 'Public Comment', 'Rulemaking', 'Final Rule']
    let activeIndex = 0
    if (text.includes('final rule') || text.includes('enacted')) activeIndex = 4
    else if (text.includes('rulemaking')) activeIndex = 3
    else if (text.includes('comment') || text.includes('public comment')) activeIndex = 2
    else if (text.includes('committee') || text.includes('hearing')) activeIndex = 1
    return { stages, activeIndex, track: 'legislative' }
  }

  // Momentum status — replaces risk score label
  const getMomentumStatus = (multiplier, riskLevel) => {
    if (multiplier >= 3 || riskLevel === 'CRITICAL')
      return { label: 'PRESSURE BUILDING', color: '#E05A5A', urgency: 'ACT NOW' }
    if (multiplier >= 2 || riskLevel === 'HIGH')
      return { label: 'ACCELERATING', color: '#E07830', urgency: 'ACT THIS QUARTER' }
    if (multiplier >= 1.2 || riskLevel === 'MODERATE')
      return { label: 'MONITORING', color: '#E0A030', urgency: 'WATCH CLOSELY' }
    return { label: 'STABLE', color: '#2ECC8A', urgency: 'TRACK QUARTERLY' }
  }
  const momentum = getMomentumStatus(multiplier, claudeResult?.riskLevel)

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes expandWidth {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes countUp {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes barGrow {
          from { width: 0; }
          to   { width: var(--bar-width); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes momentumPulse {
          0%   { box-shadow: 0 0 0 0 rgba(224,120,48,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(224,120,48,0); }
          100% { box-shadow: 0 0 0 0 rgba(224,120,48,0); }
        }
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dialFill {
          from { stroke-dashoffset: 220; }
          to   { stroke-dashoffset: var(--target-offset); }
        }
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes scanPulse {
          0%   { opacity: 0.4; }
          50%  { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes activeDotPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.7;
          }
        }
        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes radarSpinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes radarPing {
          0%   { transform: scale(0.8); opacity: 0.8; }
          50%  { transform: scale(1.1); opacity: 0.3; }
          100% { transform: scale(0.8); opacity: 0.8; }
        }
      `}</style>
      <div style={{ background: '#0A0B0F', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* ── ZONE A: SITUATION BRIEF ── */}
        <div style={{
          marginBottom: 24,
          animation: 'fadeUp 0.5s ease-out both'
        }}>

          {/* ── COMPANY HEADER ROW ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
            paddingBottom: 20,
            borderBottom: '1px solid #1E2130'
          }}>

            {/* LEFT — identity */}
            <div style={{ animation: 'slideInLeft 0.4s ease-out 0.1s both' }}>

              {/* Label */}
              <div style={{
                fontSize: 10, color: '#6B7394',
                letterSpacing: '3px', textTransform: 'uppercase',
                fontFamily: 'DM Sans, system-ui', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <div style={{
                  width: 2, height: 12,
                  background: '#C8993A', flexShrink: 0
                }} />
                US REGULATORY RISK INTELLIGENCE
              </div>

              {/* Company name */}
              <div style={{
                fontSize: 40,
                fontFamily: 'Playfair Display, Georgia, serif',
                color: '#E8EAF0', fontWeight: 'bold',
                lineHeight: 1.05, marginBottom: 10,
                letterSpacing: '-0.02em'
              }}>
                {claudeResult?.companyName || 'Company'}
              </div>

              {/* Data strip */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 11, color: '#6B7394',
                fontFamily: 'DM Sans, system-ui'
              }}>
                {/* Live dot */}
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#00D4AA',
                  boxShadow: '0 0 6px rgba(0,212,170,0.8)',
                  flexShrink: 0
                }} />
                <span style={{ color: '#00D4AA', letterSpacing: '1px', fontSize: 10 }}>
                  LIVE
                </span>
                <span style={{ color: '#2A2D3A' }}>·</span>
                <span>
                  {claudeResult?.dataQuality?.totalDataPoints || 0} data points
                </span>
                <span style={{ color: '#2A2D3A' }}>·</span>
                <span>
                  {claudeResult?.dataQuality?.sourcesSucceeded || 0}/6 sources
                </span>
                <span style={{ color: '#2A2D3A' }}>·</span>
                <span>
                  {(() => {
                    try {
                      return new Date(claudeResult?.analysisTimestamp)
                        .toISOString().slice(11,16) + ' UTC'
                    } catch { return 'Recently' }
                  })()}
                </span>
              </div>
            </div>

            {/* RIGHT — reset */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-end', gap: 6,
              animation: 'fadeUp 0.4s ease-out 0.2s both'
            }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '8px 20px',
                  background: 'transparent',
                  border: '1px solid #2A2D3A',
                  borderRadius: 0,
                  color: '#E8EAF0',
                  fontSize: 11,
                  fontFamily: 'DM Sans, system-ui',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.borderColor = '#C8993A'
                  e.target.style.color = '#C8993A'
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = '#2A2D3A'
                  e.target.style.color = '#E8EAF0'
                }}
              >
                ← New Analysis
              </button>
              <div style={{
                fontSize: 10, color: '#6B7394',
                fontFamily: 'DM Sans, system-ui', letterSpacing: '1px'
              }}>
                Run another company
              </div>
            </div>
          </div>

          {/* ── EXECUTIVE SUMMARY ── */}
          <div style={{
            position: 'relative',
            background: '#12141A',
            borderRadius: 0,
            overflow: 'hidden',
            animation: 'fadeUp 0.6s ease-out 0.25s both'
          }}>

            {/* Animated top border — scans left to right on load */}
            <div style={{
              position: 'absolute', top: 0, left: 0, height: 1,
              background: 'linear-gradient(to right, #C8993A, #E0A030, #C8993A)',
              animation: 'expandWidth 0.8s ease-out 0.4s both',
              width: '0%'  /* starts at 0, animates to 100% */
            }} />

            {/* Left accent bar */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: 3, background: '#C8993A'
            }} />

            {/* Content */}
            <div style={{ padding: '28px 28px 28px 32px' }}>

              {/* Label row with risk level badge inline */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 16
              }}>
                <div style={{
                  fontSize: 10, color: '#6B7394',
                  letterSpacing: '3px', textTransform: 'uppercase',
                  fontFamily: 'DM Sans, system-ui'
                }}>
                  EXECUTIVE SUMMARY
                </div>

                {/* Risk badge sits inline with label — not below score */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '4px 14px',
                  border: '1px solid ' + getRiskColor(claudeResult?.riskLevel) + '50',
                  background: getRiskColor(claudeResult?.riskLevel) + '12'
                }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: getRiskColor(claudeResult?.riskLevel)
                  }} />
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: getRiskColor(claudeResult?.riskLevel),
                    fontFamily: 'DM Sans, system-ui',
                    letterSpacing: '2px', textTransform: 'uppercase'
                  }}>
                    {claudeResult?.riskLevel || 'UNKNOWN'} RISK
                  </span>
                </div>
              </div>

              {/* The 2-sentence brief — Situation + Complication */}
              <div style={{
                fontSize: 17,
                fontFamily: 'Playfair Display, Georgia, serif',
                color: '#E8EAF0', lineHeight: 1.8,
                maxWidth: 780,
                animation: 'fadeUp 0.5s ease-out 0.5s both'
              }}>
                {claudeResult?.executiveSummary || 'Analysis unavailable.'}
              </div>

              {/* Bottom meta row */}
              <div style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid #1E2130',
                display: 'flex', gap: 24, alignItems: 'center'
              }}>
                {[
                  {
                    label: 'PIPELINE STAGE',
                    value: claudeResult?.pipelineStage || '—'
                  },
                  {
                    label: 'RISK WINDOW',
                    value: claudeResult?.regulatoryWindow?.range || '—'
                  },
                  {
                    label: 'VELOCITY',
                    value: (claudeResult?.velocityIndicator?.multiplier || 0)
                      .toFixed(1) + '× baseline'
                  },
                  {
                    label: 'TRIGGER',
                    value: claudeResult?.regulatoryWindow?.namedTrigger || '—'
                  },
                ].map(({ label, value }, i) => (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column', gap: 3,
                    paddingRight: 24,
                    borderRight: i < 3 ? '1px solid #1E2130' : 'none'
                  }}>
                    <div style={{
                      fontSize: 9, color: '#6B7394',
                      fontFamily: 'DM Sans, system-ui',
                      letterSpacing: '2px', textTransform: 'uppercase'
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontSize: 13, color: '#E8EAF0',
                      fontFamily: 'DM Mono, Courier New, monospace',
                      fontWeight: 500
                    }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Placeholder Blocks */}
        <div style={{ background:'#12141A', borderRadius:8, padding:24, marginBottom:16, display:'flex', gap:24 }}>

  {/* Column 1 — Risk Momentum */}
  <div style={{ flex: '0 0 38%', paddingRight: 24 }}>

    {/* ── COLUMN LABEL ── */}
    <div style={{
      fontSize: 10, color: '#6B7394',
      letterSpacing: '3px', textTransform: 'uppercase',
      fontFamily: 'DM Sans, system-ui', marginBottom: 20
    }}>
      RISK MOMENTUM
    </div>

    {/* ── VELOCITY MULTIPLIER — hero number ── */}
    <div style={{
      marginBottom: 4,
      animation: 'riseUp 0.5s ease-out 0.2s both'
    }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2
      }}>
        {/* The arrow — direction signal */}
        <span style={{
          fontSize: 28,
          color: trendDisplay.color,
          fontFamily: 'DM Sans, system-ui',
          fontWeight: 300,
          lineHeight: 1
        }}>
          {trendDisplay.icon}
        </span>

        {/* The multiplier — number that matters */}
        <span style={{
          fontSize: 56,
          fontFamily: 'DM Mono, Courier New, monospace',
          fontWeight: 'bold',
          color: trendDisplay.color,
          lineHeight: 1,
          letterSpacing: '-2px'
        }}>
          {multiplier.toFixed(1)}
        </span>

        <span style={{
          fontSize: 18,
          color: '#6B7394',
          fontFamily: 'DM Mono, Courier New, monospace',
          marginBottom: 4
        }}>
          ×
        </span>
      </div>

      {/* What number means */}
      <div style={{
        fontSize: 11, color: '#6B7394',
        fontFamily: 'DM Sans, system-ui',
        letterSpacing: '1px', marginBottom: 16
      }}>
        ABOVE HISTORICAL BASELINE
      </div>
    </div>

    {/* ── MOMENTUM STATUS BADGE ── */}
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 14px',
      border: '1px solid ' + momentum.color + '50',
      background: momentum.color + '10',
      marginBottom: 20,
      animation: multiplier >= 3
        ? 'momentumPulse 2s ease-in-out infinite'
        : 'none'
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: '50%',
        background: momentum.color,
        boxShadow: `0 0 8px ${momentum.color}` 
      }} />
      <span style={{
        fontSize: 10, fontWeight: 700,
        color: momentum.color,
        fontFamily: 'DM Sans, system-ui',
        letterSpacing: '2px', textTransform: 'uppercase'
      }}>
        {momentum.label}
      </span>
    </div>

    {/* ── SIGNAL COMPARISON — proof behind the number ── */}
    <div style={{
      marginBottom: 20,
      padding: '14px 16px',
      background: 'rgba(255,255,255,0.02)',
      borderLeft: '2px solid #1E2130'
    }}>
      <div style={{
        fontSize: 9, color: '#6B7394', letterSpacing: '2px',
        textTransform: 'uppercase', fontFamily: 'DM Sans',
        marginBottom: 10
      }}>
        SIGNAL COMPARISON
      </div>

      {/* Last 30 days vs historical */}
      {[
        {
          label: 'LAST 30 DAYS',
          count: vel.thirtyDaySignals || 0,
          max: Math.max(vel.thirtyDaySignals || 0, vel.historicalSignals || 0, 1),
          color: trendDisplay.color,
          highlight: true
        },
        {
          label: 'HISTORICAL AVG',
          count: Math.round((vel.historicalSignals || 0) / 6),
          max: Math.max(vel.thirtyDaySignals || 0, vel.historicalSignals || 0, 1),
          color: '#2A2D3A',
          highlight: false
        }
      ].map((row, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center',
          gap: 8, marginBottom: i === 0 ? 8 : 0
        }}>
          <div style={{
            width: 72, flexShrink: 0,
            fontSize: 9, color: row.highlight ? row.color : '#6B7394',
            fontFamily: 'DM Sans', letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            {row.label}
          </div>
          <div style={{
            flex: 1, height: 4,
            background: '#1E2130',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0,
              height: '100%',
              width: Math.round((row.count / row.max) * 100) + '%',
              background: row.highlight ? row.color : '#2A2D3A',
              transition: 'width 0.8s ease-out',
              boxShadow: row.highlight
                ? `0 0 6px ${row.color}60` : 'none'
            }} />
          </div>
          <div style={{
            width: 24, textAlign: 'right', flexShrink: 0,
            fontSize: 11, color: row.highlight ? row.color : '#6B7394',
            fontFamily: 'DM Mono', fontWeight: row.highlight ? 'bold' : 400
          }}>
            {row.count}
          </div>
        </div>
      ))}
    </div>

    {/* ── URGENCY RECOMMENDATION ── */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px',
      background: momentum.color + '08',
      borderLeft: '2px solid ' + momentum.color
    }}>
      <span style={{
        fontSize: 9, color: momentum.color,
        fontFamily: 'DM Sans', letterSpacing: '2px',
        textTransform: 'uppercase', fontWeight: 700
      }}>
        {momentum.urgency}
      </span>
    </div>

  </div>

  {/* Column 2 — Pipeline Stage */}
  <div style={{ flex:'0 0 28%' }}>
    <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:12 }}>
      PIPELINE STAGE
    </div>
    <div style={{ display:'flex', flexDirection:'column' }}>
      {['Stable','Monitoring','Pre-Crisis','Crisis Active'].map((stage, i, arr) => (
        <div key={stage}>
          <div style={{ padding:'6px 12px', borderRadius:4, fontSize:13, fontFamily:'DM Sans, system-ui', fontWeight:500, textAlign:'center', background: stage === claudeResult?.pipelineStage ? getRiskColor(claudeResult?.riskLevel) : 'transparent', color: stage === claudeResult?.pipelineStage ? '#0A0B0F' : '#6B7394', border: stage === claudeResult?.pipelineStage ? 'none' : '1px solid #1E2130', fontWeight: stage === claudeResult?.pipelineStage ? 'bold' : 500 }}>
            {stage}
          </div>
          {i < arr.length - 1 && <div style={{ width:1, height:12, background:'#1E2130', margin:'0 auto' }} />}
        </div>
      ))}
    </div>
  </div>

  {/* Column 3 — Regulatory Window */}
  <div style={{ flex:1 }}>
    <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:12 }}>
      REGULATORY WINDOW
    </div>
    <div style={{ fontSize:28, fontFamily:'Playfair Display, Georgia, serif', color:'#E8EAF0', fontWeight:'bold', marginBottom:12 }}>
      {claudeResult?.regulatoryWindow?.range || '—'}
    </div>
    <div style={{ display:'flex', alignItems:'flex-start', gap:6, marginBottom:10 }}>
      <span style={{ fontSize:14, color:'#E0A030', flexShrink:0 }}>⚡</span>
      <span style={{ fontSize:13, color:'#E0A030', fontFamily:'DM Sans, system-ui', lineHeight:1.5 }}>
        {claudeResult?.regulatoryWindow?.namedTrigger || '—'}
      </span>
    </div>
    <div style={{ fontSize:12, color:'#6B7394', fontFamily:'DM Sans, system-ui', fontStyle:'italic', lineHeight:1.5 }}>
      {claudeResult?.regulatoryWindow?.triggerEvent || '—'}
    </div>
  </div>

</div>
        
        <div style={{ background:'#12141A', borderRadius:8, padding:24, marginBottom:16, display:'flex', gap:32 }}>

  {/* Left — Trend + Multiplier */}
  <div style={{ flex:'0 0 32%' }}>
    <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:16 }}>
      REGULATORY VELOCITY
    </div>
    <div style={{ fontSize:20, fontWeight:'bold', color:trendDisplay.color, fontFamily:'DM Sans, system-ui', marginBottom:8 }}>
      {trendDisplay.icon} {trendDisplay.label}
    </div>
    <div style={{ fontSize:40, fontWeight:'bold', color:trendDisplay.color, fontFamily:'DM Mono, Courier New, monospace', lineHeight:1, marginBottom:4 }}>
      {(vel.multiplier || 0).toFixed(1)}×
    </div>
    <div style={{ fontSize:12, color:'#6B7394', fontFamily:'DM Sans, system-ui', marginBottom:12 }}>
      baseline
    </div>
    <div style={{ fontSize:13, color:'#6B7394', fontFamily:'DM Sans, system-ui', fontStyle:'italic', lineHeight:1.6 }}>
      {vel.interpretation || ''}
    </div>
  </div>

  {/* Right — Signal Bars */}
  <div style={{ flex:1 }}>
    <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:16 }}>
      SIGNAL TIMELINE
    </div>
    {velBars.map((bar) => (
      <div key={bar.label} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <div style={{ width:64, flexShrink:0, fontSize:10, color:'#6B7394', fontFamily:'DM Sans, system-ui', textTransform:'uppercase', letterSpacing:'1px' }}>
          {bar.label}
        </div>
        <div style={{ flex:1, height:8, background:'#1E2130', borderRadius:4, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, height:'100%', borderRadius:4, background:bar.color, width: Math.round((bar.count / maxSignals) * 100) + '%', transition:'width 0.6s ease' }} />
        </div>
        <div style={{ width:32, textAlign:'right', flexShrink:0, fontSize:12, color:bar.color, fontFamily:'DM Mono, Courier New, monospace' }}>
          {bar.count}
        </div>
      </div>
    ))}
    <div style={{ fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui', marginTop:8 }}>
      Weight: 30d = 1.0× · 90d = 0.7× · 180d = 0.4× · 180d+ = 0.1×
    </div>
  </div>

</div>
        
        <div style={{ background:'#12141A', borderRadius:8, marginBottom:16, display:'flex', overflow:'hidden' }}>
  <div style={{ width:4, flexShrink:0, background:'#C8993A' }} />
  <div style={{ flex:1, padding:24 }}>
    <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:12 }}>
      EXECUTIVE SUMMARY
    </div>
    <div style={{ fontSize:17, fontFamily:'Playfair Display, Georgia, serif', color:'#E8EAF0', lineHeight:1.7 }}>
      {claudeResult?.executiveSummary || 'Summary unavailable.'}
    </div>
  </div>
</div>
        
        {/* ── REGULATORY HEATMAP ── */}
        {(() => {
          const heatmap = getHeatmapData(claudeResult?.regulatoryRisks)
          if (!heatmap || heatmap.length === 0) return null
          const maxScore = Math.max(...heatmap.map(d => d.score), 1)

          return (
            <div style={{
              background: '#12141A',
              borderRadius: 0,
              padding: '20px 24px',
              marginBottom: 16,
              borderLeft: '3px solid #1E2130',
              animation: 'fadeUp 0.5s ease-out 0.3s both'
            }}>

              {/* Header row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 18
              }}>
                <div style={{
                  fontSize: 10, color: '#6B7394',
                  letterSpacing: '3px', textTransform: 'uppercase',
                  fontFamily: 'DM Sans, system-ui'
                }}>
                  REGULATORY EXPOSURE MAP
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  fontSize: 9, color: '#6B7394',
                  fontFamily: 'DM Sans, system-ui', letterSpacing: '1px'
                }}>
                  {[
                    { label: 'HIGH',     color: '#E05A5A' },
                    { label: 'MODERATE', color: '#E0A030' },
                    { label: 'LOW',      color: '#2ECC8A' },
                  ].map(({ label, color }) => (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center', gap: 5
                    }}>
                      <div style={{
                        width: 8, height: 2,
                        background: color
                      }} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap bars */}
              {heatmap.map((item, i) => {
                const barColor =
                  item.severity === 'HIGH'     ? '#E05A5A' :
                  item.severity === 'MODERATE' ? '#E0A030' : '#2ECC8A'
                const barPct = Math.round((item.score / 4) * 100)

                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center',
                    gap: 12, marginBottom: i < heatmap.length - 1 ? 10 : 0
                  }}>
                    {/* Domain label */}
                    <div style={{
                      width: 140, flexShrink: 0,
                      fontSize: 11, color: '#9CA3B8',
                      fontFamily: 'DM Sans, system-ui',
                      letterSpacing: '0.5px'
                    }}>
                      {item.domain}
                    </div>

                    {/* Bar track */}
                    <div style={{
                      flex: 1, height: 6,
                      background: '#1E2130',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Animated fill */}
                      <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        background: barColor,
                        width: barPct + '%',
                        animation: `barGrow 0.7s ease-out ${0.4 + i * 0.1}s both`,
                        '--bar-width': barPct + '%',
                        boxShadow: `0 0 8px ${barColor}40` 
                      }} />
                    </div>

                    {/* Severity label */}
                    <div style={{
                      width: 70, flexShrink: 0, textAlign: 'right',
                      fontSize: 10, color: barColor,
                      fontFamily: 'DM Sans, system-ui',
                      fontWeight: 600, letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      {item.severity}
                    </div>
                  </div>
                )
              })}

            </div>
          )
        })()}
        
        <div style={{ marginBottom:16 }}>
  <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:12 }}>
    REGULATORY RISKS
  </div>
  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
    {(claudeResult?.regulatoryRisks || []).map((risk, i) => (
      <div key={i} style={{ background:'#12141A', borderRadius:8, overflow:'hidden', border:'1px solid #1E2130', display:'flex', flexDirection:'column', whiteSpace:'nowrap' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'16px' }}>
          {/* Left side - Severity badge + Velocity */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, minWidth:280 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:12, background:getRiskColor(risk.severity)+'1F', border:'1px solid '+getRiskColor(risk.severity)+'40' }}>
              <span style={{ fontSize:11, fontWeight:'bold', color:getRiskColor(risk.severity), fontFamily:'DM Sans, system-ui', textTransform:'uppercase' }}>
                ● {risk.severity || 'UNKNOWN'}
              </span>
            </div>
            <span style={{ fontSize:12, fontWeight:'bold', color:getVelDisplay(risk.velocityTrend, risk.velocityMultiplier).color, fontFamily:'DM Mono, Courier New, monospace' }}>
              {getVelDisplay(risk.velocityTrend, risk.velocityMultiplier).icon} {getVelDisplay(risk.velocityTrend, risk.velocityMultiplier).text}
            </span>
          </div>

          {/* Risk title */}
          <div style={{ fontSize:15, fontFamily:'Playfair Display, Georgia, serif', color:'#E8EAF0', fontWeight:'bold', lineHeight:1.3, marginBottom:8, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {risk.title || 'Regulatory Risk'}
          </div>

          {/* Source link */}
          <div style={{ marginBottom:8 }}>
            {risk.sourceUrl || risk.source_url || risk.link ? (
              <a 
                href={risk.sourceUrl || risk.source_url || risk.url || risk.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize:11, color:'#C8993A', fontFamily:'DM Sans, system-ui',
                  textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4
                }}
              >
                📡 {risk.source || 'Source'} ↗
              </a>
            ) : (
              <div style={{ fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui' }}>
                📡 {risk.source || 'Multiple Sources'}
              </div>
            )}
          </div>

          {/* Status pipeline */}
          {(() => {
            const pipeline = getStatusPipeline(risk)
            const activeColor = getRiskColor(risk.severity)
            return (
              <div style={{ marginTop:4, marginBottom:4 }}>
                {/* Stage track */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  marginBottom: 6
                }}>
                  {pipeline.stages.map((stage, si) => {
                    const isActive = si === pipeline.activeIndex
                    const isPast   = si < pipeline.activeIndex
                    const isLast   = si === pipeline.stages.length - 1

                    return (
                      <div key={si} style={{
                        display: 'flex', alignItems: 'center', flex: isLast ? 0 : 1
                      }}>
                        {/* Stage dot */}
                        <div style={{
                          width: isActive ? 8 : 6,
                          height: isActive ? 8 : 6,
                          borderRadius: '50%',
                          flexShrink: 0,
                          background: isActive ? activeColor
                                     : isPast  ? activeColor + '60'
                                     : '#2A2D3A',
                          boxShadow: isActive
                            ? `0 0 8px ${activeColor}80` 
                            : 'none',
                          transition: 'all 0.2s ease'
                        }} />

                        {/* Connector line */}
                        {!isLast && (
                          <div style={{
                            flex: 1, height: 1,
                            background: isPast
                              ? activeColor + '40'
                              : '#1E2130'
                          }} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Active stage label */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: 9, color: activeColor,
                    fontFamily: 'DM Sans, system-ui',
                    letterSpacing: '1.5px', textTransform: 'uppercase',
                    fontWeight: 600
                  }}>
                    ● {pipeline.stages[pipeline.activeIndex]}
                  </span>
                  <span style={{
                    fontSize: 9, color: '#6B7394',
                    fontFamily: 'DM Sans, system-ui',
                    letterSpacing: '1px'
                  }}>
                    {pipeline.track === 'enforcement' ? 'ENFORCEMENT TRACK' : 'LEGISLATIVE TRACK'}
                  </span>
                </div>

              </div>
            )
          })()}

          {/* Legal reference */}
          {(risk.legalReference || risk.legal_reference || risk.act ||
            risk.legislation || risk.regulation || risk.statute) && (
            <div style={{
              fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui',
              background:'rgba(107,115,148,0.08)',
              borderLeft:'2px solid #6B7394',
              padding:'4px 8px', borderRadius:'0 4px 4px 0'
            }}>
              ⚖ {risk.legalReference || risk.legal_reference ||
                  risk.act || risk.legislation ||
                  risk.regulation || risk.statute}
            </div>
          )}

          {/* Description */}
          <div style={{ fontSize:13, color:'#C8993A', fontFamily:'DM Sans, system-ui', lineHeight:1.6, flex:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            {risk.specificDataPoint || risk.description || ''}
          </div>

          {/* Timeframe */}
          <div style={{ padding:'10px 16px', borderTop:'1px solid #1E2130' }}>
            <span style={{ fontSize:12, color:'#6B7394', fontFamily:'DM Sans, system-ui' }}>
              ⏱ {risk.timeframe || '—'}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
        
        <div style={{ marginBottom:16 }}>

  {/* Section label */}
  <div style={{
    fontSize:11, color:'#6B7394', letterSpacing:'2px',
    textTransform:'uppercase', fontFamily:'DM Sans, system-ui',
    marginBottom:12
  }}>
    STRATEGIC ACTIONS
  </div>

  {/* Cards — stacked vertically */}
  {(claudeResult?.strategicActions || []).length === 0 ? (
    <div style={{
      background:'#12141A', borderRadius:8, padding:24,
      color:'#6B7394', fontSize:13, fontFamily:'DM Sans, system-ui',
      border:'1px solid #1E2130'
    }}>
      Strategic actions unavailable for this analysis.
    </div>
  ) : (
    (claudeResult?.strategicActions || []).map((action, i) => (
      <div key={i} style={{
        display:'flex', background:'#1A1D27',
        borderRadius:8, overflow:'hidden',
        border:'1px solid #1E2130', marginBottom:12
      }}>

        {/* Priority color bar — left edge */}
        <div style={{
          width:4, flexShrink:0,
          background: getPriorityColor(action.priority)
        }} />

        {/* Card content */}
        <div style={{ flex:1, padding:20 }}>

          {/* Header row — priority badge + title */}
          <div style={{
            display:'flex', justifyContent:'space-between',
            alignItems:'flex-start', marginBottom:16, gap:16
          }}>
            <div style={{
              padding:'4px 12px', borderRadius:12, flexShrink:0,
              background: getPriorityColor(action.priority) + '25',
              border:'1px solid ' + getPriorityColor(action.priority) + '50'
            }}>
              <span style={{
                fontSize:11, fontWeight:'bold',
                color: getPriorityColor(action.priority),
                fontFamily:'DM Sans, system-ui',
                textTransform:'uppercase', letterSpacing:'1px'
              }}>
                {action.priority || 'ACTION'}
              </span>
            </div>
            <div style={{
              fontSize:15,
              fontFamily:'Playfair Display, Georgia, serif',
              color:'#E8EAF0', fontWeight:'bold',
              lineHeight:1.3, flex:1
            }}>
              {action.title || 'Strategic Action'}
            </div>
          </div>

          {/* Sub-section A — WHY THIS, WHY NOW */}
          <div style={{ marginBottom:12 }}>
            <div style={{
              fontSize:10, color:'#6B7394', letterSpacing:'2px',
              textTransform:'uppercase', fontFamily:'DM Sans, system-ui',
              marginBottom:6
            }}>
              WHY THIS, WHY NOW
            </div>
            {action.specificTrigger && (
              <div style={{
                fontSize:13, color:'#C8993A',
                fontFamily:'DM Sans, system-ui',
                marginBottom:6, lineHeight:1.5
              }}>
                ⚡ {action.specificTrigger}
              </div>
            )}
            {action.rationale && action.rationale !== action.specificTrigger && (
              <div style={{
                fontSize:13, color:'#6B7394',
                fontFamily:'DM Sans, system-ui', lineHeight:1.6
              }}>
                {action.rationale}
              </div>
            )}
          </div>

          {/* Sub-section B — COMPETITOR CONTEXT (only if present) */}
          {action.competitorContext && action.competitorContext.length > 0 && (
            <div style={{
              marginTop:12, paddingTop:12,
              borderTop:'1px solid #1E2130', marginBottom:12
            }}>
              <div style={{
                fontSize:10, color:'#6B7394', letterSpacing:'2px',
                textTransform:'uppercase', fontFamily:'DM Sans, system-ui',
                marginBottom:6
              }}>
                COMPETITOR CONTEXT
              </div>
              <div style={{
                background:'rgba(224,90,90,0.06)',
                borderLeft:'2px solid #E05A5A',
                padding:'6px 10px', borderRadius:'0 4px 4px 0'
              }}>
                <span style={{
                  fontSize:13, color:'#E8EAF0',
                  fontFamily:'DM Sans, system-ui', lineHeight:1.6
                }}>
                  {action.competitorContext}
                </span>
              </div>
            </div>
          )}

          {/* Sub-section C — HOW ACTIVATE ENABLES THIS (only if present) */}
          {action.activateCapability && action.activateCapability.length > 0 && (
            <div style={{
              marginTop:12, paddingTop:12,
              borderTop:'1px solid #1E2130'
            }}>
              <div style={{
                fontSize:10, color:'#C8993A', letterSpacing:'2px',
                textTransform:'uppercase', fontFamily:'DM Sans, system-ui',
                marginBottom:6
              }}>
                HOW ACTIVATE ENABLES THIS
              </div>
              <div style={{
                background:'rgba(200,153,58,0.06)',
                borderLeft:'2px solid #C8993A',
                padding:'6px 10px', borderRadius:'0 4px 4px 0'
              }}>
                <span style={{
                  fontSize:13, color:'#E8EAF0',
                  fontFamily:'DM Sans, system-ui', lineHeight:1.6
                }}>
                  {action.activateCapability}
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    ))
  )}
</div>
        
        <div style={{ background:'#12141A', borderRadius:8, padding:24, marginBottom:16 }}>

  <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:12 }}>
    COMPETITIVE CONTEXT
  </div>

  {claudeResult?.competitiveContext?.summary && (
    <div style={{ fontSize:14, color:'#6B7394', fontFamily:'DM Sans, system-ui', lineHeight:1.6, marginBottom:16 }}>
      {claudeResult.competitiveContext.summary}
    </div>
  )}

  <table style={{ width:'100%', borderCollapse:'collapse' }}>
    <thead>
      <tr style={{ background:'#1E2130' }}>
        {['COMPANY','RELATIVE RISK','LOBBYING','KEY DIFFERENCE'].map(h => (
          <th key={h} style={{ padding:'8px 12px', fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui', textTransform:'uppercase', letterSpacing:'1px', textAlign:'left', borderBottom:'1px solid #1E2130', fontWeight:600 }}>
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {/* Primary company row */}
      <tr style={{ background:'rgba(200,153,58,0.08)', borderBottom:'1px solid #1E2130' }}>
        <td style={{ padding:'10px 12px', fontSize:14, color:'#C8993A', fontFamily:'DM Sans, system-ui', fontWeight:'bold' }}>
          {claudeResult?.companyName}
        </td>
        <td style={{ padding:'10px 12px', fontSize:13, color:'#C8993A', fontFamily:'DM Sans, system-ui', fontWeight:'bold' }}>
          ● This Company
        </td>
        <td style={{ padding:'10px 12px', fontSize:13, color:'#6B7394', fontFamily:'DM Sans, system-ui' }}>
          —
        </td>
        <td style={{ padding:'10px 12px', fontSize:13, color:'#6B7394', fontFamily:'DM Sans, system-ui', fontStyle:'italic' }}>
          Primary analysis subject
        </td>
      </tr>
      {/* Peer rows */}
      {(claudeResult?.competitiveContext?.peers || []).map((peer, i) => {
        const rd = getRelativeRiskDisplay(peer.relativeRisk)
        const ld = getLobbyingDisplay(peer.lobbyingPosture)
        return (
          <tr key={i} style={{ borderBottom:'1px solid #1E2130', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
            <td style={{ padding:'10px 12px', fontSize:14, color:'#E8EAF0', fontFamily:'DM Sans, system-ui', fontWeight:'bold' }}>
              {peer.company}
            </td>
            <td style={{ padding:'10px 12px' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 10px', borderRadius:12, background:rd.color+'1F', border:'1px solid '+rd.color+'40' }}>
                <span style={{ fontSize:12, fontWeight:'bold', color:rd.color, fontFamily:'DM Sans, system-ui' }}>
                  {rd.icon} {rd.label}
                </span>
              </div>
            </td>
            <td style={{ padding:'10px 12px' }}>
              <span style={{ fontSize:12, color:ld.color, fontFamily:'DM Sans, system-ui', fontWeight:500 }}>
                {ld.label}
              </span>
            </td>
            <td style={{ padding:'10px 12px', fontSize:13, color:'#6B7394', fontFamily:'DM Sans, system-ui', lineHeight:1.5 }}>
              {peer.keyDifference || '—'}
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>

  <div style={{ marginTop:12, fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui', fontStyle:'italic' }}>
    Competitor estimates derived from regulatory signals in primary company data. No independent competitor analysis was performed.
  </div>
</div>
        
        <div style={{ background:'#1A2744', border:'1px solid rgba(200,153,58,0.3)', borderLeft:'4px solid #C8993A', borderRadius:8, padding:24, marginBottom:16 }}>

  <div style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:12 }}>
    <div style={{ fontSize:48, color:'#C8993A', fontFamily:'Playfair Display, Georgia, serif', lineHeight:0.8, flexShrink:0, marginTop:4 }}>
      "
    </div>
    <div style={{ fontSize:18, fontFamily:'Playfair Display, Georgia, serif', color:'#E8EAF0', lineHeight:1.6, fontStyle:'italic' }}>
      {claudeResult?.activateBenchmark?.stat || '73% of major regulatory actions follow a detectable signal pattern 6–12 months prior.'}
    </div>
  </div>

  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
    <div style={{ fontSize:12, color:'#C8993A', fontFamily:'DM Sans, system-ui', flexShrink:0 }}>
      — Activate Tech & Media Outlook 2025
    </div>
    <div style={{ fontSize:13, color:'#6B7394', fontFamily:'DM Sans, system-ui', fontStyle:'italic', lineHeight:1.5, flex:1, textAlign:'right' }}>
      {claudeResult?.activateBenchmark?.relevance || 'Early signal detection is the core of Activate\'s regulatory advisory practice.'}
    </div>
  </div>
</div>
        
        <div style={{ background:'#12141A', borderRadius:8, padding:24, marginBottom:16 }}>

  <div style={{ fontSize:11, color:'#6B7394', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'DM Sans, system-ui', marginBottom:4 }}>
    WATCHLIST — Monitor These Specifically
  </div>
  <div style={{ fontSize:12, color:'#6B7394', fontFamily:'DM Sans, system-ui', marginBottom:16 }}>
    Items that would escalate to crisis if triggered
  </div>

  {(claudeResult?.watchlist || []).length === 0 ? (
    <div style={{ fontSize:13, color:'#6B7394', fontFamily:'DM Sans, system-ui', fontStyle:'italic' }}>
      Watchlist unavailable for this analysis.
    </div>
  ) : (
    (claudeResult?.watchlist || []).map((w, i, arr) => (
      <div key={i} style={{ display:'flex', gap:24, alignItems:'flex-start', paddingBottom: i < arr.length-1 ? 16 : 0, marginBottom: i < arr.length-1 ? 16 : 0, borderBottom: i < arr.length-1 ? '1px solid #1E2130' : 'none' }}>

        {/* Left column */}
        <div style={{ flex:'0 0 30%' }}>
          <div style={{ display:'inline-block', padding:'2px 8px', borderRadius:4, background:'#1E2130', marginBottom:6 }}>
            <span style={{ fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui' }}>
              {w.source || 'Government Source'}
            </span>
          </div>
          <div style={{ fontSize:14, color:'#E8EAF0', fontWeight:'bold', fontFamily:'DM Sans, system-ui', lineHeight:1.4, marginBottom:4 }}>
            {w.item || '—'}
          </div>
          <div style={{ fontSize:12, color:'#6B7394', fontFamily:'DM Sans, system-ui', lineHeight:1.4 }}>
            ◉ {w.currentStatus || 'Under review'}
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width:1, background:'#1E2130', alignSelf:'stretch', flexShrink:0 }} />

        {/* Right column */}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, color:'#E05A5A', textTransform:'uppercase', letterSpacing:'1px', fontFamily:'DM Sans, system-ui', marginBottom:6 }}>
            ESCALATION TRIGGER
          </div>
          <div style={{ background:'rgba(224,90,90,0.06)', borderLeft:'2px solid #E05A5A', padding:'8px 12px', borderRadius:'0 4px 4px 0' }}>
            <span style={{ fontSize:13, color:'#E8EAF0', fontFamily:'DM Sans, system-ui', lineHeight:1.6 }}>
              {w.trigger || 'Monitor for legislative or enforcement advancement.'}
            </span>
          </div>
        </div>

      </div>
    ))
  )}
</div>
        
        <div style={{ paddingTop:16, paddingBottom:32, borderTop:'1px solid #1E2130', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
  <div style={{ fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui' }}>
    Sources: Congress.gov · Federal Register · FCC ECFS · Senate LDA · FTC · NewsAPI
  </div>
  <div style={{ fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui', textAlign:'center' }}>
    {claudeResult?.dataQuality?.totalDataPoints || 0} live data points
    &nbsp;·&nbsp;
    {claudeResult?.dataQuality?.sourcesSucceeded || 0}/6 sources succeeded
  </div>
  <div style={{ fontSize:11, color:'#6B7394', fontFamily:'DM Sans, system-ui', textAlign:'right' }}>
    Generated {formatFullTimestamp(claudeResult?.analysisTimestamp)}
  </div>
</div>
        
      </div>
    </div>
    </>
  )
}

export default App
