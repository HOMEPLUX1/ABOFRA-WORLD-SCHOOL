'use client'
import { useState, useEffect } from 'react'

const API = 'http://localhost:5002/api/portal'

const s: Record<string, React.CSSProperties> = {
  page:  { minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Segoe UI',sans-serif" },
  top:   { background: '#1a202c', color: '#fff', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo:  { color: '#82c906', fontWeight: 800, fontSize: 17 },
  tabs:  { background: '#fff', borderBottom: '2px solid #e2e8f0', display: 'flex', overflowX: 'auto' },
  tab:   { padding: '13px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#666', borderBottom: '3px solid transparent', whiteSpace: 'nowrap' },
  tabA:  { padding: '13px 20px', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#82c906', borderBottom: '3px solid #82c906', whiteSpace: 'nowrap' },
  body:  { padding: 24, maxWidth: 900, margin: '0 auto' },
  card:  { background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.08)', marginBottom: 20, overflow: 'hidden' },
  ch:    { padding: '16px 20px', borderBottom: '1px solid #f0f4f8', fontWeight: 700, fontSize: 15 },
  cp:    { padding: 20 },
  inp:   { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 12 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#4a5568', marginBottom: 5 },
  btn:   { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, background: '#82c906', color: '#fff' },
  badge: { padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 },
}

export default function ParentPortal() {
  const [token, setToken]   = useState('')
  const [user, setUser]     = useState<any>(null)
  const [data, setData]     = useState<any>(null)
  const [tab, setTab]       = useState('home')
  const [child, setChild]   = useState<any>(null)
  const [scores, setScores] = useState<any>(null)
  const [fees, setFees]     = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [notices, setNotices] = useState<any[]>([])
  const [term, setTerm]     = useState('Term 1')
  const [year, setYear]     = useState(String(new Date().getFullYear()))
  const [loginId, setLoginId]   = useState('')
  const [loginPwd, setLoginPwd] = useState('')
  const [loginErr, setLoginErr] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('parent_token')
    const u = localStorage.getItem('parent_user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)); fetchData(t) }
  }, [])

  async function fetchData(t: string) {
    const me = await fetch(API + '/parent/me', { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json())
    if (me.error) { logout(); return }
    setData(me)
    if (me.children?.length) selectChild(me.children[0], t)
    const n = await fetch(API + '/notices', { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json())
    setNotices(Array.isArray(n) ? n : [])
  }

  async function selectChild(c: any, t?: string) {
    const tk = t || token
    setChild(c)
    const f = await fetch(`${API}/parent/child/${c.id}/fees`, { headers: { Authorization: 'Bearer ' + tk } }).then(r => r.json())
    setFees(Array.isArray(f) ? f : [])
    const a = await fetch(`${API}/parent/child/${c.id}/assignments`, { headers: { Authorization: 'Bearer ' + tk } }).then(r => r.json())
    setAssignments(Array.isArray(a) ? a : [])
  }

  async function loadScores() {
    if (!child) return
    const res = await fetch(`${API}/parent/child/${child.id}/scores?term=${encodeURIComponent(term)}&year=${year}`, { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json())
    setScores(res)
  }

  async function login() {
    setLoginErr('')
    const res = await fetch(API + '/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ user_id: loginId, password: loginPwd }) }).then(r => r.json())
    if (res.error) { setLoginErr(res.error); return }
    if (res.role !== 'parent') { setLoginErr('This portal is for parents only.'); return }
    localStorage.setItem('parent_token', res.token)
    localStorage.setItem('parent_user', JSON.stringify(res))
    setToken(res.token); setUser(res); fetchData(res.token)
  }

  function logout() { localStorage.removeItem('parent_token'); localStorage.removeItem('parent_user'); setToken(''); setUser(null); setData(null) }

  const gradeColor = (g: string) => g?.startsWith('A')?'#276749':g?.startsWith('F')?'#e53e3e':'#2b6cb0'

  if (!token) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#1a202c,#2d3748)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:40, width:'100%', maxWidth:380, boxShadow:'0 8px 40px rgba(0,0,0,.2)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:40 }}>👨‍👩‍👧</div>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#1a202c', marginTop:8 }}>Parent Login</h2>
          <p style={{ color:'#718096', fontSize:13 }}>Abofra World School</p>
        </div>
        <label style={s.label}>Parent ID</label>
        <input style={s.inp} placeholder="e.g. AWP-2026-001" value={loginId} onChange={e => setLoginId(e.target.value)} />
        <label style={s.label}>Password</label>
        <input style={s.inp} type="password" placeholder="Your password" value={loginPwd} onChange={e => setLoginPwd(e.target.value)} onKeyDown={e => e.key==='Enter'&&login()} />
        {loginErr && <p style={{ color:'#e53e3e', fontSize:13, marginBottom:12 }}>{loginErr}</p>}
        <button style={{ ...s.btn, width:'100%', padding:'12px', fontSize:15 }} onClick={login}>Login</button>
        <p style={{ textAlign:'center', marginTop:16, fontSize:12, color:'#718096' }}>
          <a href="/portal" style={{ color:'#82c906' }}>← Back to Portal</a>
        </p>
      </div>
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.top}>
        <span style={s.logo}>🎓 Abofra — Parent Portal</span>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <span style={{ color:'#a0aec0', fontSize:13 }}>👋 {user?.name}</span>
          <button onClick={logout} style={{ background:'none', border:'1px solid #4a5568', borderRadius:6, color:'#a0aec0', padding:'5px 12px', cursor:'pointer', fontSize:12 }}>Logout</button>
        </div>
      </div>

      {/* Child selector */}
      {data?.children?.length > 1 && (
        <div style={{ background:'#fff', padding:'12px 24px', borderBottom:'1px solid #e2e8f0', display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ fontSize:13, color:'#718096', fontWeight:600 }}>Viewing:</span>
          {data.children.map((c: any) => (
            <button key={c.id} onClick={() => selectChild(c)} style={{ padding:'6px 14px', borderRadius:20, border:'2px solid', borderColor: child?.id===c.id?'#82c906':'#e2e8f0', background: child?.id===c.id?'#f0fff4':'#fff', color: child?.id===c.id?'#276749':'#555', cursor:'pointer', fontWeight:600, fontSize:13 }}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div style={s.tabs}>
        {[['home','🏠 Overview'],['scores','📊 Report Card'],['fees','💰 Fees'],['assignments','📋 Assignments'],['notices','📢 Notices'],['qr','🪪 QR Card']].map(([k,l]) => (
          <div key={k} style={tab===k?s.tabA:s.tab} onClick={() => { setTab(k); if(k==='scores') loadScores() }}>{l as string}</div>
        ))}
      </div>

      <div style={s.body}>
        {/* HOME */}
        {tab === 'home' && child && (
          <>
            <div style={{ ...s.card, padding:24, display:'flex', gap:20, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ fontSize:56 }}>🎒</div>
              <div>
                <h2 style={{ fontSize:22, fontWeight:800, color:'#1a202c' }}>{child.name}</h2>
                <p style={{ color:'#718096', fontSize:14 }}>Class: <strong>{child.class_name||'—'}</strong></p>
                <p style={{ color:'#718096', fontSize:14 }}>Student ID: <strong style={{ color:'#82c906' }}>{child.student_id}</strong></p>
                {child.gender && <p style={{ color:'#718096', fontSize:14 }}>Gender: <strong>{child.gender}</strong></p>}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:14 }}>
              {[['Assignments', assignments.length,'📋','#3182ce'],['Fees Pending', fees.filter((f:any)=>f.status==='pending').length,'💰','#e53e3e'],['Fees Paid', fees.filter((f:any)=>f.status==='paid').length,'✅','#276749']].map(([l,n,ic,c]) => (
                <div key={l as string} style={{ background:'#fff', borderRadius:12, padding:'18px 16px', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
                  <div style={{ fontSize:24 }}>{ic as string}</div>
                  <div style={{ fontSize:26, fontWeight:800, color:c as string }}>{n as number}</div>
                  <div style={{ fontSize:12, color:'#718096', marginTop:2 }}>{l as string}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SCORES */}
        {tab === 'scores' && (
          <>
            <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap', alignItems:'flex-end' }}>
              <div>
                <label style={s.label}>Term</label>
                <select style={{ ...s.inp, marginBottom:0, width:'auto' }} value={term} onChange={e => setTerm(e.target.value)}>
                  <option>Term 1</option><option>Term 2</option><option>Term 3</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Year</label>
                <select style={{ ...s.inp, marginBottom:0, width:'auto' }} value={year} onChange={e => setYear(e.target.value)}>
                  {[2024,2025,2026,2027].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <button style={s.btn} onClick={loadScores}>Load Results</button>
              {scores && child && (
                <a href={`http://localhost:5002/api/fees/reportcard/${child.id}?term=${encodeURIComponent(term)}&year=${year}`} target="_blank" style={{ ...s.btn, textDecoration:'none', background:'#2d7d32' }}>📄 Download Report Card</a>
              )}
            </div>
            {scores ? (
              <>
                <div style={{ ...s.card, marginBottom:14 }}>
                  <div style={s.cp}>
                    <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
                      <div><span style={{ color:'#718096', fontSize:13 }}>Position: </span><strong style={{ fontSize:18, color:'#82c906' }}>{scores.position || '—'}</strong><span style={{ color:'#718096', fontSize:13 }}> / {scores.classSize}</span></div>
                      <div><span style={{ color:'#718096', fontSize:13 }}>Average: </span><strong style={{ fontSize:18, color:'#3182ce' }}>{scores.average}%</strong></div>
                    </div>
                  </div>
                </div>
                <div style={s.card}>
                  <div style={s.ch}>Subjects & Scores — {term} {year}</div>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead><tr style={{ background:'#1a202c' }}>
                        {['Subject','Class Score','Exam Score','Total','Grade','Remark'].map(h => <th key={h} style={{ padding:'10px 14px', color:'#fff', fontSize:12, textAlign:'left', fontWeight:700 }}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {scores.scores?.map((sc: any, i: number) => (
                          <tr key={sc.id} style={{ background: i%2===0?'#f7fafc':'#fff' }}>
                            <td style={{ padding:'10px 14px', fontSize:13, fontWeight:600 }}>{sc.subject_name}</td>
                            <td style={{ padding:'10px 14px', fontSize:13 }}>{sc.class_score}</td>
                            <td style={{ padding:'10px 14px', fontSize:13 }}>{sc.exam_score}</td>
                            <td style={{ padding:'10px 14px', fontSize:13, fontWeight:700 }}>{sc.total}</td>
                            <td style={{ padding:'10px 14px' }}><span style={{ ...s.badge, background: sc.grade?.startsWith('A')?'#c6f6d5':sc.grade?.startsWith('F')?'#fed7d7':'#bee3f8', color: gradeColor(sc.grade) }}>{sc.grade}</span></td>
                            <td style={{ padding:'10px 14px', fontSize:12, color:'#555' }}>{sc.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : <p style={{ color:'#999', fontSize:14 }}>Select term and year, then click Load Results.</p>}
          </>
        )}

        {/* FEES */}
        {tab === 'fees' && (
          <div style={s.card}>
            <div style={s.ch}>Fee Records — {child?.name}</div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#f7fafc' }}>
                  {['Type','Term','Year','Amount','Status','Receipt'].map(h => <th key={h} style={{ padding:'10px 14px', fontSize:12, textAlign:'left', fontWeight:700, color:'#4a5568', borderBottom:'1px solid #e2e8f0' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {fees.length ? fees.map((f: any) => (
                    <tr key={f.id} style={{ borderBottom:'1px solid #f0f4f8' }}>
                      <td style={{ padding:'10px 14px', fontSize:13, fontWeight:600 }}>{f.fee_type}</td>
                      <td style={{ padding:'10px 14px', fontSize:13 }}>{f.term}</td>
                      <td style={{ padding:'10px 14px', fontSize:13 }}>{f.year}</td>
                      <td style={{ padding:'10px 14px', fontSize:13, fontWeight:700 }}>GH₵ {parseFloat(f.amount).toFixed(2)}</td>
                      <td style={{ padding:'10px 14px' }}>
                        <span style={{ ...s.badge, background:f.status==='paid'?'#c6f6d5':'#fefcbf', color:f.status==='paid'?'#276749':'#744210' }}>{f.status.toUpperCase()}</span>
                      </td>
                      <td style={{ padding:'10px 14px' }}>
                        {f.status==='paid' && <a href={`http://localhost:5002/api/fees/${f.id}/receipt`} target="_blank" style={{ ...s.btn, fontSize:12, padding:'5px 12px', textDecoration:'none' }}>📄 PDF</a>}
                      </td>
                    </tr>
                  )) : <tr><td colSpan={6} style={{ textAlign:'center', color:'#999', padding:20, fontSize:14 }}>No fee records yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ASSIGNMENTS */}
        {tab === 'assignments' && (
          <div style={s.card}>
            <div style={s.ch}>Assignments — {child?.class_name}</div>
            <div style={s.cp}>
              {assignments.length ? assignments.map((a: any) => (
                <div key={a.id} style={{ padding:'14px 0', borderBottom:'1px solid #f0f4f8' }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:4 }}>
                    <strong style={{ fontSize:14 }}>{a.title}</strong>
                    {a.subject_name && <span style={{ ...s.badge, background:'#f0fff4', color:'#276749' }}>{a.subject_name}</span>}
                    {a.teacher_name && <span style={{ ...s.badge, background:'#ebf8ff', color:'#2b6cb0' }}>By {a.teacher_name}</span>}
                  </div>
                  {a.description && <p style={{ color:'#555', fontSize:13 }}>{a.description}</p>}
                  {a.due_date && <p style={{ color:'#e53e3e', fontSize:12, marginTop:4 }}>📅 Due: {new Date(a.due_date).toLocaleDateString('en-GB')}</p>}
                  <p style={{ color:'#999', fontSize:11, marginTop:4 }}>Posted: {new Date(a.created_at).toLocaleDateString('en-GB')}</p>
                </div>
              )) : <p style={{ color:'#999', fontSize:14 }}>No assignments posted yet.</p>}
            </div>
          </div>
        )}

        {/* NOTICES */}
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

        {/* QR CARD */}
        {tab === 'qr' && data?.parent && (
          <div style={{ ...s.card, maxWidth:380, margin:'0 auto' }}>
            <div style={s.ch}>Your ID & QR Code</div>
            <div style={{ ...s.cp, textAlign:'center' }}>
              <p style={{ color:'#718096', fontSize:14, marginBottom:16 }}>Show this QR code at the school gate for student check-in / check-out</p>
              {data.parent.qr_code && <img src={data.parent.qr_code} alt="QR Code" style={{ width:180, height:180, margin:'0 auto', display:'block' }} />}
              <div style={{ background:'#1a202c', color:'#82c906', padding:'10px 20px', borderRadius:8, fontWeight:800, fontSize:18, display:'inline-block', marginTop:16 }}>{data.parent.parent_id}</div>
              <p style={{ color:'#999', fontSize:12, marginTop:12 }}>Parent ID: <strong>{data.parent.parent_id}</strong></p>
              {data.children?.map((c: any) => (
                <p key={c.id} style={{ color:'#555', fontSize:13 }}>Child: <strong>{c.name}</strong> — {c.class_name}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
