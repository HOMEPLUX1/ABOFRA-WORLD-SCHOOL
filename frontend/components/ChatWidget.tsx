'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'

const API = 'http://localhost:5002'

interface Message {
  from: 'user' | 'bot' | 'staff'
  text: string
  time: string
}

function AdmissionForm({ name, api, onDone }: { name: string; api: string; onDone: (msg: string) => void }) {
  const [form, setForm]     = useState({ name, email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch(`${api}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Admissions Enquiry from ${form.name}`,
          message: `Phone: ${form.phone}\n\n${form.message}`,
        }),
      })
      setStatus('sent')
      onDone(`Thank you ${form.name}! We have received your enquiry and will contact you soon on ${form.email || form.phone}.`)
    } catch {
      setStatus('idle')
    }
  }

  if (status === 'sent') return null

  return (
    <form onSubmit={submit} className="w-full rounded-xl overflow-hidden shadow" style={{ maxWidth: 280, border: '2px solid #82c906' }}>
      <div className="px-3 py-2 text-xs font-bold text-white uppercase tracking-wide" style={{ backgroundColor: '#82c906' }}>
        Admissions Enquiry Form
      </div>
      <div className="bg-white px-3 py-3 space-y-2">
        <input
          required
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none"
          style={{ borderColor: '#e5e7eb' }}
        />
        <input
          required
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none"
        />
        <textarea
          rows={3}
          placeholder="Any questions or details about your child..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none resize-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-2 text-xs font-bold text-white rounded disabled:opacity-60"
          style={{ backgroundColor: '#206802' }}
        >
          {status === 'sending' ? 'Sending...' : 'Submit Enquiry'}
        </button>
      </div>
    </form>
  )
}

