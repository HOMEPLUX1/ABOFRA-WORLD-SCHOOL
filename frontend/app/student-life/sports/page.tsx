import StudentLifeLayout from '@/components/StudentLifeLayout'

const sports = [
  { name: 'Football',     color: '#34d399' },
  { name: 'Basketball',   color: '#60a5fa' },
  { name: 'Volleyball',   color: '#f59e0b' },
  { name: 'Athletics',    color: '#f472b6' },
  { name: 'Table Tennis', color: '#a78bfa' },
  { name: 'Badminton',    color: '#fb923c' },
  { name: 'Swimming',     color: '#34d399' },
  { name: 'Handball',     color: '#60a5fa' },
  { name: 'Cricket',      color: '#fbbf24' },
]

export default function SportsPage() {
  return (
    <StudentLifeLayout
      title="Sports & Games"
      subtitle="Active body, active mind. Sport builds fitness, teamwork, discipline and a competitive spirit in a fun and supportive environment."
      accent="#34d399"
    >
      <div style={{
        background: 'rgba(255,255,255,.05)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: 20,
        padding: '32px',
        marginBottom: 20,
      }}>
        <p style={{ fontWeight: 800, fontSize: 13, color: '#34d399', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 20 }}>Sports We Offer</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {sports.map((s, i) => (
            <div key={i} style={{
              background: `${s.color}15`,
              border: `1px solid ${s.color}40`,
              borderRadius: 12,
              padding: '14px 16px',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 13,
              color: s.color,
              letterSpacing: '.04em',
            }}>
              {s.name}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Annual Sports Day', text: 'Our Inter-House Sports Day is one of the most exciting events of the year. Students compete in track, field and team sports representing their houses with pride.', color: '#34d399' },
          { label: 'Inter-School Competitions', text: 'Our teams regularly compete in regional tournaments. We are proud of our students\' achievements on the field and court.', color: '#60a5fa' },
        ].map((card, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid rgba(255,255,255,.1)`,
            borderTop: `3px solid ${card.color}`,
            borderRadius: 16,
            padding: '22px',
          }}>
            <p style={{ fontWeight: 800, fontSize: 13, color: card.color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>{card.label}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.65 }}>{card.text}</p>
          </div>
        ))}
      </div>
    </StudentLifeLayout>
  )
}
