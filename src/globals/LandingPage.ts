import { BlocksFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { GlobalConfig } from 'payload'

import { publishedOrSignedIn } from '@/access/published-or-signed-in'
import { signedIn } from '@/access/signed-in'
import { env } from '@/env'
import { ColorField } from '@/fields/ColorField'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  access: {
    read: publishedOrSignedIn,
    update: signedIn
  },
  admin: {
    group: 'Pages',
    description: 'Settings for the landing page',
    preview: (doc, { req }) => {
      const baseUrl = env.NEXT_PUBLIC_SERVER_URL
      const locale = typeof req.query?.locale === 'string' ? req.query.locale : req.locale || 'fi'
      return `${baseUrl}/api/draft?slug=/${locale}`
    }
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Title of the landing page'
              }
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Short line shown under the title in the hero, e.g. the date and place.'
              }
            },
            {
              name: 'heroLinks',
              type: 'array',
              maxRows: 3,
              admin: {
                description: 'Buttons in the hero, e.g. a link to the registration.'
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true },
                    {
                      name: 'url',
                      type: 'text',
                      required: true,
                      admin: {
                        description: 'Full URL (https://...) or a path inside this site (/fuusio).'
                      }
                    }
                  ]
                }
              ]
            },
            {
              name: 'bannerImages',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description:
                  'Background images of the hero. Multiple images are shown in a slideshow. Without images the hero has a plain dark background.'
              }
            },
            {
              name: 'announcement',
              type: 'group',
              admin: {
                description:
                  'Announcement for the landing page. This is shown right under the hero. Used for example when the registration opens.'
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description:
                      'Enable the announcement. If disabled, the announcement will not be shown.'
                  }
                },
                {
                  name: 'content',
                  type: 'richText',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => {
                      return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
                        BlocksFeature({ blocks: [] })
                      ]
                    }
                  }),
                  admin: {
                    description: 'Content of the announcement. Remember to provide all locales.'
                  },
                  localized: true
                },
                ColorField({
                  name: 'color',
                  label: 'Background Color',
                  required: true,
                  admin: {
                    description: 'Background color of the announcement.'
                  },
                  defaultValue: '#fbdb1d'
                }),
                ColorField({
                  name: 'textColor',
                  label: 'Text Color',
                  required: true,
                  admin: {
                    description: 'Text color of the announcement.'
                  },
                  defaultValue: '#000000'
                })
              ]
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true
            }
          ]
        }
      ]
    }
  ],
  versions: {
    max: env.NODE_ENV === 'production' ? 100 : 20,
    drafts: {
      autosave: {
        interval: 1000
      }
    }
  },
  hooks: {
    afterChange: [revalidateGlobal('landing-page')]
  }
}
