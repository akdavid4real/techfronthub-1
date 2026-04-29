'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: 'rgba(239,68,68,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        marginBottom: 20,
      }}>
        ✕
      </div>

      <h2 style={{
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--a-text)',
        marginBottom: 8,
      }}>
        Something went wrong
      </h2>

      <p style={{
        fontSize: 13,
        color: 'var(--a-muted)',
        maxWidth: 360,
        lineHeight: 1.65,
        marginBottom: 24,
      }}>
        {error?.message || 'An unexpected error occurred in the admin panel.'}
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary btn-sm" onClick={reset}>
          Retry
        </button>
        <Link href="/admin" className="btn btn-ghost btn-sm">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
