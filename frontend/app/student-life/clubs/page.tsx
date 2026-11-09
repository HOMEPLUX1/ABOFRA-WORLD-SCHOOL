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

const clubs = [
  { icon: '💻', name: 'Coding & Robotics Club', desc: 'Programming, web development and robotics challenges' },
  { icon: '📚', name: 'Debate & Oratory Club', desc: 'Public speaking, argumentation and inter-school debates' },
  { icon: '♟️', name: 'Chess Club', desc: 'Strategy, critical thinking and chess tournaments' },
  { icon: '🌍', name: 'Environment & Green Club', desc: 'Sustainability projects and environmental awareness' },
  { icon: '📰', name: 'School Magazine Club', desc: 'Writing, editing, photography and publishing' },
  { icon: '🔬', name: 'Science Club', desc: 'Experiments, STEM projects and science fairs' },
  { icon: '🎤', name: 'French Language Club', desc: 'Conversational French, culture and exchange' },
  { icon: '🤝', name: 'Community Service Club', desc: 'Outreach projects and volunteering in the community' },
]

export default function ClubsPage() {
  return (
    <>
      <InnerPageHero topText="STUDENT LIFE" mainText="CLUBS & SOCIETIES" bgColor="#0a1a2a" imageId="student-life" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Student Life', href: '/student-life' }, { label: 'Clubs & Societies' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Find Your Passion</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Our clubs and societies run after school each week and are open to all students. They are a
          fantastic way to explore new interests, meet like-minded peers and develop skills beyond the curriculum.
        </p>
        <div className="space-y-3 mb-6">
          {clubs.map((club, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl border border-gray-200" style={{ backgroundColor: '#fafafa' }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="font-extrabold text-sm text-gray-800">{club.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{club.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Start a New Club</p>
          <p className="text-sm text-gray-600">Have an idea for a new club? Students can propose new clubs to the Student Council. We love hearing from students who want to take initiative and lead.</p>
        </div>
      </SectionLayout>
    </>
  )
}
