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

export default function SendPage() {
  return (
    <>
      <InnerPageHero topText="PUPIL SUPPORT" mainText="SPECIAL EDUCATIONAL NEEDS" bgColor="#1a0f2a" imageId="pupil-support" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Pupil Support', href: '/pupil-support' }, { label: 'Special Educational Needs' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Inclusive Education</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          Abofra World School is committed to providing an inclusive environment where every learner can
          thrive. We recognise that some students may need additional support to reach their full potential
          and we are dedicated to meeting those needs with care, expertise and compassion.
        </p>
        <ul className="space-y-3 mb-6">
          {[
            'Individual learning plans tailored to each student&apos;s needs',
            'Dedicated SEND coordinator overseeing support across the school',
            'Small group and one-to-one intervention sessions',
            'Close collaboration with parents and external specialists',
            'Regular reviews to monitor progress and adjust support',
            'A fully inclusive classroom environment for all learners',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Get In Touch</p>
          <p className="text-sm text-gray-600">To discuss your child&apos;s individual needs, please contact our SEND coordinator via <a href="mailto:abofraworldschool@gmail.com" className="underline" style={{ color: '#206802' }}>abofraworldschool@gmail.com</a>.</p>
        </div>
      </SectionLayout>
    </>
  )
}
