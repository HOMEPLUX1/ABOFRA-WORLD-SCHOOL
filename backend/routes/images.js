const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')

const router = express.Router()
const DATA_PATH = path.join(__dirname, '../data/images.json')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${req.params.id}-${Date.now()}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))
}
function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

// GET all image config
router.get('/', (req, res) => {
  res.json(readData())
})

// POST upload image for a section id
router.post('/upload/:id', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const data = readData()
  const url  = `/uploads/${req.file.filename}`
  const id   = req.params.id

  // Find and update the matching entry across all sections
  let found = false
  for (const section of Object.values(data)) {
    if (!Array.isArray(section)) continue
    const item = section.find(i => i.id === id)
    if (item) {
      // Delete old file if exists
      if (item.url) {
        const old = path.join(__dirname, '..', item.url)
        if (fs.existsSync(old)) fs.unlinkSync(old)
      }
      item.url = url
      found = true
      break
    }
  }

  if (!found) return res.status(404).json({ error: 'Image slot not found' })

  writeData(data)
  res.json({ success: true, url })
})

// DELETE image for a section id
router.delete('/:id', (req, res) => {
  const data = readData()
  const id   = req.params.id
  let found  = false

  for (const section of Object.values(data)) {
    if (!Array.isArray(section)) continue
    const item = section.find(i => i.id === id)
    if (item) {
      if (item.url) {
        const old = path.join(__dirname, '..', item.url)
        if (fs.existsSync(old)) fs.unlinkSync(old)
      }
      item.url = null
      found = true
      break
    }
  }

  if (!found) return res.status(404).json({ error: 'Image slot not found' })
  writeData(data)
  res.json({ success: true })
})

module.exports = router
