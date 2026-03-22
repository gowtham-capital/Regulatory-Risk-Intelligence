import { ArrowRight, Activity, Globe, ShieldCheck } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

      {/* ── Ambient Background ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Primary glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-accent-600/8 blur-[120px] animate-pulse-glow" />
        {/* Secondary glow */}
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-400/5 blur-[100px] animate-float" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium tracking-wide text-surface-300 uppercase">
            Live Intelligence Feed
          </span>
        </div>

        {/* Headline */}
        <h1
          className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-surface-50 sm:text-5xl lg:text-7xl animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          Real-Time Risk
          <br />
          <span className="text-gradient">Intelligence</span> for Media
        </h1>

        {/* Subheadline */}
        <p
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-surface-400 leading-relaxed animate-slide-up"
          style={{ animationDelay: '0.25s' }}
        >
          Monitor regulatory shifts, congressional actions, and geopolitical threats
          impacting US media & technology companies — powered by live government APIs
          and AI-driven analysis.
        </p>

        {/* CTAs */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          <button className="group flex items-center gap-2.5 rounded-2xl bg-accent-600 px-7 py-3.5 text-sm font-semibold text-white
                             shadow-xl shadow-accent-600/25
                             transition-all duration-300
                             hover:bg-accent-500 hover:shadow-accent-500/30 hover:gap-3.5 hover:scale-[1.03]
                             active:scale-[0.97] active:shadow-md">
            Launch Dashboard
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
          <button className="flex items-center gap-2 rounded-2xl glass px-7 py-3.5 text-sm font-semibold text-surface-200
                             transition-all duration-300
                             hover:bg-white/10 hover:text-white hover:scale-[1.02]
                             active:scale-[0.97]">
            View Demo
          </button>
        </div>

        {/* Stats Row */}
        <div
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up"
          style={{ animationDelay: '0.55s' }}
        >
          {[
            { icon: Globe, label: 'Data Sources', value: '7+', desc: 'Government APIs' },
            { icon: Activity, label: 'Updates', value: 'Real-Time', desc: 'Live monitoring' },
            { icon: ShieldCheck, label: 'Analysis', value: 'AI-Powered', desc: 'Claude intelligence' },
          ].map(({ icon: Icon, label, value, desc }) => (
            <div
              key={label}
              className="group glass rounded-2xl p-6 text-center
                         transition-all duration-300
                         hover:bg-white/8 hover:shadow-card-hover hover:scale-[1.02] hover:-translate-y-0.5
                         active:scale-[0.98]"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600/10
                              transition-colors duration-300 group-hover:bg-accent-600/20">
                <Icon className="h-5 w-5 text-accent-400" />
              </div>
              <div className="text-xl font-bold text-surface-50">{value}</div>
              <div className="mt-0.5 text-xs font-medium text-surface-500 uppercase tracking-wider">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface-950 to-transparent pointer-events-none" />
    </section>
  )
}
