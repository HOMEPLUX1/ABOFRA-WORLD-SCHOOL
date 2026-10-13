const express = require('express')
const router  = express.Router()
const fs      = require('fs')
const path    = require('path')

const CHAT_FILE = path.join(__dirname, '../data/chats.json')

function readChats() {
  if (!fs.existsSync(CHAT_FILE)) return []
  return JSON.parse(fs.readFileSync(CHAT_FILE, 'utf-8'))
}
function writeChats(data) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2))
}

// ── AUTO-REPLY RULES ──
const rules = [
  {
    keywords: ['admission', 'enrol', 'enroll', 'apply', 'register', 'join'],
    reply: 'To apply for admission at Abofra World School, please call us on +233 556 592 410 or fill in our enquiry form and we will get in touch with you. [SHOW_ADMISSION_FORM]',
  },
  {
    keywords: ['fee', 'fees', 'cost', 'price', 'tuition', 'payment'],
    reply: 'For information about school fees, please contact our office directly on +233 556 592 410 or email abofraworldschool@gmail.com. Our fees vary by level.',
  },
  {
    keywords: ['term', 'date', 'calendar', 'holiday', 'vacation', 'reopen'],
    reply: 'Term dates and the school calendar are available on our website under the Information section. You can also contact the office for the latest schedule.',
  },
  {
    keywords: ['curriculum', 'ges', 'cambridge', 'subject', 'programme', 'program'],
    reply: 'Abofra World School runs both the Ghana Education Service (G.E.S) national curriculum and the Cambridge International curriculum. Visit our Education section to learn more.',
  },
  {
    keywords: ['location', 'address', 'where', 'find', 'direction', 'map'],
    reply: '📍 We are located at Archbishop Sarpong Road, TUC AK-298-7816, Kumasi, Ghana. You can also call us on +233 556 592 410 for more help. [SHOW_MAP]',
  },
  {
    keywords: ['hour', 'time', 'open', 'close', 'office'],
    reply: 'Our office is open Monday to Friday, 7:30am – 5:00pm. Call us on +233 556 592 410 during office hours.',
  },
  {
    keywords: ['phone', 'call', 'contact', 'email', 'reach', 'number'],
    reply: 'You can reach us by phone on +233 556 592 410 / +233 243 267 237 or by email at abofraworldschool@gmail.com.',
  },
  {
    keywords: ['uniform', 'dress', 'wear', 'cloth'],
    reply: 'We have a school uniform guide available under the Pupil Support section of our website. Contact the office for details.',
  },
  {
    keywords: ['transport', 'bus', 'pickup', 'commute'],
    reply: 'For information about school transport, please contact our office on +233 556 592 410.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
    reply: 'Hello! Welcome to Abofra World School. How can we help you today? You can ask about admissions, fees, curriculum, location, or anything else.',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    reply: 'You are welcome! Is there anything else we can help you with?',
  },
]

const GOODBYE_KEYWORDS = ['bye', 'goodbye', 'good bye', 'see you', 'take care', 'done', 'exit', 'leave', 'close', 'end', 'finish', 'that\'s all', 'thats all', 'no more', 'nothing else']

const GOODBYE_MESSAGES = [
  (name) => `Goodbye ${name}! It was a pleasure chatting with you. We look forward to welcoming you to Abofra World School! 🌟`,
  (name) => `Take care ${name}! Thank you for visiting Abofra World School online. We hope to see you soon! 😊`,
  (name) => `Bye bye ${name}! Have a wonderful day. Don't hesitate to reach out if you need anything. 👋`,
  (name) => `See you soon ${name}! Abofra World School is always here for you. Have a blessed day! 🙏`,
  (name) => `Thank you for stopping by ${name}! We hope we were helpful. Wishing you a great day ahead! ☀️`,
  (name) => `Farewell ${name}! It's been a joy speaking with you. Feel free to come back anytime. 😄`,
  (name) => `All the best ${name}! We're glad you reached out to Abofra World School. Have a lovely day! 🌺`,
  (name) => `Goodbye ${name}! Remember, Abofra World School is just a call away — +233 556 592 410. Take care! 📞`,
]

const CALL_REQUEST_MESSAGES = [
  (name) => `Before you go ${name} — would you like to request a call from Abofra World School? We would love to speak with you! 📞`,
  (name) => `${name}, before you leave — can we give you a call to answer any questions you may have? 😊`,
  (name) => `Wait ${name}! Would you like one of our team members to call you back? Just say yes! 📲`,
  (name) => `${name}, we'd love to follow up with you personally. Would you like us to give you a call? 🌟`,
  (name) => `Before you go ${name} — our team would be happy to call you directly. Shall we? 📞`,
]

function randomGoodbye(name) {
  return GOODBYE_MESSAGES[Math.floor(Math.random() * GOODBYE_MESSAGES.length)](name)
}
function randomCallRequest(name) {
  return CALL_REQUEST_MESSAGES[Math.floor(Math.random() * CALL_REQUEST_MESSAGES.length)](name)
}

function isGoodbye(message) {
  const lower = message.toLowerCase()
  return GOODBYE_KEYWORDS.some(k => lower.includes(k))
}

function autoReply(message) {
  const lower = message.toLowerCase()
  for (const rule of rules) {
    if (rule.keywords.some(k => lower.includes(k))) {
      return rule.reply
    }
  }
  return null
}

