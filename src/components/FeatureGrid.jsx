import {
  Landmark,
  Radio,
  FileSearch,
  Brain,
  Newspaper,
  Scale,
} from 'lucide-react'

const features = [
  {
    icon: Landmark,
    title: 'Congress Tracker',
    description: 'Monitor bills, hearings, and committee actions affecting media regulation in real-time via Congress.gov API.',
    tag: 'Legislative',
    color: 'accent',
  },
  {
    icon: Radio,
    title: 'FCC Watch',
    description: 'Track spectrum auctions, broadcast licensing, and telecom policy shifts from the FCC public API.',
    tag: 'Regulatory',
    color: 'cyan',
  },
  {
    icon: FileSearch,
    title: 'Federal Register',
    description: 'Scan proposed rules and final regulations from all federal agencies impacting media & tech companies.',
    tag: 'Compliance',
    color: 'amber',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Claude-powered intelligence synthesis — connects policy signals across sources and generates risk assessments.',
    tag: 'Intelligence',
    color: 'violet',
  },
  {
    icon: Newspaper,
    title: 'News Signals',
    description: 'Aggregate breaking coverage from top outlets, filtered for media-industry relevance and sentiment scoring.',
    tag: 'Media',
    color: 'emerald',
  },
  {
    icon: Scale,
    title: 'Lobbying Data',
    description: 'Senate LDA filings reveal who is spending to influence media policy — follow the money in real-time.',
    tag: 'Advocacy',
    color: 'rose',
  },
]

const colorMap = {
  accent:  { bg: 'bg-accent-600/10', hover: 'group-hover:bg-accent-600/20', text: 'text-accent-400', tag: 'bg-accent-500/10 text-accent-400' },
  cyan:    { bg: 'bg-cyan-600/10',    hover: 'group-hover:bg-cyan-600/20',   text: 'text-cyan-400',   tag: 'bg-cyan-500/10 text-cyan-400' },
  amber:   { bg: 'bg-amber-600/10',   hover: 'group-hover:bg-amber-600/20',  text: 'text-amber-400',  tag: 'bg-amber-500/10 text-amber-400' },
  violet:  { bg: 'bg-violet-600/10',  hover: 'group-hover:bg-violet-600/20', text: 'text-violet-400', tag: 'bg-violet-500/10 text-violet-400' },
  emerald: { bg: 'bg-emerald-600/10', hover: 'group-hover:bg-emerald-600/20',text: 'text-emerald-400',tag: 'bg-emerald-500/10 text-emerald-400' },
  rose:    { bg: 'bg-rose-600/10',    hover: 'group-hover:bg-rose-600/20',   text: 'text-rose-400',   tag: 'bg-rose-500/10 text-rose-400' },
}

export default function FeatureGrid() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Section background glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-accent-600/5 blur-[140px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-400 mb-3">
            Intelligence Suite
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-surface-50 sm:text-4xl lg:text-5xl">
            Six Signals. One Platform.
          </h2>
          <p className="mt-4 text-base text-surface-400 leading-relaxed">
            Each module connects to live government and news APIs, feeding data into
            an AI engine that surfaces risk before it becomes a headline.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => {
            const c = colorMap[feat.color]
            return (
              <article
                key={feat.title}
                className="group relative glass rounded-2xl p-6 sm:p-7
                           transition-all duration-300 ease-out
                           hover:bg-white/8 hover:shadow-card-hover hover:-translate-y-1 hover:scale-[1.01]
                           active:scale-[0.98] active:shadow-sm
                           animate-slide-up cursor-default"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Icon */}
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.hover} transition-colors duration-300`}>
                  <feat.icon className={`h-5.5 w-5.5 ${c.text}`} strokeWidth={1.8} />
                </div>

                {/* Tag */}
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${c.tag} mb-3`}>
                  {feat.tag}
                </span>

                {/* Content */}
                <h3 className="text-lg font-semibold text-surface-50 mb-2 transition-colors duration-200 group-hover:text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-surface-400 leading-relaxed">
                  {feat.description}
                </p>

                {/* Hover border glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-colors duration-300 group-hover:border-white/10" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
