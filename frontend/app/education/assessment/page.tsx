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

export default function AssessmentPage() {
  return (
    <>
      <InnerPageHero topText="ACADEMICS" mainText="ASSESSMENT & EXAMS" bgColor="#0f1a3a" imageId="education" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Academics', href: '/education' }, { label: 'Assessment & Exams' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>Our Assessment Approach</h2>
        <p className="text-gray-700 leading-relaxed mb-5">
          At Abofra World School, assessment is an integral part of learning. We use a range of formative
          and summative assessments to monitor progress, celebrate achievement and identify where additional
          support is needed.
        </p>
        <h2 className="text-xl font-extrabold uppercase mb-3 mt-6" style={{ color: '#206802' }}>Types of Assessment</h2>
        <ul className="space-y-3 mb-6">
          {[
            'Continuous Assessment — ongoing class tests, quizzes and assignments',
            'End of Term Examinations — formal exams at the close of each term',
            'Cambridge Checkpoint Exams — international benchmark assessments',
            'Cambridge IGCSE Examinations — externally marked by Cambridge Assessment',
            'Cambridge A Level Examinations — advanced qualifications for university entry',
            'BECE — Basic Education Certificate Examination for GES students',
            'WASSCE — West Africa Senior School Certificate Examination',
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-gray-700 text-sm">
              <span className="font-extrabold shrink-0" style={{ color: '#206802' }}>&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Report Cards</p>
          <p className="text-sm text-gray-600">
            Parents receive a detailed report card at the end of each term. Reports are also available
            digitally via the Parent Portal. For queries about your child&apos;s results, please contact
            the class teacher or the school office.
          </p>
        </div>
      </SectionLayout>
    </>
  )
}
