import Link from 'next/link'

export const metadata = { title: 'Page Not Found' }

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 96,
        fontWeight: 900,
        lineHeight: 1,
        background: 'linear-gradient(135deg, var(--brand-500), var(--brand-300, #93c5fd))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 16,
      }}>
        404
      </div>

      <h1 style={{
        fontSize: 'clamp(20px, 3vw, 28px)',
        fontWeight: 700,
        color: 'var(--ink-900)',
        marginBottom: 12,
      }}>
        This page doesn't exist
      </h1>

      <p style={{
        fontSize: 16,
        color: 'var(--ink-400)',
        maxWidth: 440,
        lineHeight: 1.65,
        marginBottom: 36,
      }}>
        The link might be broken, or the page may have moved. Head back home or browse our courses.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">
          ← Back to Home
        </Link>
        <Link href="/#courses" className="btn btn-ghost">
          Browse Courses
        </Link>
      </div>
    </div>
  )
}
