'use client'

import React, { useEffect, useState } from 'react'
import { I } from '@/src/components/Icons'

function UdemyCourseCard({ c }) {
  return (
    <a href={c.udemyUrl} target="_blank" rel="noopener noreferrer" className="udemy-card" style={{
      textDecoration: 'none',
      color: 'inherit',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--canvas)',
      border: '1px solid var(--ink-100)',
      borderRadius: 14,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = 'var(--brand-300)'
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)'
      e.currentTarget.style.transform = 'translateY(-4px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'var(--ink-100)'
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
      {/* Course Flyer */}
      <div style={{
        background: `linear-gradient(135deg, oklch(0.96 0.03 ${c.hue || 210}), oklch(0.88 0.08 ${c.hue || 210}))`,
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
        fontWeight: 700,
        color: 'var(--ink-400)',
      }}>
        {c.title.charAt(0)}
      </div>

      {/* Course Info */}
      <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontSize: 16,
          fontWeight: 700,
          margin: '0 0 12px',
          color: 'var(--ink-900)',
          lineHeight: 1.4,
        }}>
          {c.title}
        </h3>

        <p style={{
          fontSize: 13,
          color: 'var(--ink-500)',
          margin: '0 0 16px',
        }}>
          by {c.author}
        </p>

        {/* Rating */}
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 16,
          fontSize: 13,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--ink-600)',
          }}>
            <span style={{ color: '#f59e0b' }}>★</span>
            <span style={{ fontWeight: 600 }}>{c.rating}</span>
            <span style={{ color: 'var(--ink-400)' }}>({c.count} reviews)</span>
          </div>
        </div>

        {/* Meta */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          fontSize: 13,
          color: 'var(--ink-500)',
          flexWrap: 'wrap',
        }}>
          <span>{c.hours}</span>
          <span>•</span>
          <span>Self-paced</span>
        </div>

        {/* Price */}
        <div style={{
          marginTop: 'auto',
          paddingTop: 16,
          borderTop: '1px solid var(--ink-100)',
        }}>
          <div style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--ink-900)',
            marginBottom: 12,
          }}>
            {c.price}
          </div>
          <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            View on Udemy <I.Arrow size={12} />
          </button>
        </div>
      </div>
    </a>
  )
}

export default function UdemyPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const BASE = '/api'
    fetch(`${BASE}/udemy-courses?limit=100`)
      .then(r => r.json())
      .then(data => {
        const sorted = (data.docs || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        setCourses(sorted)
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        color: 'var(--ink-500)',
      }}>
        Loading courses...
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '120px 0 80px', background: 'linear-gradient(135deg, var(--brand-50), rgba(37, 99, 235, 0.05))' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--brand-600)',
              marginBottom: 16,
            }}>
              Self-Paced Courses
            </div>
            <h1 style={{
              fontSize: 56,
              margin: '0 0 20px',
              color: 'var(--ink-900)',
              fontWeight: 700,
              lineHeight: 1.1,
            }}>
              Learn at Your Own Pace
            </h1>
            <p style={{
              fontSize: 17,
              color: 'var(--ink-600)',
              margin: '0 auto',
              maxWidth: 600,
              lineHeight: 1.6,
            }}>
              Access our collection of comprehensive courses on Udemy. Learn from industry experts with lifetime access to course materials and updates.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {courses.map((c) => (
              <UdemyCourseCard key={c.id} c={c} />
            ))}
          </div>

          {courses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-500)' }}>
              <p>No courses available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'var(--ink-50)', padding: '80px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 40,
            textAlign: 'center',
          }}>
            <div>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'var(--brand-600)',
                marginBottom: 8,
              }}>
                {courses.length}+
              </div>
              <div style={{
                fontSize: 15,
                color: 'var(--ink-600)',
              }}>
                Quality Courses
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'var(--brand-600)',
                marginBottom: 8,
              }}>
                Lifetime
              </div>
              <div style={{
                fontSize: 15,
                color: 'var(--ink-600)',
              }}>
                Access & Updates
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'var(--brand-600)',
                marginBottom: 8,
              }}>
                $7.50+
              </div>
              <div style={{
                fontSize: 15,
                color: 'var(--ink-600)',
              }}>
                Affordable Learning
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: '#020617', color: '#fff', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(700px 400px at 20% 100%, rgba(37,99,235,0.35), transparent 60%), radial-gradient(600px 400px at 90% -10%, rgba(37,99,235,0.2), transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--brand-200)',
            marginBottom: 12,
          }}>
            Start Learning Today
          </div>
          <h2 style={{
            fontSize: 48,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: '12px auto 14px',
            maxWidth: 800,
          }}>
            Flexible Learning Options
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: 17,
            maxWidth: 560,
            margin: '0 auto 28px',
          }}>
            Choose between structured bootcamps or self-paced Udemy courses — both paths lead to the same quality education.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/programs" className="btn btn-primary btn-lg">Explore Programs <I.Arrow size={16} /></a>
            <a href="/courses" className="btn btn-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>View Courses</a>
          </div>
        </div>
      </section>
    </div>
  )
}
