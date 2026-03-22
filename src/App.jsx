import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import { runAnalysis } from './services/intelligenceEngine.js'
import { analyzeWithClaude } from './services/claudeAnalysis.js'
import GLSLHills from './components/GLSLHills.jsx'
import LandingPage from './components/LandingPage.jsx'
import ResultsPage from './components/results/ResultsPage.jsx'

function App() {
  const [showDashboard, setShowDashboard] = useState(false)

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
    setRawData(intelligenceData)

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
          REGULATORY RISK INTELLIGENCE
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
        The regulatory risk exposure can be detected months in advance.
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
          {isLoading ? 'Analyzing...' : 'Generate Regulatory Risk Brief →'}
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
            REGULATORY RISK INTELLIGENCE
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
  if (!showDashboard) {
    return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />
  }

  return (
    <ResultsPage claudeResult={claudeResult} rawData={rawData} onReset={handleReset} />
  )
}

export default App
