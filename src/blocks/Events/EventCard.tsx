import { CalendarDays, ExternalLink, MapPin, Ticket } from 'lucide-react'
import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Markdown from 'react-markdown'

import { formatDateTime, formatEventTime, getSignupState, type SiteEvent } from '@/lib/events'
import { ilmoEventUrl } from '@/lib/getEvents'

interface EventCardProps {
  event: SiteEvent
  locale: Locale
  now: Date
  dimmed?: boolean
}

export const EventCard = async ({ event, locale, now, dimmed }: EventCardProps) => {
  const t = await getTranslations('events')
  const signupState = getSignupState(event, now)

  return (
    <article
      className={`border-fk-yellow/50 bg-fuusio-surface/70 my-4 rounded-2xl border p-5 ${
        dimmed ? 'opacity-70' : ''
      }`}
    >
      <h3 className="mt-0! mb-3! no-underline">{event.title}</h3>
      <p className="text-fk-yellow my-2! flex flex-wrap gap-x-6 gap-y-1 font-bold">
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={18} aria-hidden="true" />
          <time dateTime={event.start}>{formatEventTime(event, locale)}</time>
        </span>
        {event.location && (
          <span className="inline-flex items-center gap-2">
            <MapPin size={18} aria-hidden="true" />
            {event.location}
          </span>
        )}
        {event.price && (
          <span className="inline-flex items-center gap-2">
            <Ticket size={18} aria-hidden="true" />
            {event.price}
          </span>
        )}
      </p>
      {/* react-markdown never renders raw HTML, so text from Ilmomasiina cannot inject markup. */}
      {event.description && <Markdown>{event.description}</Markdown>}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <a
          href={ilmoEventUrl(event.slug, locale)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-glow hover:text-fk-black inline-flex items-center gap-2 rounded-full px-6 py-2 font-bold no-underline transition-transform hover:scale-105"
        >
          {signupState === 'open' ? t('signup') : t('moreInfo')}
          <ExternalLink size={18} aria-hidden="true" />
        </a>
        {signupState === 'notYetOpen' && event.registrationStart && (
          <span>{t('signupOpens', { date: formatDateTime(event.registrationStart, locale) })}</span>
        )}
        {signupState === 'closed' && <span>{t('signupClosed')}</span>}
      </div>
    </article>
  )
}
