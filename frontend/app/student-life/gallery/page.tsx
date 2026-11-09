import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'

const links = [
  { label: 'Extracurricular Activities', href: '/student-life/extracurricular' },
  { label: 'Sports & Games',             href: '/student-life/sports' },
  { label: 'Arts & Culture',             href: '/student-life/arts' },
  { label: 'Clubs & Societies',          href: '/student-life/clubs' },
  { label: 'Gallery',                    href: '/student-life/gallery' },
  { label: 'Student Council',            href: '/leadership/student-council' },
]

export default function GalleryPage() {
  return (
    <>
      <InnerPageHero topText="STUDENT LIFE" mainText="GALLERY" bgColor="#0a1a2a" imageId="student-life" />
      <SectionLayout sidebarLinks={links} breadcrumb={[{ label: 'Student Life', href: '/student-life' }, { label: 'Gallery' }]}>
        <h2 className="text-xl font-extrabold uppercase mb-3" style={{ color: '#206802' }}>School Life in Pictures</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Take a look at life at Abofra World School through our photo gallery. From classroom moments
          and sports days to cultural celebrations and graduation — every picture tells a story of our
          vibrant school community.
        </p>
        <div className="p-10 rounded-xl border-2 border-dashed border-gray-300 text-center mb-6">
          <p className="text-4xl mb-3">📸</p>
          <p className="font-bold text-gray-700 mb-1">Gallery Coming Soon</p>
          <p className="text-sm text-gray-500">Photos of school events, activities and student life will be added here. Check back soon!</p>
        </div>
        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Follow Us on Social Media</p>
          <p className="text-sm text-gray-600">For the latest photos and videos from school life, follow us on Facebook, Instagram, YouTube and TikTok. Links are in the bar at the top of the page.</p>
        </div>
      </SectionLayout>
    </>
  )
}
