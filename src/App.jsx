import { useState, useEffect, useRef, useCallback } from 'react'
import { db } from './firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import PaymentPage from './PaymentPage'
import { forexMarkets, runSignalEngine } from './signalEngine'

const tg = window.Telegram?.WebApp
if (tg) { tg.ready(); tg.expand() }

const getTgUser = () => {
  if (tg?.initDataUnsafe?.user) return tg.initDataUnsafe.user
  return { id: 99999999, first_name: 'Test', last_name: '', username: 'testuser' }
}

const SUPPORT_LINK = 'https://t.me/ratulhossain56'
const GROUP_LINK   = 'https://t.me/ratulhossain424'
const CHANNEL_LINK = 'https://t.me/ratulhossain4241'

// ── নতুন App এর Collection নাম ──
const USERS_COLLECTION    = 'master_users'
const PAYMENTS_COLLECTION = 'master_payments'

const C = {
  bg: '#0b0e11', card: '#141820', panel: '#1a1f2e',
  border: '#2b3139', text: '#e0e0e0', muted: '#555',
  green: '#0ecb81', red: '#f6465d', gold: '#f3ba2f', blue: '#60a5fa',
}

// API ব্লক এড়াতে rate limiting
const requestQueue = []
let isProcessing = false
const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return
  isProcessing = true
  const { fn, resolve, reject } = requestQueue.shift()
  try { resolve(await fn()) }
  catch (e) { reject(e) }
  finally {
    isProcessing = false
    setTimeout(processQueue, 800)
  }
}
const queueRequest = (fn) => new Promise((resolve, reject) => {
  requestQueue.push({ fn, resolve, reject })
  processQueue()
})

