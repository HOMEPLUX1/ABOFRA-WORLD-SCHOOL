import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'Curriculum Overview', href: '/education/curriculum' },
  { label: 'G.E.S', href: '/education/ges' },
  { label: 'Cambridge', href: '/education/cambridge' },
  { label: 'Assessment & Exams', href: '/education/assessment' },
  { label: 'Homework & Resources', href: '/education/resources' },
  { label: 'Teacher Portal', href: '/portal/teacher' },
  { label: 'Parent Portal', href: '/portal/parent' },
]

export default function ResourcesPage() {
  return (
    <>
      <InnerPageHero topText="ACADEMICS" mainText="HOMEWORK & RESOURCES" bgColor="#0f1a3a" imageId="education" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Academics', href: '/education' }, { label: 'Homework & Resources' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Homework Policy</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Homework at Abofra World School is designed to reinforce classroom learning, develop independent
          study habits and prepare students for examinations. We set meaningful, age-appropriate tasks
          that challenge without overwhelming.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>Homework Guidelines</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Early Years & Primary — up to 30 minutes per evening',
            'Lower Secondary — up to 1 hour per evening',
            'IGCSE — up to 2 hours per evening across subjects',
            'A Level — up to 3 hours per evening for independent study',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#206802' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Parent & Student Portals</p>
          <p className="text-sm text-gray-600">
            Homework assignments, resources and learning materials are shared through our online portals.
            Parents can track assignments and progress via the <a href="/portal/parent" className="underline font-semibold" style={{ color: '#206802' }}>Parent Portal</a> and
            students can access materials through the <a href="/portal/teacher" className="underline font-semibold" style={{ color: '#206802' }}>Student Resources</a> section.
          </p>
        </div>
      </SectionLayout>
    </>
  )
}
