import type { Block } from 'payload'

export const SectionCardsBlock: Block = {
  slug: 'section-cards',
  interfaceName: 'SectionCardsBlock',
  labels: {
    singular: 'Section Cards',
    plural: 'Section Cards'
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        description:
          'Big cards that link to pages, e.g. the jubilee year and the Fuusio week. They tilt in 3D when hovered.'
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true },
            { name: 'page', type: 'relationship', relationTo: 'pages', required: true }
          ]
        },
        { name: 'description', type: 'textarea', localized: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional background image of the card.' }
        }
      ]
    }
  ]
}
