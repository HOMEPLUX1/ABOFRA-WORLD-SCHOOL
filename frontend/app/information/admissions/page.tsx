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

export default function AdmissionsPage() {
  return (
    <>
      <InnerPageHero topText="INFORMATION" mainText="ADMISSIONS" bgColor="#2a1a0a" imageId="information" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Information', href: '/information' }, { label: 'Admissions' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Join the Abofra Family</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          We welcome applications from families who share our values of excellence, integrity and community.
          Admissions are open throughout the year, subject to availability of places. We encourage
          prospective parents to visit the school before applying.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>How to Apply</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Step 1 — Contact the school to arrange a visit or enquiry',
            'Step 2 — Complete and submit the admissions application form',
            'Step 3 — Attend an assessment and interview (where applicable)',
            'Step 4 — Receive your offer letter and confirm acceptance',
            'Step 5 — Complete enrolment and pay the registration fee',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>Documents Required</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Completed application form',
            'Birth certificate of the child',
            'Most recent school report or academic records',
            'Passport-sized photographs',
            'Parent/guardian identification',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-2">Ready to Apply?</p>
          <p className="text-sm text-gray-600 mb-3">Contact our admissions team today to begin your child&apos;s journey at Abofra World School.</p>
          <Link href="/contact" className="inline-block text-sm font-bold px-5 py-2 rounded-full text-white" style={{ backgroundColor: '#82c906' }}>Contact Us →</Link>
        </div>
      </SectionLayout>
    </>
  )
}
