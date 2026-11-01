import { ArrowDown, Share2 } from 'lucide-react'
import { DOWNLOAD_URL } from '../content'
import { Reveal } from './Reveal'

async function shareLumenBar() {
  const data = {
    title: 'LumenBar',
    text: 'Warm your Mac for easier nights.',
    url: window.location.href,
  }
  try {
    if (navigator.share) await navigator.share(data)
    else await navigator.clipboard.writeText(data.url)
  } catch {
    // A cancelled share sheet is a completed user choice.
  }
}

export function SectionOne() {
  return (
    <section
      id="main"
      className="relative flex min-h-screen flex-col justify-end supports-[height:100svh]:min-h-[100svh]"
    >
      <div className="relative flex flex-col gap-10 px-5 pb-16 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:px-8 md:px-12 md:pb-20">
        <h1 className="max-w-xl text-4xl font-medium uppercase leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
          <Reveal as="span" delay={100} className="block pl-6 sm:pl-12">
            Warm Your
          </Reveal>
          <Reveal as="span" delay={220} className="block">
            Mac <span className="font-light normal-case italic">for</span>
          </Reveal>
          <Reveal as="span" delay={340} className="block pl-10 sm:pl-20">
            // Easier
          </Reveal>
          <Reveal as="span" delay={460} className="block pl-16 sm:pl-32">
            Nights
          </Reveal>
        </h1>

        <div className="flex w-full max-w-xs flex-col items-start">
          <Reveal delay={400} className="mb-6 flex w-full items-center justify-between font-mono text-white sm:mb-8">
            <span className="text-lg">( A )</span>
            <span className="text-xs text-white/70">[ 001 /004 ]</span>
          </Reveal>
          <Reveal delay={520}>
            <p className="mb-6 text-sm leading-relaxed text-white/85 drop-shadow-md sm:mb-8">
              LumenBar warms every display as the day ends, so late work feels softer. It stays on your Mac, with no account and nothing sent anywhere.
            </p>
          </Reveal>
          <Reveal delay={640} className="w-full">
            <a
              href={DOWNLOAD_URL}
              className="block w-full rounded-full border border-white/60 px-8 py-3 text-center font-mono text-xs uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Download for Mac
            </a>
          </Reveal>
        </div>
      </div>

      <Reveal delay={760} className="absolute bottom-5 left-5 sm:bottom-6 sm:left-8 md:left-12">
        <button
          type="button"
          onClick={shareLumenBar}
          aria-label="Share"
          className="flex h-11 w-11 items-center justify-center text-white/80 transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Share2 size={18} aria-hidden />
        </button>
      </Reveal>
      <Reveal delay={760} className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-6">
        <a
          href="#features"
          aria-label="Continue to the next section"
          className="flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <ArrowDown size={18} aria-hidden className="animate-bounce text-white/80" />
        </a>
      </Reveal>
    </section>
  )
}
