import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'Term Dates', href: '/information/term-dates' },
  { label: 'School Calendar', href: '/information/calendar' },
  { label: 'Daily Timetable', href: '/information/timetable' },
  { label: 'School Fees', href: '/information/fees' },
  { label: 'Admissions', href: '/information/admissions' },
  { label: 'Parent Handbook', href: '/information/handbook' },
  { label: 'Contact Us', href: '/contact' },
]

const terms = [
  { term: 'Term 1', start: 'September 2026', end: 'December 2026', holiday: 'Christmas Holiday: 3 weeks' },
  { term: 'Term 2', start: 'January 2027', end: 'April 2027', holiday: 'Easter Holiday: 2 weeks' },
  { term: 'Term 3', start: 'April 2027', end: 'July 2027', holiday: 'Long Vacation: 8 weeks' },
]

export default function TermDatesPage() {
  return (
    <>
      <InnerPageHero topText="INFORMATION" mainText="TERM DATES" bgColor="#2a1a0a" imageId="information" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Information', href: '/information' }, { label: 'Term Dates' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Academic Year 2026/2027</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          The academic year at Abofra World School is divided into three terms. Please note these dates
          and plan holidays within the designated holiday periods to avoid disruption to your child&apos;s learning.
        </p>
        <div className="space-y-4 mb-8">
          {terms.map((t, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-5" style={{ borderLeft: '4px solid #82c906' }}>
              <h3 className="font-extrabold text-base uppercase mb-2" style={{ color: '#206802' }}>{t.term}</h3>
              <p className="text-sm text-gray-700"><strong>Start:</strong> {t.start}</p>
              <p className="text-sm text-gray-700"><strong>End:</strong> {t.end}</p>
              <p className="text-sm text-gray-500 mt-1">{t.holiday}</p>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Important Note</p>
          <p className="text-sm text-gray-600">Term dates are subject to change. Parents will be notified of any changes via letter and the school notice board. Please check this page regularly for updates.</p>
        </div>
      </SectionLayout>
    </>
  )
}
