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

const staff = [
  { name: 'The Principal',        role: 'Principal' },
  { name: 'Deputy Principal',     role: 'Deputy Principal' },
  { name: 'Head of Primary',      role: 'Head of Primary School' },
  { name: 'Head of Junior High',  role: 'Head of Junior High School' },
  { name: 'Head of Senior High',  role: 'Head of Senior High School' },
  { name: 'SENCO',                role: 'Special Educational Needs Coordinator' },
]

export default function StaffPage() {
  return (
    <>
      <InnerPageHero topText="ABOUT US" mainText="STAFF" bgColor="#1a1a3a" imageId="about-staff" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Staff' },
        ]}
      >
        <p className="text-gray-700 leading-relaxed mb-6">
          Our dedicated team of teachers and support staff are committed to providing every child with
          the very best education and care.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staff.map((s) => (
            <div key={s.name} className="border border-gray-200 p-4 rounded">
              <p className="font-bold text-gray-800">{s.name}</p>
              <p className="text-sm text-gray-500">{s.role}</p>
            </div>
          ))}
        </div>
      </SectionLayout>
    </>
  )
}
