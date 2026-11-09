import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'Pastoral Care', href: '/pupil-support/pastoral' },
  { label: 'Special Educational Needs', href: '/pupil-support/send' },
  { label: 'Counselling Services', href: '/pupil-support/counselling' },
  { label: 'School Meals', href: '/pupil-support/meals' },
  { label: 'Uniform Guide', href: '/pupil-support/uniform' },
  { label: 'Transport', href: '/pupil-support/transport' },
]

export default function CounsellingPage() {
  return (
    <>
      <InnerPageHero topText="PUPIL SUPPORT" mainText="COUNSELLING SERVICES" bgColor="#1a0f2a" imageId="pupil-support" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Pupil Support', href: '/pupil-support' }, { label: 'Counselling Services' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Mental Health & Wellbeing</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          We understand that students sometimes face personal, social or emotional challenges that can
          affect their learning and wellbeing. Our qualified school counsellor provides a confidential,
          safe space for students to talk and receive the support they need.
        </p>
        <ul className="space-y-3 mb-6">
          {[
            'Confidential one-to-one counselling sessions',
            'Support for anxiety, stress, relationships and self-esteem',
            'Guidance during major life transitions',
            'Group wellbeing workshops and resilience programmes',
            'Referral to external mental health professionals when needed',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">How to Access Counselling</p>
          <p className="text-sm text-gray-600">Students can self-refer or be referred by a teacher or parent. All sessions are strictly confidential. Contact the school office to arrange an appointment.</p>
        </div>
      </SectionLayout>
    </>
  )
}
