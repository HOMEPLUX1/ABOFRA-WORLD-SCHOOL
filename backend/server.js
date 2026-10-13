const express    = require('express')
const cors       = require('cors')
const path       = require('path')
const session    = require('express-session')

require('./db') // initialise database
const newsRouter    = require('./routes/news')
const contactRouter = require('./routes/contact')
const imagesRouter  = require('./routes/images')
const adminRouter   = require('./routes/admin')
const chatRouter    = require('./routes/chat')
const ttsRouter     = require('./routes/tts')
const smsRouter     = require('./routes/sms')
const scoresRouter  = require('./routes/scores')
const feesRouter    = require('./routes/fees')
const portalRouter  = require('./routes/portal')

const app  = express()
const PORT = process.env.PORT || 5002

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Sessions for admin auth
app.use(session({
  secret: 'abofra-secret-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}))

// Serve uploaded images & public assets statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.static(path.join(__dirname, '../frontend/public')))

// API routes
app.use('/api/news',    newsRouter)
app.use('/api/contact', contactRouter)
app.use('/api/images',  imagesRouter)
app.use('/api/chat',    chatRouter)
app.use('/api/tts',     ttsRouter)

// School Management System API
app.use('/api/sms',    smsRouter)
app.use('/api/scores', scoresRouter)
app.use('/api/fees',   feesRouter)
app.use('/api/portal', portalRouter)

// Admin panel
app.use('/admin', adminRouter)

// Root redirect to admin
app.get('/', (req, res) => res.redirect('/admin'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', school: 'Abofra World School', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🎓 Abofra World School API  →  http://localhost:${PORT}`)
  console.log(`🔐 Admin Panel             →  http://localhost:${PORT}/admin`)
  console.log(`   Login: admin / abofra2026`)
})
