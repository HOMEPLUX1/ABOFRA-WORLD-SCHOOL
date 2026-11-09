import StudentLifeLayout from '@/components/StudentLifeLayout'

const artForms = [
  { title: 'Visual Arts',    desc: 'Drawing, painting, sculpture, textile arts and digital design',      color: '#f59e0b' },
  { title: 'Music',          desc: 'School choir, instrumental tuition and annual music concert',        color: '#a78bfa' },
  { title: 'Drama & Theatre',desc: 'Annual school play, improvisation and performance workshops',        color: '#f472b6' },
  { title: 'Dance',          desc: 'Traditional Ghanaian dance, contemporary and choreography',          color: '#fb923c' },
  { title: 'Photography',    desc: 'Visual storytelling and school magazine photography',                color: '#34d399' },
  { title: 'Cultural Day',   desc: 'Annual celebration of Ghana\'s rich cultural heritage',              color: '#60a5fa' },
]

export default function ArtsPage() {
  return (
    <StudentLifeLayout
      title="Arts & Culture"
      subtitle="Creativity, self-expression and cultural identity are celebrated through a vibrant programme of visual arts, music, drama and cultural events."
      accent="#f59e0b"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {artForms.map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,.1)',
            borderTop: `3px solid ${item.color}`,
            borderRadius: 16,
            padding: '22px',
          }}>
            <p style={{ fontWeight: 800, fontSize: 14, color: item.color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.title}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,.12), rgba(251,146,60,.08))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(245,158,11,.25)',
        borderRadius: 20,
        padding: '28px',
      }}>
        <p style={{ fontWeight: 800, color: '#f59e0b', marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>Annual Cultural Day</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>Every year we hold a vibrant Cultural Day where students celebrate Ghana&apos;s diverse heritage through traditional dress, food, music and dance. It is one of the most anticipated events in the school calendar.</p>
      </div>
    </StudentLifeLayout>
  )
}
