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
  { id: 1, title: 'Abofra Students Win Regional Science Fair', excerpt: 'Our Year 9 science team brought home gold at the regional science competition, impressing judges with their innovative water purification project.', date: 'June 10, 2026', category: 'Achievement', emoji: '\u{1F3C6}' },
  { id: 2, title: 'New Computer Lab Opens for All Students', excerpt: 'We are thrilled to unveil our brand-new state-of-the-art computer laboratory, equipped with 60 modern workstations for coding and digital learning.', date: 'May 28, 2026', category: 'Facilities', emoji: '\u{1F4BB}' },
  { id: 3, title: 'Annual Cultural Day Celebrates Diversity', excerpt: "Students and staff came together in a vibrant celebration of Ghana's rich cultural heritage, showcasing traditional dances, food, and music.", date: 'May 15, 2026', category: 'Events', emoji: '\u{1F389}' },
  { id: 4, title: 'Reading Week 2026 Launches Across All Classes', excerpt: "This year's Reading Week theme is \"Stories that Change the World.\" Every class is exploring literature from African authors and beyond.", date: 'Apr 30, 2026', category: 'Academic', emoji: '\u{1F4DA}' },
  { id: 5, title: 'Parent-Teacher Forum a Resounding Success', excerpt: "Over 400 parents attended our termly forum, strengthening the partnership between home and school for student success.", date: 'Apr 12, 2026', category: 'Events', emoji: '\u{1F46A}' },
  { id: 6, title: 'Football Team Qualifies for National Championship', excerpt: "After a thrilling regional tournament, our boys' football team has earned a place in the national schools championship finals.", date: 'Mar 22, 2026', category: 'Achievement', emoji: '⚽' },
]

const categoryColor: Record<string, string> = {
  Achievement: 'bg-green-100 text-green-700',
  Facilities: 'bg-blue-100 text-blue-700',
  Events: 'bg-purple-100 text-purple-700',
  Academic: 'bg-yellow-100 text-yellow-700',
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>(fallback)

  useEffect(() => {
    axios.get('http://localhost:5002/api/news')
      .then((res) => { if (res.data?.length > 0) setArticles(res.data) })
      .catch(() => {})
  }, [])

  return (
    <div>
      <div className="text-white py-16 px-6 text-center" style={{ backgroundColor: '#1a2a3a' }}>
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#82c906' }}>Stay Informed</p>
        <h1 className="text-4xl font-extrabold mb-3">Latest News</h1>
        <p className="text-blue-200 max-w-xl mx-auto">
          Keep up with achievements, events, and announcements from Abofra World School.
        </p>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-44 flex items-center justify-center text-6xl" style={{ background: 'linear-gradient(135deg, #1a2a3a, #2d4a6a)' }}>
                {article.emoji}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor[article.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">{article.date}</span>
                </div>
                <h3 className="font-bold text-base mb-2 leading-snug" style={{ color: '#1a2a3a' }}>
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                <Link href={`/news/${article.id}`} className="mt-3 inline-block font-semibold text-sm transition-colors" style={{ color: '#82c906' }}>
                  Read more &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
