// Pure helpers for events fetched from Ilmomasiina.
// No Next.js or Payload imports so that events.test.ts runs with plain node.
import { z } from 'zod'

const translationSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  location: z.string().nullish(),
  price: z.string().nullish()
})

// Only the fields this site shows. Ilmomasiina is an external service, so nothing is trusted unchecked.
export const ilmoEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  date: z.string().nullable(),
  endDate: z.string().nullish(),
  registrationStartDate: z.string().nullish(),
  registrationEndDate: z.string().nullish(),
  category: z.string().default(''),
  description: z.string().nullish(),
  location: z.string().nullish(),
  price: z.string().nullish(),
  languages: z.record(z.string(), translationSchema).default({})
})

export type IlmoEvent = z.infer<typeof ilmoEventSchema>

/** An event with a date, in the reader's language. */
export interface SiteEvent {
  id: string
  slug: string
  title: string
  start: string
  end: string | null
  registrationStart: string | null
  registrationEnd: string | null
  description: string | null
  location: string | null
  price: string | null
}

const TIME_ZONE = 'Europe/Helsinki'
const intlLocale = (locale: string) => (locale === 'fi' ? 'fi-FI' : 'en-GB')
const time = (value: string) => new Date(value).getTime()

/** Picks the translation for the locale and falls back to the event's default language field by field. */
export const localizeEvent = (event: IlmoEvent & { date: string }, locale: string): SiteEvent => {
  const translation = event.languages[locale]
  const pick = (key: 'title' | 'description' | 'location' | 'price') =>
    translation?.[key] || event[key] || null

  return {
    id: event.id,
    slug: event.slug,
    title: pick('title') ?? event.title,
    start: event.date,
    end: event.endDate ?? null,
    registrationStart: event.registrationStartDate ?? null,
    registrationEnd: event.registrationEndDate ?? null,
    description: pick('description'),
    location: pick('location'),
    price: pick('price')
  }
}

/** Keeps dated events of the given categories (case-insensitive). Signup-only events without a date are left out. */
export const selectEvents = (
  events: readonly IlmoEvent[],
  categories: readonly string[],
  locale: string
) => {
  const wanted = new Set(categories.map((category) => category.trim().toLowerCase()))

  return events
    .filter((event): event is IlmoEvent & { date: string } => !!event.date)
    .filter((event) => wanted.has(event.category.trim().toLowerCase()))
    .map((event) => localizeEvent(event, locale))
}

/** Splits events into upcoming (soonest first) and past (latest first). An event is past once it has ended. */
export const splitEvents = <T extends Pick<SiteEvent, 'start' | 'end'>>(
  events: readonly T[],
  now: Date
) => {
  const isPast = (event: T) => time(event.end || event.start) < now.getTime()

  return {
    upcoming: events
      .filter((event) => !isPast(event))
      .toSorted((a, b) => time(a.start) - time(b.start)),
    past: events.filter(isPast).toSorted((a, b) => time(b.start) - time(a.start))
  }
}

export type SignupState = 'none' | 'notYetOpen' | 'open' | 'closed'

export const getSignupState = (
  event: Pick<SiteEvent, 'registrationStart' | 'registrationEnd'>,
  now: Date
): SignupState => {
  if (!event.registrationStart || !event.registrationEnd) return 'none'
  if (now.getTime() < time(event.registrationStart)) return 'notYetOpen'
  if (now.getTime() > time(event.registrationEnd)) return 'closed'
  return 'open'
}

export const formatDateTime = (value: string, locale: string) =>
  new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE
  }).format(new Date(value))

export const formatEventTime = ({ start, end }: Pick<SiteEvent, 'start' | 'end'>, locale: string) =>
  end
    ? new Intl.DateTimeFormat(intlLocale(locale), {
        weekday: 'short',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: TIME_ZONE
      }).formatRange(new Date(start), new Date(end))
    : formatDateTime(start, locale)

export const formatShortDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    timeZone: TIME_ZONE
  }).format(new Date(value))
