const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')

const router = express.Router()

// Named icon slots and where they live in the frontend
const ICON_SLOTS = {
  'logo':        { label: 'Main Logo (circle badge)',  filename: 'logo.png' },
  'school-name': { label: 'School Name Image',         filename: 'school-name.png' },
  'favicon':     { label: 'Favicon (browser tab icon)', filename: 'favicon.ico' },
}

const PUBLIC_DIR        = path.join(__dirname, '../../frontend/public')
const STANDALONE_PUBLIC = path.join(__dirname, '../../frontend/.next/standalone/public')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `icon-${req.params.id}-${Date.now()}${ext}`)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'image/x-icon' || file.mimetype === 'image/vnd.microsoft.icon')
      cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

function copyToPublic(srcPath, filename) {
  // Copy to frontend/public
  const dest1 = path.join(PUBLIC_DIR, filename)
  fs.copyFileSync(srcPath, dest1)

  // Copy to standalone public (if it exists — only on server after build)
  const dest2 = path.join(STANDALONE_PUBLIC, filename)
  if (fs.existsSync(STANDALONE_PUBLIC)) {
    fs.copyFileSync(srcPath, dest2)
  }
}

// GET all icon slots with current state
router.get('/', (req, res) => {
  const result = Object.entries(ICON_SLOTS).map(([id, slot]) => {
    const publicFile = path.join(PUBLIC_DIR, slot.filename)
    return {
      id,
      label:    slot.label,
      filename: slot.filename,
      exists:   fs.existsSync(publicFile),
      url:      `/${slot.filename}?t=${Date.now()}`,
    }
  })
  res.json(result)
})

// POST upload and replace a named icon
router.post('/upload/:id', upload.single('icon'), (req, res) => {
  const slot = ICON_SLOTS[req.params.id]
  if (!slot) return res.status(404).json({ error: 'Unknown icon slot' })
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  try {
    copyToPublic(req.file.path, slot.filename)
    res.json({ success: true, url: `/${slot.filename}?t=${Date.now()}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE (remove) a named icon — replaces with a blank 1x1 transparent PNG
router.delete('/:id', (req, res) => {
  const slot = ICON_SLOTS[req.params.id]
  if (!slot) return res.status(404).json({ error: 'Unknown icon slot' })

  const dest = path.join(PUBLIC_DIR, slot.filename)
  try {
    if (fs.existsSync(dest)) fs.unlinkSync(dest)
    if (fs.existsSync(STANDALONE_PUBLIC)) {
      const dest2 = path.join(STANDALONE_PUBLIC, slot.filename)
      if (fs.existsSync(dest2)) fs.unlinkSync(dest2)
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
