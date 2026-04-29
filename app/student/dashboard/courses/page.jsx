'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { I } from '@/src/components/Icons'

export default function MyCoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('payload-token')
        if (!token) {
          router.push('/student/login')
          return
        }

        // Fetch all courses and simulate enrollment
        const res = await fetch('/api/courses?limit=100')
        const data = await res.json()

        if (isMounted) {
          // For now, show first 3 courses as "enrolled"
          // In a real app, this would come from a user's enrollment data
          setEnrolledCourses((data.docs || []).slice(0, 3).map(course => ({
            ...course,
            progress: Math.floor(Math.random() * 100),
            lastAccessed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
          })))
          setLoading(false)
        }
      } catch (e) {
        if (isMounted) {
          console.error('Error fetching courses:', e)
          setError('Failed to load courses')
          setLoading(false)
        }
      }
    }

    fetchCourses()
    return () => { isMounted = false }
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
        color: 'var(--ink-300)',
      }}>
        Loading your courses...
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
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--ink-50)' }}>
            Error Loading Courses
          </h2>
          <p style={{ color: 'var(--ink-200)', marginBottom: 24 }}>{error}</p>
          <Link href="/student/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)' }}>
      {/* Main Content */}
      <div className="container" style={{ padding: '60px 0' }}>
        {/* Back Link */}
        <Link href="/student/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--brand-600)',
          textDecoration: 'none',
          marginBottom: 40,
          fontSize: 14,
        }}>
          <I.Chev dir="left" size={16} />
          Back to Dashboard
        </Link>

        {/* Page Title */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 700,
            margin: '0 0 12px',
            color: 'var(--ink-50)',
          }}>
            My Courses
          </h1>
          <p style={{
            fontSize: 18,
            color: 'var(--ink-300)',
            margin: 0,
          }}>
            View your enrolled courses and progress
          </p>
        </div>

        {/* Courses Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {enrolledCourses.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              background: 'var(--canvas)',
              border: '1px solid var(--ink-100)',
              borderRadius: 16,
              padding: 60,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink-50)', marginBottom: 8 }}>
                No courses yet
              </h3>
              <p style={{ color: 'var(--ink-200)', marginBottom: 24 }}>
                Enroll in a course to get started
              </p>
              <Link href="/courses" className="btn btn-primary">
                Explore Courses
              </Link>
            </div>
          ) : (
            enrolledCourses.map((course) => (
              <div key={course.id} style={{
                background: 'var(--canvas)',
                border: '1px solid var(--ink-100)',
                borderRadius: 16,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
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
                {/* Course Icon */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'var(--brand-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  fontSize: 24,
                }}>
                  {['🔧', '🐍', '📊', '☁️', '🤖'][course.id % 5]}
                </div>

                {/* Course Title */}
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: '0 0 4px',
                  color: 'var(--ink-50)',
                }}>
                  {course.title || 'Untitled Course'}
                </h3>

                {/* Category */}
                <p style={{
                  fontSize: 12,
                  color: 'var(--ink-400)',
                  margin: '0 0 16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {course.category?.title || 'General'}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: 12, flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-300)' }}>Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-600)' }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: 6,
                    background: 'var(--ink-100)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      background: 'var(--brand-600)',
                      borderRadius: 999,
                    }} />
                  </div>
                </div>

                {/* Last Accessed */}
                <p style={{
                  fontSize: 12,
                  color: 'var(--ink-400)',
                  margin: '12px 0 16px',
                }}>
                  Last accessed: {course.lastAccessed}
                </p>

                {/* Continue Button */}
                <Link href={`/student/dashboard/courses/${course.id}`} style={{
                  display: 'block',
                  padding: '10px 16px',
                  background: 'var(--brand-600)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}>
                  Continue Learning
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
