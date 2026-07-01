import { useState, useEffect, useRef, useCallback } from 'react'
import { db } from './firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import PaymentPage from './PaymentPage'
import { forexMarkets, runSignalEngine } from './signalEngine'

// ══════════════════════════════════════════════════════
//   MASTER AI v4.0 — Professional Trading App
//   Error-Free + Finnhub API + MTF + Volume
// ══════════════════════════════════════════════════════

const tg = window.Telegram?.WebApp
if (tg) { try { tg.ready(); tg.expand() } catch {} }

const getTgUser = () => {
  try {
    if (tg?.initDataUnsafe?.user) return tg.initDataUnsafe.user
  } catch {}
  if (import.meta.env.PROD) return null
  return { id: 99999999, first_name: 'Test', last_name: '', username: 'testuser' }
}

const BACKEND_URL         = import.meta.env.VITE_BACKEND_URL || 'https://qx-mashaallha.onrender.com'
const SUPPORT_LINK        = 'https://t.me/ratulhossain56'
const GROUP_LINK          = 'https://t.me/ratulhossain424'
const CHANNEL_LINK        = 'https://t.me/ratulhossain4241'
const USERS_COLLECTION    = 'master_users'
const PAYMENTS_COLLECTION = 'master_payments'
const HISTORY_KEY         = 'master_signal_history'
const SCORE_KEY           = 'master_score'
const ALERT_KEY           = 'master_alert'
const API_KEY_STORAGE     = 'finnhub_user_key'

const C = {
  bg: '#0b0e11', card: '#141820', panel: '#1a1f2e',
  border: '#2b3139', text: '#e0e0e0', muted: '#555',
  green: '#0ecb81', red: '#f6465d', gold: '#f3ba2f', blue: '#60a5fa',
}

// ── Market Session ──
const getMarketSession = () => {
  const now  = new Date()
  const utcH = now.getUTCHours()
  const utcT = utcH + now.getUTCMinutes() / 60
  const isIn = (s, e) => s < e ? (utcT >= s && utcT < e) : (utcT >= s || utcT < e)

  const active = []
  if (isIn(21, 6))  active.push({ key: 'sydney',  label: 'Sydney',   emoji: '🇦🇺' })
  if (isIn(0, 9))   active.push({ key: 'tokyo',   label: 'Tokyo',    emoji: '🇯🇵' })
  if (isIn(8, 17))  active.push({ key: 'london',  label: 'London',   emoji: '🇬🇧' })
  if (isIn(13, 22)) active.push({ key: 'newYork', label: 'New York', emoji: '🇺🇸' })

  const hasLondon = active.some(a => a.key === 'london')
  const hasNY     = active.some(a => a.key === 'newYork')
  const hasTokyo  = active.some(a => a.key === 'tokyo')

  let message, msgColor
  if (hasLondon && hasNY) {
    message  = '⚡ London + New York Overlap! সবচেয়ে শক্তিশালী সময়! এখন ট্রেড করুন!'
    msgColor = C.gold
  } else if (hasLondon) {
    message  = '🟢 London Session — শক্তিশালী Signal পাবেন'
    msgColor = C.green
  } else if (hasNY) {
    message  = '🟢 New York Session — শক্তিশালী Signal পাবেন'
    msgColor = C.green
  } else if (hasTokyo) {
    message  = '🟡 Tokyo Session — London/NY তে আরো ভালো Signal আসবে'
    msgColor = C.gold
  } else {
    message  = '🔵 Sydney Session — London/NY এ সেরা Signal পাবেন'
    msgColor = C.blue
  }

  return { active, message, msgColor }
}

// ── LocalStorage Helpers ──
const getHistory = () => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] } }
const saveHistory = (h) => { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-50))) } catch {} }
const getScore = () => { try { return JSON.parse(localStorage.getItem(SCORE_KEY) || '{"win":0,"loss":0,"profit":0}') } catch { return {win:0,loss:0,profit:0} } }

