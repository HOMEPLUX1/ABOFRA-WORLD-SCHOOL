const express = require('express')
const router  = express.Router()
const PDFDocument = require('pdfkit')
const { db } = require('../db')

function nextReceipt() {
  const last = db.prepare("SELECT receipt_no FROM fees WHERE receipt_no IS NOT NULL ORDER BY id DESC LIMIT 1").get()
  if (!last) return 'RCP-2026-0001'
  const num = parseInt(last.receipt_no.split('-').pop()) + 1
  return `RCP-${new Date().getFullYear()}-${String(num).padStart(4, '0')}`
}

// GET all fees (optionally filter by student)
router.get('/', (req, res) => {
  const { student_id, term, year } = req.query
  let query = `SELECT f.*, s.name as student_name, s.student_id as sid, c.name as class_name
    FROM fees f JOIN students s ON f.student_id=s.id LEFT JOIN classes c ON s.class_id=c.id WHERE 1=1`
  const params = []
  if (student_id) { query += ' AND f.student_id=?'; params.push(student_id) }
  if (term)       { query += ' AND f.term=?';       params.push(term) }
  if (year)       { query += ' AND f.year=?';       params.push(year) }
  query += ' ORDER BY f.created_at DESC'
  res.json(db.prepare(query).all(...params))
})

// POST add fee record
router.post('/', (req, res) => {
  const { student_id, fee_type, term, year, amount, note } = req.body
  if (!student_id || !fee_type || !term || !year || !amount) return res.status(400).json({ error: 'Missing required fields' })
  const r = db.prepare('INSERT INTO fees (student_id,fee_type,term,year,amount,note) VALUES (?,?,?,?,?,?)').run(student_id, fee_type, term, year, parseFloat(amount), note||null)
  res.json({ success: true, id: r.lastInsertRowid })
})

// POST mark as paid
router.post('/:id/pay', (req, res) => {
  const receipt_no = nextReceipt()
  db.prepare('UPDATE fees SET status=?,paid_at=datetime("now"),receipt_no=? WHERE id=?').run('paid', receipt_no, req.params.id)
  res.json({ success: true, receipt_no })
})

// DELETE fee
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM fees WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// GET summary per student/term/year
router.get('/summary', (req, res) => {
  const { term, year } = req.query
  const rows = db.prepare(`
    SELECT s.id, s.name as student_name, s.student_id as sid, c.name as class_name,
      SUM(CASE WHEN f.status='paid' THEN f.amount ELSE 0 END) as paid,
      SUM(CASE WHEN f.status='pending' THEN f.amount ELSE 0 END) as pending,
      SUM(f.amount) as total
    FROM students s
    LEFT JOIN fees f ON f.student_id=s.id AND f.term=? AND f.year=?
    LEFT JOIN classes c ON s.class_id=c.id
    WHERE s.active=1 GROUP BY s.id ORDER BY s.name
  `).all(term||'Term 1', year||new Date().getFullYear())
  res.json(rows)
})

