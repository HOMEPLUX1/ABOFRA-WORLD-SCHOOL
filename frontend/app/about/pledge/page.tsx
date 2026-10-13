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

const pledges = [
  'We will provide a safe, welcoming and nurturing environment for every child.',
  'We will communicate openly and honestly with parents and carers.',
  'We will celebrate the achievements of every child, big and small.',
  'We will set high expectations and support every child to meet them.',
  'We will listen to your concerns and respond promptly and respectfully.',
  "We will work in partnership with families to support children's learning at home.",
  "We will keep you informed of your child's progress through regular reports and meetings.",
]

export default function PledgePage() {
  return (
    <>
      <InnerPageHero topText="ABOUT US" mainText="PLEDGE TO PARENTS" bgColor="#1a2a3a" imageId="about-pledge" />
      <SectionLayout
        sidebarLinks={aboutLinks}
        breadcrumb={[
          { label: 'About', href: '/about' },
          { label: 'Pledge To Parents' },
        ]}
      >
        <p className="text-gray-700 leading-relaxed mb-6">
          At Abofra World School, we believe that a strong partnership between school and home is
          essential for every child to thrive. We make the following pledges to all parents and carers:
        </p>
        <ul className="space-y-4">
          {pledges.map((p, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="font-extrabold text-lg shrink-0" style={{ color: '#82c906' }}>&#10003;</span>
              <span className="text-gray-700 leading-relaxed">{p}</span>
            </li>
          ))}
        </ul>
      </SectionLayout>
    </>
  )
}
