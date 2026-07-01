// ══════════════════════════════════════════════════════
//   MASTER AI — ULTIMATE FOREX SIGNAL ENGINE v4.1
//   Production Ready — All Bugs Fixed
//   NaN Safe + Precision Fixed + Volume Analysis
// ══════════════════════════════════════════════════════

export const forexMarkets = [
  // ── Major Pairs ──
  { name: 'EUR/USD', id: 'OANDA:EUR_USD', tv: 'FX:EURUSD', cat: 'Major' },
  { name: 'GBP/USD', id: 'OANDA:GBP_USD', tv: 'FX:GBPUSD', cat: 'Major' },
  { name: 'USD/JPY', id: 'OANDA:USD_JPY', tv: 'FX:USDJPY', cat: 'Major' },
  { name: 'USD/CHF', id: 'OANDA:USD_CHF', tv: 'FX:USDCHF', cat: 'Major' },
  { name: 'USD/CAD', id: 'OANDA:USD_CAD', tv: 'FX:USDCAD', cat: 'Major' },
  { name: 'AUD/USD', id: 'OANDA:AUD_USD', tv: 'FX:AUDUSD', cat: 'Major' },
  { name: 'NZD/USD', id: 'OANDA:NZD_USD', tv: 'FX:NZDUSD', cat: 'Major' },
  // ── EUR Crosses ──
  { name: 'EUR/GBP', id: 'OANDA:EUR_GBP', tv: 'FX:EURGBP', cat: 'Cross' },
  { name: 'EUR/JPY', id: 'OANDA:EUR_JPY', tv: 'FX:EURJPY', cat: 'Cross' },
  { name: 'EUR/CHF', id: 'OANDA:EUR_CHF', tv: 'FX:EURCHF', cat: 'Cross' },
  { name: 'EUR/CAD', id: 'OANDA:EUR_CAD', tv: 'FX:EURCAD', cat: 'Cross' },
  { name: 'EUR/AUD', id: 'OANDA:EUR_AUD', tv: 'FX:EURAUD', cat: 'Cross' },
  { name: 'EUR/NZD', id: 'OANDA:EUR_NZD', tv: 'FX:EURNZD', cat: 'Cross' },
  // ── GBP Crosses ──
  { name: 'GBP/JPY', id: 'OANDA:GBP_JPY', tv: 'FX:GBPJPY', cat: 'Cross' },
  { name: 'GBP/CHF', id: 'OANDA:GBP_CHF', tv: 'FX:GBPCHF', cat: 'Cross' },
  { name: 'GBP/CAD', id: 'OANDA:GBP_CAD', tv: 'FX:GBPCAD', cat: 'Cross' },
  { name: 'GBP/AUD', id: 'OANDA:GBP_AUD', tv: 'FX:GBPAUD', cat: 'Cross' },
  { name: 'GBP/NZD', id: 'OANDA:GBP_NZD', tv: 'FX:GBPNZD', cat: 'Cross' },
  // ── AUD Crosses ──
  { name: 'AUD/JPY', id: 'OANDA:AUD_JPY', tv: 'FX:AUDJPY', cat: 'Cross' },
  { name: 'AUD/CHF', id: 'OANDA:AUD_CHF', tv: 'FX:AUDCHF', cat: 'Cross' },
  { name: 'AUD/CAD', id: 'OANDA:AUD_CAD', tv: 'FX:AUDCAD', cat: 'Cross' },
  { name: 'AUD/NZD', id: 'OANDA:AUD_NZD', tv: 'FX:AUDNZD', cat: 'Cross' },
  // ── NZD Crosses ──
  { name: 'NZD/JPY', id: 'OANDA:NZD_JPY', tv: 'FX:NZDJPY', cat: 'Cross' },
  { name: 'NZD/CHF', id: 'OANDA:NZD_CHF', tv: 'FX:NZDCHF', cat: 'Cross' },
  { name: 'NZD/CAD', id: 'OANDA:NZD_CAD', tv: 'FX:NZDCAD', cat: 'Cross' },
  // ── CAD/CHF ──
  { name: 'CAD/JPY', id: 'OANDA:CAD_JPY', tv: 'FX:CADJPY', cat: 'Cross' },
  { name: 'CAD/CHF', id: 'OANDA:CAD_CHF', tv: 'FX:CADCHF', cat: 'Cross' },
  { name: 'CHF/JPY', id: 'OANDA:CHF_JPY', tv: 'FX:CHFJPY', cat: 'Cross' },
  // ── Exotic USD ──
  { name: 'USD/SGD', id: 'OANDA:USD_SGD', tv: 'FX:USDSGD', cat: 'Exotic' },
  { name: 'USD/HKD', id: 'OANDA:USD_HKD', tv: 'FX:USDHKD', cat: 'Exotic' },
  { name: 'USD/NOK', id: 'OANDA:USD_NOK', tv: 'FX:USDNOK', cat: 'Exotic' },
  { name: 'USD/SEK', id: 'OANDA:USD_SEK', tv: 'FX:USDSEK', cat: 'Exotic' },
  { name: 'USD/DKK', id: 'OANDA:USD_DKK', tv: 'FX:USDDKK', cat: 'Exotic' },
  { name: 'USD/MXN', id: 'OANDA:USD_MXN', tv: 'FX:USDMXN', cat: 'Exotic' },
  { name: 'USD/ZAR', id: 'OANDA:USD_ZAR', tv: 'FX:USDZAR', cat: 'Exotic' },
  { name: 'USD/TRY', id: 'OANDA:USD_TRY', tv: 'FX:USDTRY', cat: 'Exotic' },
  { name: 'USD/PLN', id: 'OANDA:USD_PLN', tv: 'FX:USDPLN', cat: 'Exotic' },
  { name: 'USD/CZK', id: 'OANDA:USD_CZK', tv: 'FX:USDCZK', cat: 'Exotic' },
  { name: 'USD/HUF', id: 'OANDA:USD_HUF', tv: 'FX:USDHUF', cat: 'Exotic' },
  { name: 'USD/THB', id: 'OANDA:USD_THB', tv: 'FX:USDTHB', cat: 'Exotic' },
  { name: 'USD/CNH', id: 'OANDA:USD_CNH', tv: 'FX:USDCNH', cat: 'Exotic' },
  // ── Exotic EUR ──
  { name: 'EUR/NOK', id: 'OANDA:EUR_NOK', tv: 'FX:EURNOK', cat: 'Exotic' },
  { name: 'EUR/SEK', id: 'OANDA:EUR_SEK', tv: 'FX:EURSEK', cat: 'Exotic' },
  { name: 'EUR/DKK', id: 'OANDA:EUR_DKK', tv: 'FX:EURDKK', cat: 'Exotic' },
  { name: 'EUR/TRY', id: 'OANDA:EUR_TRY', tv: 'FX:EURTRY', cat: 'Exotic' },
  { name: 'EUR/ZAR', id: 'OANDA:EUR_ZAR', tv: 'FX:EURZAR', cat: 'Exotic' },
  { name: 'EUR/PLN', id: 'OANDA:EUR_PLN', tv: 'FX:EURPLN', cat: 'Exotic' },
  { name: 'EUR/HUF', id: 'OANDA:EUR_HUF', tv: 'FX:EURHUF', cat: 'Exotic' },
  { name: 'EUR/CZK', id: 'OANDA:EUR_CZK', tv: 'FX:EURCZK', cat: 'Exotic' },
  // ── Exotic GBP ──
  { name: 'GBP/NOK', id: 'OANDA:GBP_NOK', tv: 'FX:GBPNOK', cat: 'Exotic' },
  { name: 'GBP/SEK', id: 'OANDA:GBP_SEK', tv: 'FX:GBPSEK', cat: 'Exotic' },
  { name: 'GBP/ZAR', id: 'OANDA:GBP_ZAR', tv: 'FX:GBPZAR', cat: 'Exotic' },
  { name: 'GBP/PLN', id: 'OANDA:GBP_PLN', tv: 'FX:GBPPLN', cat: 'Exotic' },
]

