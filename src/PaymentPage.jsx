import { useState } from 'react'
import { db } from './firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const BKASH_NUMBER   = '01725218874'
const NAGAD_NUMBER   = '01725218874'
const SUPPORT_LINK   = 'https://t.me/ratulhossain56'
const GROUP_LINK     = 'https://t.me/ratulhossain424'
const CHANNEL_LINK   = 'https://t.me/ratulhossain4241'
const MONTHLY_AMOUNT = 3000
const BACKEND_URL    = import.meta.env.VITE_BACKEND_URL || 'https://qx-mashaallha.onrender.com'

const C = {
  bg: '#0b0e11', card: '#141820', panel: '#1a1f2e',
  border: '#2b3139', text: '#e0e0e0', muted: '#666',
  green: '#0ecb81', red: '#f6465d', gold: '#f3ba2f',
  blue: '#60a5fa', pink: '#e2136e', orange: '#f7941d',
}

export default function PaymentPage({
  tgUser, status, usersCollection, paymentsCollection
}) {
  const [method,  setMethod]  = useState('')
  const [phone,   setPhone]   = useState('')
  const [txId,    setTxId]    = useState('')
  const [amount,  setAmount]  = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')
  const [copied,  setCopied]  = useState('')

  const copyNum = (num, label) => {
    navigator.clipboard.writeText(num).catch(() => {})
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleSubmit = async () => {
    if (!method)                              return setError('পেমেন্ট মেথড সিলেক্ট করুন')
    if (!phone || phone.length < 11)          return setError('সঠিক ফোন নম্বর দিন (১১ ডিজিট)')
    if (!amount || isNaN(amount))             return setError('সঠিক পরিমাণ লিখুন')
    // ✅ FIX: Minimum amount validation
    if (Number(amount) < MONTHLY_AMOUNT)      return setError(`সর্বনিম্ন ৳${MONTHLY_AMOUNT} পাঠাতে হবে`)
    if (!txId.trim() || txId.trim().length < 4) return setError('সঠিক ট্রানজেকশন আইডি লিখুন')

    setLoading(true)
    setError('')

    try {
      const name = tgUser.first_name + (tgUser.last_name ? ' ' + tgUser.last_name : '')
      const data = {
        userId:    String(tgUser.id),
        name,
        username:  tgUser.username || '',
        phone:     phone.trim(),
        method,
        amount:    Number(amount),
        txId:      txId.trim(),
        status:    'pending',
        appType:   'master',
        createdAt: serverTimestamp(),
      }

      // master_payments collection এ save
      await setDoc(doc(db, paymentsCollection, txId.trim()), data)

      // Backend কে notify করো
      await fetch(`${BACKEND_URL}/api/notify-payment`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...data,
          usersCollection,
          paymentsCollection,
        }),
      })

      setDone(true)
    } catch (e) {
      console.error(e)
      if (e.code === 'permission-denied') {
        setError('পেমেন্ট সেভ হয়নি। একটু পরে আবার চেষ্টা করুন।')
      } else {
        setError('সাবমিট হয়নি। ইন্টারনেট চেক করুন।')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Pending ──
  if (done || status === 'pending') {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', paddingBottom: 30 }}>
        <TopBanner />
        <div style={{ padding: 16 }}>
          <div style={{ ...s.card, textAlign: 'center', padding: '40px 20px', marginBottom: 12 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>⏳</div>
            <div style={{ color: C.gold, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>
              পেমেন্ট রিভিউতে আছে
            </div>
            <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.8 }}>
              আপনার পেমেন্ট যাচাই হলে অ্যাক্সেস পাবেন।
              সাধারণত ১–১৫ মিনিটের মধ্যে কনফার্ম হয়।
            </div>
            <SocialButtons />
            <SupportButton />
          </div>
        </div>
      </div>
    )
  }

  // ── Rejected ──
  if (status === 'rejected') {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', paddingBottom: 30 }}>
        <TopBanner />
        <div style={{ padding: 16 }}>
          <div style={{ ...s.card, textAlign: 'center', padding: '24px 16px', marginBottom: 12, border: `1px solid ${C.red}44` }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>❌</div>
            <div style={{ color: C.red, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              পেমেন্ট রিজেক্ট হয়েছে
            </div>
            <div style={{ color: C.muted, fontSize: 12 }}>
              সঠিক ট্রানজেকশন আইডি দিয়ে আবার পেমেন্ট করুন।
            </div>
          </div>
          <PayForm {...{ method, setMethod, phone, setPhone, txId, setTxId, amount, setAmount, loading, error, copied, copyNum, handleSubmit }} />
          <SupportButton />
        </div>
      </div>
    )
  }

  // ── Expired ──
  if (status === 'expired') {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', paddingBottom: 30 }}>
        <TopBanner />
        <div style={{ padding: 16 }}>
          <div style={{ ...s.card, textAlign: 'center', padding: '24px 16px', marginBottom: 12, border: `1px solid ${C.gold}44` }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>⌛</div>
            <div style={{ color: C.gold, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              সাবস্ক্রিপশন শেষ হয়েছে
            </div>
            <div style={{ color: C.muted, fontSize: 12 }}>
              পুনরায় পেমেন্ট করুন এবং ৩০ দিন ব্যবহার করুন।
            </div>
          </div>
          <PayForm {...{ method, setMethod, phone, setPhone, txId, setTxId, amount, setAmount, loading, error, copied, copyNum, handleSubmit }} />
          <SupportButton />
        </div>
      </div>
    )
  }

  // ── Main Payment Page ──
  return (
    <div style={{ background: C.bg, minHeight: '100vh', paddingBottom: 30 }}>
      <TopBanner />
      <div style={{ padding: '12px 16px' }}>

        {/* Header */}
        <div style={{ ...s.card, textAlign: 'center', padding: '20px 16px', marginBottom: 12 }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>💹</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing: '0.03em' }}>
            Master AI Signal
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            সাবস্ক্রিপশন — ৩০ দিন
          </div>
          {tgUser?.id && (
            <div style={{ marginTop: 10, background: '#0d1117', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#9ba3af' }}>
              👤 {tgUser.first_name} {tgUser.last_name || ''}
              {tgUser.username && <span style={{ color: C.blue }}> @{tgUser.username}</span>}
            </div>
          )}
          <div style={{ marginTop: 12, padding: '10px', background: `${C.gold}11`, borderRadius: 10, border: `1px solid ${C.gold}33` }}>
            <div style={{ color: C.gold, fontWeight: 900, fontSize: 22 }}>৳{MONTHLY_AMOUNT}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>প্রতি মাসে</div>
          </div>
        </div>

        <SocialButtons />
        <PayForm {...{ method, setMethod, phone, setPhone, txId, setTxId, amount, setAmount, loading, error, copied, copyNum, handleSubmit }} />
        <SupportButton />
      </div>
    </div>
  )
}

function TopBanner() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #1a1200, #251a00)',
      borderBottom: '1px solid #f3ba2f33',
      color: '#f3ba2f', fontSize: 12,
      padding: '10px 16px', textAlign: 'center',
    }}>
      📢 প্রতি মাসে <strong>৳{MONTHLY_AMOUNT}</strong> পেমেন্ট করুন Master AI ব্যবহার করতে
    </div>
  )
}

function SocialButtons() {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <button onClick={() => window.open(GROUP_LINK, '_blank')} style={{
        flex: 1, padding: '11px', borderRadius: 10, background: '#1a2744',
        color: '#60a5fa', fontWeight: 700, fontSize: 12,
        border: '1px solid #60a5fa33', cursor: 'pointer',
      }}>
        💬 Telegram Group
      </button>
      <button onClick={() => window.open(CHANNEL_LINK, '_blank')} style={{
        flex: 1, padding: '11px', borderRadius: 10, background: '#1a2744',
        color: '#60a5fa', fontWeight: 700, fontSize: 12,
        border: '1px solid #60a5fa33', cursor: 'pointer',
      }}>
        📢 Channel
      </button>
    </div>
  )
}

function SupportButton() {
  return (
    <button onClick={() => window.open(SUPPORT_LINK, '_blank')} style={{
      width: '100%', padding: '13px', borderRadius: 10,
      background: '#1a2744', color: '#60a5fa',
      fontWeight: 700, fontSize: 13,
      border: '1px solid #60a5fa44', cursor: 'pointer', marginTop: 8,
    }}>
      💬 Customer Support
    </button>
  )
}

function PayForm({
  method, setMethod, phone, setPhone, txId, setTxId,
  amount, setAmount, loading, error, copied, copyNum, handleSubmit
}) {
  return (
    <>
      {/* Payment Numbers */}
      <div style={{ ...s.card, marginBottom: 12 }}>
        <div style={s.label}>পেমেন্ট নম্বর</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {/* bKash */}
          <div style={{ ...s.numCard, borderColor: '#e2136e55' }}
               onClick={() => copyNum(BKASH_NUMBER, 'bkash')}>
            <div style={{ color: '#e2136e', fontWeight: 800, fontSize: 12, marginBottom: 4 }}>🩷 বিকাশ</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#e0e0e0', letterSpacing: '0.05em' }}>
              {BKASH_NUMBER}
            </div>
            <div style={{ fontSize: 10, color: copied === 'bkash' ? '#0ecb81' : '#666', marginTop: 4 }}>
              {copied === 'bkash' ? '✅ কপি হয়েছে!' : 'ট্যাপ করে কপি করুন'}
            </div>
          </div>
          {/* Nagad */}
          <div style={{ ...s.numCard, borderColor: '#f7941d55' }}
               onClick={() => copyNum(NAGAD_NUMBER, 'nagad')}>
            <div style={{ color: '#f7941d', fontWeight: 800, fontSize: 12, marginBottom: 4 }}>🧡 নগদ</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#e0e0e0', letterSpacing: '0.05em' }}>
              {NAGAD_NUMBER}
            </div>
            <div style={{ fontSize: 10, color: copied === 'nagad' ? '#0ecb81' : '#666', marginTop: 4 }}>
              {copied === 'nagad' ? '✅ কপি হয়েছে!' : 'ট্যাপ করে কপি করুন'}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: '#9ba3af' }}>
          Send Money পাঠান: <strong style={{ color: '#f3ba2f' }}>৳{MONTHLY_AMOUNT}</strong>
        </div>
      </div>

      {/* Form */}
      <div style={{ ...s.card, marginBottom: 12 }}>
        <div style={s.label}>পেমেন্ট তথ্য দিন</div>

        {/* Method */}
        <div style={{ marginBottom: 12 }}>
          <div style={s.fieldLabel}>মেথড সিলেক্ট করুন</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ key: 'বিকাশ', color: '#e2136e' }, { key: 'নগদ', color: '#f7941d' }].map(({ key, color }) => (
              <button key={key} onClick={() => setMethod(key)} style={{
                flex: 1, padding: '12px', borderRadius: 8, fontWeight: 700,
                fontSize: 13, cursor: 'pointer',
                background: method === key ? color + '22' : '#1a1f2e',
                color:      method === key ? color : '#666',
                border:     method === key ? `2px solid ${color}` : '2px solid #2b3139',
              }}>{key}</button>
            ))}
          </div>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 12 }}>
          <div style={s.fieldLabel}>আপনার ফোন নম্বর</div>
          <input type="tel" placeholder="01XXXXXXXXX"
            value={phone} onChange={e => setPhone(e.target.value)} style={s.input} />
        </div>

        {/* Amount */}
        <div style={{ marginBottom: 12 }}>
          <div style={s.fieldLabel}>পরিমাণ (টাকা) — সর্বনিম্ন ৳{MONTHLY_AMOUNT}</div>
          <input type="number" placeholder={`সর্বনিম্ন ${MONTHLY_AMOUNT}`}
            value={amount} onChange={e => setAmount(e.target.value)} style={s.input} />
        </div>

        {/* TxID */}
        <div style={{ marginBottom: 14 }}>
          <div style={s.fieldLabel}>ট্রানজেকশন আইডি / TrxID</div>
          <input type="text" placeholder="TrxID বা Ref নম্বর লিখুন"
            value={txId} onChange={e => setTxId(e.target.value)} style={s.input} />
        </div>

        {error && (
          <div style={{
            background: '#f6465d11', border: '1px solid #f6465d44',
            borderRadius: 8, padding: '10px 12px',
            color: '#f6465d', fontSize: 12, marginBottom: 12,
          }}>
            ⚠️ {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 10,
          background: loading ? '#1a1f2e' : '#f3ba2f',
          color:      loading ? '#555' : '#000',
          fontWeight: 800, fontSize: 14, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? '⏳ সাবমিট হচ্ছে...' : '✅ পেমেন্ট সাবমিট করুন'}
        </button>
      </div>
    </>
  )
}

const s = {
  card:      { background: '#141820', borderRadius: 14, padding: '16px', border: '1px solid #2b3139' },
  numCard:   { flex: 1, background: '#0d1117', borderRadius: 10, padding: '12px 10px', textAlign: 'center', cursor: 'pointer', border: '1px solid #2b3139' },
  label:     { fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  fieldLabel:{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 },
  input:     { width: '100%', padding: '12px', borderRadius: 8, background: '#0d1117', color: '#e0e0e0', border: '1px solid #2b3139', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
    }
