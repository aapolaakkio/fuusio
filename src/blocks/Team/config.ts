import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Team',
    plural: 'Teams'
  },
  fields: [
    {
      name: 'members',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'People shown as contact cards with photos.'
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text', localized: true }
          ]
        },
        {
          type: 'row',
          fields: [
            { name: 'email', type: 'email' },
            {
              name: 'telegram',
              type: 'text',
              admin: { description: 'Telegram username without @.' }
            }
          ]
        },
        { name: 'image', type: 'upload', relationTo: 'media' }
      ]
    }
  ]
}
