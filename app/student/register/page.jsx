'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function StudentRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreePrivacy: false,
    agreeTerms: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!formData.agreePrivacy) {
      setError('You must agree to the Privacy Policy')
      return
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the Terms & Conditions')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      // Auto-login after registration
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const loginData = await loginRes.json()

      if (loginData.token) {
        localStorage.setItem('payload-token', loginData.token)
        localStorage.setItem('user-email', formData.email)
        window.dispatchEvent(new Event('storage'));
      }

      router.push('/student/dashboard')
    } catch (e) {
      setError('An error occurred. Please try again.')
      console.error(e)
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
          Create Account
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--ink-500)',
          margin: '0 0 32px',
        }}>
          Start your learning journey today
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--ink-200)',
                borderRadius: 8,
                fontSize: 14,
                boxSizing: 'border-box',
              }}
              placeholder="John Doe"
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
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            <p style={{ fontSize: 12, color: 'var(--ink-400)', margin: '6px 0 0' }}>
              At least 8 characters
            </p>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
              color: 'var(--ink-900)',
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 14,
              color: 'var(--ink-700)',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
                style={{
                  width: 18,
                  height: 18,
                  marginTop: 2,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span>
                I agree to the{' '}
                <Link href="/privacy" target="_blank" style={{
                  color: 'var(--brand-600)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Privacy Policy
                </Link>
              </span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 14,
              color: 'var(--ink-700)',
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                style={{
                  width: 18,
                  height: 18,
                  marginTop: 2,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" target="_blank" style={{
                  color: 'var(--brand-600)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Terms & Conditions
                </Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{
          fontSize: 14,
          color: 'var(--ink-600)',
          margin: '24px 0 0',
          textAlign: 'center',
        }}>
          Already have an account?{' '}
          <Link href="/student/login" style={{
            color: 'var(--brand-600)',
            fontWeight: 600,
            textDecoration: 'none',
          }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
