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

export default function ChairPage() {
  return (
    <>
      <InnerPageHero topText="WELCOME FROM THE" mainText="CHAIR" bgColor="#1a3a2a" imageId="about-chair" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Welcome from the Chair' },
        ]}
      >
        <p className="text-gray-700 leading-relaxed mb-4">
          On behalf of the Board of Governors, I would like to extend a warm welcome to Abofra World School.
          We are extremely proud of our school and the outstanding community it serves.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our governors are dedicated to ensuring that Abofra World School continues to provide an excellent
          education and that every child reaches their full potential. We work closely with the Principal and
          staff to set the strategic direction of the school.
        </p>
        <p className="font-bold mt-6" style={{ color: '#82c906' }}>Chair of Governors</p>
        <p className="text-gray-600 text-sm">Abofra World School</p>
      </SectionLayout>
    </>
  )
}
