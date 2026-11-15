import { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export default async function proxy(req: NextRequest) {
  return intlMiddleware(req)
}

export const config = {
  matcher: ['/', '/(fi|en)/:path*', '/((?!api|_next|_vercel|admin|.*\\..*).*)']
}
