const express = require('express')
const path    = require('path')
const router  = express.Router()

// Login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/login.html'))
})

// Login POST — validates credentials, returns role
router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'engineer' && password === 'engineer2026') {
    res.json({ success: true, token: 'abofra-engineer-token', role: 'engineer', displayName: 'Engineer' })
  } else if (username === 'admin' && password === 'abofra2026') {
    res.json({ success: true, token: 'abofra-admin-token', role: 'admin', displayName: 'School Admin' })
  } else {
    res.status(401).json({ success: false })
  }
})

// Admin dashboard (no server-side auth — page checks token itself)
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/index.html'))
})

// School Management System
router.get('/sms', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/sms.html'))
})

// Standalone portals
router.get('/teachers',     (req, res) => res.sendFile(path.join(__dirname, '../views/admin/teachers.html')))
router.get('/parents',      (req, res) => res.sendFile(path.join(__dirname, '../views/admin/parents.html')))
router.get('/credentials',  (req, res) => res.sendFile(path.join(__dirname, '../views/admin/credentials.html')))

// Direct section links — each redirects to sms with ?tab=
const smsTabs = ['students','staff','classes','checkin','subjects','scores','fees','notices','receipts','reports','people']
smsTabs.forEach(tab => {
  router.get('/' + tab, (req, res) => res.redirect('/admin/sms?tab=' + tab))
})

module.exports = router
