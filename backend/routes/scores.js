const express = require('express')
const router  = express.Router()
const { db, nextId } = require('../db')
const PDFDocument = require('pdfkit')

function gradeInfo(total) {
  if (total >= 80) return { grade: 'A1', remark: 'Excellent' }
  if (total >= 70) return { grade: 'B2', remark: 'Very Good' }
  if (total >= 60) return { grade: 'B3', remark: 'Good' }
  if (total >= 55) return { grade: 'C4', remark: 'Credit' }
  if (total >= 50) return { grade: 'C5', remark: 'Credit' }
  if (total >= 45) return { grade: 'C6', remark: 'Credit' }
  if (total >= 40) return { grade: 'D7', remark: 'Pass' }
  if (total >= 35) return { grade: 'E8', remark: 'Pass' }
  return { grade: 'F9', remark: 'Fail' }
}

function recalcPositions(class_id, term, year) {
  const students = db.prepare(`
    SELECT s.id as student_id, SUM(a.total) as grand_total
    FROM students s
    JOIN assessments a ON a.student_id = s.id
    WHERE s.class_id=? AND a.term=? AND a.year=?
    GROUP BY s.id ORDER BY grand_total DESC
  `).all(class_id, term, year)

  students.forEach((row, idx) => {
    db.prepare(`UPDATE assessments SET position=? WHERE student_id=? AND term=? AND year=?`)
      .run(idx + 1, row.student_id, term, year)
  })
}

// ── SUBJECTS ──
router.get('/subjects', (req, res) => {
  const { class_id } = req.query
  const rows = class_id
    ? db.prepare('SELECT s.*,t.name as teacher_name FROM subjects s LEFT JOIN teachers t ON s.teacher_id=t.id WHERE s.class_id=? AND s.active=1').all(class_id)
    : db.prepare('SELECT s.*,t.name as teacher_name,c.name as class_name FROM subjects s LEFT JOIN teachers t ON s.teacher_id=t.id LEFT JOIN classes c ON s.class_id=c.id WHERE s.active=1').all()
  res.json(rows)
})

router.post('/subjects', (req, res) => {
  const { name, class_id, teacher_id } = req.body
  if (!name) return res.status(400).json({ error: 'name required' })
  const r = db.prepare('INSERT INTO subjects (name,class_id,teacher_id) VALUES (?,?,?)').run(name, class_id||null, teacher_id||null)
  res.json({ success: true, id: r.lastInsertRowid })
})

router.put('/subjects/:id', (req, res) => {
  const { name, class_id, teacher_id } = req.body
  db.prepare('UPDATE subjects SET name=?,class_id=?,teacher_id=? WHERE id=?').run(name, class_id||null, teacher_id||null, req.params.id)
  res.json({ success: true })
})

