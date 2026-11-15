import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale } from 'next/root-params'

import { DraftModeBanner } from '@/components/DraftModeBanner'
import { FrontPageAnnouncement } from '@/components/FrontPageAnnouncement'
import { FrontPageHero } from '@/components/FrontPageHero'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { RichText } from '@/components/RichText'
import { env } from '@/env'
import { getLandingPage } from '@/lib/getLandingPage'
import { isDraftMode } from '@/utils/draftMode'

// Event blocks sort events into upcoming and past by the current time, so re-render at least hourly.
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const curLocale = await locale()
  const page = await getLandingPage(curLocale)

  const images = page?.bannerImages
    ?.map((image) => {
      if (typeof image === 'object') {
        return {
          url: image.url || '',
          width: image.width || 100,
          height: image.height || 100,
          alt: image.alt || ''
        }
      }
      return null
    })
    .filter((image) => !!image)

  return {
    title: page?.title,
    description: page?.subtitle || undefined,
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL || ''),
    openGraph: {
      title: page?.title,
      description: page?.subtitle || '',
      images: images || [],
      url: `${env.NEXT_PUBLIC_SERVER_URL}/${curLocale}`,
      siteName: page?.title,
      locale: curLocale,
      type: 'website'
    },
    verification: {
      google: env.GOOGLE_SITE_VERIFICATION
    }
  }
}

export default async function LandingPage() {
  const curLocale = await locale()

  const isDraft = await isDraftMode()
  const landingPage = await getLandingPage(curLocale)

  if (!landingPage) {
    notFound()
  }

  return (
    <>
      <DraftModeBanner isDraft={isDraft} />
      {isDraft ? <RefreshRouteOnSave /> : null}
      <main id="page-content" className="flex w-full flex-col">
        <FrontPageHero page={landingPage} />
        <section className="mx-auto mb-12 w-full max-w-7xl flex-1 p-6">
          <div className="flex flex-col gap-8">
            <FrontPageAnnouncement page={landingPage} locale={curLocale} />
            <RichText data={landingPage.content} locale={curLocale} />
          </div>
        </section>
      </main>
    </>
  )
}
