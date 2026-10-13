const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcryptjs')
const jwt     = require('jsonwebtoken')
const { db }  = require('../db')

const SECRET = 'abofra-portal-secret-2026'

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorised' })
  try { req.user = jwt.verify(token, SECRET); next() }
  catch { res.status(401).json({ error: 'Invalid token' }) }
}

// ── LOGIN ──
router.post('/login', (req, res) => {
  const { user_id, password } = req.body
  if (!user_id || !password) return res.status(400).json({ error: 'user_id and password required' })
  const user = db.prepare('SELECT * FROM users WHERE user_id=? AND active=1').get(user_id.trim())
  if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid ID or password' })
  const token = jwt.sign({ id: user.id, user_id: user.user_id, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' })
  res.json({ token, role: user.role, name: user.name, user_id: user.user_id })
})

// ── TEACHER ──
router.get('/teacher/me', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
  const teacher = db.prepare('SELECT t.*, u.email FROM teachers t JOIN users u ON t.user_id=u.id WHERE u.id=?').get(req.user.id)
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' })
  const classes  = db.prepare('SELECT * FROM classes WHERE teacher_id=?').all(teacher.id)
  const subjects = db.prepare('SELECT s.*, c.name as class_name FROM subjects s LEFT JOIN classes c ON s.class_id=c.id WHERE s.teacher_id=?').all(teacher.id)
  res.json({ teacher, classes, subjects })
})

router.get('/teacher/students', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
  const teacher = db.prepare('SELECT * FROM teachers WHERE user_id=?').get(req.user.id)
  const classes = db.prepare('SELECT id FROM classes WHERE teacher_id=?').all(teacher.id).map(c => c.id)
  if (!classes.length) return res.json([])
  const placeholders = classes.map(() => '?').join(',')
  const students = db.prepare(`SELECT s.*, c.name as class_name FROM students s JOIN classes c ON s.class_id=c.id WHERE s.class_id IN (${placeholders}) AND s.active=1 ORDER BY c.name, s.name`).all(...classes)
  res.json(students)
})

router.get('/teacher/assignments', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
  const teacher = db.prepare('SELECT * FROM teachers WHERE user_id=?').get(req.user.id)
  const rows = db.prepare(`SELECT a.*, c.name as class_name, s.name as subject_name FROM assignments a LEFT JOIN classes c ON a.class_id=c.id LEFT JOIN subjects s ON a.subject_id=s.id WHERE a.teacher_id=? ORDER BY a.created_at DESC`).all(teacher.id)
  res.json(rows)
})

router.post('/teacher/assignments', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
  const teacher = db.prepare('SELECT * FROM teachers WHERE user_id=?').get(req.user.id)
  const { class_id, subject_id, title, description, due_date } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  const r = db.prepare('INSERT INTO assignments (teacher_id,class_id,subject_id,title,description,due_date) VALUES (?,?,?,?,?,?)').run(teacher.id, class_id||null, subject_id||null, title, description||null, due_date||null)
  res.json({ success: true, id: r.lastInsertRowid })
})

