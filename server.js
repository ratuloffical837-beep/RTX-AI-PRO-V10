import express  from 'express'
import cors     from 'cors'
import fetch    from 'node-fetch'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// ── Firebase Admin ──
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
)
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// ── Config ──
const BOT_TOKEN = process.env.BOT_TOKEN
const ADMIN_ID  = process.env.ADMIN_TELEGRAM_ID

// ✅ FIX: Webhook secret hardcode সরানো হয়েছে
if (!process.env.WEBHOOK_SECRET) {
  console.error('❌ WEBHOOK_SECRET env variable is required!')
  process.exit(1)
}
const WH_SECRET = process.env.WEBHOOK_SECRET
const BASE_URL  = process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000'

const USERS_COL    = 'master_users'
const PAYMENTS_COL = 'master_payments'

const app = express()
app.use(cors())
app.use(express.json())

// ── Telegram API Helper ──
const tgAPI = async (method, body) => {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/${method}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    }
  )
  return res.json()
}

// ── Health Check ──
app.get('/', (_, res) => res.send('✅ Master AI Backend Online'))

// ── Payment Notification ──
app.post('/api/notify-payment', async (req, res) => {
  try {
    const {
      userId, name, username, phone,
      method, amount, txId,
      // ✅ FIX: Dynamic collection names receive করা হচ্ছে
      usersCollection, paymentsCollection
    } = req.body

    if (!userId || !txId) return res.status(400).json({ ok: false, msg: 'Missing fields' })

    // ✅ Dynamic collection নাম ব্যবহার করা হচ্ছে
    const targetUsersCol    = usersCollection    || USERS_COL
    const targetPaymentsCol = paymentsCollection || PAYMENTS_COL

    const msg =
      `💳 <b>নতুন পেমেন্ট — Master AI</b>\n\n` +
      `👤 নাম: <b>${name || 'N/A'}</b>\n` +
      `🆔 TG ID: <code>${userId}</code>\n` +
      (username ? `📎 @${username}\n` : '') +
      `📱 ফোন: <code>${phone}</code>\n` +
      `💰 পরিমাণ: <b>৳${amount}</b>\n` +
      `📲 মেথড: <b>${method}</b>\n` +
      `🔑 TrxID: <code>${txId}</code>\n` +
      `🗂️ Collection: <code>${targetUsersCol}</code>`

    await tgAPI('sendMessage', {
      chat_id:    ADMIN_ID,
      text:       msg,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ এপ্রুভ (৩০ দিন)', callback_data: `ok:${userId}:${txId}` },
            { text: '❌ রিজেক্ট',          callback_data: `no:${userId}:${txId}` },
          ],
          [
            { text: '👥 Active Users', callback_data: 'users' },
          ],
        ],
      },
    })

    res.json({ ok: true })
  } catch (e) {
    console.error('notify-payment error:', e)
    res.status(500).json({ ok: false })
  }
})

