// ══════════════════════════════════════════════════════
//   MASTER AI — ULTIMATE FOREX SIGNAL ENGINE v3.0
//   সকল বাগ ফিক্স করা হয়েছে
// ══════════════════════════════════════════════════════

export const forexMarkets = [
  { name: "EUR/USD", id: "frxEURUSD", tv: "FX:EURUSD" },
  { name: "GBP/USD", id: "frxGBPUSD", tv: "FX:GBPUSD" },
  { name: "USD/JPY", id: "frxUSDJPY", tv: "FX:USDJPY" },
  { name: "AUD/USD", id: "frxAUDUSD", tv: "FX:AUDUSD" },
  { name: "USD/CAD", id: "frxUSDCAD", tv: "FX:USDCAD" },
  { name: "EUR/JPY", id: "frxEURJPY", tv: "FX:EURJPY" },
  { name: "GBP/JPY", id: "frxGBPJPY", tv: "FX:GBPJPY" },
  { name: "EUR/GBP", id: "frxEURGBP", tv: "FX:EURGBP" },
  { name: "AUD/JPY", id: "frxAUDJPY", tv: "FX:AUDJPY" },
  { name: "EUR/AUD", id: "frxEURAUD", tv: "FX:EURAUD" },
  { name: "USD/CHF", id: "frxUSDCHF", tv: "FX:USDCHF" },
  { name: "AUD/CAD", id: "frxAUDCAD", tv: "FX:AUDCAD" },
  { name: "AUD/CHF", id: "frxAUDCHF", tv: "FX:AUDCHF" },
  { name: "CHF/JPY", id: "frxCHFJPY", tv: "FX:CHFJPY" },
  { name: "EUR/CHF", id: "frxEURCHF", tv: "FX:EURCHF" },
  { name: "GBP/AUD", id: "frxGBPAUD", tv: "FX:GBPAUD" },
  { name: "CAD/JPY", id: "frxCADJPY", tv: "FX:CADJPY" },
  { name: "GBP/CAD", id: "frxGBPCAD", tv: "FX:GBPCAD" },
  { name: "GBP/CHF", id: "frxGBPCHF", tv: "FX:GBPCHF" },
  { name: "NZD/USD", id: "frxNZDUSD", tv: "FX:NZDUSD" },
  { name: "NZD/JPY", id: "frxNZDJPY", tv: "FX:NZDJPY" },
  { name: "EUR/NZD", id: "frxEURNZD", tv: "FX:EURNZD" },
  { name: "GBP/NZD", id: "frxGBPNZD", tv: "FX:GBPNZD" },
  { name: "AUD/NZD", id: "frxAUDNZD", tv: "FX:AUDNZD" },
]

// ══════════════════════════════════════
//   MATH HELPERS
// ══════════════════════════════════════

const ema = (arr, p) => {
  if (!arr || arr.length < p) return null
  const k = 2 / (p + 1)
  let val = arr.slice(0, p).reduce((a, b) => a + b, 0) / p
  for (let i = p; i < arr.length; i++) val = arr[i] * k + val * (1 - k)
  return val
}

const sma = (arr, p) => {
  if (!arr || arr.length < p) return null
  return arr.slice(-p).reduce((a, b) => a + b, 0) / p
}

const emaArr = (arr, p) => {
  if (!arr || arr.length < p) return []
  const k = 2 / (p + 1)
  const result = []
  let val = arr.slice(0, p).reduce((a, b) => a + b, 0) / p
  result.push(val)
  for (let i = p; i < arr.length; i++) {
    val = arr[i] * k + val * (1 - k)
    result.push(val)
  }
  return result
}

const rsiArr = (arr, p = 14) => {
  if (!arr || arr.length < p + 1) return []
  const results = []
  for (let i = p; i < arr.length; i++) {
    const slice = arr.slice(i - p, i + 1)
    const changes = slice.map((v, j) => j === 0 ? 0 : v - slice[j - 1]).slice(1)
    const gains = changes.filter(c => c > 0)
    const losses = changes.filter(c => c < 0)
    const ag = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / p : 0
    const al = losses.length > 0 ? losses.reduce((a, b) => a - b, 0) / p : 0
    results.push(al === 0 ? 100 : 100 - 100 / (1 + ag / al))
  }
  return results
}

const calcRSI = (arr, p = 14) => {
  const r = rsiArr(arr, p)
  return r.length > 0 ? r[r.length - 1] : null
}

