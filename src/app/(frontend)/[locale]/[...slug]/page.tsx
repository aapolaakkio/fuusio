import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locale } from 'next/root-params'
import { getTranslations } from 'next-intl/server'

import { DraftModeBanner } from '@/components/DraftModeBanner'
import { PageBanner } from '@/components/PageBanner'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { RichText } from '@/components/RichText'
import { SyncPageUrl } from '@/components/SyncPageUrl'
import { TableOfContents } from '@/components/TableOfContents'
import { env } from '@/env'
import { getMainNavigation } from '@/lib/getMainNavigation'
import { getPage } from '@/lib/getPage'
import { isDraftMode } from '@/utils/draftMode'

// Event blocks sort events into upcoming and past by the current time, so re-render at least hourly.
export const revalidate = 3600

export const generateStaticParams = async () => {
  return []
}

export async function generateMetadata({
  params
}: PageProps<'/[locale]/[...slug]'>): Promise<Metadata> {
  const { slug } = await params
  const curLocale = await locale()
  const { page, canonicalPath } = await getPage(slug.join('/'), curLocale)
  const mainNavigation = await getMainNavigation(curLocale)
  const siteName = mainNavigation.title
  const pathForUrl = canonicalPath ?? slug?.join('/') ?? ''

  if (!page) {
    const t = await getTranslations()

    return {
      title: `${t('notFound.meta.title')} - ${siteName}`,
      description: t('notFound.meta.description'),
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          noimageindex: true
        }
      }
    }
  }

  const images =
    page?.bannerImage && typeof page?.bannerImage === 'object'
      ? {
          url: page?.bannerImage?.url || '',
          width: page?.bannerImage?.width || 100,
          height: page?.bannerImage?.height || 100,
          alt: page?.bannerImage?.alt || ''
        }
      : null

  return {
    title: `${page?.title} - ${siteName}`,
    metadataBase: new URL(env.NEXT_PUBLIC_SERVER_URL || ''),
    openGraph: {
      title: `${page?.title} - ${siteName}`,
      images: images || [],
      url: `${env.NEXT_PUBLIC_SERVER_URL}/${curLocale}/${pathForUrl}`,
      siteName: siteName,
      locale: curLocale,
      type: 'website'
    },
    robots: {
      index: !page?.noIndex,
      googleBot: {
        index: !page?.noIndex,
        noimageindex: !!page?.noIndex
      }
    },
    verification: {
      google: env.GOOGLE_SITE_VERIFICATION
    }
  }
}

export default async function Page({ params }: PageProps<'/[locale]/[...slug]'>) {
  const { slug } = await params
  const curLocale = await locale()
  const slugPath = slug?.join('/') ?? ''

  const isDraft = await isDraftMode()
  const { page, canonicalPath } = await getPage(slugPath, curLocale)

  // Unpublished pages are visible only in draft mode
  if (!page || (!isDraft && page._status !== 'published')) {
    notFound()
  }

  return (
    <>
      <SyncPageUrl currentSlug={slugPath} canonicalPath={canonicalPath} locale={curLocale} />
      <DraftModeBanner pageId={page.id.toString()} isDraft={isDraft} />
      {isDraft ? <RefreshRouteOnSave /> : null}
      <main id="page-content" className="flex w-full flex-col">
        <PageBanner page={page} />
        <section className="mx-auto mb-12 w-full max-w-7xl flex-1 p-6">
          <div className={!page.fullWidth ? 'lg:ml-[20%]' : ''}>
            <h1 className="font-display text-glow mb-8 w-fit pb-1 text-5xl wrap-break-word hyphens-auto">
              {page.title}
            </h1>
          </div>
          <div className="flex flex-col gap-8 lg:flex-row">
            {!page.fullWidth && (
              <TableOfContents show={page.showTableOfContents} richText={page.content} />
            )}
            <div className={!page.fullWidth ? 'lg:w-[80%]' : 'lg:w-full'}>
              <RichText data={page.content} locale={curLocale} />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
