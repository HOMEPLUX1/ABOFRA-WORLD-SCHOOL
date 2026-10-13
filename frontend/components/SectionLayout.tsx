import Link from 'next/link'

interface SidebarLink {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

interface SectionLayoutProps {
  sidebarLinks: SidebarLink[]
  breadcrumb: { label: string; href?: string }[]
  children: React.ReactNode
}

export default function SectionLayout({ sidebarLinks, breadcrumb, children }: SectionLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-10">

        {/* Sidebar */}
        <aside className="md:w-64 shrink-0 md:border-r md:border-gray-200 md:pr-8">
          <h3 className="font-extrabold uppercase text-sm tracking-widest mb-1" style={{ color: '#206802' }}>
            IN THIS SECTION:
          </h3>
          <div className="mb-4" style={{ width: '100%', height: 3, backgroundColor: '#82c906' }} />
          <nav className="flex flex-col">
            {sidebarLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 py-2.5 text-sm border-b border-gray-200 transition-colors hover:text-green-700"
                  style={{ color: '#444' }}
                >
                  {link.label}
                </Link>
                {link.children?.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="flex items-center gap-2 py-2 pl-5 text-sm border-b border-gray-100 transition-colors hover:text-green-700"
                    style={{ color: '#666' }}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm mb-6 text-gray-400">
            <Link href="/" className="hover:text-gray-600">&#x1F3E0;</Link>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <span>|</span>
                {crumb.href
                  ? <Link href={crumb.href} className="hover:underline" style={{ color: '#206802' }}>{crumb.label}</Link>
                  : <span className="text-gray-600">{crumb.label}</span>
                }
              </span>
            ))}
          </div>
          {children}
        </main>

      </div>
    </div>
  )
}
