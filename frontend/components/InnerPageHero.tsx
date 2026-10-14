'use client'
import { useEffect, useState } from 'react'

const API = ''

interface InnerPageHeroProps {
  topText: string
  mainText: string
  bgColor?: string
  imageId?: string
}

export default function InnerPageHero({ topText, mainText, bgColor = '#2d4a2d', imageId }: InnerPageHeroProps) {
  const [ready, setReady]     = useState(false)
  const [imgUrl, setImgUrl]   = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!imageId) return
    fetch(`${API}/api/images`)
      .then(r => r.json())
      .then(data => {
        const all = [...(data.innerPages || []), ...(data.featureCards || [])]
        const item = all.find((x: { id: string; url: string | null }) => x.id === imageId)
        if (item?.url) setImgUrl(`${API}${item.url}`)
      })
      .catch(() => {})
  }, [imageId])

  return (
    <section
      className="relative w-full flex items-end overflow-hidden"
      style={{
        height: 500,
        background: `linear-gradient(135deg, ${bgColor} 0%, #0f1a0f 100%)`,
        backgroundImage: imgUrl ? `url(${imgUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandWidth {
          from { width: 0; }
          to   { width: 120px; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0px #82c906; }
          50%       { box-shadow: 0 0 24px #82c90688; }
        }
      `}</style>

      {/* Diagonal stripe overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #82c906 0px, #82c906 1px, transparent 0px, transparent 50%)',
        backgroundSize: '40px 40px',
        opacity: 0.06,
      }} />

      {/* Right-side decorative green accent bar */}
      <div className="absolute right-0 top-0 bottom-0" style={{
        width: 6,
        backgroundColor: '#82c906',
        animation: ready ? 'fadeIn 0.8s ease 0.9s both' : 'none',
        opacity: ready ? undefined : 0,
      }} />

      {/* Decorative circle */}
      <div className="absolute" style={{
        right: 80, top: '50%', transform: 'translateY(-50%)',
        width: 200, height: 200,
        borderRadius: '50%',
        border: '2px solid #82c90633',
        animation: ready ? 'fadeIn 1s ease 0.6s both' : 'none',
        opacity: ready ? undefined : 0,
      }} />
      <div className="absolute" style={{
        right: 110, top: '50%', transform: 'translateY(-50%)',
        width: 140, height: 140,
        borderRadius: '50%',
        border: '2px solid #82c90655',
        animation: ready ? 'fadeIn 1s ease 0.8s both' : 'none',
        opacity: ready ? undefined : 0,
      }} />

      {/* Text area */}
      <div className="relative z-10 pb-14 pl-10 md:pl-20 flex flex-col items-start gap-2">

        {/* Top label â€” slides in from left */}
        <div
          style={{
            backgroundColor: '#82c906',
            animation: ready ? 'slideInLeft 0.55s cubic-bezier(0.22,1,0.36,1) 0.1s both' : 'none',
            opacity: ready ? undefined : 0,
          }}
          className="px-5 py-2"
        >
          <span className="font-bold text-xs uppercase tracking-[0.2em]" style={{ color: '#1a1a1a' }}>
            {topText}
          </span>
        </div>

        {/* Main title â€” slides up */}
        <div
          style={{
            backgroundColor: '#3d3d3d',
            animation: ready ? 'slideInUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.28s both' : 'none',
            opacity: ready ? undefined : 0,
            animationFillMode: 'both',
          }}
          className="px-6 py-4"
        >
          <span className="font-extrabold uppercase" style={{ fontSize: '2.8rem', color: '#f3f4f6', letterSpacing: '0.04em', lineHeight: 1 }}>
            {mainText}
          </span>
        </div>

        {/* Animated green underline */}
        <div style={{
          height: 4,
          backgroundColor: '#82c906',
          animation: ready ? 'expandWidth 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both' : 'none',
          width: ready ? undefined : 0,
        }} />
      </div>
    </section>
  )
}
