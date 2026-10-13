const express = require('express')
const router  = express.Router()
const https   = require('https')

const ELEVEN_API_KEY  = '63c1d28e1b2f896db53eec8825d0408f'
const ALICE_VOICE_ID  = 'EXAVITQu4vr4xnSDxMaL'  // Bella (free plan)

router.post('/', (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Text required' })

  const body = JSON.stringify({
    text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
  })

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${ALICE_VOICE_ID}`,
    method: 'POST',
    headers: {
      'xi-api-key':     ELEVEN_API_KEY,
      'Content-Type':   'application/json',
      'Accept':         'audio/mpeg',
      'Content-Length': Buffer.byteLength(body),
    },
  }

  const request = https.request(options, (apiRes) => {
    console.log('ElevenLabs status:', apiRes.statusCode)
    if (apiRes.statusCode !== 200) {
      let err = ''
      apiRes.on('data', d => err += d)
      apiRes.on('end', () => {
        console.error('ElevenLabs error:', err)
        res.status(502).json({ error: 'ElevenLabs failed', detail: err })
      })
      return
    }
    res.setHeader('Content-Type', 'audio/mpeg')
    apiRes.pipe(res)
  })

  request.on('error', (e) => {
    console.error('TTS request error:', e.message)
    res.status(500).json({ error: 'TTS request failed' })
  })
  request.write(body)
  request.end()
})

module.exports = router
