import StudentLifeLayout from '@/components/StudentLifeLayout'

const clubs = [
  { name: 'Coding & Robotics Club',  desc: 'Programming, web development and robotics challenges',         color: '#34d399' },
  { name: 'Debate & Oratory Club',   desc: 'Public speaking, argumentation and inter-school debates',      color: '#a78bfa' },
  { name: 'Chess Club',              desc: 'Strategy, critical thinking and chess tournaments',            color: '#60a5fa' },
  { name: 'Environment & Green Club',desc: 'Sustainability projects and environmental awareness',          color: '#4ade80' },
  { name: 'School Magazine Club',    desc: 'Writing, editing, photography and publishing',                 color: '#f472b6' },
  { name: 'Science Club',            desc: 'Experiments, STEM projects and science fairs',                color: '#fbbf24' },
  { name: 'French Language Club',    desc: 'Conversational French, culture and exchange',                  color: '#fb923c' },
  { name: 'Community Service Club',  desc: 'Outreach projects and volunteering in the community',          color: '#34d399' },
]

export default function ClubsPage() {
  return (
    <StudentLifeLayout
      title="Clubs & Societies"
      subtitle="Find your passion, meet like-minded peers and develop skills beyond the classroom. Our clubs run after school and are open to all students."
      accent="#60a5fa"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {clubs.map((club, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,.1)',
            borderLeft: `4px solid ${club.color}`,
            borderRadius: 14,
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: club.color, boxShadow: `0 0 12px ${club.color}`, flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: club.color, marginBottom: 3 }}>{club.name}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>{club.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(96,165,250,.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(96,165,250,.25)',
        borderRadius: 20,
        padding: '24px 28px',
      }}>
        <p style={{ fontWeight: 800, color: '#60a5fa', marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>Start a New Club</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>Have an idea for a new club? Students can propose new clubs to the Student Council. We love hearing from students who want to take initiative and lead.</p>
      </div>
    </StudentLifeLayout>
  )
}
