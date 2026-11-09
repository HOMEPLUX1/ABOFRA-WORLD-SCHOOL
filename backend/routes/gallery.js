const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')

const router    = express.Router()
const DATA_PATH = path.join(__dirname, '../data/gallery.json')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `gallery-${Date.now()}-${Math.random().toString(36).slice(2,7)}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) }
  catch { return [] }
}
function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

// GET all gallery photos
router.get('/', (req, res) => {
  res.json(readData())
})

// POST upload one or more photos (field name: images)
router.post('/upload', upload.array('images', 20), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' })
  const data    = readData()
  const caption = req.body.caption || ''
  const added   = req.files.map(file => ({
    id:       `gallery-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    url:      `/uploads/${file.filename}`,
    caption,
    uploadedAt: new Date().toISOString(),
  }))
  data.push(...added)
  writeData(data)
  res.json({ success: true, photos: added })
})

// DELETE one photo by id
router.delete('/:id', (req, res) => {
  let data  = readData()
  const item = data.find(p => p.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  const filePath = path.join(__dirname, '..', item.url)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  data = data.filter(p => p.id !== req.params.id)
  writeData(data)
  res.json({ success: true })
})

module.exports = router
