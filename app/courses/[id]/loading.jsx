export default function CourseLoading() {
  const shimmer = {
    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    borderRadius: 8,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Back nav */}
      <div style={{ borderBottom: '1px solid #e2e8f0', padding: '14px 24px' }}>
        <div style={{ ...shimmer, width: 120, height: 16 }} />
      </div>

      {/* Banner skeleton */}
      <div style={{ background: '#f1f5f9', padding: '56px 24px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ ...shimmer, width: 80, height: 24 }} />
            <div style={{ ...shimmer, width: 60, height: 24 }} />
          </div>
          <div style={{ ...shimmer, width: '55%', height: 44, marginBottom: 14 }} />
          <div style={{ ...shimmer, width: '70%', height: 20, marginBottom: 8 }} />
          <div style={{ ...shimmer, width: '50%', height: 20, marginBottom: 32 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            {[120, 130, 110].map((w, i) => (
              <div key={i} style={{ ...shimmer, width: w, height: 56, borderRadius: 10 }} />
            ))}
          </div>
        </div>
      </div>

      {/* Body skeleton */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ ...shimmer, width: 160, height: 28, marginBottom: 8 }} />
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ ...shimmer, height: 56, borderRadius: 10 }} />
          ))}
        </div>
        <div style={{ ...shimmer, height: 420, borderRadius: 16 }} />
      </div>
    </div>
  )
}