// ══════════════════════════════════════
//   SAFE MATH HELPERS
//   NaN, Infinity, Zero Division Safe
// ══════════════════════════════════════

const sf = (v, decimals = 6) => {
  const n = parseFloat(v)
  if (isNaN(n) || !isFinite(n)) return 0
  return parseFloat(n.toFixed(decimals))
}

const safeDiv = (a, b) => {
  if (b === 0 || isNaN(b) || !isFinite(b)) return 0
  return a / b
}

const ema = (arr, p) => {
  if (!arr || arr.length < p) return null
  const k = 2 / (p + 1)
  let val = 0
  for (let i = 0; i < p; i++) val += sf(arr[i])
  val = safeDiv(val, p)
  for (let i = p; i < arr.length; i++) {
    val = sf(arr[i]) * k + val * (1 - k)
  }
  return isNaN(val) ? null : val
}

const sma = (arr, p) => {
  if (!arr || arr.length < p) return null
  let sum = 0
  for (let i = arr.length - p; i < arr.length; i++) sum += sf(arr[i])
  const result = safeDiv(sum, p)
  return isNaN(result) ? null : result
}

const emaArr = (arr, p) => {
  if (!arr || arr.length < p) return []
  const k   = 2 / (p + 1)
  const res = []
  let val   = 0
  for (let i = 0; i < p; i++) val += sf(arr[i])
  val = safeDiv(val, p)
  res.push(val)
  for (let i = p; i < arr.length; i++) {
    val = sf(arr[i]) * k + val * (1 - k)
    res.push(val)
  }
  return res
}

const rsiArr = (arr, p = 14) => {
  if (!arr || arr.length < p + 2) return []
  const res = []
  for (let i = p; i < arr.length; i++) {
    let gainSum = 0, lossSum = 0
    for (let j = i - p + 1; j <= i; j++) {
      const diff = sf(arr[j]) - sf(arr[j - 1])
      if (diff > 0) gainSum += diff
      else lossSum -= diff
    }
    const ag  = safeDiv(gainSum, p)
    const al  = safeDiv(lossSum, p)
    const rsi = al === 0 ? 100 : 100 - safeDiv(100, (1 + safeDiv(ag, al)))
    res.push(isNaN(rsi) ? 50 : rsi)
  }
  return res
}

const calcRSI = (arr, p = 14) => {
  const r = rsiArr(arr, p)
  return r.length > 0 ? r[r.length - 1] : null
}

