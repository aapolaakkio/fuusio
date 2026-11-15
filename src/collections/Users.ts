import { draftMode } from 'next/headers'
import type { CollectionConfig } from 'payload'

import { signedIn } from '@/access/signed-in'

export const Users: CollectionConfig = {
  slug: 'users',
  defaultPopulate: {
    email: true
  },
  access: {
    read: signedIn,
    create: signedIn,
    update: signedIn,
    delete: signedIn
  },
  admin: {
    useAsTitle: 'email',
    group: 'Users'
  },
  // Login is Google OAuth only (see the OAuth2Plugin in payload.config.ts)
  auth: {
    disableLocalStrategy: true
  },
  fields: [],
  hooks: {
    afterLogout: [
      async () => {
        const draft = await draftMode()
        if (draft.isEnabled) {
          draft.disable()
        }
      }
    ]
  }
}
