import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'
import Link from 'next/link'

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

const programmes = [
  {
    stage: 'Early Years (Pre-School)',
    ages: 'Ages 3 – 5',
    color: '#82c906',
    description: 'Our Early Years Foundation Stage nurtures young learners through play-based learning, developing language, creativity, and social skills in a safe and stimulating environment.',
    subjects: ['Language & Literacy', 'Numeracy & Logic', 'Creative Arts', 'Physical Development', 'Personal & Social Development'],
    href: '/education/eyfs',
  },
  {
    stage: 'Cambridge Primary',
    ages: 'Ages 5 – 11',
    color: '#2d5f82',
    description: 'Cambridge Primary builds a strong academic foundation across core subjects, encouraging curiosity, confidence, and a lifelong love for learning. Learners develop knowledge, skills and understanding in a broad and balanced curriculum.',
    subjects: ['English', 'Mathematics', 'Science', 'Digital Literacy', 'Global Perspectives', 'Creative Arts'],
    href: '/education/cambridge',
  },
  {
    stage: 'GES Primary',
    ages: 'Ages 6 – 12',
    color: '#206802',
    description: 'Following the Ghana Education Service (GES) curriculum, our primary programme delivers a nationally recognised education that prepares pupils for the Basic Education Certificate Examination (BECE) pathway.',
    subjects: ['English Language', 'Mathematics', 'Science', 'Social Studies', 'RME', 'Creative Arts & Design', 'Computing'],
    href: '/education/ges',
  },
  {
    stage: 'Cambridge Lower Secondary',
    ages: 'Ages 11 – 14',
    color: '#2d5f82',
    description: 'Cambridge Lower Secondary deepens subject knowledge and builds critical thinking skills, preparing students for the rigour of IGCSE. It provides a smooth transition from primary through carefully structured progression.',
    subjects: ['English', 'Mathematics', 'Science', 'History', 'Geography', 'ICT', 'Global Perspectives'],
    href: '/education/cambridge',
  },
  {
    stage: 'GES Junior High School (JHS)',
    ages: 'Ages 12 – 15',
    color: '#206802',
    description: 'Our JHS programme follows the GES curriculum, equipping students with the knowledge and skills to excel in the Basic Education Certificate Examination (BECE) and proceed to Senior High School.',
    subjects: ['English Language', 'Mathematics', 'Integrated Science', 'Social Studies', 'ICT', 'French', 'RME', 'Creative Arts'],
    href: '/education/ges',
  },
  {
    stage: 'Cambridge IGCSE',
    ages: 'Ages 14 – 16',
    color: '#2d5f82',
    description: 'The Cambridge IGCSE is one of the most widely recognised qualifications in the world. Students study a broad range of subjects and sit internationally marked examinations, earning credentials recognised by universities in 160+ countries.',
    subjects: ['English', 'Mathematics', 'Sciences', 'Humanities', 'Languages', 'Business Studies', 'ICT'],
    href: '/education/cambridge',
  },
  {
    stage: 'Cambridge A & AS Levels',
    ages: 'Ages 16 – 18',
    color: '#1a1a2a',
    description: 'Cambridge A Levels are the gold standard for university entry worldwide. Our students choose specialist subjects that align with their university aspirations, guided by experienced teachers with deep subject knowledge.',
    subjects: ['Sciences', 'Mathematics', 'Humanities', 'Business & Economics', 'Languages', 'Computing'],
    href: '/education/cambridge',
  },
]

export default function CurriculumPage() {
  return (
    <>
      <InnerPageHero topText="EDUCATION" mainText="CURRICULUM OVERVIEW" bgColor="#0f1a3a" imageId="education" />
      <SectionLayout
        sidebarLinks={educationLinks}
        breadcrumb={[
          { label: 'Education', href: '/education' },
          { label: 'Curriculum Overview' },
        ]}
      >
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Our Dual-Curriculum Approach</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          At Abofra World School, we offer both the <strong>Ghana Education Service (GES)</strong> national
          curriculum and the internationally recognised <strong>Cambridge International</strong> curriculum.
          This dual-pathway approach gives every student the flexibility to pursue either a local or
          international academic route — or both — depending on their goals and aspirations.
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">
          From Early Years through to A Levels, our programmes are designed to build confident,
          curious and capable learners who are ready for universities and careers across Ghana and beyond.
        </p>

        {/* Programme cards */}
        <div className="space-y-6">
          {programmes.map((p, i) => (
            <div key={i} style={{ border: `1px solid #e5e7eb`, borderLeft: `4px solid ${p.color}`, borderRadius: 10, padding: '24px 28px', background: '#fafafa' }}>
              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <div>
                  <h3 className="text-base font-extrabold uppercase tracking-wide" style={{ color: p.color }}>{p.stage}</h3>
                  <span className="text-xs font-semibold text-gray-400 uppercase">{p.ages}</span>
                </div>
                <Link href={p.href} className="text-xs font-bold px-4 py-1.5 rounded-full text-white" style={{ backgroundColor: p.color }}>
                  Learn More →
                </Link>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-2">
                {p.subjects.map((s, j) => (
                  <span key={j} className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}33` }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-extrabold text-gray-800 mb-2 uppercase text-sm tracking-wide">Need Help Choosing a Pathway?</p>
          <p className="text-sm text-gray-600 mb-3">
            Our admissions team is happy to advise you on which curriculum pathway best suits your child's
            learning style, goals and future aspirations.
          </p>
          <Link href="/contact" className="inline-block text-sm font-bold px-5 py-2 rounded-full text-white" style={{ backgroundColor: '#82c906' }}>
            Contact Us →
          </Link>
        </div>
      </SectionLayout>
    </>
  )
}
