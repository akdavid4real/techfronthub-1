'use client'

import React, { useEffect, useState } from 'react'
import { I } from '@/src/components/Icons'

function ProgramCard({ p }) {
  return (
    <div className="program-card" style={{
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
      {p.badge && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'var(--brand-100)',
          color: 'var(--brand-700)',
          padding: '6px 12px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.05em',
        }}>
          {p.badge}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        {React.createElement(I[p.icon || 'Briefcase'], { size: 32, color: 'var(--brand-600)' })}
      </div>

      <h3 style={{
        fontSize: 20,
        fontWeight: 700,
        margin: '0 0 12px',
        color: 'var(--ink-900)',
      }}>
        {p.name}
      </h3>

      <p style={{
        fontSize: 15,
        color: 'var(--ink-600)',
        margin: '0 0 24px',
        lineHeight: 1.6,
        flex: 1,
      }}>
        {p.desc}
      </p>

      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--ink-900)',
          marginBottom: 4,
        }}>
          {p.price}
        </div>
        <div style={{
          fontSize: 14,
          color: 'var(--ink-500)',
        }}>
          {p.per}
        </div>
      </div>

      {p.features && p.features.length > 0 && (
        <ul style={{
          listStyle: 'none',
          margin: '0 0 24px',
          padding: 0,
        }}>
          {p.features.map((f, i) => (
            <li key={i} style={{
              display: 'flex',
              gap: 12,
              marginBottom: 12,
              fontSize: 14,
              color: 'var(--ink-600)',
              alignItems: 'flex-start',
            }}>
              <span style={{ color: 'var(--brand-600)', fontWeight: 700, marginTop: 2 }}>✓</span>
              <span>{f.feature || f}</span>
            </li>
          ))}
        </ul>
      )}

      <button className="btn btn-primary" style={{ width: '100%' }}>
        Learn More
      </button>
    </div>
  )
}

export default function ProgramsPage() {
  const [loading, setLoading] = useState(true)
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const BASE = '/api'
    fetch(`${BASE}/packages?limit=100`)
      .then(r => r.json())
      .then(data => {
        const sorted = (data.docs || []).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        setPackages(sorted)
      })
      .catch(() => setPackages([]))
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
        Loading programs...
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
              Learning Programs
            </div>
            <h1 style={{
              fontSize: 56,
              margin: '0 0 20px',
              color: 'var(--ink-900)',
              fontWeight: 700,
              lineHeight: 1.1,
            }}>
              Find Your Perfect Learning Format
            </h1>
            <p style={{
              fontSize: 17,
              color: 'var(--ink-600)',
              margin: '0 auto',
              maxWidth: 600,
              lineHeight: 1.6,
            }}>
              Whether you're looking for structured bootcamps, 1-on-1 coaching, or corporate training, we have a program designed for your learning style and goals.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 32,
            marginBottom: 64,
          }}>
            {packages.map((p) => (
              <ProgramCard key={p.id} p={p} />
            ))}
          </div>

          {packages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink-500)' }}>
              <p>No programs available yet.</p>
            </div>
          )}
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
            Ready to Transform Your Career?
          </div>
          <h2 style={{
            fontSize: 48,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            margin: '12px auto 14px',
            maxWidth: 800,
          }}>
            Choose Your Path
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: 17,
            maxWidth: 560,
            margin: '0 auto 28px',
          }}>
            All programs include hands-on projects, industry expertise, and career support to help you succeed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/courses" className="btn btn-primary btn-lg">Explore Courses <I.Arrow size={16} /></a>
            <a href="/" className="btn btn-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>Contact Sales</a>
          </div>
        </div>
      </section>
    </div>
  )
}
