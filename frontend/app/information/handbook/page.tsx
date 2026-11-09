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

export default function HandbookPage() {
  return (
    <>
      <InnerPageHero topText="INFORMATION" mainText="PARENT HANDBOOK" bgColor="#2a1a0a" imageId="information" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Information', href: '/information' }, { label: 'Parent Handbook' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Your Guide to Abofra World School</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          The Parent Handbook contains everything you need to know about life at Abofra World School —
          from school policies and procedures to daily routines, expectations and how to get involved
          in your child&apos;s education.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>What&apos;s Inside</h2>
        <ul className="space-y-3 mb-6">
          {[
            'School values, vision and ethos',
            'Daily routines and school rules',
            'Attendance and punctuality policy',
            'Homework and assessment guidelines',
            'Communication with teachers and staff',
            'Behaviour and discipline policy',
            'Health, safety and safeguarding',
            'Extracurricular activities and clubs',
            'Parent-Teacher Association (PTA) information',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-2">Request a Copy</p>
          <p className="text-sm text-gray-600 mb-3">The Parent Handbook is provided to all new families upon enrolment. To request a copy, please contact the school office.</p>
          <Link href="/contact" className="inline-block text-sm font-bold px-5 py-2 rounded-full text-white" style={{ backgroundColor: '#82c906' }}>Contact Us →</Link>
        </div>
      </SectionLayout>
    </>
  )
}