const calcBB = (arr, p = 20, mult = 2) => {
  if (!arr || arr.length < p) return null
  const sl = arr.slice(-p)
  const mid = sl.reduce((a, b) => a + b, 0) / p
  const std = Math.sqrt(sl.reduce((a, b) => a + (b - mid) ** 2, 0) / p)
  return {
    upper: mid + mult * std,
    mid,
    lower: mid - mult * std,
    std,
    bandwidth: (mult * 2 * std) / mid
  }
}

const calcMACD = (arr) => {
  if (!arr || arr.length < 35) return null
  const e12 = emaArr(arr, 12)
  const e26 = emaArr(arr, 26)
  const diff = Math.min(e12.length, e26.length)
  if (diff < 1) return null
  const macdLine = []
  for (let i = 0; i < diff; i++) {
    macdLine.push(e12[e12.length - diff + i] - e26[e26.length - diff + i])
  }
  if (macdLine.length < 9) return null
  const sigLine = emaArr(macdLine, 9)
  if (sigLine.length < 2) return null
  const last    = macdLine[macdLine.length - 1]
  const sig     = sigLine[sigLine.length - 1]
  const prev    = macdLine[macdLine.length - 2]
  const prevSig = sigLine[sigLine.length - 2]
  return {
    line:      last,
    signal:    sig,
    hist:      last - sig,
    prevHist:  prev - prevSig,
    crossUp:   last > sig && prev <= prevSig,
    crossDown: last < sig && prev >= prevSig,
  }
}

const calcStoch = (candles, p = 14) => {
  if (!candles || candles.length < p + 1) return null
  const sl     = candles.slice(-p)
  const hh     = Math.max(...sl.map(c => parseFloat(c.high)))
  const ll     = Math.min(...sl.map(c => parseFloat(c.low)))
  const cl     = parseFloat(candles[candles.length - 1].close)
  if (hh === ll) return { k: 50, signal: 'NEUTRAL' }
  const k      = ((cl - ll) / (hh - ll)) * 100

  const prevSl  = candles.slice(-p - 1, -1)
  const prevHH  = Math.max(...prevSl.map(c => parseFloat(c.high)))
  const prevLL  = Math.min(...prevSl.map(c => parseFloat(c.low)))
  const prevCl  = parseFloat(candles[candles.length - 2].close)
  const prevK   = prevHH === prevLL ? 50 : ((prevCl - prevLL) / (prevHH - prevLL)) * 100

  let signal = 'NEUTRAL'
  if (k < 20 && prevK < 20 && k > prevK) signal = 'BULLISH'
  if (k > 80 && prevK > 80 && k < prevK) signal = 'BEARISH'
  return { k, prevK, signal }
}

const calcATR = (candles, p = 14) => {
  if (!candles || candles.length < p + 1) return null
  const trs = candles.slice(-(p + 1)).map((c, i, a) => {
    if (i === 0) return 0
    const h  = parseFloat(c.high)
    const l  = parseFloat(c.low)
    const pc = parseFloat(a[i - 1].close)
    return Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }).slice(1)
  return trs.reduce((a, b) => a + b, 0) / p
}

const calcSuperTrend = (candles, p = 10, mult = 3) => {
  if (!candles || candles.length < p + 2) return null
  const atrVals = []
  for (let i = 1; i < candles.length; i++) {
    const h  = parseFloat(candles[i].high)
    const l  = parseFloat(candles[i].low)
    const pc = parseFloat(candles[i - 1].close)
    atrVals.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)))
  }
  const atrSMA    = atrVals.slice(-p).reduce((a, b) => a + b, 0) / p
  const last      = candles[candles.length - 1]
  const hl2       = (parseFloat(last.high) + parseFloat(last.low)) / 2
  const upperBand = hl2 + mult * atrSMA
  const lowerBand = hl2 - mult * atrSMA
  const close     = parseFloat(last.close)

  let trend = 'NEUTRAL'
  if (close > lowerBand) trend = 'BULLISH'
  else if (close < upperBand) trend = 'BEARISH'

  return { trend, upperBand, lowerBand, value: trend === 'BULLISH' ? lowerBand : upperBand }
}