router.delete('/subjects/:id', (req, res) => {
  db.prepare('UPDATE subjects SET active=0 WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── ASSESSMENTS ──
router.get('/assessments', (req, res) => {
  const { class_id, term, year } = req.query
  if (!class_id || !term || !year) return res.status(400).json({ error: 'class_id, term and year required' })

  const students = db.prepare('SELECT * FROM students WHERE class_id=? AND active=1 ORDER BY name').all(class_id)
  const subjects = db.prepare('SELECT * FROM subjects WHERE class_id=? AND active=1').all(class_id)
  const scores   = db.prepare('SELECT * FROM assessments WHERE student_id IN (SELECT id FROM students WHERE class_id=?) AND term=? AND year=?').all(class_id, term, year)

  const scoreMap = {}
  scores.forEach(s => { scoreMap[`${s.student_id}-${s.subject_id}`] = s })

  const result = students.map(st => ({
    ...st,
    scores: subjects.map(sub => scoreMap[`${st.id}-${sub.id}`] || { student_id: st.id, subject_id: sub.id, class_score: 0, exam_score: 0, total: 0, grade: '', remark: '', position: 0 }),
    grand_total: subjects.reduce((sum, sub) => sum + (scoreMap[`${st.id}-${sub.id}`]?.total || 0), 0),
    position: scores.find(s => s.student_id === st.id)?.position || 0,
  }))

  res.json({ students: result, subjects })
})

router.post('/assessments', (req, res) => {
  const { student_id, subject_id, term, year, class_score, exam_score } = req.body
  if (!student_id || !subject_id || !term || !year) return res.status(400).json({ error: 'Missing required fields' })

  const cs = parseFloat(class_score) || 0
  const es = parseFloat(exam_score)  || 0
  const total = Math.round((cs + es) * 100) / 100
  const { grade, remark } = gradeInfo(total)

  db.prepare(`
    INSERT INTO assessments (student_id,subject_id,term,year,class_score,exam_score,total,grade,remark)
    VALUES (?,?,?,?,?,?,?,?,?)
    ON CONFLICT(student_id,subject_id,term,year) DO UPDATE SET
      class_score=excluded.class_score, exam_score=excluded.exam_score,
      total=excluded.total, grade=excluded.grade, remark=excluded.remark
  `).run(student_id, subject_id, term, year, cs, es, total, grade, remark)

  // Recalculate positions for the class
  const student = db.prepare('SELECT class_id FROM students WHERE id=?').get(student_id)
  if (student) recalcPositions(student.class_id, term, year)

  res.json({ success: true, total, grade, remark })
})

// ── REPORT CARD ──
router.get('/report/:student_id', (req, res) => {
  const { term, year } = req.query
  const student = db.prepare('SELECT s.*, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id=c.id WHERE s.id=?').get(req.params.student_id)
  if (!student) return res.status(404).json({ error: 'Student not found' })

  const subjects = db.prepare('SELECT * FROM subjects WHERE class_id=? AND active=1').all(student.class_id)
  const scores   = db.prepare('SELECT a.*, sub.name as subject_name FROM assessments a JOIN subjects sub ON a.subject_id=sub.id WHERE a.student_id=? AND a.term=? AND a.year=?').all(req.params.student_id, term, year)
  const position = scores[0]?.position || 0
  const classSize = db.prepare('SELECT COUNT(*) as c FROM students WHERE class_id=? AND active=1').get(student.class_id)?.c || 0

  const grand_total = scores.reduce((s, r) => s + r.total, 0)
  const average = scores.length ? Math.round((grand_total / scores.length) * 10) / 10 : 0

  res.json({ student, subjects, scores, position, classSize, grand_total, average, term, year })
})

// ── PDF REPORT CARD (single student) ──
router.get('/report/:student_id/pdf', (req, res) => {
  const { term, year } = req.query
  const student = db.prepare('SELECT s.*, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id=c.id WHERE s.id=?').get(req.params.student_id)
  if (!student) return res.status(404).send('Student not found')

  const subjects = db.prepare('SELECT * FROM subjects WHERE class_id=? AND active=1').all(student.class_id)
  const scores   = db.prepare('SELECT a.*, sub.name as subject_name FROM assessments a JOIN subjects sub ON a.subject_id=sub.id WHERE a.student_id=? AND a.term=? AND a.year=? ORDER BY sub.name').all(req.params.student_id, term, year)
  const position = scores[0]?.position || 0
  const classSize = db.prepare('SELECT COUNT(*) as c FROM students WHERE class_id=? AND active=1').get(student.class_id)?.c || 0
  const grand_total = scores.reduce((s, r) => s + r.total, 0)
  const average = scores.length ? Math.round((grand_total / scores.length) * 10) / 10 : 0
  const { grade: avgGrade } = gradeInfo(average)

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="report-${student.student_id}-${term}-${year}.pdf"`)
  doc.pipe(res)

  const W = 595 - 100 // page width minus margins
  const green = '#2d7d32'
  const dark  = '#1a1a2e'
  const grey  = '#666'

  // Header band
  doc.rect(50, 40, W, 70).fill(green)
  doc.fillColor('#fff').fontSize(18).font('Helvetica-Bold').text('ABOFRA WORLD SCHOOL', 60, 55, { width: W - 20, align: 'center' })
  doc.fontSize(10).font('Helvetica').text('Terminal Report Card', 60, 78, { width: W - 20, align: 'center' })
  doc.fillColor(dark)

  // Student info block
  let y = 125
  const col1 = 60, col2 = 310
  const field = (label, value, x, yy) => {
    doc.fontSize(8).font('Helvetica').fillColor(grey).text(label, x, yy)
    doc.fontSize(10).font('Helvetica-Bold').fillColor(dark).text(value || '—', x, yy + 11)
  }
  field('Student Name', student.name, col1, y)
  field('Student ID',   student.student_id, col2, y)
  y += 32
  field('Class', student.class_name, col1, y)
  field('Term',  `${term}  •  ${year}`, col2, y)
  y += 32
  field('Position in Class', position ? `${position} / ${classSize}` : '—', col1, y)
  field('Overall Average',   `${average}%  (${avgGrade})`, col2, y)
  y += 20

  // Divider
  doc.moveTo(50, y + 10).lineTo(545, y + 10).strokeColor(green).lineWidth(1.5).stroke()
  y += 22

  // Table header
  const cols = { subject: 50, cs: 270, es: 340, total: 405, grade: 460, remark: 490 }
  doc.rect(50, y, W, 18).fill('#e8f5e9')
  doc.fontSize(8).font('Helvetica-Bold').fillColor(dark)
  doc.text('SUBJECT',       cols.subject, y + 5)
  doc.text('CLASS SCORE',   cols.cs,      y + 5)
  doc.text('EXAM SCORE',    cols.es,      y + 5)
  doc.text('TOTAL',         cols.total,   y + 5)
  doc.text('GRADE',         cols.grade,   y + 5)
  doc.text('REMARK',        cols.remark,  y + 5)
  y += 20

  // Table rows
  scores.forEach((sc, i) => {
    if (i % 2 === 0) doc.rect(50, y, W, 17).fill('#f9fafb').stroke()
    doc.fontSize(9).font('Helvetica').fillColor(dark)
    doc.text(sc.subject_name,            cols.subject, y + 4, { width: 200 })
    doc.text(sc.class_score.toFixed(1),  cols.cs,      y + 4)
    doc.text(sc.exam_score.toFixed(1),   cols.es,      y + 4)
    const gColor = sc.total >= 50 ? green : '#c62828'
    doc.fillColor(gColor).font('Helvetica-Bold').text(sc.total.toFixed(1), cols.total, y + 4)
    doc.fillColor(dark).text(sc.grade,  cols.grade,  y + 4)
    doc.text(sc.remark,                  cols.remark, y + 4)
    doc.moveTo(50, y + 17).lineTo(545, y + 17).strokeColor('#e0e0e0').lineWidth(0.5).stroke()
    y += 18
  })

  // Totals row
  y += 4
  doc.rect(50, y, W, 20).fill('#c8e6c9')
  doc.fontSize(9).font('Helvetica-Bold').fillColor(dark)
  doc.text('TOTAL / AVERAGE', cols.subject, y + 6)
  doc.text(`${grand_total.toFixed(1)}  /  ${average}%`, cols.total, y + 6)
  doc.text(avgGrade, cols.grade, y + 6)
  y += 30

  // Grading key
  doc.fontSize(7.5).font('Helvetica').fillColor(grey)
  doc.text('Grading: A1≥80 · B2≥70 · B3≥60 · C4≥55 · C5≥50 · C6≥45 · D7≥40 · E8≥35 · F9<35', 50, y)
  y += 20

  // Signature lines
  const sigY = Math.max(y + 20, 680)
  const sigCol = [50, 210, 380]
  sigCol.forEach(x => {
    doc.moveTo(x, sigY + 30).lineTo(x + 130, sigY + 30).strokeColor('#aaa').lineWidth(0.8).stroke()
  })
  doc.fontSize(8).fillColor(grey)
  doc.text("Class Teacher's Signature", sigCol[0],  sigY + 33)
  doc.text("Head Teacher's Signature",  sigCol[1],  sigY + 33)
  doc.text("Parent's Signature",         sigCol[2],  sigY + 33)

  // Footer
  doc.fontSize(7).fillColor('#999').text(`Generated ${new Date().toLocaleDateString('en-GB')} · Abofra World School`, 50, 800, { width: W, align: 'center' })

  doc.end()
})

// ── PDF REPORT CARDS (whole class, merged PDF) ──
router.get('/report/class/pdf', (req, res) => {
  const { class_id, term, year } = req.query
  if (!class_id || !term || !year) return res.status(400).send('class_id, term, year required')

  const cls      = db.prepare('SELECT * FROM classes WHERE id=?').get(class_id)
  const students = db.prepare('SELECT * FROM students WHERE class_id=? AND active=1 ORDER BY name').all(class_id)
  const subjects = db.prepare('SELECT * FROM subjects WHERE class_id=? AND active=1').all(class_id)
  const classSize = students.length

  const doc = new PDFDocument({ size: 'A4', margin: 50, autoFirstPage: false })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="reports-${cls ? cls.name.replace(/\s/g,'-') : class_id}-${term}-${year}.pdf"`)
  doc.pipe(res)

  const W = 595 - 100
  const green = '#2d7d32', dark = '#1a1a2e', grey = '#666'

  for (const student of students) {
    const scores = db.prepare('SELECT a.*, sub.name as subject_name FROM assessments a JOIN subjects sub ON a.subject_id=sub.id WHERE a.student_id=? AND a.term=? AND a.year=? ORDER BY sub.name').all(student.id, term, year)
    const position = scores[0]?.position || 0
    const grand_total = scores.reduce((s, r) => s + r.total, 0)
    const average = scores.length ? Math.round((grand_total / scores.length) * 10) / 10 : 0
    const { grade: avgGrade } = gradeInfo(average)

    doc.addPage()
    let y = 40

    doc.rect(50, y, W, 70).fill(green)
    doc.fillColor('#fff').fontSize(18).font('Helvetica-Bold').text('ABOFRA WORLD SCHOOL', 60, y + 15, { width: W - 20, align: 'center' })
    doc.fontSize(10).font('Helvetica').text('Terminal Report Card', 60, y + 38, { width: W - 20, align: 'center' })
    doc.fillColor(dark)
    y += 85

    const field = (label, value, x, yy) => {
      doc.fontSize(8).font('Helvetica').fillColor(grey).text(label, x, yy)
      doc.fontSize(10).font('Helvetica-Bold').fillColor(dark).text(value || '—', x, yy + 11)
    }
    const col1 = 60, col2 = 310
    field('Student Name', student.name, col1, y); field('Student ID', student.student_id, col2, y); y += 32
    field('Class', cls ? cls.name : '', col1, y); field('Term', `${term}  •  ${year}`, col2, y); y += 32
    field('Position in Class', position ? `${position} / ${classSize}` : '—', col1, y); field('Overall Average', `${average}%  (${avgGrade})`, col2, y); y += 20
    doc.moveTo(50, y + 10).lineTo(545, y + 10).strokeColor(green).lineWidth(1.5).stroke(); y += 22

    const cols = { subject: 50, cs: 270, es: 340, total: 405, grade: 460, remark: 490 }
    doc.rect(50, y, W, 18).fill('#e8f5e9')
    doc.fontSize(8).font('Helvetica-Bold').fillColor(dark)
    doc.text('SUBJECT', cols.subject, y + 5); doc.text('CLASS SCORE', cols.cs, y + 5); doc.text('EXAM SCORE', cols.es, y + 5)
    doc.text('TOTAL', cols.total, y + 5); doc.text('GRADE', cols.grade, y + 5); doc.text('REMARK', cols.remark, y + 5)
    y += 20

    scores.forEach((sc, i) => {
      if (i % 2 === 0) doc.rect(50, y, W, 17).fill('#f9fafb').stroke()
      doc.fontSize(9).font('Helvetica').fillColor(dark)
      doc.text(sc.subject_name, cols.subject, y + 4, { width: 200 })
      doc.text(sc.class_score.toFixed(1), cols.cs, y + 4); doc.text(sc.exam_score.toFixed(1), cols.es, y + 4)
      const gColor = sc.total >= 50 ? green : '#c62828'
      doc.fillColor(gColor).font('Helvetica-Bold').text(sc.total.toFixed(1), cols.total, y + 4)
      doc.fillColor(dark).text(sc.grade, cols.grade, y + 4); doc.text(sc.remark, cols.remark, y + 4)
      doc.moveTo(50, y + 17).lineTo(545, y + 17).strokeColor('#e0e0e0').lineWidth(0.5).stroke(); y += 18
    })

    y += 4
    doc.rect(50, y, W, 20).fill('#c8e6c9')
    doc.fontSize(9).font('Helvetica-Bold').fillColor(dark)
    doc.text('TOTAL / AVERAGE', cols.subject, y + 6); doc.text(`${grand_total.toFixed(1)}  /  ${average}%`, cols.total, y + 6); doc.text(avgGrade, cols.grade, y + 6)
    y += 30

    doc.fontSize(7.5).font('Helvetica').fillColor(grey)
    doc.text('Grading: A1≥80 · B2≥70 · B3≥60 · C4≥55 · C5≥50 · C6≥45 · D7≥40 · E8≥35 · F9<35', 50, y); y += 20

    const sigY = Math.max(y + 20, 680)
    ;[50, 210, 380].forEach(x => doc.moveTo(x, sigY + 30).lineTo(x + 130, sigY + 30).strokeColor('#aaa').lineWidth(0.8).stroke())
    doc.fontSize(8).fillColor(grey)
    doc.text("Class Teacher's Signature", 50, sigY + 33); doc.text("Head Teacher's Signature", 210, sigY + 33); doc.text("Parent's Signature", 380, sigY + 33)
    doc.fontSize(7).fillColor('#999').text(`Generated ${new Date().toLocaleDateString('en-GB')} · Abofra World School`, 50, 800, { width: W, align: 'center' })
  }

  doc.end()
})

module.exports = router
