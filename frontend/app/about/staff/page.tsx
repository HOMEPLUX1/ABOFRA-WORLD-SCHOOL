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

export default function StaffPage() {
  return (
    <>
      <InnerPageHero topText="ABOUT" mainText="OUR STAFF" bgColor="#0f2a3a" imageId="about-staff" />
      <SectionLayout sidebarLinks={aboutLinks} breadcrumb={[{ label: 'About', href: '/about' }, { label: 'Staff' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#82c906' }}>Dedicated Professionals</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          At Abofra World School, our staff are our greatest asset. We have assembled a team of highly
          qualified, experienced and passionate educators who are committed to delivering outstanding
          teaching and learning every day.
        </p>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our teachers hold qualifications from recognised universities and many are trained in Cambridge
          International Education. They participate in continuous professional development to stay at
          the forefront of best educational practice.
        </p>

        <h2 className="text-xl font-extrabold uppercase mb-3 mt-2" style={{ color: '#82c906' }}>Our Staff Commitment</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Qualified and experienced teachers across all subjects and year groups',
            'Cambridge-trained educators for our international curriculum programmes',
            'Dedicated support staff ensuring a safe and welcoming environment',
            'Regular professional development and training',
            'Strong pastoral care team supporting student wellbeing',
            'Open-door policy for parents and students',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="p-5 rounded-xl mt-4" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Join Our Team</p>
          <p className="text-sm text-gray-600">
            We are always looking for talented, motivated educators to join the Abofra family.
            If you are passionate about making a difference in children&apos;s lives, we would love to hear from you.
            Please send your CV and cover letter to <a href="mailto:abofraworldschool@gmail.com" className="underline" style={{ color: '#206802' }}>abofraworldschool@gmail.com</a>.
          </p>
        </div>
      </SectionLayout>
    </>
  )
}
