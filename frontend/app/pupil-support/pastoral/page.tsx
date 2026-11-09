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

export default function PastoralPage() {
  return (
    <>
      <InnerPageHero topText="PUPIL SUPPORT" mainText="PASTORAL CARE" bgColor="#1a0f2a" imageId="pupil-support" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Pupil Support', href: '/pupil-support' }, { label: 'Pastoral Care' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Every Child Matters</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          At Abofra World School, the wellbeing of every student is at the heart of everything we do.
          Our pastoral care system ensures that each child feels safe, valued, supported and ready to learn.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>How We Support Our Students</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Dedicated form tutors who know every student personally',
            'Regular one-to-one check-ins with pastoral leads',
            'Anti-bullying policy and peer mentoring programme',
            'Clear behaviour and rewards framework',
            'Strong home-school communication with parents',
            'Support for transitions between year groups and stages',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Contact Our Pastoral Team</p>
          <p className="text-sm text-gray-600">If you have any concerns about your child&apos;s wellbeing, please do not hesitate to contact us at <a href="mailto:abofraworldschool@gmail.com" className="underline" style={{ color: '#206802' }}>abofraworldschool@gmail.com</a> or call <a href="tel:+233556592410" className="underline" style={{ color: '#206802' }}>+233 556 592 410</a>.</p>
        </div>
      </SectionLayout>
    </>
  )
}
