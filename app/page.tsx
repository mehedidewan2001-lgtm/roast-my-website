'use client'

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    let cleanUrl = url.trim()
    if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl
    if (!cleanUrl || !email) {
      setError('Enter both your website URL and email.')
      return
    }

    setLoading(true)
    localStorage.setItem('roast_pending', JSON.stringify({ url: cleanUrl, email }))
    window.location.href = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK!
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 1rem', maxWidth: '640px', margin: '0 auto' }}>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          Brutal Website Audit
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
          Your website is<br />
          <span style={{ color: 'var(--accent)' }}>probably losing</span><br />
          you customers.
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '480px' }}>
          We read it, we roast it, we tell you exactly what&apos;s broken.
          No agency speak. No generic advice. Just the truth — delivered in under 60 seconds.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Your website URL
          </label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            required
            style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', fontSize: '1rem', color: 'var(--text)', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            Your email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@yourcompany.com"
            required
            style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.9rem 1rem', fontSize: '1rem', color: 'var(--text)', outline: 'none' }}
          />
        </div>

        {error && (
          <p style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', padding: '1rem', fontSize: '1.05rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '0.5rem', letterSpacing: '-0.01em' }}
        >
          {loading ? 'Redirecting...' : 'Roast My Website — £9'}
        </button>

        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
          One-time payment. Results in under 60 seconds.<br />
          Powered by AI trained on thousands of high-converting websites.
        </p>
      </form>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        {[
          { label: 'Copy & messaging', desc: 'Is it clear what you do and who it\'s for?' },
          { label: 'Conversion leaks', desc: 'Where are visitors dropping off and why?' },
          { label: 'The 3 fastest fixes', desc: 'Ranked by revenue impact, not effort.' },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>{item.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', fontSize: '0.75rem', color: '#444', textAlign: 'center' }}>
        Built by <a href="https://3ftech.co.uk" style={{ color: 'var(--muted)', textDecoration: 'none' }}>3FTECH</a>
      </div>
    </main>
  )
}
