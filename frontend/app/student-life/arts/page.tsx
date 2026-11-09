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

export default function ArtsPage() {
  return (
    <>
      <InnerPageHero topText="STUDENT LIFE" mainText="ARTS & CULTURE" bgColor="#0a1a2a" imageId="student-life" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Student Life', href: '/student-life' }, { label: 'Arts & Culture' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Creativity at the Core</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          The arts are central to life at Abofra World School. We celebrate creativity, self-expression
          and cultural identity through a vibrant programme of visual arts, music, drama and cultural
          celebrations throughout the year.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[
            { icon: '🎨', title: 'Visual Arts', desc: 'Drawing, painting, sculpture, textile arts and digital design' },
            { icon: '🎵', title: 'Music', desc: 'School choir, instrumental tuition and annual music concert' },
            { icon: '🎭', title: 'Drama & Theatre', desc: 'Annual school play, improvisation and performance workshops' },
            { icon: '💃', title: 'Dance', desc: 'Traditional Ghanaian dance, contemporary and choreography' },
            { icon: '📸', title: 'Photography', desc: 'Visual storytelling and school magazine photography' },
            { icon: '🌍', title: 'Cultural Day', desc: 'Annual celebration of Ghana\'s rich cultural heritage' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl border border-gray-200" style={{ backgroundColor: '#fafafa' }}>
              <span className="text-3xl shrink-0 emoji-icon">{item.icon}</span>
              <div>
                <p className="font-extrabold text-sm text-gray-800 uppercase">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Annual Cultural Day</p>
          <p className="text-sm text-gray-600">Every year we hold a vibrant Cultural Day where students celebrate Ghana&apos;s diverse heritage through traditional dress, food, music and dance. It is one of the most anticipated events in the school calendar.</p>
        </div>
      </SectionLayout>
    </>
  )
}
