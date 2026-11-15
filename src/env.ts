import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Define your environment variable schema here
export const env = createEnv({
  server: {
    NODE_ENV: z.string().default('development'),
    PORT: z.string().optional().default('3000'),

    DATABASE_URI: z.string(),
    PAYLOAD_SECRET: z.string(),

    // Google OAuth is the only way to log in to the admin panel. Without these, nobody can log in.
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    // Let any Google account that logs in become a user. Turn on only to create the first user.
    ALLOW_NON_EXISTING_USERS: z
      .string()
      .default('false')
      .transform((val) => val === 'true'),

    GOOGLE_SITE_VERIFICATION: z.string().optional(),

    ILMO_URL: z.url().default('https://ilmo.fyysikkokilta.fi')
  },
  client: {
    NEXT_PUBLIC_SERVER_URL: z.url().default('http://localhost:3000')
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.IS_CI === 'true'
})
