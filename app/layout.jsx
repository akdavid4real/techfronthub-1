import { LayoutShell } from './LayoutShell'
import './globals.css'

export const viewport = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'

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