const calcIchimoku = (candles) => {
  if (!candles || candles.length < 52) return null
  const period = (arr, p) => {
    const sl = arr.slice(-p)
    return (Math.max(...sl.map(c => parseFloat(c.high))) +
            Math.min(...sl.map(c => parseFloat(c.low)))) / 2
  }
  const tenkan  = period(candles, 9)
  const kijun   = period(candles, 26)
  const senkouA = (tenkan + kijun) / 2
  const senkouB = period(candles, 52)
  const close   = parseFloat(candles[candles.length - 1].close)
  const cloudTop = Math.max(senkouA, senkouB)
  const cloudBot = Math.min(senkouA, senkouB)

  let signal = 'NEUTRAL'
  if (close > cloudTop && tenkan > kijun) signal = 'BULLISH'
  else if (close < cloudBot && tenkan < kijun) signal = 'BEARISH'

  const priceVsCloud = close > cloudTop ? 'ABOVE' : close < cloudBot ? 'BELOW' : 'INSIDE'

  return { tenkan, kijun, senkouA, senkouB, cloudTop, cloudBot, signal, priceVsCloud }
}

// ✅ FIX: Zero division error ঠিক করা হয়েছে
const calcADX = (candles, p = 14) => {
  if (!candles || candles.length < p + 2) return null
  let plusDM = 0, minusDM = 0, tr = 0
  const sl = candles.slice(-(p + 1))
  for (let i = 1; i < sl.length; i++) {
    const h      = parseFloat(sl[i].high)
    const l      = parseFloat(sl[i].low)
    const ph     = parseFloat(sl[i - 1].high)
    const pl     = parseFloat(sl[i - 1].low)
    const pc     = parseFloat(sl[i - 1].close)
    const upMove   = h - ph
    const downMove = pl - l
    if (upMove > downMove && upMove > 0) plusDM += upMove
    if (downMove > upMove && downMove > 0) minusDM += downMove
    tr += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  if (tr === 0) return null

  const plusDI  = (plusDM / tr) * 100
  const minusDI = (minusDM / tr) * 100
  const diSum   = plusDI + minusDI

  // ✅ Zero Division Fix
  if (diSum === 0) return null

  const dx    = (Math.abs(plusDI - minusDI) / diSum) * 100
  const trend = plusDI > minusDI ? 'BULLISH' : 'BEARISH'

  return { adx: dx, plusDI, minusDI, trend }
}

const calcCCI = (candles, p = 20) => {
  if (!candles || candles.length < p + 1) return null
  const tps = candles.slice(-p).map(c =>
    (parseFloat(c.high) + parseFloat(c.low) + parseFloat(c.close)) / 3
  )
  const smaTp  = tps.reduce((a, b) => a + b, 0) / p
  const meanDev = tps.reduce((s, tp) => s + Math.abs(tp - smaTp), 0) / p
  if (meanDev === 0) return null
  const cci = (tps[tps.length - 1] - smaTp) / (0.015 * meanDev)

  const prevTps = candles.slice(-p - 1, -1).map(c =>
    (parseFloat(c.high) + parseFloat(c.low) + parseFloat(c.close)) / 3
  )
  const prevSma = prevTps.reduce((a, b) => a + b, 0) / p
  const prevMD  = prevTps.reduce((s, tp) => s + Math.abs(tp - prevSma), 0) / p
  const prevCCI = prevMD === 0 ? 0 : (prevTps[prevTps.length - 1] - prevSma) / (0.015 * prevMD)

  let signal = 'NEUTRAL'
  if (cci > -100 && prevCCI <= -100) signal = 'BULLISH'
  if (cci < 100  && prevCCI >= 100)  signal = 'BEARISH'
  if (cci < -150) signal = 'BULLISH'
  if (cci > 150)  signal = 'BEARISH'

  return { value: cci, prevValue: prevCCI, signal }
}

// ✅ FIX: Williams %R logic সম্পূর্ণ ঠিক করা হয়েছে
const calcWilliamsR = (candles, p = 14) => {
  if (!candles || candles.length < p) return null
  const sl = candles.slice(-p)
  const hh = Math.max(...sl.map(c => parseFloat(c.high)))
  const ll = Math.min(...sl.map(c => parseFloat(c.low)))
  const cl = parseFloat(candles[candles.length - 1].close)
  if (hh === ll) return null
  const wr = ((hh - cl) / (hh - ll)) * -100

  // ✅ সঠিক Williams %R Logic:
  // wr < -80 → Oversold → BULLISH (CALL)
  // wr > -20 → Overbought → BEARISH (PUT)
  let signal = 'NEUTRAL'
  if (wr <= -80) signal = 'BULLISH'        // Oversold zone
  else if (wr >= -20) signal = 'BEARISH'   // Overbought zone
  else if (wr < -50) signal = 'BULLISH'    // Below midline
  else if (wr > -50) signal = 'BEARISH'    // Above midline

  return { value: wr, signal }
}

// ✅ FIX: Heikin-Ashi সঠিক গাণিতিক লজিক
const calcHeikinAshi = (candles) => {
  if (!candles || candles.length < 5) return null
  const ha = []
  for (let i = 0; i < candles.length; i++) {
    const o  = parseFloat(candles[i].open)
    const h  = parseFloat(candles[i].high)
    const l  = parseFloat(candles[i].low)
    const cl = parseFloat(candles[i].close)

    // ✅ সঠিক HA Close = (O+H+L+C)/4
    const haClose = (o + h + l + cl) / 4

    // ✅ সঠিক HA Open = পূর্ববর্তী HA (Open+Close)/2
    const haOpen = i === 0
      ? (o + cl) / 2
      : (ha[i - 1].open + ha[i - 1].close) / 2

    const haHigh = Math.max(h, haOpen, haClose)
    const haLow  = Math.min(l, haOpen, haClose)

    ha.push({ open: haOpen, high: haHigh, low: haLow, close: haClose })
  }

  const last = ha[ha.length - 1]
  const prev = ha[ha.length - 2]
  const prev2 = ha[ha.length - 3]

  const isBull     = last.close > last.open
  const noLowerWick = last.low === Math.min(last.open, last.close)
  const noUpperWick = last.high === Math.max(last.open, last.close)

  // ✅ ৩টি consecutive candle check
  const last3Bull = isBull && prev.close > prev.open && prev2.close > prev2.open
  const last3Bear = !isBull && prev.close < prev.open && prev2.close < prev2.open
  const consecutive = last3Bull ? 'BULLISH' : last3Bear ? 'BEARISH' : 'NEUTRAL'

  let signal = 'NEUTRAL'
  if (isBull && noLowerWick)  signal = 'BULLISH'
  if (!isBull && noUpperWick) signal = 'BEARISH'

  return { signal, consecutive, isBull, noLowerWick, noUpperWick }
}

const calcRSIDivergence = (candles, closes) => {
  if (!candles || candles.length < 30) return null
  const rsiVals = rsiArr(closes, 14)
  if (rsiVals.length < 15) return null
  const prices = closes.slice(-rsiVals.length)
  const len    = prices.length

  const priceLL = prices[len - 1] < Math.min(...prices.slice(-15, -1))
  const rsiHL   = rsiVals[len - 1] > rsiVals[len - 8]
  const priceHH = prices[len - 1] > Math.max(...prices.slice(-15, -1))
  const rsiLH   = rsiVals[len - 1] < rsiVals[len - 8]

  if (priceLL && rsiHL) return { type: 'BULLISH', signal: 'BULLISH' }
  if (priceHH && rsiLH) return { type: 'BEARISH', signal: 'BEARISH' }
  return { type: 'NONE', signal: 'NEUTRAL' }
}

// ✅ FIX: Candle Pattern indexing সম্পূর্ণ ঠিক করা হয়েছে
const detectPatterns = (candles) => {
  if (!candles || candles.length < 3)
    return { signal: 'NEUTRAL', pattern: 'None', strength: 0 }

  const last = candles.slice(-3).map(c => {
    const o  = parseFloat(c.open)
    const cl = parseFloat(c.close)
    const h  = parseFloat(c.high)
    const l  = parseFloat(c.low)
    const body = Math.abs(cl - o)
    const lw   = Math.min(o, cl) - l
    const uw   = h - Math.max(o, cl)
    return { o, cl, h, l, body, lw, uw, bull: cl > o }
  })

  // ✅ সঠিক indexing:
  // last[0] = oldest (c_old)
  // last[1] = middle (c_mid)
  // last[2] = newest (c_new) ← latest closed candle
  const c_old = last[0]
  const c_mid = last[1]
  const c_new = last[2]

  // ── Strength 5 Patterns ──
  // Evening Star: bull → doji → bear
  if (c_old.bull &&
      c_mid.body < c_old.body * 0.3 &&
      !c_new.bull &&
      c_new.cl < (c_old.o + c_old.cl) / 2)
    return { signal: 'BEARISH', pattern: 'Evening Star ⭐', strength: 5 }

  // Morning Star: bear → doji → bull
  if (!c_old.bull &&
      c_mid.body < c_old.body * 0.3 &&
      c_new.bull &&
      c_new.cl > (c_old.o + c_old.cl) / 2)
    return { signal: 'BULLISH', pattern: 'Morning Star ⭐', strength: 5 }

  // ── Strength 4 Patterns ──
  // Bullish Engulfing
  if (c_new.bull && !c_mid.bull &&
      c_new.o <= c_mid.cl &&
      c_new.cl >= c_mid.o &&
      c_new.body > c_mid.body)
    return { signal: 'BULLISH', pattern: 'Bullish Engulfing 🟢', strength: 4 }

  // Bearish Engulfing
  if (!c_new.bull && c_mid.bull &&
      c_new.o >= c_mid.cl &&
      c_new.cl <= c_mid.o &&
      c_new.body > c_mid.body)
    return { signal: 'BEARISH', pattern: 'Bearish Engulfing 🔴', strength: 4 }

  // Three White Soldiers
  if (last.every(c => c.bull) && c_new.cl > c_old.cl)
    return { signal: 'BULLISH', pattern: 'Three White Soldiers 🟢', strength: 4 }

  // Three Black Crows
  if (last.every(c => !c.bull) && c_new.cl < c_old.cl)
    return { signal: 'BEARISH', pattern: 'Three Black Crows 🔴', strength: 4 }

  // ── Strength 3 Patterns ──
  // Hammer
  if (c_new.lw > c_new.body * 2 && c_new.uw < c_new.body * 0.5)
    return { signal: 'BULLISH', pattern: 'Hammer 🔨', strength: 3 }

  // Shooting Star
  if (c_new.uw > c_new.body * 2 && c_new.lw < c_new.body * 0.5 && !c_new.bull)
    return { signal: 'BEARISH', pattern: 'Shooting Star 💫', strength: 3 }

  // ── Strength 2 Patterns ──
  // Piercing Line
  if (!c_mid.bull && c_new.bull && c_new.cl > (c_mid.o + c_mid.cl) / 2)
    return { signal: 'BULLISH', pattern: 'Piercing Line', strength: 2 }

  // Dark Cloud Cover
  if (c_mid.bull && !c_new.bull && c_new.cl < (c_mid.o + c_mid.cl) / 2)
    return { signal: 'BEARISH', pattern: 'Dark Cloud Cover', strength: 2 }

  return { signal: 'NEUTRAL', pattern: 'No Pattern', strength: 0 }
}

const detectSRLevels = (candles) => {
  if (!candles || candles.length < 20) return { signal: 'NEUTRAL' }
  const recent     = candles.slice(-30)
  const close      = parseFloat(candles[candles.length - 1].close)
  const highs      = recent.map(c => parseFloat(c.high))
  const lows       = recent.map(c => parseFloat(c.low))
  const resistance = Math.max(...highs.slice(-20))
  const support    = Math.min(...lows.slice(-20))
  const range      = resistance - support
  if (range === 0) return { signal: 'NEUTRAL' }
  const pct = (close - support) / range

  let signal = 'NEUTRAL'
  if (pct < 0.15) signal = 'BULLISH'
  if (pct > 0.85) signal = 'BEARISH'
  return { signal, support, resistance, pct }
}

const calcFibonacci = (candles) => {
  if (!candles || candles.length < 20) return { signal: 'NEUTRAL' }
  const recent = candles.slice(-50)
  const high   = Math.max(...recent.map(c => parseFloat(c.high)))
  const low    = Math.min(...recent.map(c => parseFloat(c.low)))
  const diff   = high - low
  const close  = parseFloat(candles[candles.length - 1].close)
  const levels = {
    l0:   high,
    l236: high - diff * 0.236,
    l382: high - diff * 0.382,
    l500: high - diff * 0.5,
    l618: high - diff * 0.618,
    l786: high - diff * 0.786,
    l100: low,
  }
  const tolerance = diff * 0.01
  let signal = 'NEUTRAL', nearLevel = ''
  for (const [key, val] of Object.entries(levels)) {
    if (Math.abs(close - val) < tolerance) {
      nearLevel = key
      const prevClose = parseFloat(candles[candles.length - 2].close)
      signal = close > prevClose ? 'BULLISH' : 'BEARISH'
      break
    }
  }
  return { signal, nearLevel, levels }
}

// ══════════════════════════════════════════
//   MASTER SIGNAL ENGINE v3.0
// ══════════════════════════════════════════

export const runSignalEngine = (candles) => {
  const EMPTY = {
    direction: null, strength: 50, confidence: 0,
    breakdown: {}, keyIndicators: {},
    pattern: 'N/A', adxValue: 0, rsiValue: 50,
    callVotes: 0, putVotes: 0,
  }
  if (!candles || candles.length < 60) return EMPTY

  const closes = candles.map(c => parseFloat(c.close))
  const last   = closes[closes.length - 1]

  // ── সব Indicator ক্যালকুলেট ──
  const adxData    = calcADX(candles, 14)
  const atrVal     = calcATR(candles, 14)
  const smVal      = sma(closes, 20)
  const atrPct     = atrVal && smVal ? (atrVal / smVal) * 100 : 999
  const rsiVal     = calcRSI(closes, 14)
  const bbData     = calcBB(closes, 20, 2)
  const macdData   = calcMACD(closes)
  const stochData  = calcStoch(candles, 14)
  const superTrend = calcSuperTrend(candles, 10, 3)
  const ichimoku   = calcIchimoku(candles)
  const cciData    = calcCCI(candles, 20)
  const wrData     = calcWilliamsR(candles, 14)
  const haData     = calcHeikinAshi(candles)
  const divData    = calcRSIDivergence(candles, closes)
  const pattern    = detectPatterns(candles)
  const srData     = detectSRLevels(candles)
  const fibData    = calcFibonacci(candles)

  const e8   = ema(closes, 8)
  const e21  = ema(closes, 21)
  const e50  = ema(closes, 50)
  const e100 = ema(closes, 100)
  const e200 = ema(closes, 200)

  // ── Filter 1: ATR Gate ──
  // ✅ FIX: Forex এর জন্য সঠিক threshold
  if (atrPct < 0.02 || atrPct > 2.0) {
    return {
      ...EMPTY,
      breakdown: {
        '⛔ ATR Gate': atrPct < 0.02 ? 'মার্কেট মৃত (Dead)' : 'অতিরিক্ত ভোলাটাইল'
      },
      keyIndicators: {
        adx: adxData, superTrend, ichimoku
      }
    }
  }

  // ── Filter 2: ADX Gate ──
  if (adxData && adxData.adx < 18) {
    return {
      ...EMPTY,
      breakdown: { '⛔ ADX Gate': `ট্রেন্ড দুর্বল (${adxData.adx.toFixed(1)})` },
      keyIndicators: { adx: adxData, superTrend, ichimoku }
    }
  }

  const bd = {}
  let callVotes = 0
  let putVotes  = 0

  // ── EMA Ribbon ──
  if (e8 && e21 && e50) {
    const bullish = e8 > e21 && e21 > e50
    const bearish = e8 < e21 && e21 < e50
    if (bullish)      { callVotes += 2; bd['EMA Ribbon'] = '↑ BULLISH' }
    else if (bearish) { putVotes  += 2; bd['EMA Ribbon'] = '↓ BEARISH' }
    else               bd['EMA Ribbon'] = '→ MIXED'
  }

  // ── EMA 100/200 ──
  if (e100 && e200) {
    if (last > e200 && e100 > e200)      { callVotes++; bd['EMA 200'] = '↑ BULLISH' }
    else if (last < e200 && e100 < e200) { putVotes++;  bd['EMA 200'] = '↓ BEARISH' }
    else                                   bd['EMA 200'] = '→ NEUTRAL'
  }

  // ── SuperTrend ──
  if (superTrend) {
    if (superTrend.trend === 'BULLISH')      { callVotes += 2; bd['SuperTrend'] = '↑ BULLISH' }
    else if (superTrend.trend === 'BEARISH') { putVotes  += 2; bd['SuperTrend'] = '↓ BEARISH' }
    else                                       bd['SuperTrend'] = '→ NEUTRAL'
  }

  // ── Ichimoku ──
  if (ichimoku) {
    if (ichimoku.signal === 'BULLISH')      { callVotes += 2; bd['Ichimoku'] = '↑ BULLISH' }
    else if (ichimoku.signal === 'BEARISH') { putVotes  += 2; bd['Ichimoku'] = '↓ BEARISH' }
    else bd['Ichimoku'] = ichimoku.priceVsCloud === 'INSIDE' ? '☁️ IN CLOUD' : '→ NEUTRAL'
  }

  // ── ADX Direction ──
  if (adxData) {
    if (adxData.adx > 25) {
      if (adxData.trend === 'BULLISH')      { callVotes++; bd[`ADX ${adxData.adx.toFixed(0)}`] = '↑ STRONG BULL' }
      else if (adxData.trend === 'BEARISH') { putVotes++;  bd[`ADX ${adxData.adx.toFixed(0)}`] = '↓ STRONG BEAR' }
    } else {
      bd[`ADX ${adxData.adx.toFixed(0)}`] = '→ WEAK TREND'
    }
  }

  // ── RSI ──
  if (rsiVal !== null) {
    if      (rsiVal < 30) { callVotes += 2; bd[`RSI ${rsiVal.toFixed(0)}`] = '↑ OVERSOLD' }
    else if (rsiVal < 45) { callVotes += 1; bd[`RSI ${rsiVal.toFixed(0)}`] = '↑ BULLISH' }
    else if (rsiVal > 70) { putVotes  += 2; bd[`RSI ${rsiVal.toFixed(0)}`] = '↓ OVERBOUGHT' }
    else if (rsiVal > 55) { putVotes  += 1; bd[`RSI ${rsiVal.toFixed(0)}`] = '↓ BEARISH' }
    else                    bd[`RSI ${rsiVal.toFixed(0)}`] = '→ NEUTRAL'
  }

  // ── RSI Divergence ──
  if (divData && divData.type !== 'NONE') {
    if (divData.signal === 'BULLISH')      { callVotes += 3; bd['RSI Divergence'] = '↑ BULL DIV' }
    else if (divData.signal === 'BEARISH') { putVotes  += 3; bd['RSI Divergence'] = '↓ BEAR DIV' }
  }

  // ── Bollinger Bands ──
  if (bbData) {
    const pct = (last - bbData.lower) / (bbData.upper - bbData.lower)
    if      (pct < 0.10) { callVotes += 2; bd['Bollinger'] = '↑ LOWER BAND' }
    else if (pct < 0.35) { callVotes += 1; bd['Bollinger'] = '↑ BULLISH' }
    else if (pct > 0.90) { putVotes  += 2; bd['Bollinger'] = '↓ UPPER BAND' }
    else if (pct > 0.65) { putVotes  += 1; bd['Bollinger'] = '↓ BEARISH' }
    else                   bd['Bollinger'] = '→ MIDDLE'
  }

  // ── MACD ──
  if (macdData) {
    if      (macdData.crossUp)                                      { callVotes += 2; bd['MACD'] = '↑ CROSS UP' }
    else if (macdData.crossDown)                                    { putVotes  += 2; bd['MACD'] = '↓ CROSS DOWN' }
    else if (macdData.hist > 0 && macdData.hist > macdData.prevHist) { callVotes += 1; bd['MACD'] = '↑ BULLISH' }
    else if (macdData.hist < 0 && macdData.hist < macdData.prevHist) { putVotes  += 1; bd['MACD'] = '↓ BEARISH' }
    else                                                              bd['MACD'] = '→ NEUTRAL'
  }

  // ── Stochastic ──
  if (stochData) {
    if      (stochData.signal === 'BULLISH') { callVotes += 2; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↑ BULLISH' }
    else if (stochData.signal === 'BEARISH') { putVotes  += 2; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↓ BEARISH' }
    else if (stochData.k < 30) { callVotes += 1; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↑ OVERSOLD' }
    else if (stochData.k > 70) { putVotes  += 1; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↓ OVERBOUGHT' }
    else                         bd[`Stoch ${stochData.k.toFixed(0)}`] = '→ NEUTRAL'
  }

  // ── CCI ──
  if (cciData) {
    if      (cciData.signal === 'BULLISH') { callVotes += 2; bd[`CCI ${cciData.value.toFixed(0)}`] = '↑ BULLISH' }
    else if (cciData.signal === 'BEARISH') { putVotes  += 2; bd[`CCI ${cciData.value.toFixed(0)}`] = '↓ BEARISH' }
    else                                    bd[`CCI ${cciData.value.toFixed(0)}`] = '→ NEUTRAL'
  }

  // ── Williams %R (✅ Fixed) ──
  if (wrData) {
    if      (wrData.signal === 'BULLISH') { callVotes += 1; bd['Williams %R'] = '↑ BULLISH' }
    else if (wrData.signal === 'BEARISH') { putVotes  += 1; bd['Williams %R'] = '↓ BEARISH' }
    else                                    bd['Williams %R'] = '→ NEUTRAL'
  }

  // ── Heikin-Ashi ──
  if (haData) {
    if      (haData.signal === 'BULLISH') { callVotes += 2; bd['Heikin-Ashi'] = '↑ BULLISH' }
    else if (haData.signal === 'BEARISH') { putVotes  += 2; bd['Heikin-Ashi'] = '↓ BEARISH' }
    else                                    bd['Heikin-Ashi'] = '→ NEUTRAL'

    if (haData.consecutive === 'BULLISH') callVotes++
    else if (haData.consecutive === 'BEARISH') putVotes++
  }

  // ── Candle Pattern ──
  if (pattern.strength > 0) {
    const w = pattern.strength
    if      (pattern.signal === 'BULLISH') { callVotes += w; bd['Pattern'] = `↑ ${pattern.pattern}` }
    else if (pattern.signal === 'BEARISH') { putVotes  += w; bd['Pattern'] = `↓ ${pattern.pattern}` }
  }

  // ── Support/Resistance ──
  if (srData.signal !== 'NEUTRAL') {
    if      (srData.signal === 'BULLISH') { callVotes += 2; bd['S/R Level'] = '↑ AT SUPPORT' }
    else if (srData.signal === 'BEARISH') { putVotes  += 2; bd['S/R Level'] = '↓ AT RESIST' }
  }

  // ── Fibonacci ──
  if (fibData.signal !== 'NEUTRAL' && fibData.nearLevel) {
    if      (fibData.signal === 'BULLISH') { callVotes += 1; bd['Fibonacci'] = `↑ ${fibData.nearLevel}` }
    else if (fibData.signal === 'BEARISH') { putVotes  += 1; bd['Fibonacci'] = `↓ ${fibData.nearLevel}` }
  }

  // ── FINAL DECISION ──
  const total = callVotes + putVotes
  if (total === 0) return { ...EMPTY, keyIndicators: { adx: adxData, superTrend, ichimoku } }

  const callPct = (callVotes / total) * 100
  const putPct  = (putVotes  / total) * 100

  const ULTRA_THRESHOLD  = 80
  const STRONG_THRESHOLD = 72
  const NORMAL_THRESHOLD = 62

  let direction     = null
  let signalStrength = 'NORMAL'

  if (callPct >= ULTRA_THRESHOLD) {
    direction = 'CALL'; signalStrength = 'ULTRA'
  } else if (callPct >= STRONG_THRESHOLD) {
    direction = 'CALL'; signalStrength = 'STRONG'
  } else if (callPct >= NORMAL_THRESHOLD) {
    direction = 'CALL'; signalStrength = 'NORMAL'
  } else if (putPct >= ULTRA_THRESHOLD) {
    direction = 'PUT'; signalStrength = 'ULTRA'
  } else if (putPct >= STRONG_THRESHOLD) {
    direction = 'PUT'; signalStrength = 'STRONG'
  } else if (putPct >= NORMAL_THRESHOLD) {
    direction = 'PUT'; signalStrength = 'NORMAL'
  }

  // ✅ Ichimoku Cloud Kill-Switch
  if (ichimoku && ichimoku.priceVsCloud === 'INSIDE') {
    direction = null
    bd['⛔ Ichimoku'] = 'Price IN CLOUD — বাতিল'
  }

  const confidence = direction === 'CALL'
    ? Math.round(callPct)
    : Math.round(putPct)

  const strength = direction === 'CALL'
    ? Math.round(50 + callPct / 2)
    : Math.round(50 - putPct / 2)

  return {
    direction,
    strength,
    confidence,
    signalStrength,
    breakdown: bd,
    // ✅ Key indicators আলাদাভাবে return করা হচ্ছে UI এর জন্য
    keyIndicators: { adx: adxData, superTrend, ichimoku },
    pattern:   pattern.pattern,
    adxValue:  adxData?.adx || 0,
    rsiValue:  rsiVal || 50,
    callVotes,
    putVotes,
  }
   }
