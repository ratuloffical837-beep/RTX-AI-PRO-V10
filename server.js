import express  from 'express'
import cors     from 'cors'
import fetch    from 'node-fetch'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// ══════════════════════════════════════════════
//   MASTER AI BACKEND v4.1 — Production Ready
//   All Bugs Fixed + Cache + CORS + Keep-Alive
// ══════════════════════════════════════════════

// ── Firebase Admin ──
let db
try {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
  )
  initializeApp({ credential: cert(serviceAccount) })
  db = getFirestore()
  console.log('✅ Firebase Admin initialized')
} catch (e) {
  console.error('❌ Firebase init error:', e.message)
  process.exit(1)
}

// ── Config ──
const BOT_TOKEN    = process.env.BOT_TOKEN
const ADMIN_ID     = process.env.ADMIN_TELEGRAM_ID
const USERS_COL    = 'master_users'
const PAYMENTS_COL = 'master_payments'

if (!process.env.WEBHOOK_SECRET) {
  console.error('❌ WEBHOOK_SECRET missing!')
  process.exit(1)
}
const WH_SECRET = process.env.WEBHOOK_SECRET
const BASE_URL  = process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000'

// ── CORS — নির্দিষ্ট Domain ──
const allowedOrigins = [
  'https://rtx-ai-pro-v10-1.onrender.com',
  'https://rtx-ai-pro-v10.onrender.com',
  'http://localhost:5173',
  'http://localhost:4173',
]

const app = express()
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS blocked'))
    }
  },
  credentials: true,
}))
app.use(express.json())

// ══════════════════════════════════════════════
//   IN-MEMORY CACHE — Rate Limit Protection
// ══════════════════════════════════════════════
const cache = new Map()
const CACHE_TTL = 30 * 1000 // ৩০ সেকেন্ড cache

const getCache = (key) => {
  const item = cache.get(key)
  if (!item) return null
  if (Date.now() - item.time > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return item.data
}

const setCache = (key, data) => {
  cache.set(key, { data, time: Date.now() })
  // Cache size limit
  if (cache.size > 200) {
    const firstKey = cache.keys().next().value
    cache.delete(firstKey)
  }
}

// ── Telegram API Helper ──
const tgAPI = async (method, body) => {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      }
    )
    return res.json()
  } catch (e) {
    console.error('tgAPI error:', e.message)
    return { ok: false }
  }
}

// ── Health Check ──
app.get('/', (_, res) => res.send('✅ Master AI Backend v4.1 Online'))

// ══════════════════════════════════════════════
//   FINNHUB PROXY — With Cache
//   User এর API Key Header এ আসবে
// ══════════════════════════════════════════════
app.get('/api/market-data', async (req, res) => {
  try {
    const apiKey = req.headers['x-finnhub-key']
    if (!apiKey) {
      return res.status(400).json({ ok: false, msg: 'API Key required', candles: [] })
    }

    const { symbol, resolution, from, to } = req.query
    if (!symbol || !resolution || !from || !to) {
      return res.status(400).json({ ok: false, msg: 'Missing params', candles: [] })
    }

    // Cache check
    const cacheKey = `${symbol}_${resolution}_${Math.floor(Number(from)/300)}`
    const cached   = getCache(cacheKey)
    if (cached) {
      return res.json({ ok: true, candles: cached, cached: true })
    }

    const url = `https://finnhub.io/api/v1/forex/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`

    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 12000)

    let response
    try {
      response = await fetch(url, { signal: controller.signal })
    } catch (e) {
      clearTimeout(timeout)
      if (e.name === 'AbortError') {
        return res.status(504).json({ ok: false, msg: 'Timeout', candles: [] })
      }
      return res.status(502).json({ ok: false, msg: 'Connection failed', candles: [] })
    }
    clearTimeout(timeout)

    if (response.status === 401) {
      return res.status(401).json({ ok: false, msg: 'Invalid API Key ❌', candles: [] })
    }
    if (response.status === 429) {
      return res.status(429).json({ ok: false, msg: 'Rate Limit ⏳ — ৬০ সেকেন্ড অপেক্ষা করুন', candles: [] })
    }
    if (!response.ok) {
      return res.status(response.status).json({ ok: false, msg: `Finnhub error ${response.status}`, candles: [] })
    }

    let data
    try {
      data = await response.json()
    } catch {
      return res.status(502).json({ ok: false, msg: 'Invalid response', candles: [] })
    }

    if (data.s === 'no_data' || !data.t || !data.o || !data.h || !data.l || !data.c) {
      return res.json({ ok: false, msg: 'no_data', candles: [] })
    }

    const candles = data.t.map((time, i) => ({
      open:   String(data.o[i]),
      high:   String(data.h[i]),
      low:    String(data.l[i]),
      close:  String(data.c[i]),
      volume: data.v ? (data.v[i] || 0) : 0,
      epoch:  time,
    }))

    // Cache save
    setCache(cacheKey, candles)

    res.json({ ok: true, candles, count: candles.length })

  } catch (e) {
    console.error('market-data error:', e.message)
    res.status(500).json({ ok: false, msg: 'Server error', candles: [] })
  }
})

