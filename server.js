import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// ── Firebase Admin ──
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8')
)
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// ── Config ──
const BOT_TOKEN  = process.env.BOT_TOKEN          // নতুন App এর আলাদা Bot Token
const ADMIN_ID   = process.env.ADMIN_TELEGRAM_ID  // আপনার Telegram ID
const WH_SECRET  = process.env.WEBHOOK_SECRET || 'masterai2024secure'
const BASE_URL   = process.env.RENDER_EXTERNAL_URL || 'http://localhost:5000'

// ── নতুন App এর Collection নাম ──
const USERS_COL    = 'master_users'
const PAYMENTS_COL = 'master_payments'

const app = express()
app.use(cors())
app.use(express.json())

// ── Telegram API helper ──
const tgAPI = async (method, body) => {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  return res.json()
}

// ── Health check ──
app.get('/', (_, res) => res.send('✅ Master AI Backend Online'))

// ── Payment Notification ──
app.post('/api/notify-payment', async (req, res) => {
  try {
    const { userId, name, username, phone, method, amount, txId } = req.body
    if (!userId || !txId) return res.status(400).json({ ok: false })

    const msg =
      `💳 <b>নতুন পেমেন্ট — Master AI</b>\n\n` +
      `👤 নাম: <b>${name}</b>\n` +
      `🆔 TG ID: <code>${userId}</code>\n` +
      (username ? `📎 @${username}\n` : '') +
      `📱 ফোন: <code>${phone}</code>\n` +
      `💰 পরিমাণ: <b>৳${amount}</b>\n` +
      `📲 মেথড: <b>${method}</b>\n` +
      `🔑 TrxID: <code>${txId}</code>\n` +
      `🗂️ Collection: <code>${USERS_COL}</code>`

    await tgAPI('sendMessage', {
      chat_id: ADMIN_ID,
      text:    msg,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ এপ্রুভ (৩০ দিন)', callback_data: `confirm:${userId}:${txId}` },
            { text: '❌ রিজেক্ট',          callback_data: `reject:${userId}:${txId}` },
          ],
          [
            { text: '👥 Active Users', callback_data: 'check_users' },
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

  // ── CONFIRM ──
  if (data.startsWith('confirm:')) {
    const [, userId, txId] = data.split(':')
    try {
      const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000)

      // master_users collection এ save
      await db.collection(USERS_COL).doc(userId).set({
        status:     'approved',
        expiresAt,
        approvedAt: FieldValue.serverTimestamp(),
        lastTxId:   txId,
        name:       cb.message.text.match(/নাম: (.+)/)?.[1] || '',
      }, { merge: true })

      // master_payments collection আপডেট
      await db.collection(PAYMENTS_COL).doc(txId).update({ status: 'approved' })

      await ack('✅ এপ্রুভ সফল!')
      await editBtn('✅ এপ্রুভ হয়েছে')

      // ইউজারকে জানাও
      await tgAPI('sendMessage', {
        chat_id: userId,
        text:
          `✅ <b>পেমেন্ট কনফার্ম!</b>\n\n` +
          `Master AI সাবস্ক্রিপশন সক্রিয় হয়েছে 🎉\n` +
          `মেয়াদ: ${expiresAt.toLocaleDateString('bn-BD')} পর্যন্ত\n\n` +
          `Bot খুলুন এবং ট্রেডিং শুরু করুন! 💹`,
        parse_mode: 'HTML',
      }).catch(() => {})

    } catch (e) {
      await ack('❌ Error: ' + e.message)
    }

  // ── REJECT ──
  } else if (data.startsWith('reject:')) {
    const [, userId, txId] = data.split(':')
    try {
      await db.collection(PAYMENTS_COL).doc(txId).update({ status: 'rejected' })
      await db.collection(USERS_COL).doc(userId).set({ status: 'rejected' }, { merge: true })

      await ack('❌ রিজেক্ট হয়েছে')
      await editBtn('❌ রিজেক্ট হয়েছে')

      await tgAPI('sendMessage', {
        chat_id: userId,
        text:
          `❌ <b>পেমেন্ট রিজেক্ট</b>\n\n` +
          `সঠিক TrxID দিয়ে আবার পেমেন্ট করুন।\n` +
          `সাপোর্ট: @ratulhossain56`,
        parse_mode: 'HTML',
      }).catch(() => {})

    } catch (_) { await ack('❌ Error') }

  // ── CHECK USERS ──
  } else if (data === 'check_users') {
    try {
      const snap = await db.collection(USERS_COL)
        .where('status', '==', 'approved')
        .get()

      if (snap.empty) {
        await ack('কোনো active user নেই')
        return
      }

      const users = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      await ack(`${users.length} জন active`)

      const lines = users.map(u => {
        const exp = u.expiresAt?.toDate?.()?.toLocaleDateString('bn-BD') || 'N/A'
        return `👤 <b>${u.name || 'N/A'}</b> | <code>${u.id}</code> | ${exp}`
      }).join('\n')

      const keyboard = users.map(u => ([
        {
          text: `🔴 Disconnect: ${(u.name || u.id).slice(0, 18)}`,
          callback_data: `disconnect:${u.id}`,
        },
      ]))

      await tgAPI('sendMessage', {
        chat_id: chatId,
        text: `👥 <b>Master AI Active Users (${users.length} জন)</b>\n\n${lines}`,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard },
      })

    } catch (e) { await ack('❌ Error: ' + e.message) }

  // ── DISCONNECT ──
  } else if (data.startsWith('disconnect:')) {
    const [, userId] = data.split(':')
    try {
      await db.collection(USERS_COL).doc(userId).update({
        status:    'disconnected',
        expiresAt: new Date(0),
      })

      await ack('🔴 Disconnect সফল!')

      await tgAPI('sendMessage', {
        chat_id: userId,
        text:
          `⚠️ <b>সাবস্ক্রিপশন শেষ</b>\n\n` +
          `আপনার Master AI অ্যাক্সেস বন্ধ করা হয়েছে।\n` +
          `পুনরায় পেমেন্ট করলে অ্যাক্সেস পাবেন।`,
        parse_mode: 'HTML',
      }).catch(() => {})

    } catch (_) { await ack('❌ Error') }

  } else if (data === 'done' || data === 'noop') {
    await ack('OK')
  }
})

// ── Server Start + Webhook Register ──
const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`✅ Master AI Server running on port ${PORT}`)
  if (process.env.NODE_ENV === 'production' && BOT_TOKEN) {
    const r = await tgAPI('setWebhook', {
      url: `${BASE_URL}/webhook/${WH_SECRET}`,
    })
    console.log('Webhook registered:', r.description)
  }
})
