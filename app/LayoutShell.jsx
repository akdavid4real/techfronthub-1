'use client'

import { usePathname } from 'next/navigation'
import { TopBar, Header, Footer } from '@/src/components/Layout'

export function LayoutShell({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <TopBar />}
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
    </>
  )
}
