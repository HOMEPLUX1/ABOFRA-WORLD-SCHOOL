'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const API = ''

const cards = [
  {
    title: 'PLEDGE OF\nEXCELLENCE',
    href: '/about/pledge',
    bg: 'linear-gradient(160deg,#0f2a0f 0%,#1e4d1e 50%,#0f2a0f 100%)',
    id: 'card-pledge',
  },
  {
    title: 'INSPIRING\nLEADERS',
    href: '/leadership',
    bg: 'linear-gradient(160deg,#2a1f0f 0%,#5a3e10 50%,#2a1a05 100%)',
    id: 'card-leaders',
  },
  {
    title: 'ADMISSIONS',
    href: '/information/admissions',
    bg: 'linear-gradient(160deg,#0f1a2a 0%,#1e3a5a 50%,#0a1520 100%)',
    id: 'card-admissions',
  },
]

export default function FeatureCards() {
  const [images, setImages] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch(`${API}/api/images`)
      .then(r => r.json())
      .then(data => {
        const map: Record<string, string> = {}
        data.featureCards?.forEach((item: { id: string; url: string | null }) => {
          if (item.url) map[item.id] = `${API}${item.url}`
        })
        setImages(map)
      })
      .catch(() => {})
  }, [])
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ minHeight: 280 }}>

        {/* First 3 cards */}
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="relative group overflow-hidden flex items-end"
            style={{ minHeight: 280, background: card.bg }}
          >
            {/* Zoom background on hover */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-110"
              style={{
                background: card.bg,
                backgroundImage: images[card.id] ? `url(${images[card.id]})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
              style={{ backgroundColor: '#000' }} />

            {/* Green tint overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{ backgroundColor: '#82c906' }} />

            {/* Title + Read More */}
            <div className="relative z-10 p-6 w-full">
              <h3 className="text-white font-extrabold text-2xl md:text-3xl uppercase leading-tight whitespace-pre-line drop-shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
                {card.title}
              </h3>
              {/* Read More â€” slides up on hover */}
              <div className="flex items-center gap-2 mt-2 overflow-hidden max-h-0 group-hover:max-h-10 transition-all duration-400 ease-out opacity-0 group-hover:opacity-100">
                <span className="font-bold text-sm uppercase tracking-widest" style={{ color: '#82c906' }}>
                  Read More
                </span>
                <span style={{ color: '#82c906' }}>&#8250;</span>
              </div>
            </div>
          </Link>
        ))}

        {/* 4th card â€” JOIN OUR TEAM */}
        <div
          className="relative flex flex-col items-center justify-center p-8 text-center"
          style={{ minHeight: 280, background: 'linear-gradient(160deg,#1a2a1a 0%,#2d4a2d 100%)' }}
        >
          <div className="border-2 border-white border-opacity-70 p-6 w-full">
            <h3 className="text-white font-extrabold text-2xl uppercase tracking-wide mb-3">
              JOIN OUR TEAM
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed mb-5">
              Play a part in our vision to nurture today&apos;s young people and inspire tomorrow&apos;s leaders.
            </p>
            <Link
              href="/contact"
              className="inline-block border-2 border-white text-white font-extrabold text-sm uppercase tracking-widest px-6 py-2 transition-all duration-200 hover:text-gray-900"
              style={{}}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#82c906'; (e.currentTarget as HTMLElement).style.borderColor = '#82c906' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'white' }}
            >
              LEARN MORE
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
