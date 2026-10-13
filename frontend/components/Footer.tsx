import Link from 'next/link'

const usefulLinks = [
  { label: 'Pledge of Excellence', href: '/about' },
  { label: 'Curriculum Overview',  href: '/academics' },
  { label: 'Admissions',           href: '/admissions' },
  { label: 'Term Dates',           href: '/information' },
  { label: 'Uniform Guide',        href: '/information' },
  { label: 'Careers',              href: '/contact' },
  { label: 'Contact Us',           href: '/contact' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#2d2d2d' }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Col 1 — School contact */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img src="/logo.png" alt="Abofra World School" style={{ width: 80, height: 80, objectFit: 'contain' }} />
            <img src="/school-name.png" alt="Abofra World School" style={{ height: 100, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>ARCHBISHOP SARPONG ROAD AK-298-7816</li>
            <li>
              <a href="tel:+233556592410" className="hover:text-white transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                +233 556 592 410 / +233 243 267 237
              </a>
            </li>
            <li>
              <a href="mailto:abofraworldschool@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                abofraworldschool@gmail.com
              </a>
            </li>
            <li className="pt-2">
              <a href="#" className="text-gray-300 hover:text-white text-xs">@AbofraWorldSchool</a>
            </li>
          </ul>
        </div>

        {/* Col 2 — Useful links */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wide">Useful Links</h4>
          <ul className="space-y-2">
            {usefulLinks.map(l => (
              <li key={l.label}>
                <Link href={l.href} className="text-gray-300 text-sm hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — About / partner */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wide">Our School</h4>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Abofra World School is dedicated to nurturing young minds and shaping tomorrow&apos;s leaders
            through excellence, integrity, innovation and community.
          </p>
          <div className="border border-gray-600 rounded p-4 text-sm text-gray-300">
            <p className="font-bold text-white mb-1">Office Hours</p>
            <p>Mon &ndash; Fri: 7:30am &ndash; 5:00pm</p>
            <p>Saturday: 9:00am &ndash; 1:00pm</p>
            <p className="mt-2">
              General Enquiries:{' '}
              <a href="tel:+233556592410" className="hover:text-white">+233 556 592 410</a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Abofra World School. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

