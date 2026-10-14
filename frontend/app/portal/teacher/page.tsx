'use client'
import { useState, useEffect } from 'react'

const API = '/api/portal'

const s: Record<string, React.CSSProperties> = {
  page:   { minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI',sans-serif" },
  top:    { background: '#1a202c', color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo:   { color: '#82c906', fontWeight: 800, fontSize: 17 },
  tabs:   { background: '#fff', borderBottom: '2px solid #e2e8f0', display: 'flex', overflowX: 'auto' },
  tab:    { padding: '13px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#666', borderBottom: '3px solid transparent', whiteSpace: 'nowrap' },
  tabA:   { padding: '13px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#82c906', borderBottom: '3px solid #82c906', whiteSpace: 'nowrap' },
  body:   { padding: 24, maxWidth: 900, margin: '0 auto' },
  card:   { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20, overflow: 'hidden' },
  ch:     { padding: '16px 20px', borderBottom: '1px solid #f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 },
  cp:     { padding: 20 },
  btn:    { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: '#82c906', color: '#fff' },
  btnR:   { padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12, background: '#e53e3e', color: '#fff' },
  inp:    { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 12 },
  label:  { display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 5 },
  badge:  { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
}

export default function TeacherPortal() {
  const [token, setToken] = useState('')
  const [user, setUser]   = useState<any>(null)
  const [data, setData]   = useState<any>(null)
  const [tab, setTab]     = useState('home')
  const [loginId, setLoginId]     = useState('')
  const [loginPwd, setLoginPwd]   = useState('')
  const [loginErr, setLoginErr]   = useState('')
  const [assignments, setAssignments] = useState<any[]>([])
  const [notices, setNotices] = useState<any[]>([])
  const [newA, setNewA] = useState({ title: '', description: '', class_id: '', subject_id: '', due_date: '' })
  const [report, setReport] = useState({ title: '', body: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('teacher_token')
    const u = localStorage.getItem('teacher_user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)); fetchData(t) }
  }, [])

  async function fetchData(t: string) {
    const me = await fetch(API + '/teacher/me', { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json())
    setData(me)
    const ass = await fetch(API + '/teacher/assignments', { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json())
    setAssignments(Array.isArray(ass) ? ass : [])
    const n = await fetch(API + '/notices', { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json())
    setNotices(Array.isArray(n) ? n : [])
  }

  async function login() {
    setLoginErr('')
    const res = await fetch(API + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: loginId, password: loginPwd }) }).then(r => r.json())
    if (res.error) { setLoginErr(res.error); return }
    if (res.role !== 'teacher') { setLoginErr('This portal is for teachers only.'); return }
    localStorage.setItem('teacher_token', res.token)
    localStorage.setItem('teacher_user', JSON.stringify(res))
    setToken(res.token); setUser(res); fetchData(res.token)
  }

  async function postAssignment() {
    if (!newA.title) return
    await fetch(API + '/teacher/assignments', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(newA) })
    setNewA({ title: '', description: '', class_id: '', subject_id: '', due_date: '' })
    setMsg('Assignment posted!'); setTimeout(() => setMsg(''), 3000)
    fetchData(token)
  }

  async function deleteAssignment(id: number) {
    await fetch(`${API}/teacher/assignments/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
    fetchData(token)
  }

  async function sendReport() {
    if (!report.title || !report.body) return
    await fetch(API + '/teacher/report', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(report) })
    setReport({ title: '', body: '' })
    setMsg('Report sent to administration!'); setTimeout(() => setMsg(''), 3000)
  }

  function logout() { localStorage.removeItem('teacher_token'); localStorage.removeItem('teacher_user'); setToken(''); setUser(null); setData(null) }

  if (!token) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1a202c,#2d3748)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40 }}>👩‍🏫</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a202c', marginTop: 8 }}>Teacher Login</h2>
          <p style={{ color: '#718096', fontSize: 13 }}>Abofra World School</p>
        </div>
        <label style={s.label}>Teacher ID</label>
        <input style={s.inp} placeholder="e.g. AWT-2026-001" value={loginId} onChange={e => setLoginId(e.target.value)} />
        <label style={s.label}>Password</label>
        <input style={s.inp} type="password" placeholder="Your password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        {loginErr && <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12 }}>{loginErr}</p>}
        <button style={{ ...s.btn, width: '100%', padding: '12px', fontSize: 15 }} onClick={login}>Login</button>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#718096' }}>
          <a href="/portal" style={{ color: '#82c906' }}>← Back to Portal</a>
        </p>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.top}>
        <span style={s.logo}>🎓 Abofra — Teacher Portal</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#a0aec0', fontSize: 13 }}>👋 {user?.name}</span>
          <button onClick={logout} style={{ background: 'none', border: '1px solid #4a5568', borderRadius: 6, color: '#a0aec0', padding: '5px 12px', cursor: 'pointer', fontSize: 12 }}>Logout</button>
        </div>
      </div>

      <div style={s.tabs}>
        {[['home','🏠 Home'],['assignments','📋 Assignments'],['report','📝 Report'],['notices','📢 Notices']].map(([k,l]) => (
          <div key={k} style={tab===k ? s.tabA : s.tab} onClick={() => setTab(k)}>{l as string}</div>
        ))}
      </div>

      {msg && <div style={{ background: '#c6f6d5', color: '#276749', padding: '10px 24px', fontSize: 13, fontWeight: 600 }}>{msg}</div>}

      <div style={s.body}>
        {tab === 'home' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 14, marginBottom: 20 }}>
              {[['Classes', data?.classes?.length||0,'#82c906'],['Subjects', data?.subjects?.length||0,'#3182ce'],['Assignments', assignments.length,'#e53e3e']].map(([l,n,c]) => (
                <div key={l as string} style={{ background:'#fff', borderRadius:12, padding:'18px 16px', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
                  <div style={{ fontSize:28, fontWeight:800, color:c as string }}>{n as number}</div>
                  <div style={{ fontSize:13, color:'#718096', marginTop:4 }}>{l as string}</div>
                </div>
              ))}
            </div>
            <div style={s.card}>
              <div style={s.ch}>My Classes</div>
              <div style={s.cp}>
                {data?.classes?.length ? data.classes.map((c: any) => (
                  <div key={c.id} style={{ padding:'10px 0', borderBottom:'1px solid #f0f4f8', fontSize:14 }}>
                    <strong>{c.name}</strong> <span style={{ color:'#718096', fontSize:12 }}>— {c.level}</span>
                  </div>
                )) : <p style={{ color:'#999', fontSize:14 }}>No classes assigned yet.</p>}
              </div>
            </div>
            <div style={s.card}>
              <div style={s.ch}>My Subjects</div>
              <div style={s.cp}>
                {data?.subjects?.length ? data.subjects.map((s: any) => (
                  <div key={s.id} style={{ padding:'10px 0', borderBottom:'1px solid #f0f4f8', fontSize:14 }}>
                    <strong>{s.name}</strong> <span style={{ color:'#718096', fontSize:12 }}>— {s.class_name}</span>
                  </div>
                )) : <p style={{ color:'#999', fontSize:14 }}>No subjects assigned yet.</p>}
              </div>
            </div>
          </>
        )}

        {tab === 'assignments' && (
          <>
            <div style={s.card}>
              <div style={s.ch}>Post New Assignment</div>
              <div style={s.cp}>
                <label style={s.label}>Title *</label>
                <input style={s.inp} placeholder="Assignment title" value={newA.title} onChange={e => setNewA({...newA, title:e.target.value})} />
                <label style={s.label}>Description</label>
                <textarea style={{...s.inp, height:80}} placeholder="Instructions or details..." value={newA.description} onChange={e => setNewA({...newA, description:e.target.value})} />
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  <div>
                    <label style={s.label}>Class</label>
                    <select style={s.inp} value={newA.class_id} onChange={e => setNewA({...newA, class_id:e.target.value})}>
                      <option value="">All my classes</option>
                      {data?.classes?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Subject</label>
                    <select style={s.inp} value={newA.subject_id} onChange={e => setNewA({...newA, subject_id:e.target.value})}>
                      <option value="">General</option>
                      {data?.subjects?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={s.label}>Due Date</label>
                    <input style={s.inp} type="date" value={newA.due_date} onChange={e => setNewA({...newA, due_date:e.target.value})} />
                  </div>
                </div>
                <button style={s.btn} onClick={postAssignment}>Post Assignment</button>
              </div>
            </div>
            <div style={s.card}>
              <div style={s.ch}>Posted Assignments</div>
              <div style={s.cp}>
                {assignments.length ? assignments.map((a: any) => (
                  <div key={a.id} style={{ padding:'12px 0', borderBottom:'1px solid #f0f4f8' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <strong style={{ fontSize:14 }}>{a.title}</strong>
                        {a.class_name && <span style={{ ...s.badge, background:'#ebf8ff', color:'#2b6cb0', marginLeft:8 }}>{a.class_name}</span>}
                        {a.subject_name && <span style={{ ...s.badge, background:'#f0fff4', color:'#276749', marginLeft:6 }}>{a.subject_name}</span>}
                        {a.description && <p style={{ color:'#555', fontSize:13, marginTop:4 }}>{a.description}</p>}
                        {a.due_date && <p style={{ color:'#e53e3e', fontSize:12, marginTop:2 }}>Due: {new Date(a.due_date).toLocaleDateString('en-GB')}</p>}
                      </div>
                      <button style={s.btnR} onClick={() => deleteAssignment(a.id)}>Delete</button>
                    </div>
                  </div>
                )) : <p style={{ color:'#999', fontSize:14 }}>No assignments posted yet.</p>}
              </div>
            </div>
          </>
        )}

        {tab === 'report' && (
          <div style={s.card}>
            <div style={s.ch}>Send Report to Administration</div>
            <div style={s.cp}>
              <label style={s.label}>Subject *</label>
              <input style={s.inp} placeholder="e.g. Student Behaviour Report — Week 3" value={report.title} onChange={e => setReport({...report, title:e.target.value})} />
              <label style={s.label}>Report Details *</label>
              <textarea style={{...s.inp, height:160}} placeholder="Write your report here..." value={report.body} onChange={e => setReport({...report, body:e.target.value})} />
              <button style={s.btn} onClick={sendReport}>Send Report</button>
            </div>
          </div>
        )}

        {tab === 'notices' && (
          <div style={s.card}>
            <div style={s.ch}>School Notices</div>
            <div style={s.cp}>
              {notices.length ? notices.map((n: any) => (
                <div key={n.id} style={{ padding:'12px 0', borderBottom:'1px solid #f0f4f8' }}>
                  <strong style={{ fontSize:14 }}>{n.title}</strong>
                  <p style={{ color:'#555', fontSize:13, marginTop:4 }}>{n.body}</p>
                  <p style={{ color:'#999', fontSize:11, marginTop:4 }}>{new Date(n.created_at).toLocaleString()}</p>
                </div>
              )) : <p style={{ color:'#999', fontSize:14 }}>No notices yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
