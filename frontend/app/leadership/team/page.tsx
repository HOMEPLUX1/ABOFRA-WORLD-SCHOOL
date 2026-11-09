import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'School Leadership Team', href: '/leadership/team' },
  { label: 'Board of Governors', href: '/leadership/governors' },
  { label: 'Student Council', href: '/leadership/student-council' },
  { label: 'Vision & Strategy', href: '/leadership/vision' },
]

export default function LeadershipTeamPage() {
  return (
    <>
      <InnerPageHero topText="LEADERSHIP" mainText="SCHOOL LEADERSHIP TEAM" bgColor="#1a2a0a" imageId="leadership" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Leadership', href: '/leadership' }, { label: 'School Leadership Team' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Leading With Purpose</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Our senior leadership team brings together experienced educators and administrators who are
          united by a shared commitment to academic excellence, student wellbeing and community.
          They set the tone for our school culture and drive continuous improvement.
        </p>
        <ul className="space-y-3 mb-6">
          {[
            'Principal — overall strategic and educational leadership',
            'Deputy Principal — curriculum oversight and staff development',
            'Head of Academics — managing teaching quality and standards',
            'Head of Pastoral Care — student wellbeing and behaviour',
            'Head of Administration — operations, finance and facilities',
            'Head of Early Years — leading our pre-school and foundation stage',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Open Door Policy</p>
          <p className="text-sm text-gray-600">Our leadership team operates an open-door policy. Parents and students are welcome to request meetings with any member of the leadership team through the school office.</p>
        </div>
      </SectionLayout>
    </>
  )
}
