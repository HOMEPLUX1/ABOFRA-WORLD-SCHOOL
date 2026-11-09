'use client'
import { useEffect, useState } from 'react'
import InnerPageHero from '@/components/InnerPageHero'
import SectionLayout from '@/components/SectionLayout'
import Image from 'next/image'

const links = [
  { label: 'Extracurricular Activities', href: '/student-life/extracurricular' },
  { label: 'Sports & Games',             href: '/student-life/sports' },
  { label: 'Arts & Culture',             href: '/student-life/arts' },
  { label: 'Clubs & Societies',          href: '/student-life/clubs' },
  { label: 'Gallery',                    href: '/student-life/gallery' },
  { label: 'Student Council',            href: '/leadership/student-council' },
]

type Photo = { id: string; url: string; caption: string; uploadedAt: string }

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPhotos(data) })
      .catch(() => {})
  }, [])

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

        {photos.length === 0 ? (
          <div className="p-10 rounded-xl border-2 border-dashed border-gray-300 text-center mb-6">
            <p className="font-bold text-gray-700 mb-1">No photos yet</p>
            <p className="text-sm text-gray-500">Photos will appear here once uploaded from the admin portal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="relative overflow-hidden rounded-xl cursor-pointer group"
                style={{ aspectRatio: '4/3' }}
                onClick={() => setLightbox(photo.url)}
              >
                <Image
                  src={photo.url}
                  alt={photo.caption || 'Gallery photo'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width:600px) 50vw, 33vw"
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-5 rounded-xl" style={{ backgroundColor: '#f0f7e6', borderLeft: '4px solid #82c906' }}>
          <p className="font-bold text-gray-800 mb-1">Follow Us on Social Media</p>
          <p className="text-sm text-gray-600">For the latest photos and videos from school life, follow us on Facebook, Instagram, YouTube and TikTok. Links are in the bar at the top of the page.</p>
        </div>
      </SectionLayout>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Gallery" style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-6 text-white text-3xl font-bold"
            style={{ lineHeight: 1 }}
          >×</button>
        </div>
      )}
    </>
  )
}
