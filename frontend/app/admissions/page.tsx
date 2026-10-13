'use client'

export default function AdmissionsPage() {
  const steps = [
    {
      num: '01',
      title: 'Enquiry Form',
      desc: 'Parents/guardians complete the online or in-person enquiry form to share basic details about the candidate and the preferred programme.',
    },
    {
      num: '02',
      title: 'Interview with Candidate',
      desc: 'The candidate is invited for an interview with the Admissions and Counselling team to understand their background, strengths, and support needs.',
    },
    {
      num: '03',
      title: 'Entrance Examination',
      desc: 'Candidates sit for an entrance exam consisting of three core papers:',
      bullets: ['English', 'Mathematics', 'General Science'],
    },
    {
      num: '04',
      title: 'Application Form & Documents',
      desc: 'Upon successful performance, parents purchase and complete the official application form and submit all required documents to the Admissions Office.',
    },
  ]

  return (
    <div>
      <div className="text-white py-16 px-6 text-center" style={{ backgroundColor: '#1a2a3a' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#82c906' }}>Join Us</p>
        <h1 className="text-4xl font-extrabold mb-3">Admissions</h1>
        <p className="text-blue-200 max-w-xl mx-auto">
          We welcome applications from families who share our values and commitment to excellence.
        </p>
      </div>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-10" style={{ color: '#1a2a3a' }}>How to Apply</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s: any) => (
              <div key={s.num} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-14 h-14 rounded-full text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#1a2a3a' }}>
                  {s.num}
                </div>
                <h3 className="font-bold mb-2" style={{ color: '#1a2a3a' }}>{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                {s.bullets && (
                  <ul className="mt-3 text-sm text-gray-600 space-y-1 text-left inline-block">
                    {s.bullets.map((b: string) => (
                      <li key={b} className="flex items-center gap-2">
                        <span style={{ color: '#82c906', fontWeight: 700 }}>✦</span> {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: '#1a2a3a' }}>Required Documents</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Completed Application Form',
              'Birth Certificate (original + photocopy)',
              'Previous School Report Cards (last 2 years)',
              'Passport-size photographs (x4)',
              'Proof of residence / utility bill',
              'Medical / immunization records',
              'Recommendation letter from previous school',
              'Application processing fee receipt',
            ].map((doc) => (
              <div key={doc} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <span className="text-lg">&#128196;</span>
                <span className="text-gray-700 text-sm">{doc}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-extrabold mb-6 text-center" style={{ color: '#1a2a3a' }}>Enquiry Form</h3>
            <form onSubmit={e => { e.preventDefault(); alert('Your enquiry has been submitted! We will be in touch shortly.') }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Parent / Guardian Name *</label>
                  <input required type="text" placeholder="e.g. Kofi Mensah" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Candidate Name *</label>
                  <input required type="text" placeholder="Child's full name" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"/>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input required type="tel" placeholder="0244xxxxxx" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                  <input type="email" placeholder="parent@email.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"/>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Candidate Age *</label>
                  <input required type="number" min="3" max="20" placeholder="e.g. 8" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Preferred Programme *</label>
                  <select required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition bg-white">
                    <option value="">— Select —</option>
                    <option>Creche</option>
                    <option>Kindergarten</option>
                    <option>Lower Primary</option>
                    <option>Upper Primary</option>
                    <option>Junior High School</option>
                    <option>Senior High School</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Additional Information</label>
                <textarea rows={3} placeholder="Tell us about your child's background, strengths, or any support needs…" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 transition resize-none"/>
              </div>
              <button type="submit" className="w-full py-3 font-bold text-white rounded-lg text-sm transition" style={{ backgroundColor: '#82c906' }}>
                Submit Enquiry →
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
