import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'School Leadership Team', href: '/leadership/team' },
  { label: 'Board of Governors', href: '/leadership/governors' },
  { label: 'Student Council', href: '/leadership/student-council' },
  { label: 'Vision & Strategy', href: '/leadership/vision' },
]

export default function GovernorsPage() {
  return (
    <>
      <InnerPageHero topText="LEADERSHIP" mainText="BOARD OF GOVERNORS" bgColor="#1a2a0a" imageId="leadership" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Leadership', href: '/leadership' }, { label: 'Board of Governors' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Our Board</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          The Board of Governors provides strategic leadership and accountability for Abofra World School.
          Our governors bring a wide range of professional expertise including education, business, law,
          finance and community development.
        </p>
        <ul className="space-y-3 mb-6">
          {[
            'Setting and reviewing the school\'s long-term strategic direction',
            'Ensuring the school meets its legal and regulatory obligations',
            'Holding the leadership team to account for performance',
            'Safeguarding the financial health and sustainability of the school',
            'Representing the interests of parents, students and the community',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Contact the Board</p>
          <p className="text-sm text-gray-600">Correspondence for the Board of Governors can be sent via the school office at <a href="mailto:abofraworldschool@gmail.com" className="underline" style={{ color: '#206802' }}>abofraworldschool@gmail.com</a>.</p>
        </div>
      </SectionLayout>
    </>
  )
}