// POST /api/chat — start or continue a session
router.post('/', (req, res) => {
  const { sessionId, name, message } = req.body
  if (!message) return res.status(400).json({ error: 'Message is required' })

  const chats = readChats()
  let session = chats.find(c => c.id === sessionId)

  if (!session) {
    session = {
      id: Date.now().toString(),
      name: name || 'Visitor',
      startedAt: new Date().toISOString(),
      status: 'open',
      flow: null,
      messages: [],
    }
    chats.unshift(session)
  }

  // Add user message
  session.messages.push({
    from: 'user',
    text: message,
    time: new Date().toISOString(),
  })

  let botReply = null
  const lower = message.toLowerCase()

  // ── FLOW: awaiting contact info after user said yes ──
  if (session.flow === 'awaiting_contact') {
    session.flow = null
    session.callRequest = message
    session.status = 'call_requested'
    botReply = {
      from: 'bot',
      text: `Thank you ${session.name}! We have your details and will be in touch with you soon. Have a wonderful day! 😊`,
      time: new Date().toISOString(),
    }
    session.messages.push(botReply)
    writeChats(chats)
    return res.json({ sessionId: session.id, reply: botReply.text })
  }

  // ── FLOW: awaiting yes/no to call request ──
  if (session.flow === 'awaiting_call_answer') {
    // If they typed a number or email directly, treat it as contact info
    const looksLikeContact = /\d{7,}/.test(message) || message.includes('@')
    if (looksLikeContact) {
      session.flow = null
      session.callRequest = message
      session.status = 'call_requested'
      botReply = {
        from: 'bot',
        text: 'Thank you ' + session.name + '! We have your details and will be in touch with you soon. Have a wonderful day! 😊',
        time: new Date().toISOString(),
      }
    } else if (lower.includes('yes') || lower.includes('yeah') || lower.includes('sure') || lower.includes('ok') || lower.includes('please')) {
      session.flow = 'awaiting_contact'
      botReply = {
        from: 'bot',
        text: 'Great! Please share your phone number or email address and we will contact you shortly. 📞',
        time: new Date().toISOString(),
      }
    } else {
      session.flow = null
      botReply = {
        from: 'bot',
        text: 'No problem! Thank you for visiting Abofra World School. Have a wonderful day! 😊',
        time: new Date().toISOString(),
      }
    }
    session.messages.push(botReply)
    writeChats(chats)
    return res.json({ sessionId: session.id, reply: botReply.text })
  }

  // ── GOODBYE DETECTION ──
  if (isGoodbye(message)) {
    // Already left contact — just say goodbye, don't ask again
    if (session.callRequest) {
      botReply = {
        from: 'bot',
        text: randomGoodbye(session.name),
        time: new Date().toISOString(),
      }
      session.messages.push(botReply)
      writeChats(chats)
      return res.json({ sessionId: session.id, reply: botReply.text })
    }
    session.flow = 'awaiting_call_answer'
    botReply = {
      from: 'bot',
      text: randomCallRequest(session.name),
      time: new Date().toISOString(),
    }
    session.messages.push(botReply)
    writeChats(chats)
    return res.json({ sessionId: session.id, reply: botReply.text })
  }

  // ── NORMAL AUTO-REPLY ──
  const botText = autoReply(message)
  if (botText) {
    botReply = { from: 'bot', text: botText, time: new Date().toISOString() }
    session.messages.push(botReply)
  } else {
    if (session.status !== 'call_requested') session.status = 'pending'
    botReply = {
      from: 'bot',
      text: 'Thank you for your message. Our team will get back to you shortly. You can also call us on +233 556 592 410.',
      time: new Date().toISOString(),
    }
    session.messages.push(botReply)
  }

  writeChats(chats)
  res.json({ sessionId: session.id, reply: botReply.text })
})

// GET /api/chat — admin: all sessions (excluding soft-deleted)
router.get('/', (req, res) => {
  res.json(readChats().filter(c => !c.deleted))
})

// POST /api/chat/:id/reply — admin staff reply
router.post('/:id/reply', (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Reply text required' })

  const chats = readChats()
  const session = chats.find(c => c.id === req.params.id)
  if (!session) return res.status(404).json({ error: 'Session not found' })

  session.messages.push({ from: 'staff', text, time: new Date().toISOString() })
  session.status = 'replied'
  writeChats(chats)
  res.json({ success: true })
})

// DELETE /api/chat/:id — soft delete (moves to trash)
router.delete('/:id', (req, res) => {
  const chats = readChats()
  const session = chats.find(c => c.id === req.params.id)
  if (!session) return res.status(404).json({ error: 'Not found' })
  session.deleted = true
  session.deletedAt = new Date().toISOString()
  writeChats(chats)
  res.json({ success: true, id: req.params.id })
})

// POST /api/chat/:id/restore — undo delete
router.post('/:id/restore', (req, res) => {
  const chats = readChats()
  const session = chats.find(c => c.id === req.params.id)
  if (!session) return res.status(404).json({ error: 'Not found' })
  delete session.deleted
  delete session.deletedAt
  writeChats(chats)
  res.json({ success: true })
})

// DELETE /api/chat/:id/permanent — permanent delete
router.delete('/:id/permanent', (req, res) => {
  const chats = readChats()
  const filtered = chats.filter(c => c.id !== req.params.id)
  if (filtered.length === chats.length) return res.status(404).json({ error: 'Not found' })
  writeChats(filtered)
  res.json({ success: true })
})

// GET /api/chat/:id/messages — frontend polls for staff replies
router.get('/:id/messages', (req, res) => {
  const chats = readChats()
  const session = chats.find(c => c.id === req.params.id)
  if (!session) return res.status(404).json({ error: 'Not found' })
  res.json(session.messages)
})

module.exports = router
