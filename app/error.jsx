'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>

      <h2 style={{
        fontSize: 'clamp(18px, 2.5vw, 24px)',
        fontWeight: 700,
        color: 'var(--ink-900)',
        marginBottom: 10,
      }}>
        Something went wrong
      </h2>

      <p style={{
        fontSize: 15,
        color: 'var(--ink-400)',
        maxWidth: 400,
        lineHeight: 1.6,
        marginBottom: 28,
      }}>
        An unexpected error occurred. You can try again or go back to the homepage.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={reset}>
          Try Again
        </button>
        <a href="/" className="btn btn-ghost">
          Go Home
        </a>
      </div>
    </div>
  )
}
