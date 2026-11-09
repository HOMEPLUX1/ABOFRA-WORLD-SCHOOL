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

const schedule = [
  { time: '7:00 AM', activity: 'Gates Open — Students Arrive' },
  { time: '7:30 AM', activity: 'Morning Assembly' },
  { time: '8:00 AM', activity: 'Period 1' },
  { time: '8:45 AM', activity: 'Period 2' },
  { time: '9:30 AM', activity: 'Period 3' },
  { time: '10:15 AM', activity: 'Morning Break' },
  { time: '10:30 AM', activity: 'Period 4' },
  { time: '11:15 AM', activity: 'Period 5' },
  { time: '12:00 PM', activity: 'Lunch Break' },
  { time: '1:00 PM', activity: 'Period 6' },
  { time: '1:45 PM', activity: 'Period 7' },
  { time: '2:30 PM', activity: 'Period 8' },
  { time: '3:15 PM', activity: 'End of School Day' },
  { time: '3:15 PM', activity: 'After School Activities & Clubs' },
]

export default function TimetablePage() {
  return (
    <>
      <InnerPageHero topText="INFORMATION" mainText="DAILY TIMETABLE" bgColor="#2a1a0a" imageId="information" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Information', href: '/information' }, { label: 'Daily Timetable' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>School Day Schedule</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          A typical school day at Abofra World School runs from 7:30 AM to 3:15 PM. Students are
          encouraged to arrive by 7:00 AM. After-school activities and clubs run until 5:00 PM.
        </p>
        <div className="space-y-2 mb-6">
          {schedule.map((item, i) => (
            <div key={i} className="flex gap-4 items-center p-3 rounded-lg" style={{ backgroundColor: i % 2 === 0 ? '#f9fafb' : '#fff', border: '1px solid #e5e7eb' }}>
              <span className="text-xs font-bold shrink-0 px-2 py-1 rounded" style={{ backgroundColor: '#206802', color: '#fff', minWidth: 80, textAlign: 'center' }}>{item.time}</span>
              <span className="text-sm text-gray-700">{item.activity}</span>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">After School</p>
          <p className="text-sm text-gray-600">We offer a wide range of after-school clubs and activities including sports, music, arts, coding and academic support clubs. Details are available from the school office.</p>
        </div>
      </SectionLayout>
    </>
  )
}
