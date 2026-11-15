import type { Locale } from 'next-intl'
import { z } from 'zod'

import { env } from '@/env'

import { ilmoEventSchema, selectEvents, type SiteEvent } from './events'

// Ilmomasiina hides ended events from its list after a few days unless asked for older ones.
// ponytail: the server caps how far back it goes (about half a year on ilmo.fyysikkokilta.fi).
// Older past events drop off the site; write them into the page text if they must stay.
const MAX_AGE_DAYS = 400

export const ilmoEventUrl = (slug: string, locale: Locale) =>
  `${env.ILMO_URL}${locale === 'en' ? '/en' : ''}/events/${encodeURIComponent(slug)}`

/** Events of the given Ilmomasiina categories. Returns null when Ilmomasiina cannot be reached. */
export async function getEvents(
  locale: Locale,
  categories: readonly string[]
): Promise<SiteEvent[] | null> {
  try {
    const response = await fetch(`${env.ILMO_URL}/api/events?maxAge=${MAX_AGE_DAYS}`, {
      next: { revalidate: 120 }
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const events = z.array(ilmoEventSchema).parse(await response.json())
    return selectEvents(events, categories, locale)
  } catch (error) {
    console.error(
      `Error fetching events from Ilmomasiina: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    return null
  }
}
