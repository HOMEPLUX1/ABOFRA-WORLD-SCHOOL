'use client'
import { useState } from 'react'
import Link from 'next/link'

const mainLinks = [
  {
    label: 'ABOUT',
    href: '/about',
    children: [
      { label: 'Welcome From The Principal',  href: '/about/principal' },
      { label: 'Welcome From The Chair',      href: '/about/chair' },
      { label: 'Our Mission, Vision & Values',href: '/about/mission' },
      { label: 'Governance',                  href: '/about/governance' },
      { label: 'Staff',                       href: '/about/staff' },
      { label: 'Pledge To Parents',           href: '/about/pledge' },
    ],
  },
  {
    label: 'EDUCATION',
    href: '/education',
    children: [
      { label: 'Curriculum Overview',     href: '/education/curriculum' },
      { label: 'G.E.S',                  href: '/education/ges' },
      { label: 'Cambridge',              href: '/education/cambridge' },
      { label: 'Assessment & Exams',     href: '/education/assessment' },
      { label: 'Homework & Resources',   href: '/education/resources' },
      { label: 'Teacher Portal',         href: '/portal/teacher' },
      { label: 'Parent Portal',          href: '/portal/parent' },
    ],
  },
  {
    label: 'PUPIL SUPPORT',
    href: '/pupil-support',
    children: [
      { label: 'Pastoral Care',           href: '/pupil-support/pastoral' },
      { label: 'Special Educational Needs',href: '/pupil-support/send' },
      { label: 'Counselling Services',    href: '/pupil-support/counselling' },
      { label: 'School Meals',            href: '/pupil-support/meals' },
      { label: 'Uniform Guide',           href: '/pupil-support/uniform' },
      { label: 'Transport',               href: '/pupil-support/transport' },
    ],
  },
  {
    label: 'LEADERSHIP',
    href: '/leadership',
    children: [
      { label: 'School Leadership Team',  href: '/leadership/team' },
      { label: 'Board of Governors',      href: '/leadership/governors' },
      { label: 'Student Council',         href: '/leadership/student-council' },
      { label: 'Vision & Strategy',       href: '/leadership/vision' },
    ],
  },
  {
    label: 'INFORMATION',
    href: '/information',
    children: [
      { label: 'Term Dates',              href: '/information/term-dates' },
      { label: 'School Calendar',         href: '/information/calendar' },
      { label: 'Daily Timetable',         href: '/information/timetable' },
      { label: 'School Fees',             href: '/information/fees' },
      { label: 'Admissions',              href: '/information/admissions' },
      { label: 'Parent Handbook',         href: '/information/handbook' },
      { label: 'Contact Us',              href: '/contact' },
    ],
  },
]

const topLinks = [
  { label: 'Home',    href: '/' },
  { label: 'News',    href: '/news' },
  { label: 'Portal',  href: 'http://localhost:5002/admin' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="w-full shadow-sm" style={{ position: 'relative', zIndex: 1000 }}>

      {/* ── GREEN TOP BAR ── */}
      <div style={{ backgroundColor: '#206802', color: '#fff' }} className="py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href="tel:+233556592410" className="flex items-center gap-1.5 hover:underline" style={{ color: '#fff' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              +233 556 592 410
            </a>
            <a href="mailto:abofraworldschool@gmail.com" className="flex items-center gap-1.5 hover:underline" style={{ color: '#fff' }}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              abofraworldschool@gmail.com
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            {topLinks.map((l) => (
              <Link key={l.label} href={l.href} className="hover:underline font-medium" style={{ color: '#fff' }}>
                {l.label}
              </Link>
            ))}
            <img src="/logo.png" alt="Abofra World School" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: '50%' }} />
          </nav>
        </div>
      </div>

      {/* ── WHITE MAIN NAV ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: 122 }}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* Main school logo */}
            <img src="/logo.png" alt="Abofra World School Logo" style={{ width: 110, height: 110, objectFit: 'contain' }} />
            {/* Divider line + school name image */}
            <div className="flex items-center" style={{ height: '70px', borderLeft: '3px solid #d1d5db', paddingLeft: '8px' }}>
              <img
                src="/school-name.png"
                alt="Abofra World School"
                style={{ height: 142, width: 'auto', objectFit: 'contain' }}
              />
            </div>
          </Link>

          {/* Desktop nav — dropdowns open FROM the link word */}
          <div className="hidden md:flex items-center" style={{ height: '100%' }}>
            {mainLinks.map((link) => (
              <div
                key={link.label}
                style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="px-4 text-base font-bold tracking-wide transition-colors"
                  style={{
                    color: link.label === 'EDUCATION' ? '#206802' : activeDropdown === link.label ? '#82c906' : '#444',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  {link.label}
                </Link>

                {/* Dropdown — positioned from the TOP of this container (which is the nav link) */}
                {activeDropdown === link.label && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',       /* right below this flex item = below the nav text */
                      left: 0,
                      minWidth: 260,
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      border: '1px solid #e5e7eb',
                      borderTop: '3px solid #82c906',
                      zIndex: 9999,
                    }}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '10px 16px',
                          fontSize: 13,
                          color: '#444',
                          borderBottom: '1px solid #f3f4f6',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f9fafb'; (e.currentTarget as HTMLElement).style.color = '#82c906' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = '#444' }}
                      >
                        <span style={{ color: '#aaa', fontSize: 11 }}>›</span>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Search icon */}
            <button aria-label="Search" className="ml-3 text-gray-500 hover:text-green-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100">
            {mainLinks.map((link) => (
              <div key={link.label}>
                <Link href={link.href} className="block px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
                {link.children.map((child) => (
                  <Link key={child.label} href={child.href} className="block px-8 py-2 text-xs text-gray-500 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                    › {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