// ── Live Quote ──
app.get('/api/quote', async (req, res) => {
  try {
    const apiKey = req.headers['x-finnhub-key']
    if (!apiKey) return res.status(400).json({ ok: false, price: null })

    const { symbol } = req.query
    if (!symbol) return res.status(400).json({ ok: false, price: null })

    // Cache check
    const cacheKey = `quote_${symbol}`
    const cached   = getCache(cacheKey)
    if (cached) return res.json({ ok: true, ...cached, cached: true })

    const now  = Math.floor(Date.now() / 1000)
    const from = now - 600
    const url  = `https://finnhub.io/api/v1/forex/candle?symbol=${encodeURIComponent(symbol)}&resolution=1&from=${from}&to=${now}&token=${apiKey}`

    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 8000)

    let response
    try {
      response = await fetch(url, { signal: controller.signal })
    } catch {
      clearTimeout(timeout)
      return res.json({ ok: false, price: null })
    }
    clearTimeout(timeout)

    if (!response.ok) return res.json({ ok: false, price: null })

    let data
    try { data = await response.json() } catch { return res.json({ ok: false, price: null }) }

    if (!data.c || data.c.length === 0) return res.json({ ok: false, price: null })

    const price     = data.c[data.c.length - 1]
    const prevPrice = data.c.length > 1 ? data.c[data.c.length - 2] : price
    const change    = price - prevPrice
    const changePct = prevPrice !== 0 ? (change / prevPrice) * 100 : 0

    const result = {
      price:     parseFloat(price.toFixed(6)),
      change:    parseFloat(change.toFixed(6)),
      changePct: parseFloat(changePct.toFixed(4)),
    }

    setCache(cacheKey, result)
    res.json({ ok: true, ...result })

  } catch (e) {
    console.error('quote error:', e.message)
    res.json({ ok: false, price: null })
  }
})

// ══════════════════════════════════════════════
//   KEEP-ALIVE — Render Sleep Prevention
// ══════════════════════════════════════════════
if (process.env.RENDER_EXTERNAL_URL && process.env.NODE_ENV === 'production') {
  setInterval(async () => {
    try {
      await fetch(`${process.env.RENDER_EXTERNAL_URL}/`)
      console.log('🔄 Keep-alive ping OK')
    } catch (e) {
      console.error('Keep-alive error:', e.message)
    }
  }, 13 * 60 * 1000)
}

// ══════════════════════════════════════════════
//   PAYMENT NOTIFICATION
// ══════════════════════════════════════════════
app.post('/api/notify-payment', async (req, res) => {
  try {
    const { userId, name, username, phone, method, amount, txId, usersCollection, paymentsCollection } = req.body

    if (!userId || !txId) {
      return res.status(400).json({ ok: false, msg: 'Missing fields' })
    }

    const targetUsersCol    = usersCollection    || USERS_COL
    const targetPaymentsCol = paymentsCollection || PAYMENTS_COL

    const msg =
      `💳 <b>নতুন পেমেন্ট — Master AI</b>\n\n` +
      `👤 নাম: <b>${name || 'N/A'}</b>\n` +
      `🆔 TG ID: <code>${userId}</code>\n` +
      (username ? `📎 @${username}\n` : '') +
      `📱 ফোন: <code>${phone || 'N/A'}</code>\n` +
      `💰 পরিমাণ: <b>৳${amount}</b>\n` +
      `📲 মেথড: <b>${method}</b>\n` +
      `🔑 TrxID: <code>${txId}</code>`

    await tgAPI('sendMessage', {
      chat_id:    ADMIN_ID,
      text:       msg,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ এপ্রুভ (৩০ দিন)', callback_data: `ok:${userId}:${txId}:${encodeURIComponent(name||'')}` },
            { text: '❌ রিজেক্ট',          callback_data: `no:${userId}:${txId}` },
          ],
          [{ text: '👥 Active Users', callback_data: 'users' }],
        ],
      },
    })

    res.json({ ok: true })
  } catch (e) {
    console.error('notify-payment error:', e.message)
    res.status(500).json({ ok: false, msg: e.message })
  }
})