export default function App() {
  const tgUser = getTgUser()

  const [authStatus, setAuthStatus]     = useState('loading')
  const [selected, setSelected]         = useState(forexMarkets[0])
  const [dToken, setDToken]             = useState(localStorage.getItem('d_token') || '')
  const [dAppId, setDAppId]             = useState(localStorage.getItem('d_app_id') || '1089')
  const [isSaved, setIsSaved]           = useState(!!localStorage.getItem('d_token'))
  const [liveTime, setLiveTime]         = useState('--:--:--')
  const [connStatus, setConnStatus]     = useState('OFFLINE')
  const [sigData, setSigData]           = useState({ direction: null, strength: 50, breakdown: {}, confidence: 0 })
  const [lastPred, setLastPred]         = useState(null)
  const [scanning, setScanning]         = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [score, setScore]               = useState(JSON.parse(localStorage.getItem('master_score') || '{"win":0,"loss":0,"profit":0}'))
  const [alertEnabled, setAlertEnabled] = useState(localStorage.getItem('master_alert') !== 'off')
  const [lastSignalTime, setLastSignalTime] = useState(null)
  const wsRef   = useRef(null)
  const retryRef = useRef(0)

  // ── Firebase Auth ──
  useEffect(() => {
    const uid = String(tgUser.id)
    if (!uid || uid === '0') { setAuthStatus('new'); return }

    // master_users collection চেক করবে
    const unsub = onSnapshot(doc(db, USERS_COLLECTION, uid), (snap) => {
      if (!snap.exists()) { setAuthStatus('new'); return }
      const d = snap.data()
      if (d.status === 'approved') {
        const exp = d.expiresAt?.toDate?.()
        setAuthStatus(exp && exp < new Date() ? 'expired' : 'approved')
      } else if (d.status === 'rejected') {
        setAuthStatus('rejected')
      } else if (d.status === 'disconnected') {
        setAuthStatus('expired')
      } else {
        setAuthStatus('pending')
      }
    }, () => setAuthStatus('new'))

    return () => unsub()
  }, [tgUser.id])

  // ── Fetch candles with rate limit protection ──
  const fetchMarketData = useCallback(() => {
    if (!isSaved || scanning) return
    setScanning(true)

    queueRequest(() => new Promise((resolve, reject) => {
      if (wsRef.current) { try { wsRef.current.close() } catch (_) {} }

      const timeout = setTimeout(() => {
        reject(new Error('Timeout'))
        try { wsRef.current?.close() } catch (_) {}
      }, 15000)

      const ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${dAppId}`)
      wsRef.current = ws

      ws.onopen = () => ws.send(JSON.stringify({ authorize: dToken }))

      ws.onmessage = (e) => {
        try {
          const res = JSON.parse(e.data)

          if (res.error) {
            clearTimeout(timeout)
            const c = res.error.code
            setConnStatus(
              c === 'InvalidToken' ? 'TOKEN INVALID ❌' :
              c === 'RateLimit'    ? 'RATE LIMIT ⏳' :
              c === 'InvalidAppID' ? 'APP ID ERROR ❌' : 'ERROR ❌'
            )
            if (c === 'RateLimit') {
              retryRef.current++
              setTimeout(() => fetchMarketData(), 3000 * retryRef.current)
            }
            setScanning(false)
            ws.close()
            reject(res.error)
            return
          }

          if (res.msg_type === 'authorize') {
            setConnStatus('CONNECTED ✅')
            retryRef.current = 0
            ws.send(JSON.stringify({
              ticks_history: selected.id,
              count: 100,
              end: 'latest',
              style: 'candles',
              granularity: 60,
            }))
          }

          if (res.msg_type === 'candles' && res.candles) {
            clearTimeout(timeout)
            const completed = res.candles.slice(0, -1)
            const result = runSignalEngine(completed)
            setSigData(result)

            if (result.direction) {
              setLastPred(result.direction)
              setLastSignalTime(new Date())
              if (alertEnabled) {
                try {
                  new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play()
                } catch (_) {}
              }
            }

            setScanning(false)
            ws.close()
            resolve()
          }
        } catch (_) {
          clearTimeout(timeout)
          setScanning(false)
          ws.close()
          reject(_)
        }
      }

      ws.onerror = () => {
        clearTimeout(timeout)
        setConnStatus('NETWORK ERROR ❌')
        setScanning(false)
        try { ws.close() } catch (_) {}
        reject(new Error('WS Error'))
      }
    })).catch(() => setScanning(false))
  }, [isSaved, scanning, dToken, dAppId, selected, alertEnabled])

  // ── Result check ──
  const checkResult = useCallback(() => {
    if (!lastPred) return
    const ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${dAppId}`)

    ws.onopen = () => ws.send(JSON.stringify({
      ticks_history: selected.id,
      count: 3,
      end: 'latest',
      style: 'candles',
      granularity: 60,
    }))

    ws.onmessage = (e) => {
      try {
        const res = JSON.parse(e.data)
        if (res.msg_type === 'candles' && res.candles) {
          const closed = res.candles[res.candles.length - 2]
          if (!closed) { ws.close(); return }

          const actual = parseFloat(closed.close) > parseFloat(closed.open) ? 'CALL' : 'PUT'
          const isWin  = lastPred === actual

          setScore(prev => {
            const updated = {
              win:    isWin ? prev.win + 1 : prev.win,
              loss:   isWin ? prev.loss : prev.loss + 1,
              profit: parseFloat((prev.profit + (isWin ? 0.85 : -1)).toFixed(2)),
            }
            localStorage.setItem('master_score', JSON.stringify(updated))
            return updated
          })

          setLastPred(null)
          setSigData({ direction: null, strength: 50, breakdown: {}, confidence: 0 })
          ws.close()
        }
      } catch (_) { ws.close() }
    }

    ws.onerror = () => { try { ws.close() } catch (_) {} }
  }, [lastPred, dAppId, selected])

  // ── Clock + Auto scan ──
  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date()
      setLiveTime(now.toLocaleTimeString('en-GB'))
      const sec = now.getSeconds()
      if (authStatus !== 'approved') return
      if (sec === 56 && isSaved && !scanning) fetchMarketData()
      if (sec === 4  && isSaved && lastPred)  checkResult()
    }, 1000)
    return () => clearInterval(tick)
  }, [fetchMarketData, checkResult, isSaved, scanning, lastPred, authStatus])

  const handleSave = () => {
    if (!dToken) return
    localStorage.setItem('d_token', dToken)
    localStorage.setItem('d_app_id', dAppId)
    setIsSaved(true)
    setShowSettings(false)
  }

  const handleClearToken = () => {
    localStorage.removeItem('d_token')
    localStorage.removeItem('d_app_id')
    setDToken('')
    setDAppId('1089')
    setIsSaved(false)
    setConnStatus('OFFLINE')
  }

  const handleReset = () => {
    if (!window.confirm('স্কোর রিসেট করবেন?')) return
    const e = { win: 0, loss: 0, profit: 0 }
    setScore(e)
    localStorage.removeItem('master_score')
  }

  // ── Auth guards ──
  if (authStatus === 'loading') {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 40 }}>💹</div>
        <div style={{ color: C.muted, fontSize: 13 }}>লোড হচ্ছে...</div>
      </div>
    )
  }

  if (['new', 'pending', 'rejected', 'expired'].includes(authStatus)) {
    return (
      <PaymentPage
        tgUser={tgUser}
        status={authStatus}
        usersCollection={USERS_COLLECTION}
        paymentsCollection={PAYMENTS_COLLECTION}
      />
    )
  }

  // ── UI ──
  const dir      = sigData.direction
  const str      = sigData.strength
  const conf     = sigData.confidence
  const isCall   = dir === 'CALL'
  const isPut    = dir === 'PUT'
  const sigColor = isCall ? C.green : isPut ? C.red : C.muted

  const sigLabel =
    scanning ? '⟳  স্ক্যান হচ্ছে...' :
    isCall   ? '▲  CALL  (UP)'        :
    isPut    ? '▼  PUT  (DOWN)'       :
    lastPred ? '⏳  রেজাল্ট আসছে...' :
               '—  সিগনাল অপেক্ষায়'

  const winRate = score.win + score.loss > 0
    ? Math.round(score.win / (score.win + score.loss) * 100) : 0

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter',sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* HEADER */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 14px', background: C.card,
        borderBottom: `1px solid ${C.border}`, fontSize: 11, fontWeight: 700, gap: 6,
      }}>
        <span style={{ color: connStatus.includes('✅') ? C.green : connStatus.includes('⏳') ? C.gold : C.red, fontSize: 10 }}>
          {connStatus}
        </span>
        <span style={{ color: C.gold, fontSize: 10 }}>
          Win: {winRate}% ({score.win}W/{score.loss}L)
        </span>
        <span style={{ color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{liveTime}</span>
      </header>

      {/* CHART */}
      <div style={{ height: '32vh', background: '#0d1117' }}>
        <iframe
          key={selected.id}
          src={`https://s.tradingview.com/widgetembed/?symbol=${selected.tv}&theme=dark&hide_top_toolbar=1&save_image=0&interval=1`}
          width="100%" height="100%"
          style={{ border: 'none', display: 'block' }}
          title="chart"
        />
      </div>

      {/* SCORE ROW */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 12px 0' }}>
        {[
          { l: 'WIN',    v: score.win,   c: C.green },
          { l: 'LOSS',   v: score.loss,  c: C.red   },
          { l: 'PROFIT', v: `${score.profit >= 0 ? '+' : ''}${score.profit}x`, c: score.profit >= 0 ? C.green : C.red },
        ].map(x => (
          <div key={x.l} style={{
            flex: 1, padding: '9px 4px', borderRadius: 8, textAlign: 'center',
            background: C.panel, border: `1px solid ${x.c}22`,
            color: x.c, fontSize: 11, fontWeight: 800,
          }}>
            <div style={{ color: '#444', fontSize: 9, marginBottom: 3 }}>{x.l}</div>
            {x.v}
          </div>
        ))}
        <button onClick={handleReset} style={{
          padding: '0 10px', borderRadius: 8, background: C.panel,
          border: `1px solid ${C.border}`, color: C.muted,
          fontSize: 11, cursor: 'pointer',
        }}>↺</button>
      </div>

      {/* MAIN */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* SIGNAL CARD */}
        <div style={{
          borderRadius: 14, padding: '16px', background: C.card,
          border: `2px solid ${isCall ? C.green : isPut ? C.red : C.border}`,
          boxShadow: isCall ? `0 0 28px ${C.green}33` : isPut ? `0 0 28px ${C.red}33` : 'none',
          transition: 'all 0.4s',
        }}>

          {/* Signal Label */}
          <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 900, color: sigColor, marginBottom: 8, letterSpacing: '0.04em' }}>
            {sigLabel}
          </div>

          {/* Strength Badge */}
          {dir && sigData.signalStrength && (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{
                background: sigData.signalStrength === 'ULTRA'  ? `${C.gold}22`  :
                            sigData.signalStrength === 'STRONG' ? `${C.green}22` : `${C.blue}22`,
                color:      sigData.signalStrength === 'ULTRA'  ? C.gold  :
                            sigData.signalStrength === 'STRONG' ? C.green : C.blue,
                border: `1px solid ${
                  sigData.signalStrength === 'ULTRA'  ? C.gold  :
                  sigData.signalStrength === 'STRONG' ? C.green : C.blue}55`,
                borderRadius: 20, padding: '3px 14px', fontSize: 11, fontWeight: 700,
              }}>
                {sigData.signalStrength === 'ULTRA'  ? '⚡ ULTRA STRONG' :
                 sigData.signalStrength === 'STRONG' ? '💪 STRONG' : '✅ NORMAL'} — {conf}%
              </span>
            </div>
          )}

          {/* Pattern */}
          {sigData.pattern && sigData.pattern !== 'N/A' && sigData.pattern !== 'No Pattern' && dir && (
            <div style={{ textAlign: 'center', fontSize: 11, color: C.gold, marginBottom: 8 }}>
              📊 {sigData.pattern}
            </div>
          )}

          {/* Strength Bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: C.muted, marginBottom: 3 }}>
              <span>PUT ↓</span>
              <span style={{ color: C.gold, fontWeight: 700 }}>শক্তি {str}%</span>
              <span>↑ CALL</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#0d1117', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${Math.max(0, 50 - str)}%`,
                background: str <= 35 ? C.red : `${C.red}44`,
                transition: 'width 0.5s',
              }} />
              <div style={{
                position: 'absolute', right: 0, top: 0, bottom: 0,
                width: `${Math.max(0, str - 50)}%`,
                background: str >= 65 ? C.green : `${C.green}44`,
                transition: 'width 0.5s',
              }} />
              <div style={{
                position: 'absolute', left: '50%', top: 0, bottom: 0,
                width: 2, background: C.border, transform: 'translateX(-50%)',
              }} />
            </div>
          </div>

          {/* ADX + RSI + VOTE */}
          {(sigData.adxValue > 0 || sigData.rsiValue) && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <div style={{ flex: 1, background: '#0d1117', borderRadius: 6, padding: '5px 8px', fontSize: 10, textAlign: 'center' }}>
                <span style={{ color: '#444' }}>ADX </span>
                <span style={{ color: sigData.adxValue > 25 ? C.green : C.gold, fontWeight: 700 }}>
                  {sigData.adxValue.toFixed(0)}
                </span>
              </div>
              <div style={{ flex: 1, background: '#0d1117', borderRadius: 6, padding: '5px 8px', fontSize: 10, textAlign: 'center' }}>
                <span style={{ color: '#444' }}>RSI </span>
                <span style={{ color: sigData.rsiValue < 35 ? C.green : sigData.rsiValue > 65 ? C.red : C.gold, fontWeight: 700 }}>
                  {sigData.rsiValue.toFixed(0)}
                </span>
              </div>
              <div style={{ flex: 1, background: '#0d1117', borderRadius: 6, padding: '5px 8px', fontSize: 10, textAlign: 'center' }}>
                <span style={{ color: C.green, fontWeight: 700 }}>{sigData.callVotes || 0}</span>
                <span style={{ color: '#444' }}>/</span>
                <span style={{ color: C.red, fontWeight: 700 }}>{sigData.putVotes || 0}</span>
              </div>
            </div>
          )}

          {/* Breakdown */}
          {Object.keys(sigData.breakdown).length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
              {Object.entries(sigData.breakdown).map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 10, padding: '4px 8px', borderRadius: 5, background: '#0d1117',
                }}>
                  <span style={{ color: '#444' }}>{k}</span>
                  <span style={{
                    color: v.includes('BULL') || v.includes('CALL') || v.includes('OVER') || v.includes('SUPPORT')
                      ? C.green
                      : v.includes('BEAR') || v.includes('PUT') || v.includes('RESIST')
                      ? C.red
                      : v.includes('⛔') ? '#f97316' : C.muted,
                    fontWeight: 700,
                  }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Last signal time */}
          {lastSignalTime && (
            <div style={{ textAlign: 'center', fontSize: 10, color: '#444', marginTop: 8 }}>
              শেষ সিগনাল: {lastSignalTime.toLocaleTimeString('en-GB')}
            </div>
          )}
        </div>

        {/* MARKET SELECT */}
        <select
          value={selected.id}
          onChange={e => setSelected(forexMarkets.find(m => m.id === e.target.value))}
          style={{ padding: '11px 12px', borderRadius: 8, background: C.panel, color: C.text, border: `1px solid ${C.border}`, fontSize: 12 }}
        >
          {forexMarkets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        {/* ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={fetchMarketData}
            disabled={scanning || !isSaved}
            style={{
              flex: 2, padding: '14px', borderRadius: 8, fontWeight: 800,
              fontSize: 13, border: 'none',
              cursor: scanning || !isSaved ? 'not-allowed' : 'pointer',
              background: scanning ? C.panel : C.green,
              color: scanning ? C.muted : '#000',
              opacity: !isSaved ? 0.5 : 1,
              transition: '0.2s',
            }}
          >
            {scanning ? '⟳ স্ক্যান হচ্ছে...' : '🔍 সিগনাল জেনারেট'}
          </button>

          <button
            onClick={() => {
              const n = !alertEnabled
              setAlertEnabled(n)
              localStorage.setItem('master_alert', n ? 'on' : 'off')
            }}
            style={{
              padding: '14px 12px', borderRadius: 8, background: C.panel,
              color: alertEnabled ? C.gold : C.muted, fontWeight: 700, fontSize: 12,
              border: `1px solid ${alertEnabled ? C.gold : C.border}`, cursor: 'pointer',
            }}
          >🔔</button>

          <button
            onClick={() => setShowSettings(s => !s)}
            style={{
              padding: '14px 12px', borderRadius: 8, background: C.panel,
              color: C.blue, fontWeight: 700, fontSize: 12,
              border: `1px solid ${C.border}`, cursor: 'pointer',
            }}
          >⚙️</button>
        </div>

        {/* SOCIAL LINKS */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => window.open(GROUP_LINK, '_blank')} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#1a2744', color: C.blue, fontWeight: 700, fontSize: 11, border: '1px solid #60a5fa33', cursor: 'pointer' }}>
            💬 Group
          </button>
          <button onClick={() => window.open(CHANNEL_LINK, '_blank')} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#1a2744', color: C.blue, fontWeight: 700, fontSize: 11, border: '1px solid #60a5fa33', cursor: 'pointer' }}>
            📢 Channel
          </button>
          <button onClick={() => window.open(SUPPORT_LINK, '_blank')} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#1a2744', color: C.blue, fontWeight: 700, fontSize: 11, border: '1px solid #60a5fa33', cursor: 'pointer' }}>
            🆘 Support
          </button>
        </div>

        {/* SETTINGS */}
        {showSettings && (
          <div style={{ background: C.card, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              Deriv API সেটিং
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="text"
                placeholder="App ID (default: 1089)"
                value={dAppId}
                onChange={e => setDAppId(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, background: '#0d1117', color: C.text, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none' }}
              />
              <input
                type="password"
                placeholder="Deriv API Token"
                value={dToken}
                onChange={e => setDToken(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, background: '#0d1117', color: C.text, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSave} style={{ flex: 2, padding: 11, borderRadius: 8, background: C.gold, color: '#000', fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer' }}>
                  {isSaved ? '✅ সেভ আছে' : '💾 সেভ করুন'}
                </button>
                <button onClick={handleClearToken} style={{ flex: 1, padding: 11, borderRadius: 8, background: '#1a0000', color: C.red, fontWeight: 700, fontSize: 11, border: `1px solid ${C.red}44`, cursor: 'pointer' }}>
                  🗑️ ডিলেট
                </button>
              </div>
              <div style={{ fontSize: 10, color: '#444', lineHeight: 1.6 }}>
                💡 Deriv.com → Settings → API Token → Read পারমিশন দিন
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
  }
