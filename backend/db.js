const Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')

const db = new Database(path.join(__dirname, 'data/school.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    photo TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level TEXT NOT NULL,
    section TEXT DEFAULT 'A',
    teacher_id INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    dob TEXT,
    gender TEXT,
    class_id INTEGER,
    parent_id INTEGER,
    photo TEXT,
    qr_code TEXT,
    address TEXT,
    special_needs TEXT DEFAULT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    subjects TEXT DEFAULT '[]',
    qualification TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS parents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    qr_code TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    phone TEXT,
    email TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    time TEXT DEFAULT (datetime('now')),
    noted_by TEXT
  );

  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    audience TEXT DEFAULT 'all',
    created_by TEXT DEFAULT 'admin',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    class_id INTEGER,
    teacher_id INTEGER,
    active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS assessments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    term TEXT NOT NULL,
    year INTEGER NOT NULL,
    class_score REAL DEFAULT 0,
    exam_score REAL DEFAULT 0,
    total REAL DEFAULT 0,
    grade TEXT DEFAULT '',
    remark TEXT DEFAULT '',
    position INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(student_id, subject_id, term, year)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER,
    class_id INTEGER,
    subject_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    receipt_no TEXT UNIQUE,
    fee_type TEXT NOT NULL,
    term TEXT NOT NULL,
    year INTEGER NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    paid_at TEXT,
    note TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`)

// Migrations for columns added after initial schema
try { db.exec("ALTER TABLE students ADD COLUMN special_needs TEXT DEFAULT NULL") } catch(e) {}
try { db.exec("ALTER TABLE students ADD COLUMN admission_date TEXT DEFAULT NULL") } catch(e) {}
try { db.exec("ALTER TABLE parents ADD COLUMN occupation TEXT DEFAULT NULL") } catch(e) {}

// Seed admin user if not exists
const adminExists = db.prepare("SELECT id FROM users WHERE role='admin' LIMIT 1").get()
if (!adminExists) {
  const hash = bcrypt.hashSync('abofra2026', 10)
  db.prepare(`INSERT INTO users (user_id, name, email, password, role) VALUES (?,?,?,?,?)`)
    .run('ADM-0001', 'Administrator', 'admin@abofra.edu.gh', hash, 'admin')
}

// Seed default classes if none exist
const classCount = db.prepare("SELECT COUNT(*) as c FROM classes").get()
if (classCount.c === 0) {
  const levels = [
    'KG 1', 'KG 2',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
    'JHS 1', 'JHS 2', 'JHS 3'
  ]
  const insert = db.prepare("INSERT INTO classes (name, level, section) VALUES (?,?,?)")
  levels.forEach(l => insert.run(`${l} A`, l, 'A'))
}

function nextId(prefix, table, column) {
  const year = new Date().getFullYear()
  const last = db.prepare(`SELECT ${column} FROM ${table} WHERE ${column} LIKE ? ORDER BY id DESC LIMIT 1`).get(`${prefix}-${year}-%`)
  if (!last) return `${prefix}-${year}-001`
  const num = parseInt(last[column].split('-').pop()) + 1
  return `${prefix}-${year}-${String(num).padStart(3, '0')}`
}

module.exports = { db, nextId }
