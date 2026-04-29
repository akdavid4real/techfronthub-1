'use client'

import React, { useEffect, useState } from 'react'
import { I } from '@/src/components/Icons'

function TestimonialCard({ t }) {
  return (
    <div className="testimonial-card" style={{
      background: 'var(--canvas)',
      border: '1px solid var(--ink-100)',
      borderRadius: 16,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
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
      {/* Rating Stars */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 20,
        fontSize: 16,
      }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ color: '#f59e0b' }}>★</span>
        ))}
      </div>

      {/* Quote */}
      <p style={{
        fontSize: 15,
        color: 'var(--ink-700)',
        margin: '0 0 24px',
        lineHeight: 1.7,
        fontStyle: 'italic',
        flex: 1,
      }}>
        "{t.quote}"
      </p>

      {/* Author */}
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        paddingTop: 20,
        borderTop: '1px solid var(--ink-100)',
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 50,
          background: 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 14,
          fontWeight: 700,
        }}>
          {t.initials}
        </div>
        <div>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--ink-900)',
            marginBottom: 2,
          }}>
            {t.name}
          </div>
          <div style={{
            fontSize: 13,
            color: 'var(--ink-500)',
          }}>
            {t.role}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const [loading, setLoading] = useState(true)
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    const BASE = '/api'
    fetch(`${BASE}/testimonials?limit=100`)
      .then(r => r.json())
      .then(data => {
        setTestimonials(data.docs || [])
      })
      .catch(() => setTestimonials([]))
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
        Loading reviews...
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
              Student Success Stories
            </div>
            <h1 style={{
              fontSize: 56,
              margin: '0 0 20px',
              color: 'var(--ink-900)',
              fontWeight: 700,
              lineHeight: 1.1,
            }}>
              Hear From Our Learners
            </h1>
            <p style={{
              fontSize: 17,
              color: 'var(--ink-600)',
              margin: '0 auto',
              maxWidth: 600,
              lineHeight: 1.6,
            }}>
              Real stories from real learners who've transformed their careers through TECHFRONT HUB programs.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 32,
          }}>
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>

          {testimonials.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-500)' }}>
              <p>No reviews available yet.</p>
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
                {testimonials.length}+
              </div>
              <div style={{
                fontSize: 15,
                color: 'var(--ink-600)',
              }}>
                Success Stories
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'var(--brand-600)',
                marginBottom: 8,
              }}>
                4.8★
              </div>
              <div style={{
                fontSize: 15,
                color: 'var(--ink-600)',
              }}>
                Average Rating
              </div>
            </div>
            <div>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'var(--brand-600)',
                marginBottom: 8,
              }}>
                87%
              </div>
              <div style={{
                fontSize: 15,
                color: 'var(--ink-600)',
              }}>
                Job Placement Rate
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
            Ready for Your Transformation?
          </div>
          <h2 style={{
            fontSize: 48,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: '12px auto 14px',
            maxWidth: 800,
          }}>
            Start Your Journey Today
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: 17,
            maxWidth: 560,
            margin: '0 auto 28px',
          }}>
            Join thousands of learners who've achieved their career goals through hands-on learning and expert mentorship.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/courses" className="btn btn-primary btn-lg">Explore Courses <I.Arrow size={16} /></a>
            <a href="/programs" className="btn btn-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>View Programs</a>
          </div>
        </div>
      </section>
    </div>
  )
}
