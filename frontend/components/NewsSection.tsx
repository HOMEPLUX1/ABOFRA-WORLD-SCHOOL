'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

interface Article {
  id: number
  title: string
  excerpt: string
  date: string
  category: string
  emoji: string
}

const fallback: Article[] = [
  { id: 1, title: 'Abofra Students Win Regional Science Fair', excerpt: 'Our Year 9 science team brought home gold at the regional science competition with their innovative water purification project.', date: 'Jun 10, 2026', category: 'Achievement', emoji: '\u{1F3C6}' },
  { id: 2, title: 'New Computer Lab Opens for All Students', excerpt: 'We are thrilled to unveil our brand-new state-of-the-art computer laboratory, equipped with 60 modern workstations.', date: 'May 28, 2026', category: 'Facilities', emoji: '\u{1F4BB}' },
  { id: 3, title: 'Annual Cultural Day Celebrates Our Diversity', excerpt: "Students and staff came together in a vibrant celebration of Ghana's rich cultural heritage — dances, food and music.", date: 'May 15, 2026', category: 'Events', emoji: '\u{1F389}' },
]

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>(fallback)

  useEffect(() => {
    axios.get('http://localhost:5002/api/news')
      .then(res => { if (res.data?.length) setArticles(res.data) })
      .catch(() => {})
  }, [])

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading — same style as Olive School */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10 uppercase tracking-wide">
          Latest <span style={{ color: '#82c906' }}>News</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(0, 3).map(article => (
            <article key={article.id} className="group">
              {/* Thumbnail */}
              <div
                className="h-48 flex items-center justify-center text-6xl mb-3 overflow-hidden"
                style={{ backgroundColor: '#e8f5e2' }}
              >
                <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
                  {article.emoji}
                </span>
              </div>
              {/* Date */}
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{article.date}</p>
              {/* Title */}
              <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-green-school transition-colors leading-snug">
                {article.title}
              </h3>
              {/* Excerpt */}
              <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-3">{article.excerpt}</p>
              {/* Read more */}
              <Link
                href={`/news/${article.id}`}
                className="text-sm font-bold hover:underline"
                style={{ color: '#82c906' }}
              >
                read more &rsaquo;
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-block px-8 py-3 text-sm font-bold uppercase tracking-widest"
            style={{ backgroundColor: '#82c906', color: '#1a1a1a' }}
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
}

