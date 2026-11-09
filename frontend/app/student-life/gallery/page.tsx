'use client'
import { useEffect, useState } from 'react'
import StudentLifeLayout from '@/components/StudentLifeLayout'
import Image from 'next/image'

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
    <StudentLifeLayout
      title="Gallery"
      subtitle="School life in pictures. From classroom moments and sports days to cultural celebrations and graduation."
      accent="#f472b6"
    >
      {photos.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '2px dashed rgba(244,114,182,.3)',
          borderRadius: 20,
          padding: '64px 32px',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📸</p>
          <p style={{ fontWeight: 800, color: '#f472b6', marginBottom: 8, fontSize: 16 }}>No photos yet</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)' }}>Photos will appear here once uploaded from the admin portal.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 28 }}>
          {photos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setLightbox(photo.url)}
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: 16,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,.1)',
                background: 'rgba(255,255,255,.05)',
              }}
            >
              <Image src={photo.url} alt={photo.caption || 'Gallery photo'} fill style={{ objectFit: 'cover' }} sizes="(max-width:600px) 100vw, 33vw" />
              {photo.caption && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,.8))', padding: '20px 12px 10px', fontSize: 12, color: 'rgba(255,255,255,.85)', fontWeight: 600 }}>
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{
        background: 'rgba(244,114,182,.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(244,114,182,.25)',
        borderRadius: 20,
        padding: '24px 28px',
      }}>
        <p style={{ fontWeight: 800, color: '#f472b6', marginBottom: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>Follow Us on Social Media</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.7 }}>For the latest photos and videos from school life, follow us on Facebook, Instagram, YouTube and TikTok. Links are in the bar at the top of the page.</p>
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={lightbox} alt="" style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 12 }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 28, color: '#fff', fontSize: 32, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}
    </StudentLifeLayout>
  )
}
