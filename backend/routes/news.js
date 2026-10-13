const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(__dirname, '../data/news.json')

function readNews() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

function writeNews(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// GET all news
router.get('/', (req, res) => {
  const news = readNews()
  res.json(news)
})

// GET single article
router.get('/:id', (req, res) => {
  const news = readNews()
  const article = news.find((n) => n.id === parseInt(req.params.id))
  if (!article) return res.status(404).json({ error: 'Article not found' })
  res.json(article)
})

// POST create article (admin)
router.post('/', (req, res) => {
  const { title, excerpt, content, category, emoji } = req.body
  if (!title || !excerpt || !content || !category) {
    return res.status(400).json({ error: 'title, excerpt, content, and category are required' })
  }
  const news = readNews()
  const newArticle = {
    id: news.length > 0 ? Math.max(...news.map((n) => n.id)) + 1 : 1,
    title,
    excerpt,
    content,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    category,
    emoji: emoji || '📰',
  }
  news.unshift(newArticle)
  writeNews(news)
  res.status(201).json(newArticle)
})

// PUT update article (admin)
router.put('/:id', (req, res) => {
  const news = readNews()
  const idx = news.findIndex((n) => n.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Article not found' })
  news[idx] = { ...news[idx], ...req.body, id: news[idx].id }
  writeNews(news)
  res.json(news[idx])
})

// DELETE article (admin)
router.delete('/:id', (req, res) => {
  const news = readNews()
  const idx = news.findIndex((n) => n.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Article not found' })
  news.splice(idx, 1)
  writeNews(news)
  res.json({ message: 'Article deleted' })
})

module.exports = router
