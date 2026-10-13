'use client'
import React from 'react'
import { FaFacebook, FaYoutube } from 'react-icons/fa6'

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%"   stopColor="#ffd600" />
        <stop offset="25%"  stopColor="#ff7a00" />
        <stop offset="50%"  stopColor="#ff0069" />
        <stop offset="75%"  stopColor="#d300c5" />
        <stop offset="100%" stopColor="#7638fa" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="url(#ig-grad)" />
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" ry="4" fill="none" stroke="white" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="white" strokeWidth="1.5" />
    <circle cx="17.3" cy="6.7" r="1.1" fill="white" />
  </svg>
)

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20">
    {/* Red shadow (left offset) */}
    <path fill="#ff0000" transform="translate(-1, 1)" d="M16.7 2c.1 2 .8 4.1 2.3 5.6 1.5 1.5 3.6 2.2 5.7 2.4v5.4c-1.9-.1-3.9-.5-5.6-1.3-.8-.4-1.5-.8-2.2-1.2 0 3.9 0 7.8 0 11.7-.1 1.9-.7 3.7-1.8 5.3-1.7 2.6-4.8 4.2-7.9 4.3-1.9.1-3.8-.4-5.4-1.4-2.7-1.6-4.6-4.5-4.9-7.6-.1-.7 0-1.3 0-2 .2-2.5 1.5-5 3.4-6.6 2.2-1.9 5.3-2.8 8.2-2.3 0 2-.1 4-.1 5.9-1.3-.4-2.9-.3-4 .5-.8.5-1.5 1.4-1.8 2.3-.3.7-.2 1.4-.2 2.1.3 2.2 2.4 4 4.7 3.8 1.5 0 2.9-.9 3.7-2.1.3-.4.5-.9.5-1.4.1-2.4.1-4.8.1-7.1 0-5.4 0-10.7 0-16.1h3.5z"/>
    {/* Green shadow (right offset) */}
    <path fill="#82c906" transform="translate(1, -1)" d="M16.7 2c.1 2 .8 4.1 2.3 5.6 1.5 1.5 3.6 2.2 5.7 2.4v5.4c-1.9-.1-3.9-.5-5.6-1.3-.8-.4-1.5-.8-2.2-1.2 0 3.9 0 7.8 0 11.7-.1 1.9-.7 3.7-1.8 5.3-1.7 2.6-4.8 4.2-7.9 4.3-1.9.1-3.8-.4-5.4-1.4-2.7-1.6-4.6-4.5-4.9-7.6-.1-.7 0-1.3 0-2 .2-2.5 1.5-5 3.4-6.6 2.2-1.9 5.3-2.8 8.2-2.3 0 2-.1 4-.1 5.9-1.3-.4-2.9-.3-4 .5-.8.5-1.5 1.4-1.8 2.3-.3.7-.2 1.4-.2 2.1.3 2.2 2.4 4 4.7 3.8 1.5 0 2.9-.9 3.7-2.1.3-.4.5-.9.5-1.4.1-2.4.1-4.8.1-7.1 0-5.4 0-10.7 0-16.1h3.5z"/>
    {/* Black main note */}
    <path fill="#010101" d="M16.7 2c.1 2 .8 4.1 2.3 5.6 1.5 1.5 3.6 2.2 5.7 2.4v5.4c-1.9-.1-3.9-.5-5.6-1.3-.8-.4-1.5-.8-2.2-1.2 0 3.9 0 7.8 0 11.7-.1 1.9-.7 3.7-1.8 5.3-1.7 2.6-4.8 4.2-7.9 4.3-1.9.1-3.8-.4-5.4-1.4-2.7-1.6-4.6-4.5-4.9-7.6-.1-.7 0-1.3 0-2 .2-2.5 1.5-5 3.4-6.6 2.2-1.9 5.3-2.8 8.2-2.3 0 2-.1 4-.1 5.9-1.3-.4-2.9-.3-4 .5-.8.5-1.5 1.4-1.8 2.3-.3.7-.2 1.4-.2 2.1.3 2.2 2.4 4 4.7 3.8 1.5 0 2.9-.9 3.7-2.1.3-.4.5-.9.5-1.4.1-2.4.1-4.8.1-7.1 0-5.4 0-10.7 0-16.1h3.5z"/>
  </svg>
)

const socials = [
  { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=100063605018881',  icon: <FaFacebook  size={18} color="#1877F2" /> },
  { label: 'TikTok',   href: 'https://www.tiktok.com/@abofra.world.scho',    icon: <TikTokIcon /> },
  { label: 'Instagram', href: 'https://www.instagram.com/AbofraWorldSchool', icon: <InstagramIcon /> },
  { label: 'YouTube',  href: 'https://www.youtube.com/@AbofraWorldSchool',   icon: <FaYoutube   size={18} color="#FF0000" /> },
]

const textItems = [
  { label: 'Read our latest newsletter', href: '/news' },
  { label: 'Admissions now open',        href: '/admissions' },
]

const allItems = [
  ...textItems.map(i => ({ ...i, social: false })),
  ...socials.map(i => ({ ...i, social: true })),
]
const doubled = [...allItems, ...allItems]

export default function TickerBar() {
  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#3d3d3d', height: 44 }}>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 35s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 44px;
          padding: 0 28px;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 600;
          color: #d1d5db;
          text-decoration: none;
          border-right: 1px solid #555;
          transition: color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .ticker-item:hover { color: #ffffff; background-color: #82c906; }
      `}</style>
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target={item.social ? '_blank' : '_self'}
            rel="noopener noreferrer"
            className="ticker-item"
          >
            {'icon' in item && (item.icon as React.ReactNode)}
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
