import StudentLifeLayout from '@/components/StudentLifeLayout'

const activities = [
  { name: 'Football',       desc: 'Competitive and recreational football for all year groups',         color: '#34d399' },
  { name: 'Basketball',     desc: 'Training sessions and inter-school competitions',                   color: '#60a5fa' },
  { name: 'Visual Arts',    desc: 'Drawing, painting, sculpture and mixed media',                      color: '#f59e0b' },
  { name: 'Drama & Theatre',desc: 'Annual school play and performance arts workshops',                 color: '#f472b6' },
  { name: 'Music',          desc: 'Choir, instrumental lessons and school band',                       color: '#a78bfa' },
  { name: 'Coding Club',    desc: 'Programming, web design and robotics for all ages',                 color: '#34d399' },
  { name: 'Debate Club',    desc: 'Public speaking, critical thinking and argumentation',              color: '#fb923c' },
  { name: 'Chess Club',     desc: 'Strategy, problem solving and tournaments',                         color: '#60a5fa' },
  { name: 'Environment Club',desc: 'Sustainability projects and community initiatives',                color: '#4ade80' },
  { name: 'School Magazine',desc: 'Writing, photography and publishing the school newsletter',         color: '#f472b6' },
  { name: 'Athletics',      desc: 'Track and field events, annual sports day competitions',            color: '#fbbf24' },
  { name: 'Public Speaking',desc: 'Oratory competitions and communication skills',                    color: '#a78bfa' },
]

export default function ExtracurricularPage() {
  return (
    <StudentLifeLayout
      title="Beyond the Classroom"
      subtitle="Discover your passion, build friendships and grow as a well-rounded individual through our rich extracurricular programme."
      accent="#a78bfa"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
        {activities.map((a, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid rgba(255,255,255,.1)`,
            borderTop: `3px solid ${a.color}`,
            borderRadius: 16,
            padding: '20px 20px',
            transition: 'transform .2s, box-shadow .2s',
          }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: a.color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>{a.name}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.6 }}>{a.desc}</p>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(167,139,250,.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(167,139,250,.25)',
        borderRadius: 20,
        padding: '24px 28px',
      }}>
        <p style={{ fontWeight: 800, color: '#a78bfa', marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>How to Join</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>All students are encouraged to join at least one club or activity. Sign-ups take place at the start of each term. Speak to your class teacher or the school office for details.</p>
      </div>
    </StudentLifeLayout>
  )
}