export default function ChatWidget() {
  const [open, setOpen]           = useState(false)
  const [started, setStarted]     = useState(false)
  const [name, setName]           = useState('')
  const [input, setInput]         = useState('')
  const [messages, setMessages]   = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sending, setSending]     = useState(false)
  const [greeted, setGreeted]     = useState(false)
  const [restored, setRestored]   = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const [voiceOn, setVoiceOn] = useState(true)

  // Clear all chat state on every page load — fresh start
  useEffect(() => {
    localStorage.removeItem('abofra_chat_open')
    localStorage.removeItem('abofra_chat_messages')
    localStorage.removeItem('abofra_chat_session')
    localStorage.removeItem('abofra_chat_name')
    localStorage.removeItem('abofra_chat_greeted')
    setRestored(true)
  }, [])

  const speak = (text: string) => {
    if (!voiceOn) return
    fetch(`${API}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then(res => {
        if (!res.ok) throw new Error('TTS failed')
        const ct = res.headers.get('content-type') || ''
        if (!ct.includes('audio')) throw new Error('Not audio')
        return res.arrayBuffer()
      })
      .then(buffer => {
        const ctx  = new AudioContext()
        ctx.decodeAudioData(buffer, decoded => {
          const src = ctx.createBufferSource()
          src.buffer = decoded
          src.connect(ctx.destination)
          src.start(0)
        })
      })
      .catch(() => {})
  }

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (!restored) return
    localStorage.setItem('abofra_chat_messages', JSON.stringify(messages))
  }, [messages, restored])

  useEffect(() => { if (sessionId) localStorage.setItem('abofra_chat_session', sessionId) }, [sessionId])
  useEffect(() => { if (name)      localStorage.setItem('abofra_chat_name', name) }, [name])
  useEffect(() => { if (greeted)   localStorage.setItem('abofra_chat_greeted', 'true') }, [greeted])

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Greet when chat opens (effect only sets messages if not yet greeted)
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true)
      const greeting = "Hi! I'm Abofra 😊 What's your name?"
      setMessages([{ from: 'bot', text: greeting, time: new Date().toISOString() }])
    }
  }, [open, greeted])

  // Poll for staff replies every 8 seconds — preserve client-side map messages
  useEffect(() => {
    if (!sessionId) return
    const t = setInterval(async () => {
      const res = await fetch(`${API}/api/chat/${sessionId}/messages`).catch(() => null)
      if (!res?.ok) return
      const data: Message[] = await res.json()
      setMessages(prev => {
        const clientOnly = prev.filter(m => m.text === '__MAP_BUTTON__')
        return [...data, ...clientOnly]
      })
    }, 8000)
    return () => clearInterval(t)
  }, [sessionId])

  const startChat = () => {
    if (!name.trim()) return
    setStarted(true)
    const reply = `Wonderful! Nice to meet you, ${name}! How can I help you today? You can ask me about admissions, fees, curriculum, our location, or anything else.`
    setMessages(prev => [...prev, { from: 'bot', text: reply, time: new Date().toISOString() }])
    speak(`Wonderful! Nice to meet you, ${name}! How can I help you today?`)
  }

  const sendMessage = async () => {
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    const userMsg: Message = { from: 'user', text, time: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])

    const res = await fetch(`${API}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, name, message: text }),
    }).catch(() => null)

    if (res?.ok) {
      const data = await res.json()
      if (!sessionId) setSessionId(data.sessionId)
      const hasMap  = data.reply.includes('[SHOW_MAP]')
      const hasForm = data.reply.includes('[SHOW_ADMISSION_FORM]')
      const cleanReply = data.reply
        .replace('[SHOW_MAP]', '')
        .replace('[SHOW_ADMISSION_FORM]', '')
        .trim()
      setMessages(prev => [...prev, { from: 'bot', text: cleanReply, time: new Date().toISOString() }])
      const spokenText = cleanReply.replace(/\[.*?\]\(.*?\)/g, '').replace(/\n+/g, ' ').trim()
      speak(spokenText)
      if (hasMap) {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: 'bot', text: '__MAP_BUTTON__', time: new Date().toISOString() }])
        }, 1500)
      }
      if (hasForm) {
        setTimeout(() => {
          setMessages(prev => [...prev, { from: 'bot', text: '__ADMISSION_FORM__', time: new Date().toISOString() }])
        }, 1500)
      }
    }
    setSending(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => {
          const opening = !open
          setOpen(opening)
          localStorage.setItem('abofra_chat_open', String(opening))
          if (opening && !greeted) {
            speak("Hi! I'm Abofra! Welcome to Abofra World School. What's your name?")
          }
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ backgroundColor: '#82c906' }}
        aria-label="Chat with us"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col shadow-2xl overflow-hidden"
          style={{ width: 340, height: 560, borderRadius: 8, border: '1px solid #e5e7eb', backgroundColor: '#fff' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center" style={{ border: '2px solid #82c906', backgroundColor: '#111' }}>
              <img src="/logo.png" alt="Abofra" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm leading-none">Abofra</p>
              <p className="text-xs mt-0.5" style={{ color: '#82c906' }}>Abofra World School Assistant</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setVoiceOn(v => !v)}
                className="text-xs font-bold px-2 py-1 rounded"
                style={{ backgroundColor: voiceOn ? '#82c90633' : '#ffffff22', color: voiceOn ? '#82c906' : '#9ca3af' }}
                title={voiceOn ? 'Mute voice' : 'Unmute voice'}
              >
                {voiceOn ? '🔊' : '🔇'}
              </button>
            </div>
          </div>


          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ backgroundColor: '#f9fafb' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.from !== 'user' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mr-2 mt-1" style={{ border: '1px solid #82c906' }}>
                    <img src="/logo.png" alt="Abofra" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                )}
                {m.text === '__ADMISSION_FORM__' ? (
                  <AdmissionForm name={name} api={API} onDone={(msg) => setMessages(prev => [...prev, { from: 'bot', text: msg, time: new Date().toISOString() }])} />
                ) : m.text === '__MAP_BUTTON__' ? (
                  <div style={{ width: '100%', maxWidth: 280 }}>
                    <div style={{ borderRadius: 10, overflow: 'hidden', border: '2px solid #82c906', height: 180 }}>
                      <iframe
                        title="School Location"
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: 'block' }}
                        loading="lazy"
                        src="https://maps.google.com/maps?q=Abofra+World+School,Kumasi,Ghana&output=embed"
                      />
                    </div>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Abofra+World+School,Kumasi,Ghana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-2 py-2 rounded-lg font-bold text-xs w-full"
                      style={{ backgroundColor: '#82c906', color: '#fff', textDecoration: 'none' }}
                    >
                      🗺️ Get Directions
                    </a>
                  </div>
                ) : (
                  <div
                    className="max-w-[75%] px-3 py-2 text-sm leading-snug"
                    style={{
                      borderRadius: m.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      backgroundColor: m.from === 'user' ? '#82c906' : m.from === 'staff' ? '#206802' : '#fff',
                      color: m.from === 'user' ? '#fff' : m.from === 'staff' ? '#fff' : '#1a1a1a',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      border: m.from !== 'user' ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    {m.from === 'staff' && <p className="text-xs font-bold mb-1 opacity-80">Staff</p>}
                    {m.text}
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0" style={{ border: '1px solid #82c906' }}>
                  <img src="/logo.png" alt="Abofra" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 text-gray-400 text-sm" style={{ borderRadius: '12px 12px 12px 2px' }}>
                  typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Name input (before chat starts) */}
          {!started ? (
            <div className="flex gap-2 px-3 py-3 border-t border-gray-100 shrink-0">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && startChat()}
                placeholder="Enter your name..."
                className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                style={{ borderRadius: 6 }}
                autoFocus
              />
              <button
                onClick={startChat}
                className="px-4 py-2 text-sm font-bold text-white shrink-0"
                style={{ backgroundColor: '#82c906', borderRadius: 6 }}
              >
                Go
              </button>
            </div>
          ) : (
            /* Message input (after name entered) */
            <div className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 shrink-0">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 border border-gray-200 px-3 py-2 text-sm focus:outline-none"
                style={{ borderRadius: 6 }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="w-9 h-9 flex items-center justify-center shrink-0 disabled:opacity-40"
                style={{ backgroundColor: '#82c906', borderRadius: 6 }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