// ── Telegram Webhook ──
app.post(`/webhook/${WH_SECRET}`, async (req, res) => {
  res.sendStatus(200)

  const update = req.body
  if (!update.callback_query) return

  const cb     = update.callback_query
  const data   = cb.data
  const chatId = cb.message.chat.id
  const msgId  = cb.message.message_id

  const ack     = (text) => tgAPI('answerCallbackQuery', { callback_query_id: cb.id, text })
  const editBtn = (label) => tgAPI('editMessageReplyMarkup', {
    chat_id: chatId, message_id: msgId,
    reply_markup: { inline_keyboard: [[{ text: label, callback_data: 'done' }]] },
  })

  // ── CONFIRM (ok:userId:txId) ──
  if (data.startsWith('ok:')) {
    const parts  = data.split(':')
    const userId = parts[1]
    const txId   = parts[2]

    try {
      // ✅ FIX: UTC+6 Bangladesh timezone
      const now       = new Date()
      const bdOffset  = 6 * 60 * 60 * 1000
      const expiresAt = new Date(now.getTime() + 30 * 24 * 3600 * 1000)

      // ✅ FIX: Regex সঠিক করা হয়েছে — HTML থেকে নাম বের করা
      const rawText   = cb.message.text || ''
      const nameMatch = rawText.match(/নাম: (.+)/) || rawText.match(/👤 নাম: (.+)/)
      const userName  = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : ''

      await db.collection(USERS_COL).doc(userId).set({
        status:     'approved',
        expiresAt,
        approvedAt: FieldValue.serverTimestamp(),
        lastTxId:   txId,
        name:       userName,
      }, { merge: true })

      await db.collection(PAYMENTS_COL).doc(txId).update({ status: 'approved' })

      await ack('✅ এপ্রুভ সফল!')
      await editBtn('✅ এপ্রুভ হয়েছে')

      // ✅ FIX: BD timezone দিয়ে date format
      const expBD = new Date(expiresAt.getTime())
      const expStr = expBD.toLocaleDateString('bn-BD', { timeZone: 'Asia/Dhaka' })

      await tgAPI('sendMessage', {
        chat_id:    userId,
        text:
          `✅ <b>পেমেন্ট কনফার্ম!</b>\n\n` +
          `Master AI সাবস্ক্রিপশন সক্রিয় হয়েছে 🎉\n` +
          `মেয়াদ: <b>${expStr}</b> পর্যন্ত\n\n` +
          `Bot খুলুন এবং ট্রেডিং শুরু করুন! 💹`,
        parse_mode: 'HTML',
      }).catch(() => {})

    } catch (e) {
      await ack('❌ Error: ' + e.message)
    }

  // ── REJECT (no:userId:txId) ──
  } else if (data.startsWith('no:')) {
    const parts  = data.split(':')
    const userId = parts[1]
    const txId   = parts[2]

    try {
      await db.collection(PAYMENTS_COL).doc(txId).update({ status: 'rejected' })
      await db.collection(USERS_COL).doc(userId).set({ status: 'rejected' }, { merge: true })

      await ack('❌ রিজেক্ট হয়েছে')
      await editBtn('❌ রিজেক্ট হয়েছে')

      await tgAPI('sendMessage', {
        chat_id:    userId,
        text:
          `❌ <b>পেমেন্ট রিজেক্ট</b>\n\n` +
          `সঠিক TrxID দিয়ে আবার পেমেন্ট করুন।\n` +
          `সাপোর্ট: @ratulhossain56`,
        parse_mode: 'HTML',
      }).catch(() => {})

    } catch (_) { await ack('❌ Error') }

  // ── CHECK USERS ──
  } else if (data === 'users') {
    try {
      const snap = await db.collection(USERS_COL)
        .where('status', '==', 'approved')
        .get()

      if (snap.empty) { await ack('কোনো active user নেই'); return }

      const users = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      await ack(`${users.length} জন active`)

      const lines = users.map(u => {
        const exp = u.expiresAt?.toDate?.()?.toLocaleDateString('bn-BD', { timeZone: 'Asia/Dhaka' }) || 'N/A'
        return `👤 <b>${u.name || 'N/A'}</b> | <code>${u.id}</code> | ${exp}`
      }).join('\n')

      // ✅ FIX: callback_data সংক্ষিপ্ত রাখা হয়েছে (64 byte limit)
      const keyboard = users.map(u => ([{
        text:          `🔴 ${(u.name || u.id).slice(0, 15)}`,
        callback_data: `dis:${u.id}`,  // ✅ 'disconnect:' → 'dis:' (সংক্ষিপ্ত)
      }]))

      await tgAPI('sendMessage', {
        chat_id:    chatId,
        text:       `👥 <b>Master AI Active Users (${users.length} জন)</b>\n\n${lines}`,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard },
      })

    } catch (e) { await ack('❌ Error: ' + e.message) }

  // ── DISCONNECT ──
  } else if (data.startsWith('dis:')) {
    const userId = data.split(':')[1]
    try {
      await db.collection(USERS_COL).doc(userId).update({
        status:    'disconnected',
        expiresAt: new Date(0),
      })

      await ack('🔴 Disconnect সফল!')

      await tgAPI('sendMessage', {
        chat_id:    userId,
        text:
          `⚠️ <b>সাবস্ক্রিপশন শেষ</b>\n\n` +
          `আপনার Master AI অ্যাক্সেস বন্ধ করা হয়েছে।\n` +
          `পুনরায় পেমেন্ট করলে অ্যাক্সেস পাবেন।`,
        parse_mode: 'HTML',
      }).catch(() => {})

    } catch (_) { await ack('❌ Error') }

  } else if (data === 'done') {
    await ack('OK')
  }
})

// ── Server Start + Webhook Register ──
const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`✅ Master AI Server running on port ${PORT}`)
  if (process.env.NODE_ENV === 'production' && BOT_TOKEN && BASE_URL !== 'http://localhost:5000') {
    const r = await tgAPI('setWebhook', {
      url: `${BASE_URL}/webhook/${WH_SECRET}`,
    })
    console.log('Webhook registered:', r.description)
  }
})
