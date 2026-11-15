import { Link } from '@/i18n/navigation'
import type { LandingPage } from '@/payload-types'

import { FrontPageSlideshow } from './FrontPageSlideshow'

interface FrontPageHeroProps {
  page: LandingPage
}

const buttonClass =
  'rounded-full border-2 border-fk-white px-7 py-3 font-bold transition-transform first:bg-glow first:border-transparent hover:scale-105'

export const FrontPageHero = ({ page }: FrontPageHeroProps) => (
  <section className="hero-glow relative flex min-h-[70svh] w-full items-center justify-center overflow-hidden">
    <FrontPageSlideshow page={page} />
    {!!page.bannerImages?.length && (
      <div className="bg-fuusio-deep/60 absolute inset-0" aria-hidden="true" />
    )}
    <div className="relative flex flex-col items-center gap-6 px-6 py-16 text-center">
      <h1 className="font-display text-glow pb-2 text-7xl wrap-break-word sm:text-9xl">
        {page.title}
      </h1>
      {page.subtitle && <p className="text-xl font-bold sm:text-2xl">{page.subtitle}</p>}
      {!!page.heroLinks?.length && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {page.heroLinks.map(({ id, label, url }) =>
            url.startsWith('/') ? (
              <Link key={id} href={url} className={buttonClass}>
                {label}
              </Link>
            ) : (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass}
              >
                {label}
              </a>
            )
          )}
        </div>
      )}
    </div>
  </section>
)
