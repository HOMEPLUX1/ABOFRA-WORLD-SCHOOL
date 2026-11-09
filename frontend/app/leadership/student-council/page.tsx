import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'School Leadership Team', href: '/leadership/team' },
  { label: 'Board of Governors', href: '/leadership/governors' },
  { label: 'Student Council', href: '/leadership/student-council' },
  { label: 'Vision & Strategy', href: '/leadership/vision' },
]

export default function StudentCouncilPage() {
  return (
    <>
      <InnerPageHero topText="LEADERSHIP" mainText="STUDENT COUNCIL" bgColor="#1a2a0a" imageId="leadership" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Leadership', href: '/leadership' }, { label: 'Student Council' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Student Voice</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          The Abofra World School Student Council gives students a real voice in shaping their school
          experience. Elected representatives from each year group meet regularly to discuss ideas,
          raise concerns and contribute to school improvement.
        </p>
        <ul className="space-y-3 mb-6">
          {[
            'Democratically elected student representatives from each year group',
            'Regular meetings with school leadership to discuss student matters',
            'Input into school policies, events and improvements',
            'Organising school events, fundraisers and community initiatives',
            'Developing leadership, communication and teamwork skills',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Get Involved</p>
          <p className="text-sm text-gray-600">Elections for the Student Council take place at the start of each academic year. All students are encouraged to stand for election or vote for their representative.</p>
        </div>
      </SectionLayout>
    </>
  )
}