const calcBB = (arr, p = 20, mult = 2) => {
  if (!arr || arr.length < p) return null
  const sl  = arr.slice(-p).map(sf)
  const mid = safeDiv(sl.reduce((a, b) => a + b, 0), p)
  const std = Math.sqrt(safeDiv(sl.reduce((a, b) => a + (b - mid) ** 2, 0), p))
  if (std === 0 || isNaN(std)) return null
  return {
    upper: mid + mult * std,
    mid,
    lower: mid - mult * std,
    std,
    bandwidth: safeDiv(mult * 2 * std, mid),
  }
}

const calcMACD = (arr) => {
  if (!arr || arr.length < 36) return null
  const e12 = emaArr(arr, 12)
  const e26 = emaArr(arr, 26)
  const diff = Math.min(e12.length, e26.length)
  if (diff < 1) return null
  const macdLine = []
  for (let i = 0; i < diff; i++) {
    const v = e12[e12.length - diff + i] - e26[e26.length - diff + i]
    macdLine.push(isNaN(v) ? 0 : v)
  }
  if (macdLine.length < 10) return null
  const sigLine = emaArr(macdLine, 9)
  if (sigLine.length < 2) return null
  const last = macdLine[macdLine.length - 1]
  const sig  = sigLine[sigLine.length - 1]
  const prev = macdLine[macdLine.length - 2]
  const pSig = sigLine[sigLine.length - 2]
  return {
    line: last, signal: sig,
    hist: last - sig, prevHist: prev - pSig,
    crossUp:   last > sig && prev <= pSig,
    crossDown: last < sig && prev >= pSig,
  }
}

const calcStoch = (candles, p = 14) => {
  if (!candles || candles.length < p + 2) return null
  const sl  = candles.slice(-p)
  const hh  = Math.max(...sl.map(c => sf(c.high)))
  const ll  = Math.min(...sl.map(c => sf(c.low)))
  const cl  = sf(candles[candles.length - 1].close)
  if (hh === ll) return { k: 50, signal: 'NEUTRAL' }
  const k = safeDiv(cl - ll, hh - ll) * 100

  const psl  = candles.slice(-p - 1, -1)
  const phh  = Math.max(...psl.map(c => sf(c.high)))
  const pll  = Math.min(...psl.map(c => sf(c.low)))
  const pcl  = sf(candles[candles.length - 2].close)
  const prevK = phh === pll ? 50 : safeDiv(pcl - pll, phh - pll) * 100

  let signal = 'NEUTRAL'
  if (k < 20 && prevK < 20 && k > prevK) signal = 'BULLISH'
  if (k > 80 && prevK > 80 && k < prevK) signal = 'BEARISH'
  return { k, prevK, signal }
}

