const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const INBOX_FILE = path.join(__dirname, '../data/messages.json')

function readMessages() {
  if (!fs.existsSync(INBOX_FILE)) return []
  return JSON.parse(fs.readFileSync(INBOX_FILE, 'utf-8'))
}

function saveMessage(msg) {
  const messages = readMessages()
  messages.unshift(msg)
  fs.writeFileSync(INBOX_FILE, JSON.stringify(messages, null, 2))
}

// POST contact form submission
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const entry = {
    id: Date.now(),
    name,
    email,
    subject,
    message,
    receivedAt: new Date().toISOString(),
    read: false,
  }

  saveMessage(entry)
  console.log(`📬 New contact message from ${name} <${email}>: ${subject}`)
  res.json({ success: true, message: 'Your message has been received. We will get back to you shortly.' })
})

// GET all messages (admin)
router.get('/', (req, res) => {
  res.json(readMessages())
})

// PATCH mark as read (admin)
router.patch('/:id/read', (req, res) => {
  const messages = readMessages()
  const idx = messages.findIndex((m) => m.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Message not found' })
  messages[idx].read = true
  fs.writeFileSync(INBOX_FILE, JSON.stringify(messages, null, 2))
  res.json(messages[idx])
})

module.exports = router
