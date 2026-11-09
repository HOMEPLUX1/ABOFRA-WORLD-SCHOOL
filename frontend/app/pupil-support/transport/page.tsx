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

export default function TransportPage() {
  return (
    <>
      <InnerPageHero topText="PUPIL SUPPORT" mainText="TRANSPORT" bgColor="#1a0f2a" imageId="pupil-support" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Pupil Support', href: '/pupil-support' }, { label: 'Transport' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>School Transport</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Abofra World School operates a safe and reliable school bus service covering key routes in
          and around the local area. Our buses are driven by experienced, vetted drivers and supervised
          by school staff to ensure your child travels safely every day.
        </p>
        <ul className="space-y-3 mb-6">
          {[
            'Morning pick-up and afternoon drop-off service',
            'Experienced and vetted drivers',
            'Fixed routes covering key residential areas',
            'Staff supervision on every bus',
            'Real-time updates for parents on delays',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Register for Transport</p>
          <p className="text-sm text-gray-600">To register your child for the school bus service or to enquire about routes and fees, please contact the school office at <a href="tel:+233556592410" className="underline" style={{ color: '#206802' }}>+233 556 592 410</a>.</p>
        </div>
      </SectionLayout>
    </>
  )
}
