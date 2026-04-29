import { LayoutShell } from './LayoutShell'
import './globals.css'

export const metadata = {
  title: {
    default:  'TECHFRONT HUB — Nigeria\'s Career-Focused Tech Academy',
    template: '%s — TECHFRONT HUB',
  },
  description:
    'Cohort-based bootcamps, 1-on-1 coaching and corporate training in data analytics, engineering, AI, DevOps and more. Based in Ibadan & Lagos.',
  keywords: [
    'tech training Nigeria', 'data analytics bootcamp', 'coding school Nigeria',
    'DevOps training', 'AI automation course', 'TECHFRONT HUB', 'Ibadan tech academy',
  ],
  authors: [{ name: 'TECHFRONT HUB', url: 'https://techfronthub.ng' }],
  openGraph: {
    type:        'website',
    locale:      'en_NG',
    url:         'https://techfronthub.ng',
    siteName:    'TECHFRONT HUB',
    title:       'TECHFRONT HUB — Nigeria\'s Career-Focused Tech Academy',
    description: 'Cohort bootcamps, 1-on-1 coaching and corporate training in data, engineering and AI.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'TECHFRONT HUB',
    description: 'Nigeria\'s career-focused tech academy.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  )
}
