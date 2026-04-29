'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { I } from '@/src/components/Icons'

export default function StudentDashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('payload-token')
        if (!token) {
          if (isMounted) {
            router.push('/student/login')
          }
          return
        }

        // Fetch user data
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `JWT ${token}` },
        })

        if (!isMounted) return

        const data = await res.json()

        if (res.ok) {
          setUser(data.user || data)
          setLoading(false)
        } else {
          console.error('Failed to fetch user:', res.status, data)
          setError(`Login expired (${res.status}). Please login again.`)
          router.push('/student/login')
        }
      } catch (e) {
        if (!isMounted) return
        console.error('Error checking auth:', e)
        setError(`Error: ${e.message}`)
        setLoading(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('payload-token')
    localStorage.removeItem('user-email')
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--ink-500)',
      }}>
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          background: 'var(--canvas)',
          border: '1px solid var(--ink-100)',
          borderRadius: 16,
          padding: 40,
          maxWidth: 500,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 12,
            color: 'var(--ink-50)',
          }}>
            Authentication Error
          </h2>
          <p style={{ color: 'var(--ink-200)', marginBottom: 12 }}>
            {error}
          </p>
          <p style={{ color: 'var(--ink-400)', fontSize: 12, marginBottom: 24 }}>
            Check your browser console for more details.
          </p>
          <Link href="/student/login" className="btn btn-primary">
            Login Again
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink-50)',
    }}>
      {/* Main Content */}
      <div className="container" style={{ padding: '60px 0' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'var(--canvas)',
          border: '1px solid var(--ink-100)',
          borderRadius: 16,
          padding: 40,
          marginBottom: 40,
        }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            margin: '0 0 12px',
            color: 'var(--ink-50)',
          }}>
            Welcome back! 👋
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--ink-200)',
            margin: 0,
          }}>
            {user?.email || user?.doc?.email || 'Student'}
          </p>
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {/* My Courses Card */}
          <Link href="/student/dashboard/courses" style={{
            textDecoration: 'none',
            color: 'inherit',
          }}>
            <div style={{
              background: 'var(--canvas)',
              border: '1px solid var(--ink-100)',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-300)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--ink-100)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <I.Briefcase size={32} color="var(--brand-600)" style={{ marginBottom: 16 }} />
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                margin: '0 0 8px',
                color: 'var(--ink-50)',
              }}>
                My Courses
              </h3>
              <p style={{
                fontSize: 14,
                color: 'var(--ink-200)',
                margin: 0,
              }}>
                View your enrolled courses and progress
              </p>
            </div>
          </Link>

          {/* Explore Courses Card */}
          <Link href="/courses" style={{
            textDecoration: 'none',
            color: 'inherit',
          }}>
            <div style={{
              background: 'var(--canvas)',
              border: '1px solid var(--ink-100)',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-300)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--ink-100)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <I.Target size={32} color="var(--brand-600)" style={{ marginBottom: 16 }} />
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                margin: '0 0 8px',
                color: 'var(--ink-50)',
              }}>
                Explore Courses
              </h3>
              <p style={{
                fontSize: 14,
                color: 'var(--ink-200)',
                margin: 0,
              }}>
                Browse and enroll in new courses
              </p>
            </div>
          </Link>

          {/* Settings Card */}
          <Link href="/student/dashboard/settings" style={{
            textDecoration: 'none',
            color: 'inherit',
          }}>
            <div style={{
              background: 'var(--canvas)',
              border: '1px solid var(--ink-100)',
              borderRadius: 16,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-300)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--ink-100)'
              e.currentTarget.style.boxShadow = 'none'
            }}>
              <I.User size={32} color="var(--brand-600)" style={{ marginBottom: 16 }} />
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                margin: '0 0 8px',
                color: 'var(--ink-50)',
              }}>
                Settings
              </h3>
              <p style={{
                fontSize: 14,
                color: 'var(--ink-200)',
                margin: 0,
              }}>
                Update your profile and preferences
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
