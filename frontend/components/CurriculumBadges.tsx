'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const API = ''

export default function CurriculumBadges() {
  const [gesLogo, setGesLogo]   = useState<string | null>(null)
  const [cambLogo, setCambLogo] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API}/api/images`)
      .then(r => r.json())
      .then(data => {
        data.curriculumLogos?.forEach((item: { id: string; url: string | null }) => {
          if (item.id === 'logo-ges' && item.url)      setGesLogo(`${API}${item.url}`)
          if (item.id === 'logo-cambridge' && item.url) setCambLogo(`${API}${item.url}`)
        })
      })
      .catch(() => {})
  }, [])

  return (
    <section className="w-full py-14" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-7xl mx-auto px-6 text-center">

        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-2" style={{ color: '#82c906' }}>
          Curriculum We Run
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wide mb-10">
          Internationally &amp; Nationally Recognised
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

          {/* G.E.S */}
          <Link
            href="/education/ges"
            className="group flex items-center gap-5 px-8 py-6 w-full sm:w-72 transition-all duration-300"
            style={{ backgroundColor: '#222', border: '2px solid #333' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = '#82c906'
              el.style.backgroundColor = '#2a2a2a'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = '#333'
              el.style.backgroundColor = '#222'
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style={{ border: '2px solid #82c906', backgroundColor: '#111' }}
            >
              {gesLogo
                ? <img src={gesLogo} alt="GES" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span className="text-xl font-black" style={{ color: '#82c906' }}>G</span>}
            </div>
            <div className="text-left">
              <p className="font-extrabold text-white text-lg uppercase tracking-wide leading-none mb-1">G.E.S</p>
              <p className="text-xs text-gray-400 leading-snug">Ghana Education Service<br/>National Curriculum</p>
              <p className="text-xs font-bold mt-2 group-hover:underline" style={{ color: '#82c906' }}>Learn more &#8594;</p>
            </div>
          </Link>

          {/* Divider */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <div style={{ width: 1, height: 40, backgroundColor: '#333' }} />
            <span className="text-xs text-gray-600 font-bold">+</span>
            <div style={{ width: 1, height: 40, backgroundColor: '#333' }} />
          </div>

          {/* Cambridge */}
          <Link
            href="/education/cambridge"
            className="group flex items-center gap-5 px-8 py-6 w-full sm:w-72 transition-all duration-300"
            style={{ backgroundColor: '#222', border: '2px solid #333' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = '#82c906'
              el.style.backgroundColor = '#2a2a2a'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = '#333'
              el.style.backgroundColor = '#222'
            }}
          >
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              style={{ border: '2px solid #82c906', backgroundColor: '#111' }}
            >
              {cambLogo
                ? <img src={cambLogo} alt="Cambridge" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <span className="text-xl font-black" style={{ color: '#82c906' }}>C</span>}
            </div>
            <div className="text-left">
              <p className="font-extrabold text-white text-lg uppercase tracking-wide leading-none mb-1">Cambridge</p>
              <p className="text-xs text-gray-400 leading-snug">Cambridge International<br/>University of Cambridge, UK</p>
              <p className="text-xs font-bold mt-2 group-hover:underline" style={{ color: '#82c906' }}>Learn more &#8594;</p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}
