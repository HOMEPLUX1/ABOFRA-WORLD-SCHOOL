import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const educationLinks = [
  { label: 'Curriculum Overview', href: '/education/curriculum' },
  { label: 'G.E.S',              href: '/education/ges' },
  { label: 'Cambridge',          href: '/education/cambridge' },
  { label: 'Early Years (EYFS)', href: '/education/eyfs' },
  { label: 'Primary School',     href: '/education/primary' },
  { label: 'Junior High School', href: '/education/junior' },
  { label: 'Senior High School', href: '/education/senior' },
  { label: 'Assessment & Exams', href: '/education/assessment' },
]

export default function CambridgePage() {
  return (
    <>
      <InnerPageHero topText="EDUCATION" mainText="CAMBRIDGE CURRICULUM" bgColor="#0f1a3a" imageId="education-cambridge" />
      <SectionLayout
        sidebarLinks={educationLinks}
        breadcrumb={[
          { label: 'Education', href: '/education' },
          { label: 'Cambridge' },
        ]}
      >
        {/* Cambridge Logo placeholder */}
        <div className="flex items-center gap-4 mb-8 p-5 border border-gray-200 rounded w-fit">
          <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <span className="text-2xl font-black" style={{ color: '#2d5f82' }}>C</span>
          </div>
          <div>
            <p className="font-extrabold text-lg text-gray-800 uppercase tracking-wide">Cambridge International</p>
            <p className="text-sm text-gray-500">University of Cambridge, UK</p>
          </div>
        </div>

        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#2d5f82' }}>About Cambridge International</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Abofra World School proudly runs the Cambridge International curriculum, one of the world&apos;s
          most respected education programmes, developed by the University of Cambridge. This globally
          recognised qualification opens doors to universities and employers worldwide, giving our
          students a competitive edge.
        </p>

        <h2 className="text-xl font-extrabold uppercase mb-3 mt-6" style={{ color: '#2d5f82' }}>Cambridge Programmes We Offer</h2>
        <ul className="space-y-3">
          {[
            'Cambridge Primary - nurturing enquiry, curiosity and critical thinking from an early age',
            'Cambridge Lower Secondary - building on primary with deeper subject knowledge',
            'Cambridge IGCSE - internationally recognised qualifications at secondary level',
            'Cambridge A Levels - advanced qualifications for university entry worldwide',
            'Cambridge Assessment English - internationally recognised English language certificates',
            'Cambridge Global Perspectives - developing research, communication and collaboration skills',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0 mt-0.5" style={{ color: '#2d5f82' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-extrabold uppercase mb-3 mt-6" style={{ color: '#2d5f82' }}>Why Cambridge?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Cambridge qualifications are accepted by over 10,000 universities in 160+ countries. Our
          students gain world-class skills in critical thinking, problem solving and independent
          learning - preparing them to thrive in any environment globally.
        </p>

        <div className="mt-4 p-5 rounded" style={{ backgroundColor: '#eef4fa', borderLeft: '4px solid #2d5f82' }}>
          <p className="font-bold text-gray-800 mb-1">Cambridge Accreditation</p>
          <p className="text-sm text-gray-600">
            Abofra World School is a registered Cambridge International School. Our teachers are
            Cambridge-trained and our examinations are administered and marked by Cambridge Assessment
            International Education.
          </p>
        </div>
      </SectionLayout>
    </>
  )
}
