import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const aboutLinks = [
  { label: 'Welcome From The Principal', href: '/about/principal' },
  { label: 'Welcome From The Chair',     href: '/about/chair' },
  { label: 'Our Mission, Vision & Values', href: '/about/mission' },
  { label: 'Governance',                 href: '/about/governance' },
  { label: 'Staff',                      href: '/about/staff' },
  { label: 'Pledge To Parents',          href: '/about/pledge' },
]

export default function MissionPage() {
  return (
    <>
      <InnerPageHero topText="OUR" mainText="MISSION, VISION & VALUES" bgColor="#0f2a3a" imageId="about-mission" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Our Mission, Vision & Values' },
        ]}
      >
        <h2 className="text-2xl font-extrabold mb-3 uppercase" style={{ color: '#82c906' }}>Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          To nurture every child&apos;s unique potential by delivering an outstanding education rooted in
          excellence, integrity, innovation and community.
        </p>

        <h2 className="text-2xl font-extrabold mb-3 uppercase" style={{ color: '#82c906' }}>Our Vision</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          To be a world-class school that inspires lifelong learners, confident leaders and responsible
          global citizens who make a positive difference in their communities.
        </p>

        <h2 className="text-2xl font-extrabold mb-3 uppercase" style={{ color: '#82c906' }}>Our Values</h2>
        <ul className="space-y-3">
          {[
            { v: 'Excellence', d: 'Striving to be our best in everything we do.' },
            { v: 'Integrity',  d: 'Being honest, trustworthy and doing the right thing.' },
            { v: 'Innovation', d: 'Encouraging creative thinking and problem solving.' },
            { v: 'Community',  d: 'Growing together as one family, celebrating diversity.' },
          ].map(({ v, d }) => (
            <li key={v} className="flex gap-3 items-start">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              <span className="text-gray-700"><strong>{v}</strong> &mdash; {d}</span>
            </li>
          ))}
        </ul>
      </SectionLayout>
    </>
  )
}
