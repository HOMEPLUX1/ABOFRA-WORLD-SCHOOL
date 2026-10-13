'use client'
import Link from 'next/link'

export default function PortalHome() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a202c 0%,#2d3748 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎓</div>
        <h1 style={{ color: '#82c906', fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>Abofra World School</h1>
        <p style={{ color: '#a0aec0', fontSize: 15, marginTop: 6 }}>Staff & Parent Portal</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, width: '100%', maxWidth: 600 }}>
        <Link href="/portal/teacher" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,.15)', transition: 'transform .15s', border: '3px solid transparent' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor='#82c906')}
            onMouseLeave={e => (e.currentTarget.style.borderColor='transparent')}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>👩‍🏫</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>Teacher Portal</h2>
            <p style={{ color: '#718096', fontSize: 13, marginTop: 8 }}>Share assignments, enter scores, send reports</p>
          </div>
        </Link>

        <Link href="/portal/parent" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,.15)', transition: 'transform .15s', border: '3px solid transparent' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor='#82c906')}
            onMouseLeave={e => (e.currentTarget.style.borderColor='transparent')}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>👨‍👩‍👧</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>Parent Portal</h2>
            <p style={{ color: '#718096', fontSize: 13, marginTop: 8 }}>View results, fees, assignments, notices</p>
          </div>
        </Link>
      </div>

      <p style={{ color: '#4a5568', fontSize: 12, marginTop: 40 }}>
        Use your ID number and password provided by the school to log in.
      </p>
    </main>
  )
}
