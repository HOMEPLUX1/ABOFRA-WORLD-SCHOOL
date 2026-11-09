import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'
import Link from 'next/link'

const links = [
  { label: 'Term Dates', href: '/information/term-dates' },
  { label: 'School Calendar', href: '/information/calendar' },
  { label: 'Daily Timetable', href: '/information/timetable' },
  { label: 'School Fees', href: '/information/fees' },
  { label: 'Admissions', href: '/information/admissions' },
  { label: 'Parent Handbook', href: '/information/handbook' },
  { label: 'Contact Us', href: '/contact' },
]

export default function FeesPage() {
  return (
    <>
      <InnerPageHero topText="INFORMATION" mainText="SCHOOL FEES" bgColor="#2a1a0a" imageId="information" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Information', href: '/information' }, { label: 'School Fees' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Fee Structure</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          At Abofra World School, we are committed to providing world-class education at fair and
          transparent fees. Our fees cover tuition, learning materials, assessments and access to
          school facilities. Additional charges may apply for transport, meals and extracurricular activities.
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: '#206802', color: '#fff' }}>
                <th className="text-left p-3 font-bold">Level</th>
                <th className="text-left p-3 font-bold">Programme</th>
                <th className="text-left p-3 font-bold">Fees Per Term</th>
              </tr>
            </thead>
            <tbody>
              {[
                { level: 'Early Years', prog: 'Pre-School (Ages 3–5)', fee: 'Contact school' },
                { level: 'Primary', prog: 'GES / Cambridge Primary', fee: 'Contact school' },
                { level: 'Lower Secondary', prog: 'Cambridge Lower Secondary / JHS', fee: 'Contact school' },
                { level: 'IGCSE', prog: 'Cambridge IGCSE', fee: 'Contact school' },
                { level: 'A Level', prog: 'Cambridge A & AS Levels', fee: 'Contact school' },
              ].map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9fafb' : '#fff', borderBottom: '1px solid #e5e7eb' }}>
                  <td className="p-3 font-semibold text-gray-800">{row.level}</td>
                  <td className="p-3 text-gray-600">{row.prog}</td>
                  <td className="p-3 font-bold" style={{ color: '#206802' }}>{row.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-2">Get a Full Fee Schedule</p>
          <p className="text-sm text-gray-600 mb-3">For the full and current fee schedule, please contact our admissions office directly. We are happy to discuss payment plans and financial support options.</p>
          <Link href="/contact" className="inline-block text-sm font-bold px-5 py-2 rounded-full text-white" style={{ backgroundColor: '#82c906' }}>Contact Us →</Link>
        </div>
      </SectionLayout>
    </>
  )
}