export default function App() {
  const tgUser = getTgUser()

  const [authStatus,  setAuthStatus]  = useState('loading')
  const [selected,    setSelected]    = useState(forexMarkets[0])
  const [liveTime,    setLiveTime]    = useState('--:--:--')
  const [connStatus,  setConnStatus]  = useState('OFFLINE')
  const [livePrice,   setLivePrice]   = useState(null)
  const [livePriceChg,setLivePriceChg]= useState(null)
  const [session,     setSession]     = useState(getMarketSession())
  const [countdown,   setCountdown]   = useState(300)
  const [sigData,     setSigData]     = useState({
    direction: null, strength: 50, breakdown: {},
    keyIndicators: {}, confidence: 0, callVotes: 0, putVotes: 0,
    volumeSignal: null,
  })
  const [mtfData,       setMtfData]       = useState({ h1: null, m15: null, m5: null })
  const [lastPred,      setLastPred]      = useState(null)
  const [lastPredMarket,setLastPredMarket]= useState(null)
  const [showSettings,  setShowSettings]  = useState(false)
  const [showHistory,   setShowHistory]   = useState(false)
  const [score,         setScore]         = useState(getScore())
  const [alertEnabled,  setAlertEnabled]  = useState(localStorage.getItem(ALERT_KEY) !== 'off')
  const [lastSignalTime,setLastSignalTime]= useState(null)
  const [history,       setHistory]       = useState(getHistory())
  const [isScanning,    setIsScanning]    = useState(false)
  const [keyInput,      setKeyInput]      = useState(localStorage.getItem(API_KEY_STORAGE) || '')
  const [isSaved,       setIsSaved]       = useState(!!localStorage.getItem(API_KEY_STORAGE))
  const [apiError,      setApiError]      = useState('')

  const scanRef     = useRef(false)
  const selectedRef = useRef(selected)
  const predRef     = useRef(lastPred)
  const marketRef   = useRef(lastPredMarket)
  const keyRef      = useRef(localStorage.getItem(API_KEY_STORAGE) || '')

  useEffect(() => { selectedRef.current = selected },       [selected])
  useEffect(() => { predRef.current     = lastPred },       [lastPred])
  useEffect(() => { marketRef.current   = lastPredMarket }, [lastPredMarket])

  // ── Firebase Auth ──
  useEffect(() => {
    if (!tgUser) { setAuthStatus('new'); return }
    const uid = String(tgUser.id)
    if (!uid || uid === '0') { setAuthStatus('new'); return }

    const unsub = onSnapshot(
      doc(db, USERS_COLLECTION, uid),
      (snap) => {
        if (!snap.exists()) { setAuthStatus('new'); return }
        const d = snap.data()
        if (d.status === 'approved') {
          const exp = d.expiresAt?.toDate?.()
          setAuthStatus(exp && exp < new Date() ? 'expired' : 'approved')
        } else if (d.status === 'rejected')   setAuthStatus('rejected')
        else if (d.status === 'disconnected') setAuthStatus('expired')
        else                                   setAuthStatus('pending')
      },
      (err) => {
        console.error('Firebase auth error:', err)
        setAuthStatus('new')
      }
    )
    return () => unsub()
  }, [tgUser?.id])

  // ── Fetch Candles ──
  const fetchCandles = useCallback(async (symbol, resolution, count = 150) => {
    const key = keyRef.current
    if (!key) throw new Error('API Key নেই')

    const to   = Math.floor(Date.now() / 1000)
    const mins = resolution === '60' ? 60 : resolution === '15' ? 15 : 5
    const from = to - count * mins * 60

    const url = `${BACKEND_URL}/api/market-data?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}`

    const controller = new AbortController()
    const timeout    = setTimeout(() => controller.abort(), 15000)

    try {
      const res = await fetch(url, {
        headers: { 'X-Finnhub-Key': key },
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        if (res.status === 401) throw new Error('Invalid API Key')
        if (res.status === 429) throw new Error('Rate Limit — ৬০ সেকেন্ড অপেক্ষা করুন')
        throw new Error(errData.msg || `Error ${res.status}`)
      }

      const data = await res.json()
      if (!data.ok || !data.candles || data.candles.length < 10) return null
      return data.candles
    } catch (e) {
      clearTimeout(timeout)
      if (e.name === 'AbortError') throw new Error('Timeout — আবার চেষ্টা করুন')
      throw e
    }
  }, [])

  // ── Live Price ──
  const fetchPrice = useCallback(async (symbol) => {
    const key = keyRef.current
    if (!key) return
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/quote?symbol=${encodeURIComponent(symbol)}`,
        { headers: { 'X-Finnhub-Key': key } }
      )
      const data = await res.json()
      if (data.ok && data.price) {
        setLivePrice(data.price)
        setLivePriceChg({ change: data.change, pct: data.changePct })
      }
    } catch {}
  }, [])

  // ── Main Scan ──
  const fetchMarketData = useCallback(async () => {
    if (!isSaved || scanRef.current) return
    scanRef.current = true
    setIsScanning(true)
    setConnStatus('SCANNING ⟳')
    setApiError('')

    try {
      const sym = selectedRef.current.id

      const [r5, r15, r60] = await Promise.allSettled([
        fetchCandles(sym, '5',  150),
        fetchCandles(sym, '15', 150),
        fetchCandles(sym, '60', 150),
      ])

      const c5  = r5.status  === 'fulfilled' ? r5.value  : null
      const c15 = r15.status === 'fulfilled' ? r15.value : null
      const c60 = r60.status === 'fulfilled' ? r60.value : null

      // Error Check
      if (r5.status === 'rejected') {
        const errMsg = r5.reason?.message || 'Unknown error'
        setApiError(errMsg)
        if (errMsg.includes('Invalid API Key')) {
          setConnStatus('API KEY ERROR ❌')
        } else if (errMsg.includes('Rate Limit')) {
          setConnStatus('RATE LIMIT ⏳')
        } else {
          setConnStatus('ERROR ❌')
        }
        scanRef.current = false
        setIsScanning(false)
        return
      }

      if (!c5 || c5.length < 60) {
        setConnStatus('NO DATA ⚠️')
        setApiError('এই Market এ Data পাওয়া যাচ্ছে না')
        scanRef.current = false
        setIsScanning(false)
        return
      }

      // Signal Engine
      const sig5  = runSignalEngine(c5,  '5M')
      const sig15 = c15 && c15.length >= 60 ? runSignalEngine(c15, '15M') : null
      const sig60 = c60 && c60.length >= 60 ? runSignalEngine(c60, '1H')  : null

      // MTF Bonus
      let mtfBonus = 0
      if (sig15?.direction && sig15.direction === sig5.direction) mtfBonus += 5
      if (sig60?.direction && sig60.direction === sig5.direction) mtfBonus += 5

      const finalSig = {
        ...sig5,
        confidence: Math.min(99, (sig5.confidence || 0) + mtfBonus),
      }

      setSigData(finalSig)
      setMtfData({ h1: sig60, m15: sig15, m5: sig5 })
      setConnStatus('CONNECTED ✅')

      await fetchPrice(sym).catch(() => {})

      if (finalSig.direction) {
        setLastPred(finalSig.direction)
        setLastPredMarket(sym)
        setLastSignalTime(new Date())

        if (alertEnabled) {
          try { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play() } catch {}
        }

        const entry = {
          time:      new Date().toLocaleTimeString('en-GB'),
          market:    selectedRef.current.name,
          direction: finalSig.direction,
          confidence:finalSig.confidence,
          strength:  finalSig.signalStrength,
          result:    'pending',
        }
        const updated = [entry, ...getHistory()].slice(0, 50)
        setHistory(updated)
        saveHistory(updated)
      }

    } catch (e) {
      console.error('Scan error:', e)
      setConnStatus('ERROR ❌')
      setApiError(e.message || 'Unknown error')
    } finally {
      scanRef.current = false
      setIsScanning(false)
    }
  }, [isSaved, fetchCandles, fetchPrice, alertEnabled])

  // ── Result Check ──
  const checkResult = useCallback(async () => {
    const pred = predRef.current, market = marketRef.current
    if (!pred || !market) return

    try {
      const candles = await fetchCandles(market, '5', 10)
      if (!candles || candles.length < 3) return

      const closed = candles[candles.length - 2]
      if (!closed) return

      const openP  = parseFloat(closed.open)
      const closeP = parseFloat(closed.close)
      if (openP === closeP) return

      const actual = closeP > openP ? 'CALL' : 'PUT'
      const isWin  = pred === actual

      setScore(prev => {
        const updated = {
          win:    isWin ? prev.win + 1 : prev.win,
          loss:   isWin ? prev.loss    : prev.loss + 1,
          profit: parseFloat((prev.profit + (isWin ? 0.85 : -1)).toFixed(2)),
        }
        localStorage.setItem(SCORE_KEY, JSON.stringify(updated))
        return updated
      })

      const hist = getHistory()
      const idx  = hist.findIndex(h => h.result === 'pending')
      if (idx !== -1) {
        hist[idx].result = isWin ? 'win' : 'loss'
        setHistory([...hist])
        saveHistory(hist)
      }

      setLastPred(null)
      setLastPredMarket(null)
      setSigData(prev => ({ ...prev, direction: null, strength: 50, confidence: 0 }))

    } catch (e) {
      console.error('checkResult error:', e)
    }
  }, [fetchCandles])

  // ── Clock + Auto Scan ──
  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date()
      const sec = now.getSeconds()
      const min = now.getMinutes()
      setLiveTime(now.toLocaleTimeString('en-GB'))
      setSession(getMarketSession())

      const minsInto5 = min % 5
      const remaining = (4 - minsInto5) * 60 + (60 - sec)
      setCountdown(remaining > 300 ? 300 : remaining)

      if (authStatus !== 'approved') return

      if (sec === 50 && minsInto5 === 4 && isSaved && !scanRef.current) {
        fetchMarketData()
      }
      if (sec === 15 && minsInto5 === 0 && predRef.current) {
        checkResult()
      }
      if (sec === 30 && min % 2 === 0 && isSaved) {
        fetchPrice(selectedRef.current.id).catch(() => {})
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [fetchMarketData, checkResult, fetchPrice, isSaved, authStatus])

  // ── Market Change ──
  useEffect(() => {
    setSigData({
      direction: null, strength: 50, breakdown: {},
      keyIndicators: {}, confidence: 0, callVotes: 0, putVotes: 0,
      volumeSignal: null,
    })
    setMtfData({ h1: null, m15: null, m5: null })
    setLivePrice(null)
    setLivePriceChg(null)
    setLastPred(null)
    setLastPredMarket(null)
    setApiError('')
    if (isSaved && authStatus === 'approved') {
      setTimeout(() => fetchMarketData(), 300)
    }
  }, [selected.id])

  const handleSave = () => {
    const k = keyInput.trim()
    if (!k) return
    localStorage.setItem(API_KEY_STORAGE, k)
    keyRef.current = k
    setIsSaved(true)
    setShowSettings(false)
    setApiError('')
    setTimeout(() => fetchMarketData(), 300)
  }

  const handleClearKey = () => {
    localStorage.removeItem(API_KEY_STORAGE)
    keyRef.current = ''
    setKeyInput('')
    setIsSaved(false)
    setConnStatus('OFFLINE')
    setApiError('')
  }

  const handleReset = () => {
    if (!window.confirm('স্কোর রিসেট করবেন?')) return
    setScore({ win: 0, loss: 0, profit: 0 })
    localStorage.removeItem(SCORE_KEY)
  }

  const handleClearHistory = () => {
    if (!window.confirm('সব History মুছবেন?')) return
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  // ── Auth Guards ──
  if (authStatus === 'loading') {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 40 }}>💹</div>
        <div style={{ color: C.muted, fontSize: 13 }}>লোড হচ্ছে...</div>
      </div>
    )
  }

  if (!tgUser || ['new','pending','rejected','expired'].includes(authStatus)) {
    return (
      <PaymentPage
        tgUser={tgUser || { id: 0, first_name: 'User' }}
        status={authStatus}
        usersCollection={USERS_COLLECTION}
        paymentsCollection={PAYMENTS_COLLECTION}
      />
    )
  }

  // ── UI Variables ──
  const dir      = sigData.direction
  const str      = sigData.strength
  const conf     = sigData.confidence
  const isCall   = dir === 'CALL'
  const isPut    = dir === 'PUT'
  const sigColor = isCall ? C.green : isPut ? C.red : C.muted

  const sigLabel =
    isScanning ? '⟳  স্ক্যান হচ্ছে...'   :
    isCall     ? '▲  CALL  (UP)'          :
    isPut      ? '▼  PUT  (DOWN)'         :
    lastPred   ? '⏳  রেজাল্ট আসছে...'  :
                 '—  সিগনাল অপেক্ষায়'

  const winRate = score.win + score.loss > 0
    ? Math.round(score.win / (score.win + score.loss) * 100) : 0

  const ki       = sigData.keyIndicators || {}
  const adxInfo  = ki.adx
  const stInfo   = ki.superTrend
  const ichiInfo = ki.ichimoku

  const mtfDir = (d) =>
    d === 'CALL' ? { color: C.green, label: '↑ BULL' } :
    d === 'PUT'  ? { color: C.red,   label: '↓ BEAR' } :
                   { color: C.muted, label: '→ N/A'  }

  const cdMin = Math.floor(countdown / 60)
  const cdSec = countdown % 60
  const cdStr = `${String(cdMin).padStart(2,'0')}:${String(cdSec).padStart(2,'0')}`

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── HEADER ── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 14px', background: C.card,
        borderBottom: `1px solid ${C.border}`,
        fontSize: 11, fontWeight: 700,
      }}>
        <span style={{ color: connStatus.includes('✅') ? C.green : connStatus.includes('⟳') ? C.gold : C.red, fontSize: 10 }}>
          {connStatus}
        </span>
        <span style={{ color: C.gold, fontSize: 10 }}>
          Win: {winRate}% ({score.win}W/{score.loss}L)
        </span>
        <span style={{ color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{liveTime}</span>
      </header>

      {/* ── SESSION BAR ── */}
      <div style={{ background: `${session.msgColor}11`, borderBottom: `1px solid ${session.msgColor}33`, padding: '8px 14px' }}>
        <div style={{ fontSize: 11, color: session.msgColor, fontWeight: 700, marginBottom: 6 }}>
          {session.message}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { key: 'sydney',  label: 'Sydney',  emoji: '🇦🇺' },
            { key: 'tokyo',   label: 'Tokyo',   emoji: '🇯🇵' },
            { key: 'london',  label: 'London',  emoji: '🇬🇧' },
            { key: 'newYork', label: 'New York', emoji: '🇺🇸' },
          ].map(s => {
            const isAct = session.active.some(a => a.key === s.key)
            return (
              <div key={s.key} style={{
                padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                background: isAct ? `${C.green}22` : `${C.border}44`,
                color: isAct ? C.green : C.muted,
                border: `1px solid ${isAct ? C.green+'55' : C.border}`,
              }}>
                {s.emoji} {s.label} {isAct ? '🟢' : '⚪'}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── LIVE PRICE ── */}
      {livePrice && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '6px 14px', background: '#0d1117', borderBottom: `1px solid ${C.border}`,
        }}>
          <span style={{ fontWeight: 800, fontSize: 13 }}>{selected.name}</span>
          <span style={{ fontWeight: 900, fontSize: 14 }}>{livePrice.toFixed(5)}</span>
          {livePriceChg && (
            <span style={{ fontSize: 11, fontWeight: 700, color: livePriceChg.change >= 0 ? C.green : C.red }}>
              {livePriceChg.change >= 0 ? '▲' : '▼'} {Math.abs(livePriceChg.pct).toFixed(3)}%
            </span>
          )}
        </div>
      )}

      {/* ── CHART ── */}
      <div style={{ height: '28vh', background: '#0d1117' }}>
        <iframe
          key={selected.id}
          src={`https://s.tradingview.com/widgetembed/?symbol=${selected.tv}&theme=dark&hide_top_toolbar=1&save_image=0&interval=5`}
          width="100%" height="100%"
          style={{ border: 'none', display: 'block' }}
          title="chart"
        />
      </div>

      {/* ── SCORE ROW ── */}
      <div style={{ display: 'flex', gap: 6, padding: '8px 12px 0' }}>
        {[
          { l: 'WIN',    v: score.win,   c: C.green },
          { l: 'LOSS',   v: score.loss,  c: C.red   },
          { l: 'PROFIT', v: `${score.profit >= 0 ? '+' : ''}${score.profit}x`, c: score.profit >= 0 ? C.green : C.red },
        ].map(x => (
          <div key={x.l} style={{
            flex: 1, padding: '8px 4px', borderRadius: 8, textAlign: 'center',
            background: C.panel, border: `1px solid ${x.c}22`, color: x.c, fontSize: 11, fontWeight: 800,
          }}>
            <div style={{ color: '#444', fontSize: 9, marginBottom: 3 }}>{x.l}</div>
            {x.v}
          </div>
        ))}
        <button onClick={handleReset} style={{
          padding: '0 10px', borderRadius: 8, background: C.panel,
          border: `1px solid ${C.border}`, color: C.muted, fontSize: 11, cursor: 'pointer',
        }}>↺</button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* API Error */}
        {apiError && (
          <div style={{
            background: '#f6465d22', border: `1px solid ${C.red}`, borderRadius: 8,
            padding: '10px 14px', fontSize: 11, color: '#ff6b7a', fontWeight: 700,
          }}>
            ⚠️ {apiError}
          </div>
        )}

        {/* ══ SIGNAL CARD ══ */}
        <div style={{
          borderRadius: 14, padding: '14px', background: C.card,
          border: `2px solid ${isCall ? C.green : isPut ? C.red : C.border}`,
          boxShadow: isCall ? `0 0 28px ${C.green}33` : isPut ? `0 0 28px ${C.red}33` : 'none',
          transition: 'all 0.4s',
        }}>

          {/* KEY INDICATORS */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: '#444', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' }}>
              KEY INDICATORS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {/* ADX */}
              <div style={{ background: '#0d1117', borderRadius: 8, padding: '8px 6px', textAlign: 'center',
                border: `1px solid ${adxInfo && adxInfo.adx > 25 ? (adxInfo.trend === 'BULLISH' ? C.green+'55' : C.red+'55') : C.border}` }}>
                <div style={{ fontSize: 9, color: '#444', marginBottom: 4, fontWeight: 700 }}>ADX {adxInfo ? adxInfo.adx.toFixed(0) : '--'}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: adxInfo && adxInfo.adx > 25 ? (adxInfo.trend === 'BULLISH' ? C.green : C.red) : C.muted }}>
                  {adxInfo ? (adxInfo.adx > 25 ? (adxInfo.trend === 'BULLISH' ? '↑ BULL' : '↓ BEAR') : '→ WEAK') : '→ N/A'}
                </div>
              </div>
              {/* SuperTrend */}
              <div style={{ background: '#0d1117', borderRadius: 8, padding: '8px 6px', textAlign: 'center',
                border: `1px solid ${stInfo ? (stInfo.trend === 'BULLISH' ? C.green+'55' : C.red+'55') : C.border}` }}>
                <div style={{ fontSize: 9, color: '#444', marginBottom: 4, fontWeight: 700 }}>SUPERTREND</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: stInfo ? (stInfo.trend === 'BULLISH' ? C.green : C.red) : C.muted }}>
                  {stInfo ? (stInfo.trend === 'BULLISH' ? '↑ BULL' : '↓ BEAR') : '→ N/A'}
                </div>
              </div>
              {/* Ichimoku */}
              <div style={{ background: '#0d1117', borderRadius: 8, padding: '8px 6px', textAlign: 'center',
                border: `1px solid ${ichiInfo ? (ichiInfo.signal === 'BULLISH' ? C.green+'55' : ichiInfo.signal === 'BEARISH' ? C.red+'55' : C.gold+'33') : C.border}` }}>
                <div style={{ fontSize: 9, color: '#444', marginBottom: 4, fontWeight: 700 }}>ICHIMOKU</div>
                <div style={{ fontSize: 10, fontWeight: 800,
                  color: ichiInfo ? (ichiInfo.signal === 'BULLISH' ? C.green : ichiInfo.signal === 'BEARISH' ? C.red : C.gold) : C.muted }}>
                  {ichiInfo ? (ichiInfo.priceVsCloud === 'INSIDE' ? '☁️ CLOUD' : ichiInfo.signal === 'BULLISH' ? '↑ BULL' : ichiInfo.signal === 'BEARISH' ? '↓ BEAR' : '→ N/A') : '→ N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* MTF */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: '#444', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' }}>
              MULTI-TIMEFRAME
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[
                { label: '1H',  data: mtfData.h1  },
                { label: '15M', data: mtfData.m15 },
                { label: '5M',  data: mtfData.m5  },
              ].map(({ label, data }) => {
                const d = mtfDir(data?.direction)
                return (
                  <div key={label} style={{
                    background: '#0d1117', borderRadius: 8, padding: '6px', textAlign: 'center',
                    border: `1px solid ${data?.direction ? (data.direction === 'CALL' ? C.green+'44' : C.red+'44') : C.border}`,
                  }}>
                    <div style={{ fontSize: 9, color: '#444', marginBottom: 3, fontWeight: 700 }}>{label}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: d.color }}>{d.label}</div>
                  </div>
                )
              })}
            </div>
            {mtfData.h1?.direction && mtfData.m15?.direction && mtfData.m5?.direction &&
              mtfData.h1.direction === mtfData.m15.direction && mtfData.m15.direction === mtfData.m5.direction && (
              <div style={{ textAlign: 'center', marginTop: 6, fontSize: 10, color: C.gold, fontWeight: 700 }}>
                ⚡ সব Timeframe একমত! Ultra Strong!
              </div>
            )}
          </div>

          {/* Signal Label */}
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 900, color: sigColor, marginBottom: 8, letterSpacing: '0.04em' }}>
            {sigLabel}
          </div>

          {/* Strength Badge */}
          {dir && sigData.signalStrength && (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{
                background: sigData.signalStrength === 'ULTRA' ? `${C.gold}22` : sigData.signalStrength === 'STRONG' ? `${C.green}22` : `${C.blue}22`,
                color: sigData.signalStrength === 'ULTRA' ? C.gold : sigData.signalStrength === 'STRONG' ? C.green : C.blue,
                border: `1px solid ${(sigData.signalStrength === 'ULTRA' ? C.gold : sigData.signalStrength === 'STRONG' ? C.green : C.blue)+'55'}`,
                borderRadius: 20, padding: '3px 14px', fontSize: 11, fontWeight: 700,
              }}>
                {sigData.signalStrength === 'ULTRA' ? '⚡ ULTRA' : sigData.signalStrength === 'STRONG' ? '💪 STRONG' : '✅ NORMAL'}
                {' '}— {conf}%
              </span>
            </div>
          )}

          {/* Volume Badge */}
          {sigData.volumeSignal && dir && (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{
                fontSize: 10, padding: '2px 10px', borderRadius: 12,
                background: sigData.volumeSignal.signal === 'HIGH' ? `${C.green}22` : sigData.volumeSignal.signal === 'LOW' ? `${C.red}22` : `${C.border}`,
                color: sigData.volumeSignal.signal === 'HIGH' ? C.green : sigData.volumeSignal.signal === 'LOW' ? C.red : C.muted,
                border: `1px solid ${sigData.volumeSignal.signal === 'HIGH' ? C.green+'44' : sigData.volumeSignal.signal === 'LOW' ? C.red+'44' : C.border}`,
              }}>
                📊 Volume: {sigData.volumeSignal.signal} ({sigData.volumeSignal.ratio}x)
              </span>
            </div>
          )}

          {/* Pattern */}
          {sigData.pattern && sigData.pattern !== 'N/A' && sigData.pattern !== 'No Pattern' && dir && (
            <div style={{ textAlign: 'center', fontSize: 11, color: C.gold, marginBottom: 8 }}>
              📊 {sigData.pattern}
            </div>
          )}

          {/* Countdown */}
          <div style={{ textAlign: 'center', marginBottom: 10, background: '#0d1117', borderRadius: 8, padding: '8px' }}>
            <div style={{ fontSize: 9, color: '#444', marginBottom: 4, fontWeight: 700 }}>পরের Signal</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: countdown < 30 ? C.gold : C.muted, fontVariantNumeric: 'tabular-nums' }}>
              ⏱️ {cdStr}
            </div>
            <div style={{ height: 4, borderRadius: 2, background: '#1a1f2e', marginTop: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${((300 - countdown) / 300) * 100}%`,
                background: countdown < 30 ? C.gold : C.green,
                transition: 'width 1s linear',
              }} />
            </div>
          </div>

          {/* Strength Bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: C.muted, marginBottom: 3 }}>
              <span>PUT ↓</span>
              <span style={{ color: C.gold, fontWeight: 700 }}>শক্তি {str}%</span>
              <span>↑ CALL</span>
            </div>
            <div style={{ height: 7, borderRadius: 4, background: '#0d1117', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0,50-str)}%`, background: str<=35?C.red:`${C.red}44`, transition: 'width 0.5s' }} />
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${Math.max(0,str-50)}%`, background: str>=65?C.green:`${C.green}44`, transition: 'width 0.5s' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: C.border, transform: 'translateX(-50%)' }} />
            </div>
          </div>

          {/* ADX + RSI + Votes */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <div style={{ flex: 1, background: '#0d1117', borderRadius: 6, padding: '5px 8px', fontSize: 10, textAlign: 'center' }}>
              <span style={{ color: '#444' }}>ADX </span>
              <span style={{ color: sigData.adxValue > 25 ? C.green : C.gold, fontWeight: 700 }}>{sigData.adxValue.toFixed(0)}</span>
            </div>
            <div style={{ flex: 1, background: '#0d1117', borderRadius: 6, padding: '5px 8px', fontSize: 10, textAlign: 'center' }}>
              <span style={{ color: '#444' }}>RSI </span>
              <span style={{ color: sigData.rsiValue < 35 ? C.green : sigData.rsiValue > 65 ? C.red : C.gold, fontWeight: 700 }}>{sigData.rsiValue.toFixed(0)}</span>
            </div>
            <div style={{ flex: 1, background: '#0d1117', borderRadius: 6, padding: '5px 8px', fontSize: 10, textAlign: 'center' }}>
              <span style={{ color: C.green, fontWeight: 700 }}>{sigData.callVotes || 0}</span>
              <span style={{ color: '#444' }}>/</span>
              <span style={{ color: C.red, fontWeight: 700 }}>{sigData.putVotes || 0}</span>
            </div>
          </div>

          {/* Full Breakdown */}
          {Object.keys(sigData.breakdown).length > 0 && (
            <>
              <div style={{ fontSize: 9, color: '#333', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' }}>
                ALL INDICATORS ({Object.keys(sigData.breakdown).length})
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 6px' }}>
                {Object.entries(sigData.breakdown).map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 10, padding: '4px 8px', borderRadius: 5, background: '#0d1117',
                  }}>
                    <span style={{ color: '#444' }}>{k}</span>
                    <span style={{
                      fontWeight: 700,
                      color: (v.includes('BULL') || v.includes('UP') || v.includes('OVER') || v.includes('SUP') || v.includes('LOWER') || v.includes('ABOVE'))
                        ? C.green
                        : (v.includes('BEAR') || v.includes('DOWN') || v.includes('RESIST') || v.includes('UPPER') || v.includes('BELOW'))
                        ? C.red
                        : (v.includes('⛔') || v.includes('CLOUD') || v.includes('⚠️'))
                        ? C.gold : C.muted,
                    }}>{v}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {lastSignalTime && (
            <div style={{ textAlign: 'center', fontSize: 10, color: '#333', marginTop: 8 }}>
              শেষ Signal: {lastSignalTime.toLocaleTimeString('en-GB')}
            </div>
          )}
        </div>

        {/* ── MARKET SELECT ── */}
        <select
          value={selected.id}
          onChange={e => setSelected(forexMarkets.find(m => m.id === e.target.value))}
          style={{ padding: '11px 12px', borderRadius: 8, background: C.panel, color: C.text, border: `1px solid ${C.border}`, fontSize: 12 }}
        >
          {forexMarkets.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.cat})</option>
          ))}
        </select>

        {/* ── ACTION BUTTONS ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={fetchMarketData}
            disabled={isScanning || !isSaved}
            style={{
              flex: 2, padding: '14px', borderRadius: 8, fontWeight: 800, fontSize: 13, border: 'none',
              cursor: isScanning || !isSaved ? 'not-allowed' : 'pointer',
              background: isScanning ? C.panel : C.green,
              color: isScanning ? C.muted : '#000',
              opacity: !isSaved ? 0.5 : 1, transition: '0.2s',
            }}
          >
            {isScanning ? '⟳ স্ক্যান হচ্ছে...' : '🔍 সিগনাল জেনারেট'}
          </button>
          <button onClick={() => { setAlertEnabled(n => { const v = !n; localStorage.setItem(ALERT_KEY, v ? 'on' : 'off'); return v }) }} style={{
            padding: '14px 12px', borderRadius: 8, background: C.panel,
            color: alertEnabled ? C.gold : C.muted, fontWeight: 700, fontSize: 12,
            border: `1px solid ${alertEnabled ? C.gold : C.border}`, cursor: 'pointer',
          }}>🔔</button>
          <button onClick={() => setShowHistory(s => !s)} style={{
            padding: '14px 12px', borderRadius: 8, background: C.panel,
            color: C.blue, fontWeight: 700, fontSize: 12,
            border: `1px solid ${showHistory ? C.blue : C.border}`, cursor: 'pointer',
          }}>📋</button>
          <button onClick={() => setShowSettings(s => !s)} style={{
            padding: '14px 12px', borderRadius: 8, background: C.panel,
            color: C.blue, fontWeight: 700, fontSize: 12,
            border: `1px solid ${C.border}`, cursor: 'pointer',
          }}>⚙️</button>
        </div>

        {/* ── SIGNAL HISTORY ── */}
        {showHistory && (
          <div style={{ background: C.card, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: 'uppercase' }}>
                📋 Signal History ({history.length})
              </div>
              <button onClick={handleClearHistory} style={{
                fontSize: 10, color: C.red, background: 'none',
                border: `1px solid ${C.red}44`, borderRadius: 6,
                padding: '3px 8px', cursor: 'pointer',
              }}>🗑️ Clear</button>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: C.muted, fontSize: 12, padding: '16px 0' }}>
                কোনো Signal নেই
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
                {history.map((h, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '6px 10px', borderRadius: 6, background: '#0d1117', fontSize: 10,
                  }}>
                    <span style={{ color: C.muted }}>{h.time}</span>
                    <span style={{ color: C.text, fontWeight: 700 }}>{h.market}</span>
                    <span style={{ color: h.direction === 'CALL' ? C.green : C.red, fontWeight: 800 }}>
                      {h.direction === 'CALL' ? '▲' : '▼'}
                    </span>
                    <span style={{ color: C.gold, fontSize: 9 }}>{h.confidence}%</span>
                    <span style={{
                      color: h.result === 'win' ? C.green : h.result === 'loss' ? C.red : C.muted, fontWeight: 700,
                    }}>
                      {h.result === 'win' ? '✅' : h.result === 'loss' ? '❌' : '⏳'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SOCIAL LINKS ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: '💬 Group',   link: GROUP_LINK },
            { label: '📢 Channel', link: CHANNEL_LINK },
            { label: '🆘 Support', link: SUPPORT_LINK },
          ].map(({ label, link }) => (
            <button key={label} onClick={() => window.open(link, '_blank')} style={{
              flex: 1, padding: '11px', borderRadius: 10, background: '#1a2744',
              color: C.blue, fontWeight: 700, fontSize: 11,
              border: '1px solid #60a5fa33', cursor: 'pointer',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── SETTINGS ── */}
        {showSettings && (
          <div style={{ background: C.card, borderRadius: 12, padding: 14, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              ⚙️ Finnhub API Key
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="password"
                placeholder="আপনার Finnhub API Key দিন"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 8, background: '#0d1117', color: C.text, border: `1px solid ${C.border}`, fontSize: 12, outline: 'none' }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSave} style={{
                  flex: 2, padding: 11, borderRadius: 8,
                  background: C.gold, color: '#000',
                  fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer',
                }}>
                  {isSaved ? '✅ সেভ আছে' : '💾 সেভ করুন'}
                </button>
                <button onClick={handleClearKey} style={{
                  flex: 1, padding: 11, borderRadius: 8,
                  background: '#1a0000', color: C.red,
                  fontWeight: 700, fontSize: 11,
                  border: `1px solid ${C.red}44`, cursor: 'pointer',
                }}>
                  🗑️ ডিলেট
                </button>
              </div>
              <div style={{ fontSize: 10, color: '#444', lineHeight: 1.6 }}>
                💡 finnhub.io → Dashboard → API Key কপি করুন{'\n'}
                প্রতিটি User এর নিজের API Key দরকার{'\n'}
                Free Plan: 60 calls/minute
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
