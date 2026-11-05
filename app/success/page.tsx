'use client'

import { useEffect, useState } from 'react'

interface Section {
  title: string
  rating: 'poor' | 'average' | 'good'
  finding: string
  fix: string
}

interface RoastResult {
  verdict: string
  score: number
  sections: Section[]
  top3fixes: { priority: number; fix: string; impact: string }[]
}

const ratingColor = { poor: '#ff4444', average: '#ffaa00', good: '#44ff88' }
const ratingLabel = { poor: 'Broken', average: 'Weak', good: 'Solid' }

export default function SuccessPage() {
  const [result, setResult] = useState<RoastResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [siteUrl, setSiteUrl] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('roast_pending')
    if (!stored) {
      setError('No website found. Did you come here directly?')
      setLoading(false)
      return
    }
    const { url } = JSON.parse(stored)
    setSiteUrl(url)
    localStorage.removeItem('roast_pending')

    fetch('/api/roast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(r => r.json())
      .then(data => { setResult(data); setLoading(false) })
      .catch(() => { setError('Analysis failed. Email hello@3ftech.co.uk for a manual roast.'); setLoading(false) })
  }, [])

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid #222', borderTop: '3px solid #ff4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>Reading {siteUrl || 'your website'}...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )

  if (error) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <p style={{ color: 'var(--accent)' }}>{error}</p>
    </main>
  )

  if (!result) return null

  return (
    <main style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 1rem 5rem' }}>

      <div style={{ marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--muted)' }}>{siteUrl}</div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
          {result.verdict}
        </h1>
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: result.score <= 4 ? '#ff4444' : result.score <= 6 ? '#ffaa00' : '#44ff88' }}>
          {result.score}/10
        </span>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
        {result.sections.map(s => (
          <div key={s.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.title}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ratingColor[s.rating], background: ratingColor[s.rating] + '22', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                {ratingLabel[s.rating]}
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{s.finding}</p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, borderLeft: '2px solid var(--accent)', paddingLeft: '0.75rem' }}>
              <strong>Fix:</strong> {s.fix}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>The 3 fixes that matter most</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {result.top3fixes.map(f => (
          <div key={f.priority} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 900, fontSize: '1.5rem', lineHeight: 1, minWidth: '1.5rem' }}>{f.priority}</span>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{f.fix}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{f.impact}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Need help fixing it?</p>
        <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>3FTECH builds websites that convert. We fix exactly the problems above.</p>
        <a href="https://3ftech.co.uk" style={{ background: 'var(--accent)', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem' }}>
          Talk to 3FTECH
        </a>
      </div>
    </main>
  )
}