// ══════════════════════════════════════════════
//   TELEGRAM WEBHOOK
// ══════════════════════════════════════════════
app.post(`/webhook/${WH_SECRET}`, async (req, res) => {
  res.sendStatus(200)

  try {
    const update = req.body
    if (!update?.callback_query) return

    const cb     = update.callback_query
    const data   = cb.data || ''
    const chatId = cb.message?.chat?.id
    const msgId  = cb.message?.message_id

    if (!chatId) return

    const ack     = (text) => tgAPI('answerCallbackQuery', { callback_query_id: cb.id, text: String(text).substring(0, 200) })
    const editBtn = (label) => tgAPI('editMessageReplyMarkup', {
      chat_id: chatId, message_id: msgId,
      reply_markup: { inline_keyboard: [[{ text: label, callback_data: 'done' }]] },
    })

    // ── APPROVE ──
    if (data.startsWith('ok:')) {
      const parts  = data.split(':')
      const userId = parts[1]
      const txId   = parts[2]
      // Name সরাসরি callback_data থেকে নেওয়া হচ্ছে (Regex dependency বাদ)
      const userName = parts[3] ? decodeURIComponent(parts[3]) : ''

      if (!userId || !txId) { await ack('❌ Invalid'); return }

      try {
        const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000)

        await db.collection(USERS_COL).doc(userId).set({
          status:     'approved',
          expiresAt,
          approvedAt: FieldValue.serverTimestamp(),
          lastTxId:   txId,
          name:       userName,
        }, { merge: true })

        // Payment update — error ignore করব
        await db.collection(PAYMENTS_COL).doc(txId).update({ status: 'approved' }).catch(() => {})

        await ack('✅ এপ্রুভ সফল!')
        await editBtn('✅ এপ্রুভ হয়েছে')

        const expStr = expiresAt.toLocaleDateString('bn-BD', { timeZone: 'Asia/Dhaka' })
        await tgAPI('sendMessage', {
          chat_id:    userId,
          text:       `✅ <b>পেমেন্ট কনফার্ম!</b>\n\nMaster AI সাবস্ক্রিপশন সক্রিয় হয়েছে 🎉\nমেয়াদ: <b>${expStr}</b> পর্যন্ত\n\nBot খুলুন এবং ট্রেডিং শুরু করুন! 💹`,
          parse_mode: 'HTML',
        }).catch(() => {})

      } catch (e) {
        console.error('Approve error:', e.message)
        await ack('❌ Error: ' + e.message.substring(0, 100))
      }

    // ── REJECT ──
    } else if (data.startsWith('no:')) {
      const parts  = data.split(':')
      const userId = parts[1]
      const txId   = parts[2]
      if (!userId || !txId) { await ack('❌ Invalid'); return }

      try {
        await db.collection(PAYMENTS_COL).doc(txId).update({ status: 'rejected' }).catch(() => {})
        await db.collection(USERS_COL).doc(userId).set({ status: 'rejected' }, { merge: true })
        await ack('❌ রিজেক্ট হয়েছে')
        await editBtn('❌ রিজেক্ট হয়েছে')
        await tgAPI('sendMessage', {
          chat_id:    userId,
          text:       `❌ <b>পেমেন্ট রিজেক্ট</b>\n\nসঠিক TrxID দিয়ে আবার পেমেন্ট করুন।\nসাপোর্ট: @ratulhossain56`,
          parse_mode: 'HTML',
        }).catch(() => {})
      } catch (e) {
        await ack('❌ Error')
      }

    // ── USERS ──
    } else if (data === 'users') {
      try {
        const snap = await db.collection(USERS_COL).where('status', '==', 'approved').get()
        if (snap.empty) { await ack('কোনো active user নেই'); return }

        const users = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        await ack(`${users.length} জন active`)

        const lines = users.slice(0, 30).map(u => {
          const exp = u.expiresAt?.toDate?.()?.toLocaleDateString('bn-BD', { timeZone: 'Asia/Dhaka' }) || 'N/A'
          return `👤 <b>${u.name || 'N/A'}</b> | <code>${u.id}</code> | ${exp}`
        }).join('\n')

        const keyboard = users.slice(0, 20).map(u => ([{
          text:          `🔴 ${(u.name || u.id).slice(0, 15)}`,
          callback_data: `dis:${u.id}`,
        }]))

        await tgAPI('sendMessage', {
          chat_id:      chatId,
          text:         `👥 <b>Active Users (${users.length})</b>\n\n${lines}`,
          parse_mode:   'HTML',
          reply_markup: { inline_keyboard: keyboard },
        })
      } catch (e) {
        await ack('❌ Error')
      }

    // ── DISCONNECT ──
    } else if (data.startsWith('dis:')) {
      const userId = data.split(':')[1]
      if (!userId) { await ack('❌ Invalid'); return }
      try {
        await db.collection(USERS_COL).doc(userId).update({
          status: 'disconnected', expiresAt: new Date(0),
        })
        await ack('🔴 Disconnect সফল!')
        await tgAPI('sendMessage', {
          chat_id:    userId,
          text:       `⚠️ <b>সাবস্ক্রিপশন শেষ</b>\n\nআপনার অ্যাক্সেস বন্ধ করা হয়েছে।\nপুনরায় পেমেন্ট করলে অ্যাক্সেস পাবেন।`,
          parse_mode: 'HTML',
        }).catch(() => {})
      } catch { await ack('❌ Error') }

    } else if (data === 'done') {
      await ack('OK')
    }

  } catch (e) {
    console.error('Webhook error:', e.message)
  }
})

// ── Server Start ──
const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`✅ Master AI Server v4.1 running on port ${PORT}`)
  if (process.env.NODE_ENV === 'production' && BOT_TOKEN) {
    try {
      const r = await tgAPI('setWebhook', { url: `${BASE_URL}/webhook/${WH_SECRET}` })
      console.log('Webhook:', r.description || r.result)
    } catch (e) {
      console.error('Webhook register error:', e.message)
    }
  }
})
