import type { Block } from 'payload'

export const EventsBlock: Block = {
  slug: 'events',
  interfaceName: 'EventsBlock',
  labels: {
    singular: 'Events',
    plural: 'Events'
  },
  fields: [
    {
      name: 'categories',
      type: 'text',
      hasMany: true,
      required: true,
      admin: {
        description:
          'Ilmomasiina categories to show, written exactly like the "Category" field of the events in ilmo.fyysikkokilta.fi (e.g. Juhlavuositapahtumat). Events are read from Ilmomasiina, so they are typed in only there.'
      }
    },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'list',
      options: [
        { label: 'List (cards under each other)', value: 'list' },
        { label: 'Tabs (one event visible at a time)', value: 'tabs' },
        { label: 'Calendar (month, week and day views)', value: 'calendar' }
      ],
      admin: {
        description:
          'Tabs keep the page short: the reader picks an event and sees only that one. Good for the Fuusio week.'
      }
    },
    {
      name: 'show',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'Upcoming and past (separated)', value: 'all' },
        { label: 'Only upcoming', value: 'upcoming' },
        { label: 'Only past', value: 'past' }
      ],
      admin: {
        condition: (_data, siblingData) => siblingData.layout === 'list'
      }
    }
  ]
}
