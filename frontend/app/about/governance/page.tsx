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

export default function GovernancePage() {
  return (
    <>
      <InnerPageHero topText="ABOUT" mainText="GOVERNANCE" bgColor="#0f2a3a" imageId="about-governance" />
      <SectionLayout sidebarLinks={aboutLinks} breadcrumb={[{ label: 'About', href: '/about' }, { label: 'Governance' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#82c906' }}>Our Governing Body</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Abofra World School is governed by a dedicated Board of Directors who provide strategic oversight,
          ensure accountability, and champion the best interests of our students, staff and community.
          The Board works in partnership with the school leadership team to uphold our vision and values.
        </p>

        <h2 className="text-xl font-extrabold uppercase mb-3 mt-6" style={{ color: '#82c906' }}>Roles & Responsibilities</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Setting the strategic direction and long-term vision of the school',
            'Ensuring financial accountability and sustainability',
            'Appointing and supporting the Principal and senior leadership',
            'Monitoring academic standards and student welfare',
            'Ensuring compliance with educational regulations and policies',
            'Engaging with parents, staff and the wider community',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="p-5 rounded-xl mt-4" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Transparency & Accountability</p>
          <p className="text-sm text-gray-600">
            Abofra World School is committed to transparent governance. Board meeting summaries and key
            decisions are made available to parents and stakeholders on request. We welcome parent
            engagement and value community input in shaping our school&apos;s future.
          </p>
        </div>
      </SectionLayout>
    </>
  )
}
