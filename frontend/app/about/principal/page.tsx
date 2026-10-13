import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const aboutLinks = [
  { label: 'Welcome From The Principal', href: '/about/principal' },
  { label: 'Welcome From The Chair',     href: '/about/chair' },
  { label: 'Our Mission, Vision & Values', href: '/about/mission' },
  {
    label: 'Governance', href: '/about/governance',
    children: [
      { label: 'Governor Information',      href: '/about/governance' },
      { label: 'Legal & Financial Information', href: '/about/governance' },
    ],
  },
  { label: 'Staff',                      href: '/about/staff' },
  { label: 'Pledge To Parents',          href: '/about/pledge' },
]

export default function PrincipalPage() {
  return (
    <>
      <InnerPageHero topText="WELCOME FROM THE" mainText="PRINCIPAL" imageId="about-principal" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Welcome from the Principal' },
        ]}
      >
        <p className="text-gray-700 leading-relaxed mb-4">
          A very warm welcome to Abofra World School &mdash; a school for children that believes every child
          deserves the very best start in life.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          At Abofra World School, we are committed to providing a transformative educational experience
          that prepares our pupils for success personally, academically and socially. Our pupils benefit
          from an engaging curriculum designed to deliver educational excellence and encourage character
          development.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          By promoting our core values of Excellence, Integrity, Innovation and Community, we strive to
          create an enriching environment where every child is safe, happy and well, and where every
          child is supported and encouraged to shine.
        </p>
        <p className="font-bold mt-6" style={{ color: '#82c906' }}>The Principal</p>
        <p className="text-gray-600 text-sm">Abofra World School</p>
      </SectionLayout>
    </>
  )
}
