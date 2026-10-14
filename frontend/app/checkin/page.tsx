'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const API = '/api/sms'

type Child = { id: number; name: string; student_id: string; class_name: string; photo?: string }
type ParentData = { id: number; name: string; parent_id: string }
type Result = { parent: string; type: string; children: { name: string; student_id: string; class_name: string }[]; time: string }

// step: 'id' → 'select' → 'success'
export default function CheckinKiosk() {
  const [step, setStep]           = useState<'id'|'select'|'success'>('id')
  const [parentId, setParentId]   = useState('')
  const [type, setType]           = useState<'in'|'out'>('in')
  const [parentData, setParentData] = useState<ParentData | null>(null)
  const [children, setChildren]   = useState<Child[]>([])
  const [selected, setSelected]   = useState<number[]>([])
  const [result, setResult]       = useState<Result | null>(null)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [scanActive, setScanActive] = useState(false)
  const inputRef   = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scannerRef = useRef<any>(null)
  const scanDivId  = 'qr-reader'

  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setNow(d)
      const h = d.getHours()
      setType(h >= 5 && h < 14 ? 'in' : 'out')
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { if (step === 'id') inputRef.current?.focus() }, [step])

  // Start QR camera
  const startScan = useCallback(async () => {
    setScanActive(true)
    const { Html5Qrcode } = await import('html5-qrcode')
    scannerRef.current = new Html5Qrcode(scanDivId)
    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        async (decoded: string) => {
          await stopScan()
          setParentId(decoded)
          await doLookup(decoded)
        },
        () => {}
      )
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setScanActive(false)
        setError('Camera not available. Use ID entry instead.')
      }
    }
  }, [])

  const stopScan = useCallback(async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop().catch(() => {})
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
    } catch {}
    setScanActive(false)
  }, [])

  useEffect(() => () => { stopScan() }, [])

  const timeStr = now ? now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'
  const dateStr = now ? now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''

  function scheduleReset(ms = 6000) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setStep('id'); setResult(null); setError(''); setParentId('')
      setParentData(null); setChildren([]); setSelected([])
    }, ms)
  }

  async function doLookup(id: string) {
    if (!id) return
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API}/checkin/parent/${encodeURIComponent(id)}/children`)
      const data = await res.json()
      if (!res.ok || data.error) { setError(data.error || 'Not found.'); setParentId(''); inputRef.current?.focus() }
      else {
        setParentData(data.parent)
        setChildren(data.children)
        setSelected(data.children.map((c: Child) => c.id))
        setStep('select')
      }
    } catch { setError('Cannot connect to server.') }
    finally { setLoading(false) }
  }

  function lookupParent() { doLookup(parentId.trim()) }

  async function confirm() {
    if (!selected.length) return
    setLoading(true)
    try {
      const res = await fetch(`${API}/checkin/parent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_id: parentId.trim(), type, child_ids: selected })
      })
      const data = await res.json()
      if (!res.ok || data.error) { setError(data.error || 'Error.') }
      else { setResult(data); setStep('success'); scheduleReset() }
    } catch { setError('Cannot connect to server.') }
    finally { setLoading(false) }
  }

  function toggleChild(id: number) {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  const bg = type === 'in'
    ? 'linear-gradient(135deg,#0a0f1e 0%,#0e1a2e 30%,#0f2a10 65%,#1a3a0a 100%)'
    : 'linear-gradient(135deg,#0a0f1e 0%,#0e1a2e 30%,#2a0f10 65%,#3a1a0a 100%)'
  const accent = type === 'in' ? '#82c906' : '#f87171'

  return (
    <div style={{ minHeight:'100vh', background: bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Segoe UI',sans-serif", color:'#fff', padding:20, transition:'background .5s' }}>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom: step === 'select' ? 24 : 40, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <img src="/logo.png" alt="Abofra World School" style={{ width:160, height:160, objectFit:'contain', filter:'drop-shadow(0 6px 32px rgba(130,201,6,.4))' }} />
        <h1 style={{ fontSize:32, fontWeight:900, color: accent, margin:'12px 0 2px', letterSpacing:'.03em', textAlign:'center' }}>
          Abofra World School
        </h1>
        <p style={{ color:'rgba(255,255,255,.5)', fontSize:13, marginTop:2 }}>Student Check-In / Check-Out Kiosk</p>
        <div style={{ marginTop:12 }}>
          <div style={{ fontSize:30, fontWeight:800, letterSpacing:2 }}>{timeStr}</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.4)', marginTop:2 }}>{dateStr}</div>
        </div>
      </div>

      {/* STEP 1 — QR + ID panels */}
      {step === 'id' && (
        <div style={{ maxWidth:800, width:'100%' }}>
          {/* IN/OUT toggle */}
          <div style={{ display:'flex', gap:0, marginBottom:24, borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,.15)', maxWidth:400, margin:'0 auto 24px' }}>
            {(['in','out'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{ flex:1, padding:14, border:'none', cursor:'pointer', fontWeight:700, fontSize:16, background: type===t?(t==='in'?'#82c906':'#ef4444'):'transparent', color:type===t?'#fff':'rgba(255,255,255,.4)', transition:'all .2s' }}>
                {t==='in'?'🟢 Check In':'🔴 Check Out'}
              </button>
            ))}
          </div>

          {error && <div style={{ background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)', borderRadius:10, padding:'12px 16px', marginBottom:16, color:'#fca5a5', fontSize:14, textAlign:'center' }}>❌ {error}</div>}

          {/* Two panels */}
          <div className="checkin-grid" style={{ display:'grid', gap:20 }}>

            {/* LEFT — QR Scanner */}
            <div style={{ background:'rgba(255,255,255,.06)', border:`2px solid ${scanActive?accent:'rgba(255,255,255,.12)'}`, borderRadius:20, padding:28, display:'flex', flexDirection:'column', alignItems:'center', gap:16, transition:'border-color .3s', cursor: scanActive?'default':'pointer' }}
              onClick={() => { if (!scanActive) startScan() }}>
              <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em' }}>📷 Scan QR Code</div>

              {/* Scanner viewport */}
              <div style={{ width:'100%', borderRadius:14, overflow:'hidden', background:'#000', minHeight:220, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div id={scanDivId} style={{ width:'100%' }} />
                {!scanActive && (
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, background:'rgba(0,0,0,.85)' }}>
                    {/* QR code illustration — pixel grid style */}
                    <svg width="160" height="160" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{imageRendering:'pixelated'}}>
                      {/* top-left finder 7x7 */}
                      {[0,1,2,3,4,5,6].map(x=><rect key={'tl-t'+x} x={x} y={0} width={1} height={1} fill="white"/>)}
                      {[0,1,2,3,4,5,6].map(x=><rect key={'tl-b'+x} x={x} y={6} width={1} height={1} fill="white"/>)}
                      {[1,2,3,4,5].map(y=><rect key={'tl-l'+y} x={0} y={y} width={1} height={1} fill="white"/>)}
                      {[1,2,3,4,5].map(y=><rect key={'tl-r'+y} x={6} y={y} width={1} height={1} fill="white"/>)}
                      <rect x={2} y={2} width={3} height={3} fill="white"/>
                      {/* top-right finder 7x7 */}
                      {[14,15,16,17,18,19,20].map(x=><rect key={'tr-t'+x} x={x} y={0} width={1} height={1} fill="white"/>)}
                      {[14,15,16,17,18,19,20].map(x=><rect key={'tr-b'+x} x={x} y={6} width={1} height={1} fill="white"/>)}
                      {[1,2,3,4,5].map(y=><rect key={'tr-l'+y} x={14} y={y} width={1} height={1} fill="white"/>)}
                      {[1,2,3,4,5].map(y=><rect key={'tr-r'+y} x={20} y={y} width={1} height={1} fill="white"/>)}
                      <rect x={16} y={2} width={3} height={3} fill="white"/>
                      {/* bottom-left finder 7x7 */}
                      {[0,1,2,3,4,5,6].map(x=><rect key={'bl-t'+x} x={x} y={14} width={1} height={1} fill="white"/>)}
                      {[0,1,2,3,4,5,6].map(x=><rect key={'bl-b'+x} x={x} y={20} width={1} height={1} fill="white"/>)}
                      {[15,16,17,18,19].map(y=><rect key={'bl-l'+y} x={0} y={y} width={1} height={1} fill="white"/>)}
                      {[15,16,17,18,19].map(y=><rect key={'bl-r'+y} x={6} y={y} width={1} height={1} fill="white"/>)}
                      <rect x={2} y={16} width={3} height={3} fill="white"/>
                      {/* data modules */}
                      {[[8,0],[10,0],[8,2],[10,2],[12,2],[8,4],[12,4],[10,6],[12,6],
                        [0,8],[2,8],[6,8],[8,8],[12,8],[14,8],[16,8],[20,8],
                        [0,10],[4,10],[8,10],[10,10],[14,10],[18,10],[20,10],
                        [2,12],[6,12],[10,12],[12,12],[16,12],[18,12],
                        [8,14],[10,14],[14,14],[18,14],[20,14],
                        [8,16],[12,16],[16,16],[20,16],
                        [10,18],[14,18],[18,18],
                        [8,20],[12,20],[16,20],[20,20],
                      ].map(([x,y],i)=><rect key={'d'+i} x={x} y={y} width={1} height={1} fill="white"/>)}
                    </svg>
                    <p style={{ color:'rgba(255,255,255,.8)', fontSize:13, fontWeight:600, textAlign:'center', margin:0 }}>Tap to open camera</p>
                    <p style={{ color:'rgba(255,255,255,.35)', fontSize:11, textAlign:'center', margin:0 }}>Point your QR card at the lens</p>
                  </div>
                )}
              </div>

              {scanActive
                ? <button onClick={e => { e.stopPropagation(); stopScan() }} style={{ padding:'10px 24px', border:'1px solid rgba(255,255,255,.3)', borderRadius:10, background:'transparent', color:'#fff', cursor:'pointer', fontWeight:600, fontSize:13 }}>✕ Cancel Scan</button>
                : <p style={{ color:'rgba(255,255,255,.35)', fontSize:12, textAlign:'center' }}>Point your Parent QR card at the camera</p>
              }
            </div>

            {/* RIGHT — Manual ID */}
            <div style={{ background:'rgba(255,255,255,.06)', border:'2px solid rgba(255,255,255,.12)', borderRadius:20, padding:28, display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', textAlign:'center' }}>🪪 Enter Parent ID</div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:16 }}>
                <input ref={inputRef} type="text" value={parentId}
                  onChange={e => { setParentId(e.target.value); setError('') }}
                  onKeyDown={e => e.key==='Enter' && lookupParent()}
                  placeholder="e.g. AWP-2026-001"
                  style={{ width:'100%', padding:'16px 18px', fontSize:18, fontWeight:700, background:'rgba(255,255,255,.08)', border:`2px solid ${error?'#ef4444':'rgba(255,255,255,.2)'}`, borderRadius:12, color:'#fff', outline:'none', letterSpacing:2, fontFamily:'monospace', transition:'border-color .2s', boxSizing:'border-box' }}
                />
                <button onClick={lookupParent} disabled={loading||!parentId.trim()}
                  style={{ width:'100%', padding:16, border:'none', borderRadius:12, cursor:loading||!parentId.trim()?'not-allowed':'pointer', fontWeight:800, fontSize:16, background:loading||!parentId.trim()?'rgba(255,255,255,.1)':type==='in'?'linear-gradient(135deg,#82c906,#6aab00)':'linear-gradient(135deg,#ef4444,#dc2626)', color:loading||!parentId.trim()?'rgba(255,255,255,.3)':'#fff', transition:'all .2s' }}>
                  {loading?'Looking up…':'Continue →'}
                </button>
                <p style={{ textAlign:'center', fontSize:12, color:'rgba(255,255,255,.3)', margin:0 }}>
                  Press <kbd style={{ background:'rgba(255,255,255,.1)', padding:'2px 6px', borderRadius:4 }}>Enter</kbd> or tap Continue
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STEP 2 — Select Children */}
      {step === 'select' && parentData && (
        <div style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:24, padding:'36px 40px', maxWidth:600, width:'100%' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <p style={{ color:'rgba(255,255,255,.6)', fontSize:14 }}>Welcome, <strong style={{ color:'#fff' }}>{parentData.name}</strong></p>
            <h2 style={{ fontSize:20, fontWeight:800, color: accent, margin:'6px 0 4px' }}>
              {type==='in' ? '✅ Select children to Check In' : '👋 Select children to Check Out'}
            </h2>
            <p style={{ color:'rgba(255,255,255,.4)', fontSize:13 }}>Tap a child to select / deselect</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:16, marginBottom:28 }}>
            {children.map(child => {
              const isSelected = selected.includes(child.id)
              return (
                <div key={child.id} onClick={() => toggleChild(child.id)} style={{ cursor:'pointer', borderRadius:16, border:`3px solid ${isSelected ? accent : 'rgba(255,255,255,.12)'}`, background: isSelected ? `rgba(${type==='in'?'130,201,6':'248,113,113'},.12)` : 'rgba(255,255,255,.04)', padding:'20px 12px', textAlign:'center', transition:'all .2s', position:'relative' }}>
                  {isSelected && <div style={{ position:'absolute', top:10, right:10, width:22, height:22, borderRadius:'50%', background: accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#000' }}>✓</div>}
                  {child.photo
                    ? <img src={child.photo} alt={child.name} style={{ width:70, height:70, borderRadius:'50%', objectFit:'cover', border:`3px solid ${isSelected?accent:'rgba(255,255,255,.2)'}`, marginBottom:10 }} />
                    : <div style={{ width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto 10px', border:`3px solid ${isSelected?accent:'rgba(255,255,255,.15)'}` }}>🎒</div>
                  }
                  <div style={{ fontWeight:700, fontSize:14, color:'#fff' }}>{child.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginTop:3 }}>{child.class_name || '—'}</div>
                </div>
              )
            })}
          </div>

          {error && <div style={{ background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.3)', borderRadius:10, padding:'12px 16px', marginBottom:16, color:'#fca5a5', fontSize:14 }}>❌ {error}</div>}

          <div style={{ display:'flex', gap:12 }}>
            <button onClick={() => { setStep('id'); setError('') }} style={{ flex:1, padding:14, border:'1px solid rgba(255,255,255,.2)', borderRadius:12, background:'transparent', color:'rgba(255,255,255,.6)', fontWeight:700, fontSize:15, cursor:'pointer' }}>← Back</button>
            <button onClick={confirm} disabled={loading || !selected.length} style={{ flex:2, padding:14, border:'none', borderRadius:12, cursor: loading||!selected.length?'not-allowed':'pointer', fontWeight:800, fontSize:16, background: loading||!selected.length ? 'rgba(255,255,255,.1)' : type==='in' ? 'linear-gradient(135deg,#82c906,#6aab00)' : 'linear-gradient(135deg,#ef4444,#dc2626)', color: loading||!selected.length?'rgba(255,255,255,.3)':'#fff' }}>
              {loading ? 'Processing…' : type==='in' ? `✅ Check In ${selected.length} child${selected.length!==1?'ren':''}` : `👋 Check Out ${selected.length} child${selected.length!==1?'ren':''}`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Success */}
      {step === 'success' && result && (
        <div style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:24, padding:'36px 48px', textAlign:'center', maxWidth:500, width:'100%', animation:'fadeIn .3s ease' }}>
          <div style={{ fontSize:64, marginBottom:12 }}>{type==='in'?'✅':'👋'}</div>
          <h2 style={{ fontSize:24, fontWeight:800, color: accent, margin:'0 0 8px' }}>
            {type==='in'?'Checked In!':'Checked Out!'}
          </h2>
          <p style={{ color:'rgba(255,255,255,.6)', fontSize:14, marginBottom:24 }}>
            Parent: <strong style={{ color:'#fff' }}>{result.parent}</strong> &nbsp;•&nbsp; {new Date(result.time).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })}
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {result.children.map((c, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,.06)', borderRadius:12, padding:'14px 20px', display:'flex', alignItems:'center', gap:14, textAlign:'left' }}>
                <div style={{ fontSize:28 }}>🎒</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:16 }}>{c.name}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.5)' }}>{c.class_name} &nbsp;•&nbsp; {c.student_id}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ color:'rgba(255,255,255,.3)', fontSize:12, marginTop:20 }}>Screen resets in a few seconds…</p>
        </div>
      )}

      <a href="/" style={{ marginTop:32, color:'rgba(255,255,255,.3)', fontSize:13, textDecoration:'none' }}>← Back to School Website</a>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(.96) } to { opacity:1; transform:scale(1) } }
        input::placeholder { color: rgba(255,255,255,.2) }
        .checkin-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 600px) { .checkin-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