// GET PDF receipt
router.get('/:id/receipt', (req, res) => {
  const fee = db.prepare(`SELECT f.*, s.name as student_name, s.student_id as sid, c.name as class_name
    FROM fees f JOIN students s ON f.student_id=s.id LEFT JOIN classes c ON s.class_id=c.id WHERE f.id=?`).get(req.params.id)
  if (!fee) return res.status(404).json({ error: 'Not found' })
  if (fee.status !== 'paid') return res.status(400).json({ error: 'Fee not yet paid' })

  const doc = new PDFDocument({ size: 'A5', margin: 40 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename=receipt-${fee.receipt_no}.pdf`)
  doc.pipe(res)

  // Header
  doc.fontSize(18).font('Helvetica-Bold').fillColor('#1a202c').text('ABOFRA WORLD SCHOOL', { align: 'center' })
  doc.fontSize(10).font('Helvetica').fillColor('#555').text('Archbishop Sarpong Road, TUC AK-298-7816, Kumasi, Ghana', { align: 'center' })
  doc.text('Tel: +233 556 592 410 | abofraworldschool@gmail.com', { align: 'center' })
  doc.moveDown(0.5)

  // Title
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#82c906').text('OFFICIAL FEE RECEIPT', { align: 'center' })
  doc.moveDown(0.5)

  // Line
  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#e2e8f0').stroke()
  doc.moveDown(0.5)

  // Details
  const col1 = 40, col2 = 200
  const row = (label, value) => {
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#4a5568').text(label, col1, doc.y, { continued: false })
    doc.fontSize(10).font('Helvetica').fillColor('#1a202c').text(value || '—', col2, doc.y - doc.currentLineHeight())
    doc.moveDown(0.3)
  }

  row('Receipt No:', fee.receipt_no)
  row('Date Paid:', new Date(fee.paid_at).toLocaleDateString('en-GB'))
  doc.moveDown(0.3)
  row('Student Name:', fee.student_name)
  row('Student ID:', fee.sid)
  row('Class:', fee.class_name)
  doc.moveDown(0.3)
  row('Fee Type:', fee.fee_type)
  row('Term:', fee.term)
  row('Academic Year:', String(fee.year))
  row('Note:', fee.note)
  doc.moveDown(0.5)

  doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor('#e2e8f0').stroke()
  doc.moveDown(0.5)

  // Amount
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#1a202c').text(`Amount Paid: GH₵ ${parseFloat(fee.amount).toFixed(2)}`, { align: 'right' })
  doc.moveDown(1)

  // Status
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#82c906').text('✓ PAID', { align: 'center' })
  doc.moveDown(1)

  // Footer
  doc.fontSize(9).font('Helvetica').fillColor('#999').text('This is an official receipt from Abofra World School. Keep for your records.', { align: 'center' })

  doc.end()
})

// GET all fees for one student (statement)
router.get('/student/:student_id', (req, res) => {
  const fees = db.prepare(`SELECT f.*, s.name as student_name, s.student_id as sid, c.name as class_name,
      p.name as parent_name, p.phone as parent_phone, p.email as parent_email
    FROM fees f
    JOIN students s ON f.student_id=s.id
    LEFT JOIN classes c ON s.class_id=c.id
    LEFT JOIN parents p ON s.parent_id=p.id
    WHERE f.student_id=? ORDER BY f.created_at DESC`).all(req.params.student_id)
  res.json(fees)
})

// GET PDF statement for a student — all fees, paid and owing
router.get('/statement/:student_id', (req, res) => {
  const student = db.prepare(`SELECT s.*, c.name as class_name, p.name as parent_name, p.phone as parent_phone, p.email as parent_email
    FROM students s LEFT JOIN classes c ON s.class_id=c.id LEFT JOIN parents p ON s.parent_id=p.id
    WHERE s.id=?`).get(req.params.student_id)
  if (!student) return res.status(404).json({ error: 'Student not found' })

  const fees = db.prepare(`SELECT * FROM fees WHERE student_id=? ORDER BY created_at DESC`).all(req.params.student_id)

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename=statement-${student.student_id}.pdf`)
  doc.pipe(res)

  // Header
  doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a202c').text('ABOFRA WORLD SCHOOL', { align: 'center' })
  doc.fontSize(10).font('Helvetica').fillColor('#555').text('Archbishop Sarpong Road, TUC AK-298-7816, Kumasi, Ghana', { align: 'center' })
  doc.text('Tel: +233 556 592 410  |  abofraworldschool@gmail.com', { align: 'center' })
  doc.moveDown(0.4)
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#82c906').text('PAYMENT STATEMENT', { align: 'center' })
  doc.moveDown(0.5)
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2e8f0').lineWidth(1).stroke()
  doc.moveDown(0.5)

  // Student info box
  const infoY = doc.y
  doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a202c')
  doc.text('Student: ' + student.name, 50, infoY)
  doc.text('ID: ' + student.student_id, 310, infoY)
  doc.text('Class: ' + (student.class_name || '—'), 50, infoY + 16)
  doc.text('Gender: ' + (student.gender || '—'), 310, infoY + 16)
  doc.text('Parent: ' + (student.parent_name || '—'), 50, infoY + 32)
  doc.text('Phone: ' + (student.parent_phone || '—'), 310, infoY + 32)
  doc.text('Date: ' + new Date().toLocaleDateString('en-GB'), 50, infoY + 48)
  doc.moveDown(4)
  doc.moveDown(0.5)
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e2e8f0').stroke()
  doc.moveDown(0.5)

  // Table header
  const cols = [50, 150, 260, 330, 390, 455]
  const tTop = doc.y
  doc.rect(50, tTop, 495, 22).fill('#1a202c')
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff')
  const headers = ['Fee Type', 'Term / Year', 'Amount (GH₵)', 'Status', 'Receipt No', 'Date Paid']
  headers.forEach(function(h, i) { doc.text(h, cols[i] + 4, tTop + 6, { width: (cols[i+1]||560) - cols[i] - 4 }) })

  let y = tTop + 22
  let totalPaid = 0, totalPending = 0
  fees.forEach(function(f, idx) {
    const isPaid = f.status === 'paid'
    doc.rect(50, y, 495, 20).fill(idx % 2 === 0 ? '#f7fafc' : '#fff')
    doc.fontSize(9).font('Helvetica').fillColor('#1a202c')
    doc.text(f.fee_type, cols[0]+4, y+5, { width: 95 })
    doc.text(f.term + ' / ' + f.year, cols[1]+4, y+5, { width: 105 })
    doc.text('GH₵ ' + parseFloat(f.amount).toFixed(2), cols[2]+4, y+5, { width: 65 })
    doc.fillColor(isPaid ? '#276749' : '#744210').text(isPaid ? 'PAID' : 'PENDING', cols[3]+4, y+5, { width: 60 })
    doc.fillColor('#1a202c').text(f.receipt_no || '—', cols[4]+4, y+5, { width: 60 })
    doc.text(f.paid_at ? new Date(f.paid_at).toLocaleDateString('en-GB') : '—', cols[5]+4, y+5, { width: 80 })
    if (isPaid) totalPaid += parseFloat(f.amount)
    else totalPending += parseFloat(f.amount)
    y += 20
  })

  doc.rect(50, tTop, 495, y - tTop).strokeColor('#e2e8f0').lineWidth(1).stroke()
  y += 12

  // Summary
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#276749').text('Total Paid:     GH₵ ' + totalPaid.toFixed(2), 50, y)
  doc.fillColor('#744210').text('Outstanding:  GH₵ ' + totalPending.toFixed(2), 310, y)
  y += 20
  doc.fillColor('#1a202c').text('Grand Total:   GH₵ ' + (totalPaid + totalPending).toFixed(2), 50, y)
  y += 30

  doc.moveTo(50, y).lineTo(545, y).strokeColor('#e2e8f0').stroke()
  y += 20
  doc.fontSize(9).font('Helvetica').fillColor('#999').text('This is an official statement from Abofra World School. Keep for your records.', 50, y, { align: 'center' })

  doc.end()
})

// GET PDF report card
router.get('/reportcard/:student_id', (req, res) => {
  const { term, year } = req.query
  const student = db.prepare('SELECT s.*, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id=c.id WHERE s.id=?').get(req.params.student_id)
  if (!student) return res.status(404).json({ error: 'Student not found' })

  const scores = db.prepare('SELECT a.*, sub.name as subject_name FROM assessments a JOIN subjects sub ON a.subject_id=sub.id WHERE a.student_id=? AND a.term=? AND a.year=?').all(req.params.student_id, term, year)
  const classSize = db.prepare('SELECT COUNT(*) as c FROM students WHERE class_id=? AND active=1').get(student.class_id)?.c || 0
  const position  = scores[0]?.position || 0
  const average   = scores.length ? (scores.reduce((s,r) => s + r.total, 0) / scores.length).toFixed(1) : 0

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename=report-${student.student_id}-${term}-${year}.pdf`)
  doc.pipe(res)

  // Header
  doc.fontSize(20).font('Helvetica-Bold').fillColor('#1a202c').text('ABOFRA WORLD SCHOOL', { align: 'center' })
  doc.fontSize(10).font('Helvetica').fillColor('#555').text('Archbishop Sarpong Road, TUC AK-298-7816, Kumasi, Ghana', { align: 'center' })
  doc.moveDown(0.3)
  doc.fontSize(15).font('Helvetica-Bold').fillColor('#82c906').text('STUDENT REPORT CARD', { align: 'center' })
  doc.moveDown(0.5)
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#82c906').lineWidth(2).stroke()
  doc.moveDown(0.5)

  // Student info
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#1a202c')
  doc.text(`Name: ${student.name}`, 50, doc.y)
  doc.text(`ID: ${student.student_id}`, 300, doc.y - doc.currentLineHeight())
  doc.text(`Class: ${student.class_name || '—'}`, 50)
  doc.text(`Term: ${term}  |  Year: ${year}`, 300, doc.y - doc.currentLineHeight())
  doc.moveDown(0.5)

  // Scores table
  const tableTop = doc.y
  const cols = [50, 230, 310, 385, 440, 495]
  const headers = ['Subject', 'Class Score (30)', 'Exam Score (70)', 'Total (100)', 'Grade', 'Remark']

  // Header row
  doc.rect(50, tableTop, 495, 22).fill('#1a202c')
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#fff')
  headers.forEach((h, i) => doc.text(h, cols[i] + 4, tableTop + 6, { width: cols[i+1] ? cols[i+1]-cols[i]-4 : 100 }))

  let y = tableTop + 22
  scores.forEach((s, idx) => {
    const bg = idx % 2 === 0 ? '#f7fafc' : '#fff'
    doc.rect(50, y, 495, 20).fill(bg)
    doc.fontSize(9).font('Helvetica').fillColor('#1a202c')
    doc.text(s.subject_name, cols[0]+4, y+5, { width: 174 })
    doc.text(String(s.class_score), cols[1]+4, y+5, { width: 74 })
    doc.text(String(s.exam_score),  cols[2]+4, y+5, { width: 74 })
    doc.text(String(s.total),       cols[3]+4, y+5, { width: 50 })
    doc.fillColor(s.grade.startsWith('F') ? '#e53e3e' : '#276749').text(s.grade, cols[4]+4, y+5, { width: 50 })
    doc.fillColor('#1a202c').text(s.remark, cols[5]+4, y+5, { width: 100 })
    y += 20
  })

  // Border around table
  doc.rect(50, tableTop, 495, y - tableTop).strokeColor('#e2e8f0').lineWidth(1).stroke()
  doc.moveDown(1)
  y += 16

  // Summary
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#1a202c').text(`Total Score: ${scores.reduce((s,r)=>s+r.total,0).toFixed(1)}   |   Average: ${average}%   |   Position: ${position} out of ${classSize}`, 50, y, { align: 'left' })
  y += 30

  // Signature lines
  doc.fontSize(10).font('Helvetica').fillColor('#555')
  doc.text("Class Teacher's Signature: _____________________", 50, y)
  doc.text("Head Teacher's Signature: _____________________", 310, y)
  y += 40
  doc.text("Parent's Signature: _____________________", 50, y)
  doc.text(`Date: _____________________`, 310, y)
  y += 40

  doc.fontSize(9).fillColor('#999').text('This report card is an official document of Abofra World School.', 50, y, { align: 'center' })

  doc.end()
})

module.exports = router
