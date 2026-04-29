'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function StudentLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Attempting login with:', { email })
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log('Login response:', { status: res.status, data })

      if (!res.ok) {
        setError(data.message || data.error || `Login failed (${res.status})`)
        return
      }

      // Store token and email
      if (data.token) {
        localStorage.setItem('payload-token', data.token)
        localStorage.setItem('user-email', email)
        window.dispatchEvent(new Event('storage'));
        console.log('Token stored, redirecting...')
      } else {
        setError('No token received from server')
        return
      }

      // Redirect to dashboard
      router.push('/student/dashboard')
    } catch (e) {
      const errorMsg = e.message || 'An error occurred. Please try again.'
      setError(errorMsg)
      console.error('Login error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--brand-50), rgba(37, 99, 235, 0.05))',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--canvas)',
        border: '1px solid var(--ink-100)',
        borderRadius: 16,
        padding: 40,
      }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          margin: '0 0 8px',
          color: 'var(--ink-900)',
        }}>
          Student Login
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--ink-500)',
          margin: '0 0 32px',
        }}>
          Access your learning dashboard
        </p>

        {error && (
          <div style={{
            background: '#fee',
            border: '1px solid #fcc',
            color: '#c33',
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
              color: 'var(--ink-900)',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--ink-200)',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
              color: 'var(--ink-900)',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--ink-200)',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{
          fontSize: 14,
          color: 'var(--ink-600)',
          margin: '24px 0 0',
          textAlign: 'center',
        }}>
          Don't have an account?{' '}
          <Link href="/student/register" style={{
            color: 'var(--brand-600)',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
