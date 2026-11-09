import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'School Leadership Team', href: '/leadership/team' },
  { label: 'Board of Governors', href: '/leadership/governors' },
  { label: 'Student Council', href: '/leadership/student-council' },
  { label: 'Vision & Strategy', href: '/leadership/vision' },
]

export default function VisionPage() {
  return (
    <>
      <InnerPageHero topText="LEADERSHIP" mainText="VISION & STRATEGY" bgColor="#1a2a0a" imageId="leadership" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Leadership', href: '/leadership' }, { label: 'Vision & Strategy' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Our Vision</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          To be a world-class school that inspires lifelong learners, confident leaders and responsible
          global citizens who make a positive difference in their communities and beyond.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-4" style={{ color: '#206802' }}>Strategic Priorities</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Academic Excellence — raising attainment for every student at every level',
            'Wellbeing First — ensuring every child feels safe, valued and supported',
            'World-Class Teaching — investing in our staff through continuous development',
            'Community & Partnership — building strong links with parents and the community',
            'Innovation — embracing technology and modern pedagogy in the classroom',
            'Sustainability — developing responsible citizens who care for the world',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#82c906' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Our Commitment</p>
          <p className="text-sm text-gray-600">Every decision we make is guided by what is best for our students. We review our strategy annually to ensure we are meeting the evolving needs of our school community.</p>
        </div>
      </SectionLayout>
    </>
  )
}
