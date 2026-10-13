'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const slides = [
  { word: 'EXCELLENCE',    color: '#1a3a1a', id: 'hero-0' },
  { word: 'INTEGRITY',     color: '#1a2a3a', id: 'hero-1' },
  { word: 'INNOVATION',    color: '#2a1a3a', id: 'hero-2' },
  { word: 'COMMUNITY',     color: '#1a1a2a', id: 'hero-3' },
  { word: 'COURAGE',       color: '#2a1a1a', id: 'hero-0' },
  { word: 'LEADERSHIP',    color: '#1a2a1a', id: 'hero-1' },
  { word: 'DETERMINATION', color: '#1a1a3a', id: 'hero-2' },
  { word: 'PERSEVERANCE',  color: '#2a2a1a', id: 'hero-3' },
]

const API = 'http://localhost:5002'

export default function Hero() {
  const [current, setCurrent]     = useState(0)
  const [visible, setVisible]     = useState(true)
  const [images, setImages]       = useState<Record<string, string>>({})
  const [gesLogo, setGesLogo]     = useState<string | null>(null)
  const [cambLogo, setCambLogo]   = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/api/images`)
      .then(r => r.json())
      .then(data => {
        const map: Record<string, string> = {}
        data.hero?.forEach((item: { id: string; url: string | null }) => {
          if (item.url) map[item.id] = `${API}${item.url}`
        })
        setImages(map)
        data.curriculumLogos?.forEach((item: { id: string; url: string | null }) => {
          if (item.id === 'logo-ges' && item.url)      setGesLogo(`${API}${item.url}`)
          if (item.id === 'logo-cambridge' && item.url) setCambLogo(`${API}${item.url}`)
        })
      })
      .catch(() => {})
  }, [])

  const goTo = (idx: number) => {
    setVisible(false)
    setTimeout(() => { setCurrent(idx); setVisible(true) }, 350)
  }

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [current])

  return (
    <section className="relative w-full overflow-hidden" style={{ height: '70vh', minHeight: 480 }}>

      {/* Background slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            backgroundColor: slide.color,
            backgroundImage: images[slide.id]
              ? `url(${images[slide.id]})`
              : `radial-gradient(ellipse at 70% 50%, #2d4a2d88 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, #1a2a1a99 0%, transparent 50%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}


      {/* Left arrow */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Previous"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Next"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bottom-left text */}
      <div className="absolute bottom-0 left-0 z-10 pb-12 pl-10 md:pl-20 flex flex-col items-start">
        <div
          style={{
            backgroundColor: '#82c906',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            borderTop: '2px solid #ffffff',
            borderLeft: '2px solid #ffffff',
            borderBottomRightRadius: '24px',
          }}
          className="px-6 py-3"
        >
          <span className="font-extrabold text-4xl md:text-5xl tracking-wide uppercase" style={{ color: '#3d3d3d' }}>
            {slides[current].word}
          </span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-6 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="w-2.5 h-2.5 rounded-full border border-white transition-all"
            style={{ backgroundColor: i === current ? '#82c906' : 'transparent' }}
          />
        ))}
      </div>

    </section>
  )
}
