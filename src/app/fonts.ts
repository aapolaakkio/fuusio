import { Fraunces, Nunito } from 'next/font/google'

// Headings: Fraunces with its soft and "wonky" axes turned up for a festive, playful serif.
export const displayFont = Fraunces({
  display: 'swap',
  subsets: ['latin-ext', 'latin'],
  axes: ['SOFT', 'WONK', 'opsz'],
  preload: true,
  variable: '--font-display'
})

// Body: Nunito, a friendly rounded sans.
export const bodyFont = Nunito({
  display: 'swap',
  subsets: ['latin-ext', 'latin'],
  preload: true,
  variable: '--font-body'
})
