import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'Extracurricular Activities', href: '/student-life/extracurricular' },
  { label: 'Sports & Games',             href: '/student-life/sports' },
  { label: 'Arts & Culture',             href: '/student-life/arts' },
  { label: 'Clubs & Societies',          href: '/student-life/clubs' },
  { label: 'Gallery',                    href: '/student-life/gallery' },
  { label: 'Student Council',            href: '/leadership/student-council' },
]

export default function SportsPage() {
  return (
    <>
      <InnerPageHero topText="STUDENT LIFE" mainText="SPORTS & GAMES" bgColor="#0a1a2a" imageId="student-life" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Student Life', href: '/student-life' }, { label: 'Sports & Games' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Active Body, Active Mind</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Sport is a vital part of life at Abofra World School. We encourage every student to participate
          in physical activity — developing fitness, teamwork, discipline and a competitive spirit in a
          fun and supportive environment.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>Sports We Offer</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {['Football', 'Basketball', 'Volleyball', 'Athletics', 'Table Tennis', 'Badminton', 'Swimming', 'Handball', 'Cricket'].map((sport, i) => (
            <div key={i} className="text-center p-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700" style={{ backgroundColor: '#f9fafb' }}>{sport}</div>
          ))}
        </div>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>Annual Sports Day</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Our annual Inter-House Sports Day is one of the most exciting events in the school calendar.
          Students compete in track and field events, team sports and relay races, representing their
          houses with pride and passion.
        </p>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Inter-School Competitions</p>
          <p className="text-sm text-gray-600">Our teams regularly compete in inter-school tournaments across the region. We are proud of our students&apos; achievements on the field and court.</p>
        </div>
      </SectionLayout>
    </>
  )
}
