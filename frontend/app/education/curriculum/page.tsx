import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const educationLinks = [
  { label: 'Curriculum Overview', href: '/education/curriculum' },
  { label: 'Early Years (EYFS)',   href: '/education/eyfs' },
  { label: 'Primary School',       href: '/education/primary' },
  { label: 'Junior High School',   href: '/education/junior' },
  { label: 'Senior High School',   href: '/education/senior' },
  { label: 'Assessment & Exams',   href: '/education/assessment' },
]

const programmes = [
  {
    stage: 'Early Years (Pre-School)',
    ages: 'Ages 3 – 5',
    color: '#82c906',
    description: 'Our Early Years Foundation Stage nurtures young learners through play-based learning, developing language, creativity, and social skills in a safe and stimulating environment.',
    subjects: ['Language & Literacy', 'Numeracy & Logic', 'Creative Arts', 'Physical Development', 'Personal & Social Development'],
  },
  {
    stage: 'Primary School',
    ages: 'Ages 5 – 12',
    color: '#206802',
    description: 'Our primary programme builds a strong academic foundation across core subjects, encouraging curiosity, confidence, and a lifelong love of learning. Pupils develop knowledge, skills and understanding in a broad and balanced curriculum.',
    subjects: ['English Language', 'Mathematics', 'Science', 'Social Studies', 'Creative Arts & Design', 'Computing', 'Physical Education'],
  },
  {
    stage: 'Junior High School (JHS)',
    ages: 'Ages 12 – 15',
    color: '#2d5f82',
    description: 'Our JHS programme deepens subject knowledge and builds critical thinking skills, preparing students for examinations and a smooth transition into Senior High School.',
    subjects: ['English Language', 'Mathematics', 'Integrated Science', 'Social Studies', 'ICT', 'French', 'RME', 'Creative Arts'],
  },
  {
    stage: 'Senior High School (SHS)',
    ages: 'Ages 15 – 18',
    color: '#1a1a2a',
    description: 'Our SHS programme prepares students for university and professional careers. Students choose specialist subjects aligned with their aspirations, guided by experienced teachers with deep subject knowledge.',
    subjects: ['Sciences', 'Mathematics', 'Humanities', 'Business & Economics', 'Languages', 'Computing'],
  },
]

export default function CurriculumPage() {
  return (
    <>
      <InnerPageHero topText="ACADEMICS" mainText="CURRICULUM OVERVIEW" bgColor="#0f1a3a" imageId="education" />
      <SectionLayout
        sidebarLinks={educationLinks}
        breadcrumb={[
          { label: 'Academics', href: '/education' },
          { label: 'Curriculum Overview' },
        ]}
      >
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Our Academic Programmes</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          At Abofra World School, we offer a comprehensive academic programme from Early Years through to
          Senior High School. Our curriculum is designed to build confident, curious and capable learners
          who are ready for universities and careers across Ghana and beyond.
        </p>
        <p className="text-gray-700 leading-relaxed mb-8">
          From Pre-School to SHS, every stage of learning at Abofra is carefully structured to ensure
          progression, depth and breadth across all subject areas.
        </p>

        <div className="space-y-6">
          {programmes.map((p, i) => (
            <div key={i} style={{ border: `1px solid #e5e7eb`, borderLeft: `4px solid ${p.color}`, borderRadius: 10, padding: '24px 28px', background: '#fafafa' }}>
              <div className="mb-2">
                <h3 className="text-base font-extrabold uppercase tracking-wide" style={{ color: p.color }}>{p.stage}</h3>
                <span className="text-xs font-semibold text-gray-400 uppercase">{p.ages}</span>
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
          <p className="font-extrabold text-gray-800 mb-2 uppercase text-sm tracking-wide">Interested in Enrolling?</p>
          <p className="text-sm text-gray-600 mb-3">
            Our admissions team is happy to advise you on the right programme for your child&apos;s
            learning stage, goals and future aspirations.
          </p>
          <a href="/contact" className="inline-block text-sm font-bold px-5 py-2 rounded-full text-white" style={{ backgroundColor: '#82c906' }}>
            Contact Us →
          </a>
        </div>
      </SectionLayout>
    </>
  )
}