const calcATR = (candles, p = 14) => {
  if (!candles || candles.length < p + 1) return null
  let sum = 0
  for (let i = candles.length - p; i < candles.length; i++) {
    const h = sf(candles[i].high), l = sf(candles[i].low), pc = sf(candles[i-1].close)
    sum += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  return safeDiv(sum, p)
}

const calcSuperTrend = (candles, p = 10, mult = 3) => {
  if (!candles || candles.length < p + 2) return null
  let atrSum = 0
  for (let i = candles.length - p; i < candles.length; i++) {
    const h = sf(candles[i].high), l = sf(candles[i].low), pc = sf(candles[i-1].close)
    atrSum += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  const atrVal = safeDiv(atrSum, p)
  const last   = candles[candles.length - 1]
  const hl2    = safeDiv(sf(last.high) + sf(last.low), 2)
  const upper  = hl2 + mult * atrVal
  const lower  = hl2 - mult * atrVal
  const close  = sf(last.close)
  const trend  = close > lower ? 'BULLISH' : close < upper ? 'BEARISH' : 'NEUTRAL'
  return { trend, upperBand: upper, lowerBand: lower, value: trend === 'BULLISH' ? lower : upper }
}

const calcIchimoku = (candles) => {
  if (!candles || candles.length < 60) return null
  const period = (arr, p) => {
    const sl = arr.slice(-p)
    const hi = Math.max(...sl.map(c => sf(c.high)))
    const lo = Math.min(...sl.map(c => sf(c.low)))
    return safeDiv(hi + lo, 2)
  }
  const tenkan  = period(candles, 9)
  const kijun   = period(candles, 26)
  const senkouA = safeDiv(tenkan + kijun, 2)
  const senkouB = period(candles, 52)
  const close   = sf(candles[candles.length - 1].close)
  const cloudTop = Math.max(senkouA, senkouB)
  const cloudBot = Math.min(senkouA, senkouB)
  let signal = 'NEUTRAL'
  if (close > cloudTop && tenkan > kijun) signal = 'BULLISH'
  else if (close < cloudBot && tenkan < kijun) signal = 'BEARISH'
  const priceVsCloud = close > cloudTop ? 'ABOVE' : close < cloudBot ? 'BELOW' : 'INSIDE'
  return { tenkan, kijun, senkouA, senkouB, cloudTop, cloudBot, signal, priceVsCloud }
}

const calcADX = (candles, p = 14) => {
  if (!candles || candles.length < p + 2) return null
  let plusDM = 0, minusDM = 0, tr = 0
  const sl = candles.slice(-(p + 1))
  for (let i = 1; i < sl.length; i++) {
    const h = sf(sl[i].high), l = sf(sl[i].low)
    const ph = sf(sl[i-1].high), pl = sf(sl[i-1].low), pc = sf(sl[i-1].close)
    const up = h - ph, dn = pl - l
    if (up > dn && up > 0) plusDM += up
    if (dn > up && dn > 0) minusDM += dn
    tr += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  if (tr === 0) return null
  const pDI = safeDiv(plusDM, tr) * 100
  const mDI = safeDiv(minusDM, tr) * 100
  const sum  = pDI + mDI
  if (sum === 0) return null
  const dx = safeDiv(Math.abs(pDI - mDI), sum) * 100
  return { adx: dx, plusDI: pDI, minusDI: mDI, trend: pDI > mDI ? 'BULLISH' : 'BEARISH' }
}

const calcCCI = (candles, p = 20) => {
  if (!candles || candles.length < p + 2) return null
  const tps = candles.slice(-p).map(c =>
    safeDiv(sf(c.high) + sf(c.low) + sf(c.close), 3)
  )
  const avg = safeDiv(tps.reduce((a, b) => a + b, 0), p)
  const md  = safeDiv(tps.reduce((s, t) => s + Math.abs(t - avg), 0), p)
  if (md === 0) return null
  const cci = safeDiv(tps[tps.length - 1] - avg, 0.015 * md)

  const ptps = candles.slice(-p - 1, -1).map(c =>
    safeDiv(sf(c.high) + sf(c.low) + sf(c.close), 3)
  )
  const pavg = safeDiv(ptps.reduce((a, b) => a + b, 0), p)
  const pmd  = safeDiv(ptps.reduce((s, t) => s + Math.abs(t - pavg), 0), p)
  const prev = pmd === 0 ? 0 : safeDiv(ptps[ptps.length - 1] - pavg, 0.015 * pmd)

  let signal = 'NEUTRAL'
  if (cci > -100 && prev <= -100) signal = 'BULLISH'
  if (cci < 100 && prev >= 100)   signal = 'BEARISH'
  if (cci < -150) signal = 'BULLISH'
  if (cci > 150)  signal = 'BEARISH'
  return { value: cci, prevValue: prev, signal }
}

const calcWilliamsR = (candles, p = 14) => {
  if (!candles || candles.length < p) return null
  const sl = candles.slice(-p)
  const hh = Math.max(...sl.map(c => sf(c.high)))
  const ll = Math.min(...sl.map(c => sf(c.low)))
  const cl = sf(candles[candles.length - 1].close)
  if (hh === ll) return null
  const wr = safeDiv(hh - cl, hh - ll) * -100
  let signal = 'NEUTRAL'
  if (wr <= -80)      signal = 'BULLISH'
  else if (wr >= -20) signal = 'BEARISH'
  else if (wr < -50)  signal = 'BULLISH'
  else if (wr > -50)  signal = 'BEARISH'
  return { value: wr, signal }
}

const calcHeikinAshi = (candles) => {
  if (!candles || candles.length < 5) return null
  const ha = []
  for (let i = 0; i < candles.length; i++) {
    const o = sf(candles[i].open), h = sf(candles[i].high)
    const l = sf(candles[i].low),  c = sf(candles[i].close)
    const haC = safeDiv(o + h + l + c, 4)
    const haO = i === 0 ? safeDiv(o + c, 2) : safeDiv(ha[i-1].open + ha[i-1].close, 2)
    ha.push({ open: haO, high: Math.max(h, haO, haC), low: Math.min(l, haO, haC), close: haC })
  }
  const [p2, p1, cur] = ha.slice(-3)
  const bull  = cur.close > cur.open
  const noLow = cur.low  === Math.min(cur.open, cur.close)
  const noUp  = cur.high === Math.max(cur.open, cur.close)
  const consec = (bull && p1.close > p1.open && p2.close > p2.open) ? 'BULLISH'
    : (!bull && p1.close < p1.open && p2.close < p2.open) ? 'BEARISH' : 'NEUTRAL'
  let signal = 'NEUTRAL'
  if (bull && noLow)  signal = 'BULLISH'
  if (!bull && noUp)  signal = 'BEARISH'
  return { signal, consecutive: consec, isBull: bull }
}

const calcRSIDivergence = (candles, closes) => {
  if (!candles || candles.length < 35) return null
  const rsiVals = rsiArr(closes, 14)
  if (rsiVals.length < 15) return null
  const prices = closes.slice(-rsiVals.length)
  const len = prices.length
  if (len < 15) return null
  const prev15 = prices.slice(-15, -1)
  const priceLL = prices[len-1] < Math.min(...prev15)
  const rsiHL   = rsiVals[rsiVals.length-1] > rsiVals[rsiVals.length-8]
  const priceHH = prices[len-1] > Math.max(...prev15)
  const rsiLH   = rsiVals[rsiVals.length-1] < rsiVals[rsiVals.length-8]
  if (priceLL && rsiHL) return { type: 'BULLISH', signal: 'BULLISH' }
  if (priceHH && rsiLH) return { type: 'BEARISH', signal: 'BEARISH' }
  return { type: 'NONE', signal: 'NEUTRAL' }
}

const detectPatterns = (candles) => {
  if (!candles || candles.length < 3)
    return { signal: 'NEUTRAL', pattern: 'None', strength: 0 }
  const last = candles.slice(-3).map(c => {
    const o = sf(c.open), cl = sf(c.close)
    const h = sf(c.high), l = sf(c.low)
    const body = Math.abs(cl - o)
    return { o, cl, h, l, body, lw: Math.min(o,cl)-l, uw: h-Math.max(o,cl), bull: cl > o }
  })
  const [a, b, c] = last
  if (body => body > 0) {
    if (a.bull && b.body < a.body*0.3 && !c.bull && c.cl < (a.o+a.cl)/2)
      return { signal: 'BEARISH', pattern: 'Evening Star ⭐', strength: 5 }
    if (!a.bull && b.body < a.body*0.3 && c.bull && c.cl > (a.o+a.cl)/2)
      return { signal: 'BULLISH', pattern: 'Morning Star ⭐', strength: 5 }
    if (c.bull && !b.bull && c.o <= b.cl && c.cl >= b.o && c.body > b.body)
      return { signal: 'BULLISH', pattern: 'Bullish Engulfing 🟢', strength: 4 }
    if (!c.bull && b.bull && c.o >= b.cl && c.cl <= b.o && c.body > b.body)
      return { signal: 'BEARISH', pattern: 'Bearish Engulfing 🔴', strength: 4 }
    if (last.every(x => x.bull) && c.cl > a.cl)
      return { signal: 'BULLISH', pattern: 'Three White Soldiers 🟢', strength: 4 }
    if (last.every(x => !x.bull) && c.cl < a.cl)
      return { signal: 'BEARISH', pattern: 'Three Black Crows 🔴', strength: 4 }
    if (c.lw > c.body*2 && c.uw < c.body*0.5 && c.body > 0)
      return { signal: 'BULLISH', pattern: 'Hammer 🔨', strength: 3 }
    if (c.uw > c.body*2 && c.lw < c.body*0.5 && !c.bull && c.body > 0)
      return { signal: 'BEARISH', pattern: 'Shooting Star 💫', strength: 3 }
    if (!b.bull && c.bull && c.cl > (b.o+b.cl)/2)
      return { signal: 'BULLISH', pattern: 'Piercing Line', strength: 2 }
    if (b.bull && !c.bull && c.cl < (b.o+b.cl)/2)
      return { signal: 'BEARISH', pattern: 'Dark Cloud Cover', strength: 2 }
  }
  return { signal: 'NEUTRAL', pattern: 'No Pattern', strength: 0 }
}

const detectSRLevels = (candles) => {
  if (!candles || candles.length < 20) return { signal: 'NEUTRAL' }
  const recent = candles.slice(-30)
  const close  = sf(candles[candles.length - 1].close)
  const res    = Math.max(...recent.slice(-20).map(c => sf(c.high)))
  const sup    = Math.min(...recent.slice(-20).map(c => sf(c.low)))
  const range  = res - sup
  if (range === 0) return { signal: 'NEUTRAL' }
  const pct = safeDiv(close - sup, range)
  return {
    signal: pct < 0.15 ? 'BULLISH' : pct > 0.85 ? 'BEARISH' : 'NEUTRAL',
    support: sup, resistance: res, pct,
  }
}

const calcFibonacci = (candles) => {
  if (!candles || candles.length < 25) return { signal: 'NEUTRAL' }
  const recent = candles.slice(-50)
  const high   = Math.max(...recent.map(c => sf(c.high)))
  const low    = Math.min(...recent.map(c => sf(c.low)))
  const diff   = high - low
  if (diff === 0) return { signal: 'NEUTRAL' }
  const close = sf(candles[candles.length - 1].close)
  const levels = {
    l236: high - diff*0.236, l382: high - diff*0.382,
    l500: high - diff*0.5,   l618: high - diff*0.618,
    l786: high - diff*0.786,
  }
  const tol = diff * 0.01
  for (const [key, val] of Object.entries(levels)) {
    if (Math.abs(close - val) < tol) {
      const prev = sf(candles[candles.length - 2].close)
      return { signal: close > prev ? 'BULLISH' : 'BEARISH', nearLevel: key }
    }
  }
  return { signal: 'NEUTRAL', nearLevel: '' }
}

const calcParabolicSAR = (candles, step = 0.02, max = 0.2) => {
  if (!candles || candles.length < 10) return null
  let bull = true, af = step
  let ep  = sf(candles[0].low)
  let sar = sf(candles[0].high)
  for (let i = 1; i < candles.length; i++) {
    const h = sf(candles[i].high), l = sf(candles[i].low)
    const ph = sf(candles[i-1].high), pl = sf(candles[i-1].low)
    const pp = i > 1 ? sf(candles[i-2].high) : ph
    const ppL = i > 1 ? sf(candles[i-2].low) : pl
    sar = sar + af * (ep - sar)
    if (bull) {
      sar = Math.min(sar, pl, ppL)
      if (l < sar) { bull = false; sar = ep; ep = l; af = step }
      else if (h > ep) { ep = h; af = Math.min(af + step, max) }
    } else {
      sar = Math.max(sar, ph, pp)
      if (h > sar) { bull = true; sar = ep; ep = h; af = step }
      else if (l < ep) { ep = l; af = Math.min(af + step, max) }
    }
  }
  return { sar, bull, signal: bull ? 'BULLISH' : 'BEARISH' }
}

const calcPivotPoints = (candles) => {
  if (!candles || candles.length < 2) return null
  const prev  = candles[candles.length - 2]
  const h = sf(prev.high), l = sf(prev.low), c = sf(prev.close)
  const pivot = safeDiv(h + l + c, 3)
  const curr  = sf(candles[candles.length - 1].close)
  return {
    pivot, r1: 2*pivot - l, s1: 2*pivot - h,
    signal: curr > pivot ? 'BULLISH' : curr < pivot ? 'BEARISH' : 'NEUTRAL',
  }
}

const calcDonchian = (candles, p = 20) => {
  if (!candles || candles.length < p) return null
  const sl  = candles.slice(-p)
  const hi  = Math.max(...sl.map(c => sf(c.high)))
  const lo  = Math.min(...sl.map(c => sf(c.low)))
  const rng = hi - lo
  if (rng === 0) return null
  const cl  = sf(candles[candles.length - 1].close)
  const pct = safeDiv(cl - lo, rng)
  return {
    upper: hi, lower: lo, mid: safeDiv(hi + lo, 2), pct,
    signal: pct < 0.2 ? 'BULLISH' : pct > 0.8 ? 'BEARISH' : 'NEUTRAL',
  }
}

const calcVolumeSignal = (candles) => {
  if (!candles || candles.length < 20) return null
  const vols = candles.map(c => sf(c.volume || 0))
  if (vols.every(v => v === 0)) return null
  const avg20 = safeDiv(vols.slice(-20).reduce((a, b) => a + b, 0), 20)
  if (avg20 === 0) return null
  const last  = vols[vols.length - 1]
  const ratio = safeDiv(last, avg20)
  const signal = ratio > 1.5 ? 'HIGH' : ratio < 0.5 ? 'LOW' : 'NORMAL'
  return { signal, ratio: parseFloat(ratio.toFixed(2)), confirm: signal !== 'LOW' }
}

// ══════════════════════════════════════════
//   MASTER SIGNAL ENGINE v4.1
//   ১৯+ Indicator + NaN Safe + Precision
// ══════════════════════════════════════════

export const runSignalEngine = (candles, tfLabel = '5M') => {
  const EMPTY = {
    direction: null, strength: 50, confidence: 0,
    breakdown: {}, keyIndicators: {},
    pattern: 'N/A', adxValue: 0, rsiValue: 50,
    callVotes: 0, putVotes: 0, tfLabel, volumeSignal: null,
  }

  // ✅ Minimum 100 candles required
  if (!candles || candles.length < 100) return EMPTY

  // Validate candles
  const validCandles = candles.filter(c =>
    c && sf(c.open) > 0 && sf(c.high) > 0 && sf(c.low) > 0 && sf(c.close) > 0
  )
  if (validCandles.length < 100) return EMPTY

  const closes = validCandles.map(c => sf(c.close))
  const last   = closes[closes.length - 1]
  if (last === 0) return EMPTY

  // ── All Indicators ──
  const adxData    = calcADX(validCandles, 14)
  const atrVal     = calcATR(validCandles, 14)
  const smVal      = sma(closes, 20)
  const atrPct     = atrVal && smVal && smVal !== 0 ? safeDiv(atrVal, smVal) * 100 : 999
  const rsiVal     = calcRSI(closes, 14)
  const bbData     = calcBB(closes, 20, 2)
  const macdData   = calcMACD(closes)
  const stochData  = calcStoch(validCandles, 14)
  const superTrend = calcSuperTrend(validCandles, 10, 3)
  const ichimoku   = calcIchimoku(validCandles)
  const cciData    = calcCCI(validCandles, 20)
  const wrData     = calcWilliamsR(validCandles, 14)
  const haData     = calcHeikinAshi(validCandles)
  const divData    = calcRSIDivergence(validCandles, closes)
  const pattern    = detectPatterns(validCandles)
  const srData     = detectSRLevels(validCandles)
  const fibData    = calcFibonacci(validCandles)
  const psarData   = calcParabolicSAR(validCandles)
  const pivotData  = calcPivotPoints(validCandles)
  const donchian   = calcDonchian(validCandles, 20)
  const volData    = calcVolumeSignal(validCandles)

  const e8   = ema(closes, 8)
  const e21  = ema(closes, 21)
  const e50  = ema(closes, 50)
  const e100 = ema(closes, 100)
  const e200 = ema(closes, 200)

  // ── ATR Gate ──
  if (atrPct < 0.02 || atrPct > 3.0) {
    return {
      ...EMPTY,
      breakdown: { '⛔ ATR Gate': atrPct < 0.02 ? 'মার্কেট মৃত' : 'অতিরিক্ত Volatile' },
      keyIndicators: { adx: adxData, superTrend, ichimoku }, volumeSignal: volData,
    }
  }

  // ── ADX Gate ──
  if (adxData && adxData.adx < 15) {
    return {
      ...EMPTY,
      breakdown: { '⛔ ADX Gate': `Trend দুর্বল (${adxData.adx.toFixed(1)})` },
      keyIndicators: { adx: adxData, superTrend, ichimoku }, volumeSignal: volData,
    }
  }

  const bd = {}
  let callVotes = 0, putVotes = 0

  // EMA Ribbon
  if (e8 !== null && e21 !== null && e50 !== null) {
    if (e8 > e21 && e21 > e50)      { callVotes += 2; bd['EMA Ribbon'] = '↑ BULLISH' }
    else if (e8 < e21 && e21 < e50) { putVotes  += 2; bd['EMA Ribbon'] = '↓ BEARISH' }
    else bd['EMA Ribbon'] = '→ MIXED'
  }

  // EMA 100/200
  if (e100 !== null && e200 !== null) {
    if (last > e200 && e100 > e200)      { callVotes++; bd['EMA 200'] = '↑ BULLISH' }
    else if (last < e200 && e100 < e200) { putVotes++;  bd['EMA 200'] = '↓ BEARISH' }
    else bd['EMA 200'] = '→ NEUTRAL'
  }

  // SuperTrend
  if (superTrend) {
    if (superTrend.trend === 'BULLISH')      { callVotes += 2; bd['SuperTrend'] = '↑ BULLISH' }
    else if (superTrend.trend === 'BEARISH') { putVotes  += 2; bd['SuperTrend'] = '↓ BEARISH' }
    else bd['SuperTrend'] = '→ NEUTRAL'
  }

  // Ichimoku
  if (ichimoku) {
    if (ichimoku.signal === 'BULLISH')      { callVotes += 2; bd['Ichimoku'] = '↑ BULLISH' }
    else if (ichimoku.signal === 'BEARISH') { putVotes  += 2; bd['Ichimoku'] = '↓ BEARISH' }
    else bd['Ichimoku'] = ichimoku.priceVsCloud === 'INSIDE' ? '☁️ IN CLOUD' : '→ NEUTRAL'
  }

  // ADX
  if (adxData) {
    if (adxData.adx > 25) {
      if (adxData.trend === 'BULLISH')      { callVotes++; bd[`ADX ${adxData.adx.toFixed(0)}`] = '↑ STRONG' }
      else if (adxData.trend === 'BEARISH') { putVotes++;  bd[`ADX ${adxData.adx.toFixed(0)}`] = '↓ STRONG' }
    } else bd[`ADX ${adxData.adx.toFixed(0)}`] = '→ WEAK'
  }

  // RSI
  if (rsiVal !== null && !isNaN(rsiVal)) {
    if      (rsiVal < 30) { callVotes += 2; bd[`RSI ${rsiVal.toFixed(0)}`] = '↑ OVERSOLD' }
    else if (rsiVal < 45) { callVotes += 1; bd[`RSI ${rsiVal.toFixed(0)}`] = '↑ BULLISH' }
    else if (rsiVal > 70) { putVotes  += 2; bd[`RSI ${rsiVal.toFixed(0)}`] = '↓ OVERBOUGHT' }
    else if (rsiVal > 55) { putVotes  += 1; bd[`RSI ${rsiVal.toFixed(0)}`] = '↓ BEARISH' }
    else bd[`RSI ${rsiVal.toFixed(0)}`] = '→ NEUTRAL'
  }

  // RSI Divergence
  if (divData && divData.type !== 'NONE') {
    if (divData.signal === 'BULLISH')      { callVotes += 3; bd['RSI Div'] = '↑ BULL DIV' }
    else if (divData.signal === 'BEARISH') { putVotes  += 3; bd['RSI Div'] = '↓ BEAR DIV' }
  }

  // Bollinger Bands
  if (bbData) {
    const range = bbData.upper - bbData.lower
    if (range > 0) {
      const pct = safeDiv(last - bbData.lower, range)
      if      (pct < 0.10) { callVotes += 2; bd['Bollinger'] = '↑ LOWER' }
      else if (pct < 0.35) { callVotes += 1; bd['Bollinger'] = '↑ BULLISH' }
      else if (pct > 0.90) { putVotes  += 2; bd['Bollinger'] = '↓ UPPER' }
      else if (pct > 0.65) { putVotes  += 1; bd['Bollinger'] = '↓ BEARISH' }
      else bd['Bollinger'] = '→ MIDDLE'
    }
  }

  // MACD
  if (macdData) {
    if      (macdData.crossUp)                                        { callVotes += 2; bd['MACD'] = '↑ CROSS UP' }
    else if (macdData.crossDown)                                      { putVotes  += 2; bd['MACD'] = '↓ CROSS DOWN' }
    else if (macdData.hist > 0 && macdData.hist > macdData.prevHist) { callVotes += 1; bd['MACD'] = '↑ BULLISH' }
    else if (macdData.hist < 0 && macdData.hist < macdData.prevHist) { putVotes  += 1; bd['MACD'] = '↓ BEARISH' }
    else bd['MACD'] = '→ NEUTRAL'
  }

  // Stochastic
  if (stochData) {
    if      (stochData.signal === 'BULLISH') { callVotes += 2; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↑ BULLISH' }
    else if (stochData.signal === 'BEARISH') { putVotes  += 2; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↓ BEARISH' }
    else if (stochData.k < 30) { callVotes += 1; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↑ LOW' }
    else if (stochData.k > 70) { putVotes  += 1; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↓ HIGH' }
    else bd[`Stoch ${stochData.k.toFixed(0)}`] = '→ NEUTRAL'
  }

  // CCI
  if (cciData) {
    if      (cciData.signal === 'BULLISH') { callVotes += 2; bd[`CCI ${cciData.value.toFixed(0)}`] = '↑ BULL' }
    else if (cciData.signal === 'BEARISH') { putVotes  += 2; bd[`CCI ${cciData.value.toFixed(0)}`] = '↓ BEAR' }
    else bd[`CCI ${cciData.value.toFixed(0)}`] = '→ NEUTRAL'
  }

  // Williams %R
  if (wrData) {
    if      (wrData.signal === 'BULLISH') { callVotes += 1; bd['Williams %R'] = '↑ BULL' }
    else if (wrData.signal === 'BEARISH') { putVotes  += 1; bd['Williams %R'] = '↓ BEAR' }
    else bd['Williams %R'] = '→ NEUTRAL'
  }

  // Heikin-Ashi
  if (haData) {
    if      (haData.signal === 'BULLISH') { callVotes += 2; bd['Heikin-Ashi'] = '↑ BULL' }
    else if (haData.signal === 'BEARISH') { putVotes  += 2; bd['Heikin-Ashi'] = '↓ BEAR' }
    else bd['Heikin-Ashi'] = '→ NEUTRAL'
    if (haData.consecutive === 'BULLISH') callVotes++
    else if (haData.consecutive === 'BEARISH') putVotes++
  }

  // Pattern
  if (pattern && pattern.strength > 0) {
    const w = pattern.strength
    if      (pattern.signal === 'BULLISH') { callVotes += w; bd['Pattern'] = `↑ ${pattern.pattern}` }
    else if (pattern.signal === 'BEARISH') { putVotes  += w; bd['Pattern'] = `↓ ${pattern.pattern}` }
  }

  // S/R
  if (srData && srData.signal !== 'NEUTRAL') {
    if      (srData.signal === 'BULLISH') { callVotes += 2; bd['S/R'] = '↑ SUPPORT' }
    else if (srData.signal === 'BEARISH') { putVotes  += 2; bd['S/R'] = '↓ RESIST' }
  }

  // Fibonacci
  if (fibData && fibData.signal !== 'NEUTRAL' && fibData.nearLevel) {
    if      (fibData.signal === 'BULLISH') { callVotes += 1; bd['Fibo'] = `↑ ${fibData.nearLevel}` }
    else if (fibData.signal === 'BEARISH') { putVotes  += 1; bd['Fibo'] = `↓ ${fibData.nearLevel}` }
  }

  // Parabolic SAR
  if (psarData) {
    if      (psarData.signal === 'BULLISH') { callVotes += 2; bd['P.SAR'] = '↑ BULL' }
    else if (psarData.signal === 'BEARISH') { putVotes  += 2; bd['P.SAR'] = '↓ BEAR' }
  }

  // Pivot Points
  if (pivotData) {
    if      (pivotData.signal === 'BULLISH') { callVotes += 1; bd['Pivot'] = '↑ ABOVE' }
    else if (pivotData.signal === 'BEARISH') { putVotes  += 1; bd['Pivot'] = '↓ BELOW' }
    else bd['Pivot'] = '→ AT PIVOT'
  }

  // Donchian
  if (donchian) {
    if      (donchian.signal === 'BULLISH') { callVotes += 1; bd['Donchian'] = '↑ LOWER' }
    else if (donchian.signal === 'BEARISH') { putVotes  += 1; bd['Donchian'] = '↓ UPPER' }
    else bd['Donchian'] = '→ MID'
  }

  // Volume
  if (volData) {
    bd['Volume'] = `${volData.signal === 'HIGH' ? '↑' : volData.signal === 'LOW' ? '⚠️' : '→'} ${volData.signal} (${volData.ratio}x)`
  }

  // ── FINAL ──
  const total = callVotes + putVotes
  if (total === 0) return { ...EMPTY, keyIndicators: { adx: adxData, superTrend, ichimoku }, volumeSignal: volData }

  const callPct = safeDiv(callVotes, total) * 100
  const putPct  = safeDiv(putVotes,  total) * 100

  let direction = null, signalStrength = 'NORMAL'

  if      (callPct >= 80) { direction = 'CALL'; signalStrength = 'ULTRA'  }
  else if (callPct >= 72) { direction = 'CALL'; signalStrength = 'STRONG' }
  else if (callPct >= 62) { direction = 'CALL'; signalStrength = 'NORMAL' }
  else if (putPct  >= 80) { direction = 'PUT';  signalStrength = 'ULTRA'  }
  else if (putPct  >= 72) { direction = 'PUT';  signalStrength = 'STRONG' }
  else if (putPct  >= 62) { direction = 'PUT';  signalStrength = 'NORMAL' }

  // Ichimoku Kill-Switch
  if (ichimoku && ichimoku.priceVsCloud === 'INSIDE') {
    direction = null
    bd['⛔ Ichimoku'] = 'IN CLOUD — বাতিল'
  }

  // Volume Warning
  if (volData && !volData.confirm && direction) {
    bd['⚠️ Volume'] = `Low (${volData.ratio}x) — সতর্কতা`
  }

  const confidence = direction === 'CALL' ? Math.round(callPct) : direction === 'PUT' ? Math.round(putPct) : 0
  const strength   = direction === 'CALL' ? Math.round(50 + safeDiv(callPct, 2))
                   : direction === 'PUT'  ? Math.round(50 - safeDiv(putPct, 2)) : 50

  return {
    direction, strength, confidence, signalStrength,
    breakdown: bd,
    keyIndicators: { adx: adxData, superTrend, ichimoku },
    pattern: pattern?.pattern || 'N/A',
    adxValue: adxData?.adx || 0,
    rsiValue: rsiVal || 50,
    callVotes, putVotes, tfLabel, volumeSignal: volData,
  }
   }
