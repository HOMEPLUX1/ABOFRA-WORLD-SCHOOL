const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcryptjs')
const QRCode  = require('qrcode')
const multer  = require('multer')
const XLSX    = require('xlsx')
const path    = require('path')
const { db, nextId } = require('../db')

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// ── CLASSES ──
router.get('/classes', (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, t.name as teacher_name,
      (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id AND s.active=1) as student_count
    FROM classes c LEFT JOIN teachers t ON c.teacher_id = t.id
    ORDER BY c.id
  `).all()
  res.json(rows)
})

router.post('/classes', (req, res) => {
  const { name, level, section, teacher_id } = req.body
  if (!name || !level) return res.status(400).json({ error: 'name and level required' })
  const r = db.prepare('INSERT INTO classes (name,level,section,teacher_id) VALUES (?,?,?,?)').run(name, level, section||'A', teacher_id||null)
  res.json({ id: r.lastInsertRowid, name, level })
})

router.put('/classes/:id', (req, res) => {
  const { name, level, section, teacher_id } = req.body
  db.prepare('UPDATE classes SET name=?,level=?,section=?,teacher_id=? WHERE id=?').run(name, level, section, teacher_id||null, req.params.id)
  res.json({ success: true })
})

router.delete('/classes/:id', (req, res) => {
  db.prepare('DELETE FROM classes WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── STUDENTS ──
router.get('/students', (req, res) => {
  const rows = db.prepare(`
    SELECT s.*, c.name as class_name, p.name as parent_name, p.phone as parent_phone
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.id
    LEFT JOIN parents p ON s.parent_id = p.id
    WHERE s.active=1 ORDER BY s.name
  `).all()
  res.json(rows)
})

router.get('/students/template', (req, res) => {
  const ws = XLSX.utils.aoa_to_sheet([
    ['Name', 'DOB', 'Gender', 'Class', 'Address', 'Special Needs'],
    ['Kofi Mensah', '2015-03-12', 'Male', 'Primary 1 A', 'Kumasi', ''],
    ['Ama Owusu',   '2014-07-20', 'Female', 'Primary 2 A', 'Kumasi', 'Hearing'],
  ])
  ws['!cols'] = [{wch:22},{wch:14},{wch:10},{wch:16},{wch:24},{wch:20}]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Students')
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename=student-import-template.xlsx')
  res.send(buf)
})

router.get('/students/:id', (req, res) => {
  const s = db.prepare(`SELECT s.*, c.name as class_name, p.name as parent_name FROM students s LEFT JOIN classes c ON s.class_id=c.id LEFT JOIN parents p ON s.parent_id=p.id WHERE s.id=?`).get(req.params.id)
  if (!s) return res.status(404).json({ error: 'Not found' })
  res.json(s)
})

router.post('/students', upload.single('photo'), async (req, res) => {
  try {
    const { name, dob, gender, class_id, parent_id, address, special_needs, admission_date } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })
    const student_id = nextId('AWS', 'students', 'student_id')
    const qr_data = JSON.stringify({ type: 'student', id: student_id, name })
    const qr_code = await QRCode.toDataURL(qr_data)
    const photo = req.file ? 'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64') : null
    db.prepare('INSERT INTO students (student_id,name,dob,gender,class_id,parent_id,address,special_needs,admission_date,photo,qr_code) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
      .run(student_id, name, dob||null, gender||null, class_id||null, parent_id||null, address||null, special_needs||null, admission_date||null, photo, qr_code)
    res.json({ success: true, student_id })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.put('/students/:id', upload.single('photo'), (req, res) => {
  const { name, dob, gender, class_id, parent_id, address, special_needs, admission_date } = req.body
  const existing = db.prepare('SELECT photo FROM students WHERE id=?').get(req.params.id)
  const photo = req.file ? 'data:' + req.file.mimetype + ';base64,' + req.file.buffer.toString('base64') : (existing ? existing.photo : null)
  db.prepare('UPDATE students SET name=?,dob=?,gender=?,class_id=?,parent_id=?,address=?,special_needs=?,admission_date=?,photo=? WHERE id=?')
    .run(name, dob||null, gender||null, class_id||null, parent_id||null, address||null, special_needs||null, admission_date||null, photo, req.params.id)
  res.json({ success: true })
})

router.delete('/students/:id', (req, res) => {
  db.prepare('UPDATE students SET active=0 WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── TEACHERS ──
router.get('/teachers', (req, res) => {
  const rows = db.prepare(`SELECT t.*, u.email, u.phone as user_phone FROM teachers t LEFT JOIN users u ON t.user_id=u.id WHERE t.active=1 ORDER BY t.name`).all()
  res.json(rows)
})

router.post('/teachers', async (req, res) => {
  try {
    const { name, phone, email, subjects, qualification } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })
    const teacher_id = nextId('AWT', 'teachers', 'teacher_id')
    const password = bcrypt.hashSync(teacher_id, 10)
    const ur = db.prepare('INSERT INTO users (user_id,name,email,phone,password,role) VALUES (?,?,?,?,?,?)').run(teacher_id, name, email||null, phone||null, password, 'teacher')
    db.prepare('INSERT INTO teachers (teacher_id,user_id,name,phone,email,subjects,qualification) VALUES (?,?,?,?,?,?,?)')
      .run(teacher_id, ur.lastInsertRowid, name, phone||null, email||null, JSON.stringify(subjects||[]), qualification||null)
    res.json({ success: true, teacher_id, default_password: teacher_id })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/teachers/template', (req, res) => {
  const ws = XLSX.utils.aoa_to_sheet([
    ['Name','Phone','Email','Qualification','Subjects'],
    ['Akosua Boateng','+233201234567','akosua@school.edu.gh','B.Ed','Maths, Science'],
  ])
  ws['!cols'] = [{wch:24},{wch:16},{wch:28},{wch:16},{wch:28}]
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Teachers')
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition','attachment; filename=teacher-import-template.xlsx')
  res.send(buf)
})

router.put('/teachers/:id', (req, res) => {
  const { name, phone, email, subjects, qualification } = req.body
  db.prepare('UPDATE teachers SET name=?,phone=?,email=?,subjects=?,qualification=? WHERE id=?')
    .run(name, phone||null, email||null, JSON.stringify(subjects||[]), qualification||null, req.params.id)
  res.json({ success: true })
})

router.delete('/teachers/:id', (req, res) => {
  db.prepare('UPDATE teachers SET active=0 WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── PARENTS ──
router.get('/parents', (req, res) => {
  const rows = db.prepare(`
    SELECT p.*, GROUP_CONCAT(s.name, ', ') as children
    FROM parents p LEFT JOIN students s ON s.parent_id=p.id AND s.active=1
    WHERE p.active=1 GROUP BY p.id ORDER BY p.name
  `).all()
  res.json(rows)
})

router.post('/parents', async (req, res) => {
  try {
    const { name, phone, email, address, occupation } = req.body
    if (!name) return res.status(400).json({ error: 'name required' })
    const parent_id = nextId('AWP', 'parents', 'parent_id')
    const password = bcrypt.hashSync(parent_id, 10)
    const qr_data = JSON.stringify({ type: 'parent', id: parent_id, name })
    const qr_code = await QRCode.toDataURL(qr_data)
    const ur = db.prepare('INSERT INTO users (user_id,name,email,phone,password,role) VALUES (?,?,?,?,?,?)').run(parent_id, name, email||null, phone||null, password, 'parent')
    const pr = db.prepare('INSERT INTO parents (parent_id,user_id,name,phone,email,address,occupation,qr_code) VALUES (?,?,?,?,?,?,?,?)')
      .run(parent_id, ur.lastInsertRowid, name, phone||null, email||null, address||null, occupation||null, qr_code)
    res.json({ success: true, id: pr.lastInsertRowid, parent_id, default_password: parent_id, qr_code })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/parents/template', (req, res) => {
  const ws = XLSX.utils.aoa_to_sheet([
    ['Name','Phone','Email','Address','Occupation'],
    ['Kwame Asante','+233551234567','kwame@gmail.com','Kumasi, Ashanti','Teacher'],
  ])
  ws['!cols'] = [{wch:24},{wch:16},{wch:28},{wch:28},{wch:18}]
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Parents')
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition','attachment; filename=parent-import-template.xlsx')
  res.send(buf)
})

router.put('/parents/:id', (req, res) => {
  const { name, phone, email, address } = req.body
  db.prepare('UPDATE parents SET name=?,phone=?,email=?,address=? WHERE id=?').run(name, phone||null, email||null, address||null, req.params.id)
  res.json({ success: true })
})

router.delete('/parents/:id', (req, res) => {
  db.prepare('UPDATE parents SET active=0 WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── STAFF ──
router.get('/staff', (req, res) => {
  const rows = db.prepare('SELECT * FROM staff WHERE active=1 ORDER BY name').all()
  res.json(rows)
})

router.post('/staff', (req, res) => {
  try {
    const { name, role, department, phone, email } = req.body
    if (!name || !role) return res.status(400).json({ error: 'name and role required' })
    const staff_id = nextId('AWS', 'staff', 'staff_id')
    const password = bcrypt.hashSync(staff_id, 10)
    const ur = db.prepare('INSERT INTO users (user_id,name,email,phone,password,role) VALUES (?,?,?,?,?,?)').run(staff_id, name, email||null, phone||null, password, 'staff')
    db.prepare('INSERT INTO staff (staff_id,user_id,name,role,department,phone,email) VALUES (?,?,?,?,?,?,?)')
      .run(staff_id, ur.lastInsertRowid, name, role, department||null, phone||null, email||null)
    res.json({ success: true, staff_id })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/staff/template', (req, res) => {
  const ws = XLSX.utils.aoa_to_sheet([
    ['Name','Role','Department','Phone','Email'],
    ['Yaw Darko','Security','Finance','+233241234567','yaw@school.edu.gh'],
  ])
  ws['!cols'] = [{wch:24},{wch:16},{wch:18},{wch:16},{wch:28}]
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Staff')
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition','attachment; filename=staff-import-template.xlsx')
  res.send(buf)
})

router.put('/staff/:id', (req, res) => {
  const { name, role, department, phone, email } = req.body
  db.prepare('UPDATE staff SET name=?,role=?,department=?,phone=?,email=? WHERE id=?').run(name, role, department||null, phone||null, email||null, req.params.id)
  res.json({ success: true })
})

router.delete('/staff/:id', (req, res) => {
  db.prepare('UPDATE staff SET active=0 WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── CHECK-IN / CHECK-OUT (QR scan) ──
router.post('/checkin', (req, res) => {
  const { student_id, type } = req.body
  const student = db.prepare("SELECT * FROM students WHERE student_id=? AND active=1").get(student_id)
  if (!student) return res.status(404).json({ error: 'Student not found' })
  db.prepare('INSERT INTO checkins (student_id, type) VALUES (?,?)').run(student.id, type||'in')
  res.json({ success: true, student: student.name, type: type||'in' })
})

// Get children for a parent ID (for kiosk selection screen)
router.get('/checkin/parent/:parent_id/children', (req, res) => {
  const parent = db.prepare("SELECT * FROM parents WHERE parent_id=? AND active=1").get(req.params.parent_id)
  if (!parent) return res.status(404).json({ error: 'Parent ID not found. Please check and try again.' })
  const children = db.prepare("SELECT s.id, s.name, s.student_id, s.photo, cl.name as class_name FROM students s LEFT JOIN classes cl ON s.class_id=cl.id WHERE s.parent_id=? AND s.active=1").all(parent.id)
  if (!children.length) return res.status(404).json({ error: 'No active children linked to this parent.' })
  res.json({ parent: { id: parent.id, name: parent.name, parent_id: parent.parent_id }, children })
})

// Parent kiosk check-in — accepts parent_id + selected child ids
router.post('/checkin/parent', (req, res) => {
  const { parent_id, type, child_ids } = req.body
  if (!parent_id) return res.status(400).json({ error: 'parent_id required' })
  const parent = db.prepare("SELECT * FROM parents WHERE parent_id=? AND active=1").get(parent_id)
  if (!parent) return res.status(404).json({ error: 'Parent ID not found.' })
  const allChildren = db.prepare("SELECT s.*, cl.name as class_name FROM students s LEFT JOIN classes cl ON s.class_id=cl.id WHERE s.parent_id=? AND s.active=1").all(parent.id)
  const selected = child_ids?.length ? allChildren.filter(c => child_ids.includes(c.id)) : allChildren
  if (!selected.length) return res.status(400).json({ error: 'No children selected.' })
  const t = type || 'in'
  const done = []
  selected.forEach(child => {
    db.prepare('INSERT INTO checkins (student_id, type) VALUES (?,?)').run(child.id, t)
    done.push({ name: child.name, student_id: child.student_id, class_name: child.class_name })
  })
  res.json({ success: true, parent: parent.name, type: t, children: done, time: new Date().toISOString() })
})

router.get('/checkins', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0]
  const rows = db.prepare(`
    SELECT c.*, s.name as student_name, s.student_id, cl.name as class_name
    FROM checkins c JOIN students s ON c.student_id=s.id LEFT JOIN classes cl ON s.class_id=cl.id
    WHERE date(c.time)=? ORDER BY c.time DESC
  `).all(date)
  res.json(rows)
})

// ── NOTICES ──
router.get('/notices', (req, res) => {
  res.json(db.prepare('SELECT * FROM notices ORDER BY created_at DESC LIMIT 50').all())
})

router.post('/notices', (req, res) => {
  const { title, body, audience } = req.body
  if (!title || !body) return res.status(400).json({ error: 'title and body required' })
  const r = db.prepare('INSERT INTO notices (title,body,audience) VALUES (?,?,?)').run(title, body, audience||'all')
  res.json({ success: true, id: r.lastInsertRowid })
})

router.delete('/notices/:id', (req, res) => {
  db.prepare('DELETE FROM notices WHERE id=?').run(req.params.id)
  res.json({ success: true })
})

// ── STATS (dashboard) ──
router.get('/stats', (req, res) => {
  res.json({
    students:  db.prepare("SELECT COUNT(*) as c FROM students WHERE active=1").get().c,
    teachers:  db.prepare("SELECT COUNT(*) as c FROM teachers WHERE active=1").get().c,
    parents:   db.prepare("SELECT COUNT(*) as c FROM parents WHERE active=1").get().c,
    staff:     db.prepare("SELECT COUNT(*) as c FROM staff WHERE active=1").get().c,
    classes:   db.prepare("SELECT COUNT(*) as c FROM classes").get().c,
    checkins_today: db.prepare("SELECT COUNT(*) as c FROM checkins WHERE date(time)=date('now') AND type='in'").get().c,
  })
})

// ── BULK IMPORT STUDENTS ──
router.post('/students/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    const sheet    = workbook.Sheets[workbook.SheetNames[0]]
    const rows     = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    if (!rows.length) return res.status(400).json({ error: 'File is empty or unreadable' })

    const results = { added: 0, skipped: 0, errors: [] }
    const insert  = db.prepare('INSERT INTO students (student_id,name,dob,gender,class_id,address,qr_code) VALUES (?,?,?,?,?,?,?)')

    // Resolve class name → id
    const allClasses = db.prepare('SELECT * FROM classes').all()
    function findClass(val) {
      if (!val) return null
      const v = String(val).trim().toLowerCase()
      const c = allClasses.find(c => c.name.toLowerCase() === v || c.level.toLowerCase() === v)
      return c ? c.id : null
    }

    for (const row of rows) {
      // Accept flexible column names
      const name    = (row['Name'] || row['name'] || row['Full Name'] || row['FULL NAME'] || '').toString().trim()
      const dob     = (row['DOB'] || row['Date of Birth'] || row['dob'] || '').toString().trim()
      const gender  = (row['Gender'] || row['gender'] || row['Sex'] || '').toString().trim()
      const cls     = (row['Class'] || row['class'] || row['CLASS'] || '').toString().trim()
      const address = (row['Address'] || row['address'] || '').toString().trim()

      if (!name) { results.skipped++; continue }

      try {
        const student_id = nextId('AWS', 'students', 'student_id')
        const class_id   = findClass(cls)
        const qr_data    = JSON.stringify({ type: 'student', id: student_id, name })
        const qr_code    = await QRCode.toDataURL(qr_data)
        insert.run(student_id, name, dob||null, gender||null, class_id, address||null, qr_code)
        results.added++
      } catch (e) {
        results.errors.push(`${name}: ${e.message}`)
        results.skipped++
      }
    }

    res.json({ success: true, ...results, total: rows.length })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ── IMPORT TEACHERS ──
router.post('/teachers/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const rows = XLSX.utils.sheet_to_json(XLSX.read(req.file.buffer, { type: 'buffer' }).Sheets[XLSX.read(req.file.buffer, { type: 'buffer' }).SheetNames[0]], { defval: '' })
    if (!rows.length) return res.status(400).json({ error: 'File is empty' })
    const insert = db.prepare('INSERT OR IGNORE INTO teachers (teacher_id,name,phone,email,qualification,subjects) VALUES (?,?,?,?,?,?)')
    const results = { added: 0, skipped: 0, errors: [] }
    for (const row of rows) {
      const name = (row['Name']||row['name']||row['Full Name']||'').toString().trim()
      if (!name) { results.skipped++; continue }
      try {
        const tid = nextId('TCH', 'teachers', 'teacher_id')
        const subjects = (row['Subjects']||row['subjects']||'').toString().split(',').map(s=>s.trim()).filter(Boolean)
        insert.run(tid, name, row['Phone']||row['phone']||null, row['Email']||row['email']||null, row['Qualification']||row['qualification']||null, JSON.stringify(subjects))
        results.added++
      } catch(e) { results.errors.push(`${name}: ${e.message}`); results.skipped++ }
    }
    res.json({ success: true, ...results, total: rows.length })
  } catch(e) { res.status(500).json({ error: e.message }) }
})

// ── IMPORT PARENTS ──
router.post('/parents/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const rows = XLSX.utils.sheet_to_json(XLSX.read(req.file.buffer, { type: 'buffer' }).Sheets[XLSX.read(req.file.buffer, { type: 'buffer' }).SheetNames[0]], { defval: '' })
    if (!rows.length) return res.status(400).json({ error: 'File is empty' })
    const insert = db.prepare('INSERT OR IGNORE INTO parents (parent_id,name,phone,email,address,occupation) VALUES (?,?,?,?,?,?)')
    const results = { added: 0, skipped: 0, errors: [] }
    for (const row of rows) {
      const name = (row['Name']||row['name']||row['Full Name']||'').toString().trim()
      if (!name) { results.skipped++; continue }
      try {
        const pid = nextId('PAR', 'parents', 'parent_id')
        insert.run(pid, name, row['Phone']||row['phone']||null, row['Email']||row['email']||null, row['Address']||row['address']||null, row['Occupation']||row['occupation']||null)
        results.added++
      } catch(e) { results.errors.push(`${name}: ${e.message}`); results.skipped++ }
    }
    res.json({ success: true, ...results, total: rows.length })
  } catch(e) { res.status(500).json({ error: e.message }) }
})

// ── IMPORT STAFF ──
router.post('/staff/import', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const rows = XLSX.utils.sheet_to_json(XLSX.read(req.file.buffer, { type: 'buffer' }).Sheets[XLSX.read(req.file.buffer, { type: 'buffer' }).SheetNames[0]], { defval: '' })
    if (!rows.length) return res.status(400).json({ error: 'File is empty' })
    const insert = db.prepare('INSERT OR IGNORE INTO staff (staff_id,name,role,department,phone,email) VALUES (?,?,?,?,?,?)')
    const results = { added: 0, skipped: 0, errors: [] }
    for (const row of rows) {
      const name = (row['Name']||row['name']||row['Full Name']||'').toString().trim()
      if (!name) { results.skipped++; continue }
      try {
        const sid = nextId('STF', 'staff', 'staff_id')
        insert.run(sid, name, row['Role']||row['role']||'Other', row['Department']||row['department']||null, row['Phone']||row['phone']||null, row['Email']||row['email']||null)
        results.added++
      } catch(e) { results.errors.push(`${name}: ${e.message}`); results.skipped++ }
    }
    res.json({ success: true, ...results, total: rows.length })
  } catch(e) { res.status(500).json({ error: e.message }) }
})

function xlsxSend(res, rows, headers, filename, sheetName) {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1')
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', 'attachment; filename=' + filename)
  res.send(buf)
}

// ── EXPORT ROUTES ──
router.get('/export/students', (req, res) => {
  const rows = db.prepare(`SELECT s.student_id, s.name, s.dob, s.gender, c.name as class_name, p.name as parent_name, p.phone as parent_phone, s.address, s.special_needs, s.admission_date, s.created_at
    FROM students s LEFT JOIN classes c ON s.class_id=c.id LEFT JOIN parents p ON s.parent_id=p.id WHERE s.active=1 ORDER BY s.name`).all()
  function age(dob) {
    if (!dob) return ''
    const today = new Date(), b = new Date(dob)
    let a = today.getFullYear() - b.getFullYear()
    if (today.getMonth() < b.getMonth() || (today.getMonth()===b.getMonth() && today.getDate()<b.getDate())) a--
    return a
  }
  xlsxSend(res,
    rows.map(r => [r.student_id, r.name, r.dob||'', age(r.dob), r.gender||'', r.class_name||'', r.admission_date||'', r.parent_name||'', r.parent_phone||'', r.address||'', r.special_needs||'', r.created_at]),
    ['Student ID','Name','Date of Birth','Age','Gender','Class','Date of Admission','Parent Name','Parent Phone','Address','Special Needs','Date Added'],
    'students-export.xlsx', 'Students')
})

router.get('/export/teachers', (req, res) => {
  const rows = db.prepare(`SELECT teacher_id, name, phone, email, qualification, subjects FROM teachers WHERE active=1 ORDER BY name`).all()
  xlsxSend(res,
    rows.map(r => [r.teacher_id, r.name, r.phone||'', r.email||'', r.qualification||'', r.subjects ? JSON.parse(r.subjects).join(', ') : '']),
    ['Teacher ID','Name','Phone','Email','Qualification','Subjects'],
    'teachers-export.xlsx', 'Teachers')
})

router.get('/export/parents', (req, res) => {
  const rows = db.prepare(`SELECT p.parent_id, p.name, p.phone, p.email, p.address,
    GROUP_CONCAT(s.name, ', ') as children
    FROM parents p LEFT JOIN students s ON s.parent_id=p.id WHERE p.active=1 GROUP BY p.id ORDER BY p.name`).all()
  xlsxSend(res,
    rows.map(r => [r.parent_id, r.name, r.phone||'', r.email||'', r.address||'', r.children||'']),
    ['Parent ID','Name','Phone','Email','Address','Children'],
    'parents-export.xlsx', 'Parents')
})

router.get('/export/staff', (req, res) => {
  const rows = db.prepare(`SELECT staff_id, name, role, department, phone, email FROM staff WHERE active=1 ORDER BY name`).all()
  xlsxSend(res,
    rows.map(r => [r.staff_id, r.name, r.role||'', r.department||'', r.phone||'', r.email||'']),
    ['Staff ID','Name','Role','Department','Phone','Email'],
    'staff-export.xlsx', 'Staff')
})

router.get('/export/classes', (req, res) => {
  const rows = db.prepare(`SELECT c.name, c.level, c.section, t.name as teacher_name,
    (SELECT COUNT(*) FROM students s WHERE s.class_id=c.id AND s.active=1) as student_count
    FROM classes c LEFT JOIN teachers t ON c.teacher_id=t.id ORDER BY c.name`).all()
  xlsxSend(res,
    rows.map(r => [r.name, r.level, r.section||'', r.teacher_name||'', r.student_count||0]),
    ['Class Name','Level','Section','Class Teacher','No. of Students'],
    'classes-export.xlsx', 'Classes')
})

router.get('/export/fees', (req, res) => {
  const rows = db.prepare(`SELECT f.receipt_no, s.name as student_name, s.student_id as sid, c.name as class_name,
    p.name as parent_name, p.phone as parent_phone, f.fee_type, f.term, f.year, f.amount, f.status, f.paid_at, f.note
    FROM fees f JOIN students s ON f.student_id=s.id LEFT JOIN classes c ON s.class_id=c.id LEFT JOIN parents p ON s.parent_id=p.id
    ORDER BY f.created_at DESC`).all()
  xlsxSend(res,
    rows.map(r => [r.receipt_no||'', r.student_name, r.sid, r.class_name||'', r.parent_name||'', r.parent_phone||'', r.fee_type, r.term, r.year, r.amount, r.status, r.paid_at||'', r.note||'']),
    ['Receipt No','Student','Student ID','Class','Parent','Parent Phone','Fee Type','Term','Year','Amount (GH₵)','Status','Date Paid','Note'],
    'fees-export.xlsx', 'Fees')
})

router.get('/export/notices', (req, res) => {
  const rows = db.prepare(`SELECT title, body, audience, created_by, created_at FROM notices ORDER BY created_at DESC`).all()
  xlsxSend(res,
    rows.map(r => [r.title, r.body, r.audience, r.created_by, r.created_at]),
    ['Title','Message','Audience','Created By','Date'],
    'notices-export.xlsx', 'Notices')
})

module.exports = router
