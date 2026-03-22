import Navbar from './Navbar'
import Hero from './Hero'
import FeatureGrid from './FeatureGrid'
import { Heart } from 'lucide-react'

export default function LandingPage({ onEnterDashboard }) {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-200">
      <Navbar />
      <Hero />
      <FeatureGrid />

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-accent-950/10 to-transparent" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-surface-50 sm:text-4xl">
            Ready to see your risk landscape?
          </h2>
          <p className="mt-4 text-base text-surface-400 leading-relaxed">
            Enter a company name and our intelligence engine will scan 7+ government
            data sources and deliver an AI-powered risk assessment in seconds.
          </p>
          <button
            onClick={onEnterDashboard}
            className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-accent-600 px-8 py-4 text-base font-semibold text-white
                       shadow-xl shadow-accent-600/25
                       transition-all duration-300
                       hover:bg-accent-500 hover:shadow-accent-500/30 hover:scale-[1.03]
                       active:scale-[0.97] active:shadow-md"
          >
            Enter Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} Media Risk Intel. Built for Activate Consulting.
          </p>
          <p className="flex items-center gap-1 text-xs text-surface-600">
            Crafted with <Heart className="h-3 w-3 text-rose-500" /> and Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  )
}
