import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const aboutLinks = [
  { label: 'Welcome From The Principal', href: '/about/principal' },
  { label: 'Welcome From The Chair',     href: '/about/chair' },
  { label: 'Our Mission, Vision & Values', href: '/about/mission' },
  { label: 'Governance',                 href: '/about/governance' },
  { label: 'Staff',                      href: '/about/staff' },
  { label: 'Ofsted',                     href: '/about/ofsted' },
  { label: 'Policies & Publications',    href: '/about/policies' },
  { label: 'Pledge To Parents',          href: '/about/pledge' },
]

const policies = [
  'Admissions Policy', 'Anti-Bullying Policy', 'Attendance Policy',
  'Behaviour Policy', 'Child Protection & Safeguarding Policy',
  'Complaints Policy', 'Equality & Diversity Policy',
  'Health & Safety Policy', 'SEND Policy', 'Uniform Policy',
]

export default function PoliciesPage() {
  return (
    <>
      <InnerPageHero topText="ABOUT US" mainText="POLICIES & PUBLICATIONS" bgColor="#3a1a1a" imageId="about-policies" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Policies & Publications' },
        ]}
      >
        <p className="text-gray-700 leading-relaxed mb-6">
          Below you will find our key school policies and publications. If you require a document not
          listed here, please contact the school office.
        </p>
        <ul className="space-y-2">
          {policies.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-gray-700 border-b border-gray-100 py-2">
              <span style={{ color: '#82c906' }}>&#8250;</span>
              <span>{p}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#f0fdf0', color: '#206802' }}>PDF</span>
            </li>
          ))}
        </ul>
      </SectionLayout>
    </>
  )
}
