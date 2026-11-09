'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Extracurricular', href: '/student-life/extracurricular', color: '#a78bfa' },
  { label: 'Sports & Games',  href: '/student-life/sports',          color: '#34d399' },
  { label: 'Arts & Culture',  href: '/student-life/arts',            color: '#f59e0b' },
  { label: 'Clubs',           href: '/student-life/clubs',           color: '#60a5fa' },
  { label: 'Gallery',         href: '/student-life/gallery',         color: '#f472b6' },
  { label: 'Student Council', href: '/leadership/student-council',   color: '#fb923c' },
]

type Props = {
  title: string
  subtitle: string
  accent: string
  children: React.ReactNode
}

export default function StudentLifeLayout({ title, subtitle, accent, children }: Props) {
  const pathname = usePathname()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060818 0%, #0d0d2b 40%, #0a1a18 100%)',
      paddingBottom: 80,
    }}>

      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%',  width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '30%',  right: '-8%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,.14) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '5%',left: '20%',  width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: '60%',  right: '25%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,114,182,.10) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, padding: '64px 24px 40px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 100,
          padding: '6px 20px',
          marginBottom: 20,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.2em', textTransform: 'uppercase', color: accent }}>STUDENT LIFE</span>
        </div>
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 52px)',
          fontWeight: 900,
          letterSpacing: '-.01em',
          color: '#fff',
          marginBottom: 12,
          textShadow: `0 0 60px ${accent}44`,
        }}>{title}</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.55)', maxWidth: 520, margin: '0 auto' }}>{subtitle}</p>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, margin: '24px auto 0', borderRadius: 2 }} />
      </div>

      {/* Nav pills */}
      <div style={{ position: 'relative', zIndex: 1, overflowX: 'auto', display: 'flex', justifyContent: 'center', padding: '0 20px 32px', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {navLinks.map(link => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 20px',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '.06em',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all .2s',
                background: active ? link.color : 'rgba(255,255,255,.07)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${active ? link.color : 'rgba(255,255,255,.12)'}`,
                color: active ? '#000' : 'rgba(255,255,255,.75)',
                boxShadow: active ? `0 0 20px ${link.color}55` : 'none',
              }}>
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
        {children}
      </div>

    </div>
  )
}
