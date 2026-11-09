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

const activities = [
  { icon: '⚽', name: 'Football', desc: 'Competitive and recreational football for all year groups' },
  { icon: '🏀', name: 'Basketball', desc: 'Training sessions and inter-school competitions' },
  { icon: '🎨', name: 'Visual Arts', desc: 'Drawing, painting, sculpture and mixed media' },
  { icon: '🎭', name: 'Drama & Theatre', desc: 'Annual school play and performance arts workshops' },
  { icon: '🎵', name: 'Music', desc: 'Choir, instrumental lessons and school band' },
  { icon: '💻', name: 'Coding Club', desc: 'Programming, web design and robotics for all ages' },
  { icon: '📚', name: 'Debate Club', desc: 'Public speaking, critical thinking and argumentation' },
  { icon: '♟️', name: 'Chess Club', desc: 'Strategy, problem solving and tournaments' },
  { icon: '🌍', name: 'Environment Club', desc: 'Sustainability projects and community initiatives' },
  { icon: '📰', name: 'School Magazine', desc: 'Writing, photography and publishing the school newsletter' },
  { icon: '🏃', name: 'Athletics', desc: 'Track and field events, annual sports day competitions' },
  { icon: '🎤', name: 'Public Speaking', desc: 'Oratory competitions and communication skills' },
]

export default function ExtracurricularPage() {
  return (
    <>
      <InnerPageHero topText="STUDENT LIFE" mainText="EXTRACURRICULAR ACTIVITIES" bgColor="#0a1a2a" imageId="student-life" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Student Life', href: '/student-life' }, { label: 'Extracurricular Activities' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Beyond the Classroom</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          At Abofra World School, we believe education goes far beyond the classroom. Our rich
          extracurricular programme gives every student the opportunity to discover their passions,
          develop new skills, build friendships and grow as well-rounded individuals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {activities.map((a, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl border border-gray-200" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-3xl shrink-0 emoji-icon">{a.icon}</span>
              <div>
                <p className="font-extrabold text-sm text-gray-800 uppercase">{a.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">How to Join</p>
          <p className="text-sm text-gray-600">All students are encouraged to join at least one club or activity. Sign-ups take place at the start of each term. Speak to your class teacher or the school office for details.</p>
        </div>
      </SectionLayout>
    </>
  )
}
