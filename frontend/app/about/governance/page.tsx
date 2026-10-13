import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const aboutLinks = [
  { label: 'Welcome From The Principal', href: '/about/principal' },
  { label: 'Welcome From The Chair',     href: '/about/chair' },
  { label: 'Our Mission, Vision & Values', href: '/about/mission' },
  {
    label: 'Governance', href: '/about/governance',
    children: [
      { label: 'Governor Information',          href: '/about/governance' },
      { label: 'Legal & Financial Information', href: '/about/governance' },
    ],
  },
  { label: 'Staff',                      href: '/about/staff' },
  { label: 'Pledge To Parents',          href: '/about/pledge' },
]

export default function GovernancePage() {
  return (
    <>
      <InnerPageHero topText="ABOUT US" mainText="GOVERNANCE" bgColor="#2a1a0f" imageId="about-governance" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Governance' },
        ]}
      >
        <p className="text-gray-700 leading-relaxed mb-4">
          The Board of Governors plays a vital role in ensuring the highest standards of education and
          welfare at Abofra World School. Governors work in partnership with the Principal and staff to
          set strategic direction, monitor performance and ensure accountability.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3 uppercase" style={{ color: '#82c906' }}>Governor Information</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our governing body is made up of dedicated volunteers from the local community, parents, staff
          and appointed members who bring a wealth of experience and expertise.
        </p>
        <h2 className="text-xl font-bold mt-6 mb-3 uppercase" style={{ color: '#82c906' }}>Legal & Financial Information</h2>
        <p className="text-gray-700 leading-relaxed">
          Full details of our legal status, financial accounts and governance documents are available
          on request. Please contact the school office for further information.
        </p>
      </SectionLayout>
    </>
  )
}
