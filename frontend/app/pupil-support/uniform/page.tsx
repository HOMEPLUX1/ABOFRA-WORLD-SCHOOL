import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'Pastoral Care', href: '/pupil-support/pastoral' },
  { label: 'Special Educational Needs', href: '/pupil-support/send' },
  { label: 'Counselling Services', href: '/pupil-support/counselling' },
  { label: 'School Meals', href: '/pupil-support/meals' },
  { label: 'Uniform Guide', href: '/pupil-support/uniform' },
  { label: 'Transport', href: '/pupil-support/transport' },
]

export default function UniformPage() {
  return (
    <>
      <InnerPageHero topText="PUPIL SUPPORT" mainText="UNIFORM GUIDE" bgColor="#1a0f2a" imageId="pupil-support" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Pupil Support', href: '/pupil-support' }, { label: 'Uniform Guide' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>School Uniform</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Our school uniform creates a sense of belonging, equality and pride among our students.
          All students are expected to wear the correct uniform every day. Smart appearance reflects
          our school values of excellence and respect.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>Uniform Requirements</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Green and white school shirt/blouse with school crest',
            'Green school trousers or skirt',
            'Black shoes — no trainers or sandals on school days',
            'School PE kit for physical education lessons',
            'School bag displaying the Abofra World School crest',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Where to Buy Uniform</p>
          <p className="text-sm text-gray-600">Official school uniform is available from the school office. For more information contact us at <a href="tel:+233556592410" className="underline" style={{ color: '#206802' }}>+233 556 592 410</a>.</p>
        </div>
      </SectionLayout>
    </>
  )
}