router.delete('/teacher/assignments/:id', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
  db.prepare('DELETE FROM assignments WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// Teacher can enter scores for their subjects
router.post('/teacher/scores', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
  const { student_id, subject_id, term, year, class_score, exam_score } = req.body
  const cs = parseFloat(class_score)||0, es = parseFloat(exam_score)||0
  const total = Math.round((cs+es)*100)/100
  const grade = total>=80?'A1':total>=70?'B2':total>=60?'B3':total>=55?'C4':total>=50?'C5':total>=45?'C6':total>=40?'D7':total>=35?'E8':'F9'
  const remark = total>=80?'Excellent':total>=70?'Very Good':total>=60?'Good':total>=45?'Credit':total>=35?'Pass':'Fail'
  db.prepare(`INSERT INTO assessments (student_id,subject_id,term,year,class_score,exam_score,total,grade,remark) VALUES (?,?,?,?,?,?,?,?,?)
    ON CONFLICT(student_id,subject_id,term,year) DO UPDATE SET class_score=excluded.class_score,exam_score=excluded.exam_score,total=excluded.total,grade=excluded.grade,remark=excluded.remark`
  ).run(student_id, subject_id, term, year, cs, es, total, grade, remark)
  res.json({ success: true, total, grade, remark })
})

// Teacher report to admin
router.post('/teacher/report', auth, (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' })
  const { title, body } = req.body
  if (!title || !body) return res.status(400).json({ error: 'title and body required' })
  db.prepare('INSERT INTO notices (title, body, audience, created_by) VALUES (?,?,?,?)').run(`[Teacher Report] ${title}`, body, 'admin', req.user.name)
  res.json({ success: true })
})

// ── PARENT ──
router.get('/parent/me', auth, (req, res) => {
  if (req.user.role !== 'parent') return res.status(403).json({ error: 'Forbidden' })
  const parent = db.prepare('SELECT * FROM parents WHERE user_id=?').get(req.user.id)
  if (!parent) return res.status(404).json({ error: 'Parent not found' })
  const children = db.prepare('SELECT s.*, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id=c.id WHERE s.parent_id=? AND s.active=1').all(parent.id)
  res.json({ parent, children })
})

router.get('/parent/child/:student_id/scores', auth, (req, res) => {
  if (req.user.role !== 'parent') return res.status(403).json({ error: 'Forbidden' })
  const { term, year } = req.query
  const scores = db.prepare('SELECT a.*, sub.name as subject_name FROM assessments a JOIN subjects sub ON a.subject_id=sub.id WHERE a.student_id=? AND a.term=? AND a.year=?').all(req.params.student_id, term, year)
  const classSize = db.prepare('SELECT class_id FROM students WHERE id=?').get(req.params.student_id)
  const size = classSize ? db.prepare('SELECT COUNT(*) as c FROM students WHERE class_id=? AND active=1').get(classSize.class_id)?.c : 0
  const avg = scores.length ? (scores.reduce((s,r)=>s+r.total,0)/scores.length).toFixed(1) : 0
  res.json({ scores, position: scores[0]?.position||0, classSize: size, average: avg })
})

router.get('/parent/child/:student_id/fees', auth, (req, res) => {
  if (req.user.role !== 'parent') return res.status(403).json({ error: 'Forbidden' })
  const fees = db.prepare('SELECT * FROM fees WHERE student_id=? ORDER BY created_at DESC').all(req.params.student_id)
  res.json(fees)
})

router.get('/parent/child/:student_id/assignments', auth, (req, res) => {
  if (req.user.role !== 'parent') return res.status(403).json({ error: 'Forbidden' })
  const student = db.prepare('SELECT class_id FROM students WHERE id=?').get(req.params.student_id)
  if (!student) return res.json([])
  const rows = db.prepare('SELECT a.*, t.name as teacher_name, s.name as subject_name FROM assignments a LEFT JOIN teachers t ON a.teacher_id=t.id LEFT JOIN subjects s ON a.subject_id=s.id WHERE a.class_id=? ORDER BY a.created_at DESC').all(student.class_id)
  res.json(rows)
})

// ── ADMIN: User management (create / list / reset / delete portal credentials) ──
// Admin auth middleware (uses same admin token from localStorage)
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token']
  if (token !== 'abofra-admin-token' && token !== 'abofra-engineer-token') return res.status(403).json({ error: 'Admin access required' })
  next()
}

