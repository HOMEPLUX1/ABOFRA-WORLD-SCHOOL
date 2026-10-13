import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const educationLinks = [
  { label: 'Curriculum Overview', href: '/education/curriculum' },
  { label: 'G.E.S',              href: '/education/ges' },
  { label: 'Cambridge',           href: '/education/cambridge' },
  { label: 'Assessment & Exams',  href: '/education/assessment' },
]

const offerings = [
  'Full alignment with the Ghana National Curriculum from KG to Senior High',
  'Qualified and certified GES-approved teachers across all subject areas',
  'Preparation for BECE (Basic Education Certificate Examination)',
  'Preparation for WASSCE (West African Senior School Certificate Examination)',
  'Regular internal assessments aligned with GES standards',
  'Co-curricular activities that support holistic development',
]

export default function GESPage() {
  return (
    <>
      <InnerPageHero topText="EDUCATION" mainText="G.E.S CURRICULUM" bgColor="#0f2a1a" imageId="education-ges" />
      <SectionLayout
        sidebarLinks={educationLinks}
        breadcrumb={[
          { label: 'Education', href: '/education' },
          { label: 'G.E.S' },
        ]}
      >
        <div className="flex items-center gap-4 mb-8 p-5 border border-gray-200 rounded w-fit">
          <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <span className="text-2xl font-black text-gray-400">G</span>
          </div>
          <div>
            <p className="font-extrabold text-lg text-gray-800 uppercase tracking-wide">Ghana Education Service</p>
            <p className="text-sm text-gray-500">National Curriculum Provider</p>
          </div>
        </div>

        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#82c906' }}>About G.E.S</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Abofra World School is fully accredited under the Ghana Education Service (G.E.S), the
          national body responsible for overseeing the implementation of pre-tertiary education in Ghana.
          Our G.E.S curriculum ensures every student receives a thorough grounding in the national
          standards set by the Ministry of Education.
        </p>

        <h2 className="text-xl font-extrabold uppercase mb-3 mt-6" style={{ color: '#82c906' }}>What We Offer</h2>
        <ul className="space-y-3">
          {offerings.map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0 mt-0.5" style={{ color: '#82c906' }}>&#10003;</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 p-5 rounded" style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">GES Accreditation</p>
          <p className="text-sm text-gray-600">
            Abofra World School is a fully registered and accredited institution under the Ghana
            Education Service. Our students sit national examinations and receive nationally recognised certificates.
          </p>
        </div>
      </SectionLayout>
    </>
  )
}
