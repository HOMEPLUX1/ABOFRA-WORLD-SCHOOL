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

export default function CalendarPage() {
  return (
    <>
      <InnerPageHero topText="INFORMATION" mainText="SCHOOL CALENDAR" bgColor="#2a1a0a" imageId="information" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Information', href: '/information' }, { label: 'School Calendar' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Key Events 2026/2027</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our school calendar is packed with exciting events, parents&apos; evenings, sports days, cultural
          celebrations and academic milestones. Stay up to date so you never miss an important moment
          in your child&apos;s school year.
        </p>
        <div className="space-y-3 mb-6">
          {[
            { month: 'September 2026', event: 'Start of Term 1 — Welcome Back Assembly' },
            { month: 'October 2026', event: 'Parents\' Evening — Term 1 Progress Reports' },
            { month: 'November 2026', event: 'Cambridge Checkpoint Examinations' },
            { month: 'December 2026', event: 'End of Term 1 — Prize Giving & Closing Ceremony' },
            { month: 'January 2027', event: 'Start of Term 2' },
            { month: 'February 2027', event: 'Inter-House Sports Competition' },
            { month: 'March 2027', event: 'Cultural Day Celebrations' },
            { month: 'April 2027', event: 'End of Term 2 — Easter Break' },
            { month: 'April 2027', event: 'Start of Term 3' },
            { month: 'May/June 2027', event: 'Cambridge IGCSE & A Level Examinations' },
            { month: 'June 2027', event: 'Open Day for Prospective Parents' },
            { month: 'July 2027', event: 'End of Year Ceremony & Graduation' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-3 rounded-lg" style={{ backgroundColor: i % 2 === 0 ? '#f9fafb' : '#fff', border: '1px solid #e5e7eb' }}>
              <span className="text-xs font-bold shrink-0 mt-0.5 px-2 py-1 rounded" style={{ backgroundColor: '#82c906', color: '#fff', minWidth: 110 }}>{item.month}</span>
              <span className="text-sm text-gray-700">{item.event}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Stay Updated</p>
          <p className="text-sm text-gray-600">The school calendar is updated regularly. Parents are notified of any changes via letter and the school notice board.</p>
        </div>
      </SectionLayout>
    </>
  )
}
