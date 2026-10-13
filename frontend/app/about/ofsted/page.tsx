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

export default function OfstedPage() {
  return (
    <>
      <InnerPageHero topText="ABOUT US" mainText="OFSTED" bgColor="#2a2a1a" imageId="about-ofsted" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Ofsted' },
        ]}
      >
        <p className="text-gray-700 leading-relaxed mb-4">
          Abofra World School is committed to transparency and accountability. Our most recent inspection
          report and performance data are available below.
        </p>
        <div className="border border-gray-200 rounded p-6 mt-4" style={{ borderLeft: '4px solid #82c906' }}>
          <h3 className="font-bold text-lg mb-2" style={{ color: '#82c906' }}>Latest Inspection Report</h3>
          <p className="text-gray-600 text-sm">
            Our school inspection reports and performance information will be published here.
            Please contact the school office for the latest information.
          </p>
        </div>
      </SectionLayout>
    </>
  )
}
