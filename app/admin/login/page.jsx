'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/src/lib/payload-api'
import { useAuth } from '@/src/components/AdminAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      if (data?.user) {
        setUser(data.user)
        router.replace('/admin')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
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
      background: 'var(--a-bg)',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--a-text)', letterSpacing: '-0.3px' }}>
            <span style={{ color: 'var(--a-brand)' }}>T</span>ECHFRONT Admin
          </div>
          <div style={{ color: 'var(--a-muted)', fontSize: 13, marginTop: 6 }}>Sign in to manage your content</div>
        </div>

        <div className="a-card">
          <form className="a-form" onSubmit={handleSubmit}>
            {error && <div className="a-error">{error}</div>}

            <div className="a-field">
              <label className="a-label">Email</label>
              <input
                className="a-input"
                type="email"
                placeholder="admin@techfronthub.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="a-field">
              <label className="a-label">Password</label>
              <input
                className="a-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: 4 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
