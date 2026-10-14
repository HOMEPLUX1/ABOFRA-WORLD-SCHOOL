'use client'
import { useState } from 'react'
import axios from 'axios'

const info = [
  { label: 'Address',      val: 'ARCHBISHOP SARPONG ROAD AK-298-7816' },
  { label: 'Main Office',  val: '+233 556 592 410 / +233 243 267 237' },
  { label: 'Email',        val: 'abofraworldschool@gmail.com' },
  { label: 'Office Hours', val: 'Mon - Fri: 7:30am - 5:00pm' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await axios.post('/api/contact', form)
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      {/* ── HERO BANNER ── */}
      <div className="py-16 px-4 text-center" style={{ backgroundColor: '#1a1a1a' }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: '#82c906' }}>
          Get in Touch
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide mb-4 text-white">
          Contact Us
        </h1>
        <div className="mx-auto mb-5" style={{ width: 60, height: 4, backgroundColor: '#82c906' }} />
        <p className="max-w-xl mx-auto text-sm sm:text-base" style={{ color: '#d1d5db' }}>
          We&apos;d love to hear from you. Reach out and our team will get back to you promptly.
        </p>
      </div>

      {/* ── BODY ── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-10">

          {/* School Info */}
          <div className="w-full md:w-80 shrink-0">
            <h2 className="text-lg font-extrabold uppercase tracking-wide mb-4" style={{ color: '#206802' }}>
              School Information
            </h2>
            <div className="mb-4" style={{ width: '100%', height: 3, backgroundColor: '#82c906' }} />
            <div className="space-y-4">
              {info.map((c) => (
                <div
                  key={c.label}
                  className="p-4 border-l-4"
                  style={{ borderColor: '#82c906', backgroundColor: '#f9fafb' }}
                >
                  <p className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{ color: '#206802' }}>
                    {c.label}
                  </p>
                  <p className="text-sm text-gray-700 leading-snug">{c.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold uppercase tracking-wide mb-4" style={{ color: '#206802' }}>
              Send a Message
            </h2>
            <div className="mb-6" style={{ width: '100%', height: 3, backgroundColor: '#82c906' }} />

            {status === 'sent' ? (
              <div className="p-8 text-center rounded border" style={{ backgroundColor: '#f0fdf4', borderColor: '#82c906' }}>
                <p className="font-extrabold text-lg mb-1" style={{ color: '#206802' }}>Message Sent!</p>
                <p className="text-sm text-gray-600">
                  Thank you for reaching out. We&apos;ll get back to you within 1&ndash;2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-gray-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#82c906')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-gray-600">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none"
                      style={{ borderColor: '#e5e7eb' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#82c906')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-gray-600">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none"
                    style={{ borderColor: '#e5e7eb' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#82c906')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    placeholder="What is your message about?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide mb-1 text-gray-600">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none resize-none"
                    style={{ borderColor: '#e5e7eb' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#82c906')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    placeholder="Write your message here..."
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-sm">Something went wrong. Please try again or email us directly.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full font-extrabold uppercase tracking-widest py-3 text-sm disabled:opacity-60 transition-colors"
                  style={{ backgroundColor: '#82c906', color: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#206802')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#82c906')}
                >
                  {status === 'sending' ? 'Sending...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ── MAP ── */}
      <section style={{ backgroundColor: '#f9fafb' }} className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-extrabold uppercase tracking-wide mb-2" style={{ color: '#206802' }}>
            Find Us
          </h2>
          <div className="mb-6" style={{ width: 60, height: 3, backgroundColor: '#82c906' }} />

          {/* Map with clickable directions overlay */}
          <div className="relative w-full overflow-hidden" style={{ borderRadius: 2, border: '3px solid #82c906', height: 400 }}>
            <iframe
              title="Abofra World School Location"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              allowFullScreen
              src="https://maps.google.com/maps?q=Abofra+World+School,Kumasi,Ghana&output=embed"
            />
            {/* Directions button overlay */}
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Abofra+World+School,Kumasi,Ghana"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-1/2 flex items-center gap-2 px-5 py-3 font-bold text-sm shadow-lg transition-all hover:scale-105"
              style={{
                transform: 'translateX(-50%)',
                backgroundColor: '#82c906',
                color: '#fff',
                borderRadius: 8,
                whiteSpace: 'nowrap',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions to Our School
            </a>
          </div>

          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <p className="text-sm text-gray-500">Archbishop Sarpong Road, AK-298-7816, Kumasi, Ghana</p>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Abofra+World+School,Kumasi,Ghana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-wide underline"
              style={{ color: '#82c906' }}
            >
              Open in Google Maps &#8250;
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
