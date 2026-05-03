'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InstructorLoginPage() {
  const router = useRouter()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/instructors/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.errors?.[0]?.message || data?.message || 'Invalid credentials. Please try again.')
        return
      }

      if (!data?.token) {
        setError('Login failed — no token returned. Please try again.')
        return
      }

      localStorage.setItem('instructor-token', data.token)
      localStorage.setItem('instructor-email', email)
      router.push('/instructor/dashboard')
    } catch {
      setError('Unable to reach the server. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="i-login-root">
      <div className="i-login-card">

        {/* Logo mark */}
        <div className="i-login-brand">
          <div className="i-login-mark">TF</div>
          <div className="i-login-brand-text">
            <span className="i-login-brand-name">TECHFRONT<span className="i-login-brand-dot">.</span>HUB</span>
            <span className="i-login-brand-sub">Instructor Portal</span>
          </div>
        </div>

        <h1 className="i-login-heading">Sign in to your account</h1>
        <p className="i-login-subheading">Welcome back. Enter your instructor credentials below.</p>

        {error && (
          <div className="i-login-error" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="i-login-form" noValidate>
          <div className="i-login-field">
            <label htmlFor="instructor-email" className="i-login-label">
              Email address
            </label>
            <input
              id="instructor-email"
              type="email"
              autoComplete="email"
              required
              className="i-login-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="i-login-field">
            <label htmlFor="instructor-password" className="i-login-label">
              Password
            </label>
            <input
              id="instructor-password"
              type="password"
              autoComplete="current-password"
              required
              className="i-login-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="i-login-btn"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <span className="i-login-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign in
              </>
            )}
          </button>
        </form>

        <div className="i-login-footer">
          <Link href="/" className="i-login-back">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  )
}
