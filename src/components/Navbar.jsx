import { useState } from 'react'
import { Menu, X, Shield, Zap } from 'lucide-react'

const navLinks = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Intelligence', href: '#features' },
  { label: 'Analysis', href: '#analysis' },
  { label: 'Reports', href: '#reports' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 transition-all duration-300 group-hover:bg-accent-500 group-hover:shadow-lg group-hover:shadow-accent-600/25">
              <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-surface-50">
              Media Risk <span className="text-gradient">Intel</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-3.5 py-2 text-sm font-medium text-surface-400 rounded-lg
                           transition-all duration-200
                           hover:text-surface-50 hover:bg-white/5
                           active:scale-[0.97]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white
                               shadow-lg shadow-accent-600/20
                               transition-all duration-300
                               hover:bg-accent-500 hover:shadow-accent-500/30 hover:scale-[1.02]
                               active:scale-[0.97] active:shadow-sm">
              <Zap className="h-4 w-4" />
              Run Analysis
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg
                       text-surface-400 transition-colors hover:text-surface-50 hover:bg-white/5
                       active:scale-95"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 border-t border-white/5">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-surface-300
                         transition-all duration-200
                         hover:text-surface-50 hover:bg-white/5
                         active:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white
                             transition-all duration-200
                             hover:bg-accent-500 active:scale-[0.97]">
            <Zap className="h-4 w-4" />
            Run Analysis
          </button>
        </div>
      </div>
    </nav>
  )
}
