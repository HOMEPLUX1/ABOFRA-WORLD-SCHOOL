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

export default function MealsPage() {
  return (
    <>
      <InnerPageHero topText="PUPIL SUPPORT" mainText="SCHOOL MEALS" bgColor="#1a0f2a" imageId="pupil-support" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Pupil Support', href: '/pupil-support' }, { label: 'School Meals' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Nutritious & Delicious</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Abofra World School provides freshly prepared, nutritious meals every school day. We believe
          that a healthy diet is essential for concentration, energy and overall wellbeing. Our meals
          are prepared on-site using quality ingredients.
        </p>
        <ul className="space-y-3 mb-6">
          {[
            'Hot lunch served every school day',
            'Balanced menus designed with nutrition in mind',
            'Fresh fruit and healthy snacks available',
            'Special dietary requirements and allergies catered for',
            'Clean, comfortable dining facilities',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Dietary Requirements</p>
          <p className="text-sm text-gray-600">If your child has any food allergies or specific dietary requirements, please inform the school office so we can make appropriate arrangements.</p>
        </div>
      </SectionLayout>
    </>
  )
}