// List all portal users
router.get('/admin/users', adminAuth, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.user_id, u.name, u.role, u.active, u.created_at,
      CASE WHEN u.role='teacher' THEN t.name WHEN u.role='parent' THEN p.name ELSE NULL END as linked_name
    FROM users u
    LEFT JOIN teachers t ON u.role='teacher' AND t.user_id=u.id
    LEFT JOIN parents  p ON u.role='parent'  AND p.user_id=u.id
    ORDER BY u.role, u.name
  `).all()
  res.json(users)
})

// Create portal credentials for a teacher or parent
router.post('/admin/users', adminAuth, (req, res) => {
  const { role, linked_id, password } = req.body
  if (!role || !linked_id || !password) return res.status(400).json({ error: 'role, linked_id and password required' })
  if (!['teacher','parent','student'].includes(role)) return res.status(400).json({ error: 'role must be teacher, parent or student' })

  const table = role === 'teacher' ? 'teachers' : role === 'parent' ? 'parents' : 'students'
  const idField = role === 'teacher' ? 'teacher_id' : role === 'parent' ? 'parent_id' : 'student_id'
  const person = db.prepare(`SELECT * FROM ${table} WHERE id=?`).get(linked_id)
  if (!person) return res.status(404).json({ error: `${role} not found` })

  const user_id = person[idField]
  const existing = db.prepare('SELECT id FROM users WHERE user_id=?').get(user_id)
  if (existing) return res.status(409).json({ error: `Credentials already exist for ${user_id}` })

  const hash = bcrypt.hashSync(password, 10)
  const r = db.prepare('INSERT INTO users (user_id, name, role, password, active) VALUES (?,?,?,?,1)').run(user_id, person.name, role, hash)
  // Link the user back
  db.prepare(`UPDATE ${table} SET user_id=? WHERE id=?`).run(r.lastInsertRowid, linked_id)
  res.json({ success: true, user_id, name: person.name, role })
})

// Reset password
router.put('/admin/users/:id/password', adminAuth, (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'password required' })
  const hash = bcrypt.hashSync(password, 10)
  db.prepare('UPDATE users SET password=? WHERE id=?').run(hash, req.params.id)
  res.json({ success: true })
})

// Toggle active/inactive
router.put('/admin/users/:id/toggle', adminAuth, (req, res) => {
  const user = db.prepare('SELECT active FROM users WHERE id=?').get(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  db.prepare('UPDATE users SET active=? WHERE id=?').run(user.active ? 0 : 1, req.params.id)
  res.json({ success: true, active: !user.active })
})

// Delete credentials
router.delete('/admin/users/:id', adminAuth, (req, res) => {
  db.prepare('DELETE FROM users WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// Get unlinked teachers, parents, students (no portal account yet)
router.get('/admin/unlinked/:role', adminAuth, (req, res) => {
  const { role } = req.params
  if (role === 'teacher') {
    const rows = db.prepare(`SELECT t.id, t.name, t.teacher_id as person_id FROM teachers t WHERE t.active=1 AND (t.user_id IS NULL OR t.user_id=0 OR NOT EXISTS (SELECT 1 FROM users u WHERE u.id=t.user_id)) ORDER BY t.name`).all()
    res.json(rows)
  } else if (role === 'parent') {
    const rows = db.prepare(`SELECT p.id, p.name, p.parent_id as person_id FROM parents p WHERE p.active=1 AND (p.user_id IS NULL OR p.user_id=0 OR NOT EXISTS (SELECT 1 FROM users u WHERE u.id=p.user_id)) ORDER BY p.name`).all()
    res.json(rows)
  } else if (role === 'student') {
    const rows = db.prepare(`SELECT s.id, s.name, s.student_id as person_id, c.name as class_name FROM students s LEFT JOIN classes c ON s.class_id=c.id WHERE s.active=1 AND (s.user_id IS NULL OR s.user_id=0 OR NOT EXISTS (SELECT 1 FROM users u WHERE u.id=s.user_id)) ORDER BY s.name`).all()
    res.json(rows)
  } else res.status(400).json({ error: 'role must be teacher, parent or student' })
})

router.get('/notices', auth, (req, res) => {
  const role = req.user.role
  const rows = db.prepare("SELECT * FROM notices WHERE audience='all' OR audience=? ORDER BY created_at DESC LIMIT 30").all(role+'s')
  res.json(rows)
})

module.exports = router
