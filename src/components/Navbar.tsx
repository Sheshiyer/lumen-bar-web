import { ArrowUpRight } from 'lucide-react'
import { EXPLAINER_URL } from '../content'
import { Reveal } from './Reveal'

const links = [
  { label: 'main', href: '#main' },
  { label: 'features', href: '#features' },
  { label: 'film', href: EXPLAINER_URL },
  { label: 'talk to us', href: 'mailto:shesh@thoughtseed.space' },
]

export function Navbar() {
  return (
    <>
      <div className="fixed left-5 top-5 z-50 sm:left-8 sm:top-7 md:left-12">
        <Reveal>
          <a
            href="#main"
            className="font-mono text-lg font-medium tracking-tight text-white drop-shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-xl md:text-2xl"
          >
            (LumenBar)
          </a>
        </Reveal>
        <Reveal delay={150}>
          <p className="mt-6 font-mono text-[10px] text-white/60 sm:mt-8 sm:text-xs">[ v1.2.0 ]</p>
        </Reveal>
      </div>

      <nav
        aria-label="Page"
        className="fixed right-5 top-5 z-50 sm:right-8 sm:top-7 md:right-12"
      >
        <ul className="flex flex-col items-end gap-1.5 sm:gap-2">
          {links.map((link, index) => (
            <li key={link.label}>
              <Reveal delay={100 + index * 120}>
                <a
                  href={link.href}
                  className="group flex min-h-6 items-center gap-1 font-mono text-xs text-white/80 drop-shadow-md transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-sm"
                >
                  {link.label}
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
