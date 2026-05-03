'use client'

import { usePathname } from 'next/navigation'
import { TopBar, Header, Footer } from '@/src/components/Layout'

export function LayoutShell({ children }) {
  const pathname = usePathname()
  const isAdmin      = pathname.startsWith('/admin')
  const isInstructor = pathname.startsWith('/instructor')
  const isShell      = !isAdmin && !isInstructor

  return (
    <>
      {isShell && <TopBar />}
      {isShell && <Header />}
      {children}
      {isShell && <Footer />}
    </>
  )
}
