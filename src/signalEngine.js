// ══════════════════════════════════════════════════════
//   MASTER AI — ULTIMATE FOREX SIGNAL ENGINE
//   দুনিয়ার সবচেয়ে পাওয়ারফুল সিগনাল সিস্টেম
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

// ══════════════════════════════════════════
//   MATH HELPERS
// ══════════════════════════════════════════

const ema = (arr, p) => {
  if (arr.length < p) return null
  const k = 2 / (p + 1)
  let val = arr.slice(0, p).reduce((a, b) => a + b, 0) / p
  for (let i = p; i < arr.length; i++) val = arr[i] * k + val * (1 - k)
  return val
}

const sma = (arr, p) => {
  if (arr.length < p) return null
  return arr.slice(-p).reduce((a, b) => a + b, 0) / p
}

const emaArr = (arr, p) => {
  if (arr.length < p) return []
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
  if (arr.length < p + 1) return []
  const results = []
  for (let i = p; i < arr.length; i++) {
    const slice = arr.slice(i - p, i + 1)
    const ch = slice.map((v, j) => j === 0 ? 0 : v - slice[j - 1]).slice(1)
    const ag = ch.filter(c => c > 0).reduce((a, b) => a + b, 0) / p
    const al = ch.filter(c => c < 0).reduce((a, b) => a - b, 0) / p
    results.push(al === 0 ? 100 : 100 - 100 / (1 + ag / al))
  }
  return results
}

const calcRSI = (arr, p = 14) => {
  const r = rsiArr(arr, p)
  return r.length > 0 ? r[r.length - 1] : null
}

const calcBB = (arr, p = 20, mult = 2) => {
  if (arr.length < p) return null
  const sl = arr.slice(-p)
  const mid = sl.reduce((a, b) => a + b, 0) / p
  const std = Math.sqrt(sl.reduce((a, b) => a + (b - mid) ** 2, 0) / p)
  return { upper: mid + mult * std, mid, lower: mid - mult * std, std, bandwidth: (mult * 2 * std) / mid }
}

const calcMACD = (arr) => {
  if (arr.length < 35) return null
  const e12 = emaArr(arr, 12)
  const e26 = emaArr(arr, 26)
  const diff = Math.min(e12.length, e26.length)
  const macdLine = []
  for (let i = 0; i < diff; i++) {
    macdLine.push(e12[e12.length - diff + i] - e26[e26.length - diff + i])
  }
  if (macdLine.length < 9) return null
  const sigLine = emaArr(macdLine, 9)
  const last = macdLine[macdLine.length - 1]
  const sig = sigLine[sigLine.length - 1]
  const prev = macdLine[macdLine.length - 2]
  const prevSig = sigLine[sigLine.length - 2]
  return {
    line: last,
    signal: sig,
    hist: last - sig,
    prevHist: prev - prevSig,
    crossUp: last > sig && prev <= prevSig,
    crossDown: last < sig && prev >= prevSig,
  }
}

const calcStoch = (candles, p = 14) => {
  if (candles.length < p) return null
  const sl = candles.slice(-p)
  const hh = Math.max(...sl.map(c => parseFloat(c.high)))
  const ll = Math.min(...sl.map(c => parseFloat(c.low)))
  const cl = parseFloat(candles[candles.length - 1].close)
  if (hh === ll) return { k: 50, signal: 'NEUTRAL' }
  const k = ((cl - ll) / (hh - ll)) * 100
  const prevSl = candles.slice(-p - 1, -1)
  const prevHH = Math.max(...prevSl.map(c => parseFloat(c.high)))
  const prevLL = Math.min(...prevSl.map(c => parseFloat(c.low)))
  const prevCl = parseFloat(candles[candles.length - 2].close)
  const prevK = prevHH === prevLL ? 50 : ((prevCl - prevLL) / (prevHH - prevLL)) * 100
  let signal = 'NEUTRAL'
  if (k < 20 && prevK < 20 && k > prevK) signal = 'CALL'
  if (k > 80 && prevK > 80 && k < prevK) signal = 'PUT'
  return { k, prevK, signal }
}

const calcATR = (candles, p = 14) => {
  if (candles.length < p + 1) return null
  const trs = candles.slice(-(p + 1)).map((c, i, a) => {
    if (i === 0) return 0
    const h = parseFloat(c.high), l = parseFloat(c.low), pc = parseFloat(a[i - 1].close)
    return Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }).slice(1)
  return trs.reduce((a, b) => a + b, 0) / p
}

const calcSuperTrend = (candles, p = 10, mult = 3) => {
  if (candles.length < p + 2) return null
  const atrVals = []
  for (let i = 1; i < candles.length; i++) {
    const h = parseFloat(candles[i].high)
    const l = parseFloat(candles[i].low)
    const pc = parseFloat(candles[i - 1].close)
    atrVals.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)))
  }
  const atrSMA = atrVals.slice(-p).reduce((a, b) => a + b, 0) / p
  const last = candles[candles.length - 1]
  const hl2 = (parseFloat(last.high) + parseFloat(last.low)) / 2
  const upperBand = hl2 + mult * atrSMA
  const lowerBand = hl2 - mult * atrSMA
  const close = parseFloat(last.close)
  const prevClose = parseFloat(candles[candles.length - 2].close)
  const trend = close > lowerBand ? 'CALL' : close < upperBand ? 'PUT' : 'NEUTRAL'
  return { trend, upperBand, lowerBand, value: trend === 'CALL' ? lowerBand : upperBand }
}

const calcIchimoku = (candles) => {
  if (candles.length < 52) return null
  const period = (arr, p) => {
    const sl = arr.slice(-p)
    return (Math.max(...sl.map(c => parseFloat(c.high))) + Math.min(...sl.map(c => parseFloat(c.low)))) / 2
  }
  const tenkan = period(candles, 9)
  const kijun = period(candles, 26)
  const senkouA = (tenkan + kijun) / 2
  const senkouB = period(candles, 52)
  const close = parseFloat(candles[candles.length - 1].close)
  const cloudTop = Math.max(senkouA, senkouB)
  const cloudBot = Math.min(senkouA, senkouB)
  let signal = 'NEUTRAL'
  if (close > cloudTop && tenkan > kijun) signal = 'CALL'
  else if (close < cloudBot && tenkan < kijun) signal = 'PUT'
  return { tenkan, kijun, senkouA, senkouB, cloudTop, cloudBot, signal, priceVsCloud: close > cloudTop ? 'ABOVE' : close < cloudBot ? 'BELOW' : 'INSIDE' }
}

const calcADX = (candles, p = 14) => {
  if (candles.length < p + 2) return null
  let plusDM = 0, minusDM = 0, tr = 0
  const sl = candles.slice(-(p + 1))
  for (let i = 1; i < sl.length; i++) {
    const h = parseFloat(sl[i].high), l = parseFloat(sl[i].low)
    const ph = parseFloat(sl[i - 1].high), pl = parseFloat(sl[i - 1].low)
    const pc = parseFloat(sl[i - 1].close)
    const upMove = h - ph
    const downMove = pl - l
    if (upMove > downMove && upMove > 0) plusDM += upMove
    if (downMove > upMove && downMove > 0) minusDM += downMove
    tr += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  if (tr === 0) return null
  const plusDI = (plusDM / tr) * 100
  const minusDI = (minusDM / tr) * 100
  const dx = Math.abs(plusDI - minusDI) / (plusDI + minusDI) * 100
  return { adx: dx, plusDI, minusDI, trend: plusDI > minusDI ? 'CALL' : 'PUT' }
}

const calcCCI = (candles, p = 20) => {
  if (candles.length < p) return null
  const tps = candles.slice(-p).map(c => (parseFloat(c.high) + parseFloat(c.low) + parseFloat(c.close)) / 3)
  const smaTp = tps.reduce((a, b) => a + b, 0) / p
  const meanDev = tps.reduce((s, tp) => s + Math.abs(tp - smaTp), 0) / p
  if (meanDev === 0) return null
  const cci = (tps[tps.length - 1] - smaTp) / (0.015 * meanDev)
  const prevTps = candles.slice(-p - 1, -1).map(c => (parseFloat(c.high) + parseFloat(c.low) + parseFloat(c.close)) / 3)
  const prevSma = prevTps.reduce((a, b) => a + b, 0) / p
  const prevMD = prevTps.reduce((s, tp) => s + Math.abs(tp - prevSma), 0) / p
  const prevCCI = prevMD === 0 ? 0 : (prevTps[prevTps.length - 1] - prevSma) / (0.015 * prevMD)
  let signal = 'NEUTRAL'
  if (cci > -100 && prevCCI <= -100) signal = 'CALL'
  if (cci < 100 && prevCCI >= 100) signal = 'PUT'
  if (cci < -150) signal = 'CALL'
  if (cci > 150) signal = 'PUT'
  return { value: cci, prevValue: prevCCI, signal }
}

const calcWilliamsR = (candles, p = 14) => {
  if (candles.length < p) return null
  const sl = candles.slice(-p)
  const hh = Math.max(...sl.map(c => parseFloat(c.high)))
  const ll = Math.min(...sl.map(c => parseFloat(c.low)))
  const cl = parseFloat(candles[candles.length - 1].close)
  if (hh === ll) return null
  const wr = ((hh - cl) / (hh - ll)) * -100
  let signal = 'NEUTRAL'
  if (wr > -80 && wr < -50) signal = 'CALL'
  if (wr < -20 && wr > -50) signal = 'PUT'
  if (wr > -20) signal = 'PUT'
  if (wr < -80) signal = 'CALL'
  return { value: wr, signal }
}

const calcHeikinAshi = (candles) => {
  if (candles.length < 3) return null
  const ha = []
  for (let i = 0; i < candles.length; i++) {
    const o = parseFloat(candles[i].open)
    const h = parseFloat(candles[i].high)
    const l = parseFloat(candles[i].low)
    const cl = parseFloat(candles[i].close)
    const haClose = (o + h + l + cl) / 4
    const haOpen = i === 0 ? (o + cl) / 2 : (ha[i - 1].open + ha[i - 1].close) / 2
    const haHigh = Math.max(h, haOpen, haClose)
    const haLow = Math.min(l, haOpen, haClose)
    ha.push({ open: haOpen, high: haHigh, low: haLow, close: haClose })
  }
  const last = ha[ha.length - 1]
  const prev = ha[ha.length - 2]
  const isBull = last.close > last.open
  const noLowerWick = last.low === Math.min(last.open, last.close)
  const noUpperWick = last.high === Math.max(last.open, last.close)
  const consecutive = (ha.slice(-3).every(c => c.close > c.open)) ? 'CALL' :
    (ha.slice(-3).every(c => c.close < c.open)) ? 'PUT' : 'NEUTRAL'
  let signal = 'NEUTRAL'
  if (isBull && noLowerWick) signal = 'CALL'
  if (!isBull && noUpperWick) signal = 'PUT'
  return { signal, consecutive, isBull, noLowerWick, noUpperWick }
}

const calcRSIDivergence = (candles, closes) => {
  if (candles.length < 30) return null
  const rsiVals = rsiArr(closes, 14)
  if (rsiVals.length < 15) return null
  const prices = closes.slice(-rsiVals.length)
  const len = prices.length
  const priceLL = prices[len - 1] < Math.min(...prices.slice(-15, -1))
  const rsiHL = rsiVals[len - 1] > rsiVals[len - 8]
  const priceHH = prices[len - 1] > Math.max(...prices.slice(-15, -1))
  const rsiLH = rsiVals[len - 1] < rsiVals[len - 8]
  if (priceLL && rsiHL) return { type: 'BULLISH', signal: 'CALL' }
  if (priceHH && rsiLH) return { type: 'BEARISH', signal: 'PUT' }
  return { type: 'NONE', signal: 'NEUTRAL' }
}

const detectPatterns = (candles) => {
  if (candles.length < 3) return { signal: 'NEUTRAL', pattern: 'None', strength: 0 }
  const last = candles.slice(-3).map(c => {
    const o = parseFloat(c.open), cl = parseFloat(c.close)
    const h = parseFloat(c.high), l = parseFloat(c.low)
    const body = Math.abs(cl - o)
    const lw = Math.min(o, cl) - l
    const uw = h - Math.max(o, cl)
    return { o, cl, h, l, body, lw, uw, bull: cl > o }
  })
  const [c2, c1, c0] = last

  // Strong Patterns (strength 5)
  if (c2.bull && c1.body < c2.body * 0.3 && !c0.bull && c0.cl < (c2.o + c2.cl) / 2)
    return { signal: 'PUT', pattern: 'Evening Star ⭐', strength: 5 }
  if (!c2.bull && c1.body < c2.body * 0.3 && c0.bull && c0.cl > (c2.o + c2.cl) / 2)
    return { signal: 'CALL', pattern: 'Morning Star ⭐', strength: 5 }

  // Medium Patterns (strength 4)
  if (c0.bull && !c1.bull && c0.o <= c1.cl && c0.cl >= c1.o && c0.body > c1.body)
    return { signal: 'CALL', pattern: 'Bullish Engulfing 🟢', strength: 4 }
  if (!c0.bull && c1.bull && c0.o >= c1.cl && c0.cl <= c1.o && c0.body > c1.body)
    return { signal: 'PUT', pattern: 'Bearish Engulfing 🔴', strength: 4 }
  if (last.every(c => c.bull) && last[2].cl > last[0].cl)
    return { signal: 'CALL', pattern: 'Three White Soldiers 🟢', strength: 4 }
  if (last.every(c => !c.bull) && last[2].cl < last[0].cl)
    return { signal: 'PUT', pattern: 'Three Black Crows 🔴', strength: 4 }

  // Light Patterns (strength 2-3)
  if (c0.lw > c0.body * 2 && c0.uw < c0.body * 0.5 && c0.bull)
    return { signal: 'CALL', pattern: 'Hammer 🔨', strength: 3 }
  if (c0.uw > c0.body * 2 && c0.lw < c0.body * 0.5 && !c0.bull)
    return { signal: 'PUT', pattern: 'Shooting Star 💫', strength: 3 }
  if (!c1.bull && c0.bull && c0.cl > (c1.o + c1.cl) / 2)
    return { signal: 'CALL', pattern: 'Piercing Line', strength: 2 }
  if (c1.bull && !c0.bull && c0.cl < (c1.o + c1.cl) / 2)
    return { signal: 'PUT', pattern: 'Dark Cloud Cover', strength: 2 }

  return { signal: 'NEUTRAL', pattern: 'No Pattern', strength: 0 }
}

const detectSRLevels = (candles) => {
  if (candles.length < 20) return { signal: 'NEUTRAL' }
  const recent = candles.slice(-30)
  const close = parseFloat(candles[candles.length - 1].close)
  const highs = recent.map(c => parseFloat(c.high))
  const lows = recent.map(c => parseFloat(c.low))
  const resistance = Math.max(...highs.slice(-20))
  const support = Math.min(...lows.slice(-20))
  const range = resistance - support
  if (range === 0) return { signal: 'NEUTRAL' }
  const pct = (close - support) / range
  let signal = 'NEUTRAL'
  if (pct < 0.15) signal = 'CALL'
  if (pct > 0.85) signal = 'PUT'
  return { signal, support, resistance, pct }
}

const calcFibonacci = (candles) => {
  if (candles.length < 20) return { signal: 'NEUTRAL' }
  const recent = candles.slice(-50)
  const high = Math.max(...recent.map(c => parseFloat(c.high)))
  const low = Math.min(...recent.map(c => parseFloat(c.low)))
  const diff = high - low
  const close = parseFloat(candles[candles.length - 1].close)
  const levels = {
    l0: high,
    l236: high - diff * 0.236,
    l382: high - diff * 0.382,
    l500: high - diff * 0.5,
    l618: high - diff * 0.618,
    l786: high - diff * 0.786,
    l100: low,
  }
  const tolerance = diff * 0.008
  let signal = 'NEUTRAL'
  let nearLevel = ''
  for (const [key, val] of Object.entries(levels)) {
    if (Math.abs(close - val) < tolerance) {
      nearLevel = key
      const prevClose = parseFloat(candles[candles.length - 2].close)
      signal = close > prevClose ? 'CALL' : 'PUT'
      break
    }
  }
  return { signal, nearLevel, levels }
}

// ══════════════════════════════════════════
//   MASTER SIGNAL ENGINE
// ══════════════════════════════════════════

export const runSignalEngine = (candles) => {
  const EMPTY = {
    direction: null, strength: 50, confidence: 0,
    breakdown: {}, pattern: 'N/A', adxValue: 0, rsiValue: 50
  }
  if (candles.length < 60) return EMPTY

  const closes = candles.map(c => parseFloat(c.close))
  const last = closes[closes.length - 1]

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

  const e8  = ema(closes, 8)
  const e21 = ema(closes, 21)
  const e50 = ema(closes, 50)
  const e100 = ema(closes, 100)
  const e200 = ema(closes, 200)

  // ── Filter 1: ATR Gate (অত্যধিক ভোলাটিলিটি বা মৃত মার্কেট) ──
  if (atrPct < 0.008 || atrPct > 0.8) {
    return {
      ...EMPTY,
      breakdown: {
        '⛔ ATR Gate': atrPct < 0.008 ? 'মার্কেট মৃত' : 'অত্যধিক ভোলাটিলিটি'
      }
    }
  }

  // ── Filter 2: ADX Gate (ট্রেন্ড শক্তি) ──
  if (adxData && adxData.adx < 18) {
    return {
      ...EMPTY,
      breakdown: { '⛔ ADX Gate': `ট্রেন্ড দুর্বল (${adxData.adx.toFixed(1)})` }
    }
  }

  const bd = {}
  let callVotes = 0
  let putVotes = 0
  let totalIndicators = 0

  // ── EMA Ribbon (ট্রেন্ড দিক) ──
  if (e8 && e21 && e50) {
    totalIndicators++
    const bullish = e8 > e21 && e21 > e50
    const bearish = e8 < e21 && e21 < e50
    if (bullish) { callVotes += 2; bd['EMA Ribbon'] = '↑ BULL' }
    else if (bearish) { putVotes += 2; bd['EMA Ribbon'] = '↓ BEAR' }
    else bd['EMA Ribbon'] = '→ MIX'
  }

  // ── EMA 100/200 (বড় ট্রেন্ড) ──
  if (e100 && e200) {
    totalIndicators++
    if (last > e200 && e100 > e200) { callVotes++; bd['EMA 200'] = '↑ BULL' }
    else if (last < e200 && e100 < e200) { putVotes++; bd['EMA 200'] = '↓ BEAR' }
    else bd['EMA 200'] = '→ NEUTRAL'
  }

  // ── SuperTrend ──
  if (superTrend) {
    totalIndicators++
    if (superTrend.trend === 'CALL') { callVotes += 2; bd['SuperTrend'] = '↑ BULL' }
    else if (superTrend.trend === 'PUT') { putVotes += 2; bd['SuperTrend'] = '↓ BEAR' }
    else bd['SuperTrend'] = '→ NEUTRAL'
  }

  // ── Ichimoku ──
  if (ichimoku) {
    totalIndicators++
    if (ichimoku.signal === 'CALL') { callVotes += 2; bd['Ichimoku'] = '↑ BULL' }
    else if (ichimoku.signal === 'PUT') { putVotes += 2; bd['Ichimoku'] = '↓ BEAR' }
    else bd['Ichimoku'] = ichimoku.priceVsCloud === 'INSIDE' ? '☁️ CLOUD' : '→ NEUTRAL'
  }

  // ── ADX Direction ──
  if (adxData) {
    totalIndicators++
    if (adxData.adx > 25) {
      if (adxData.trend === 'CALL') { callVotes += 1; bd[`ADX ${adxData.adx.toFixed(0)}`] = '↑ STRONG' }
      else { putVotes += 1; bd[`ADX ${adxData.adx.toFixed(0)}`] = '↓ STRONG' }
    } else {
      bd[`ADX ${adxData.adx.toFixed(0)}`] = '→ WEAK'
    }
  }

  // ── RSI ──
  if (rsiVal !== null) {
    totalIndicators++
    let v = 0
    if (rsiVal < 30) { callVotes += 2; v = 1; bd[`RSI ${rsiVal.toFixed(0)}`] = '↑ OVERSOLD' }
    else if (rsiVal < 45) { callVotes += 1; v = 1; bd[`RSI ${rsiVal.toFixed(0)}`] = '↑ BULL' }
    else if (rsiVal > 70) { putVotes += 2; bd[`RSI ${rsiVal.toFixed(0)}`] = '↓ OVERBOUGHT' }
    else if (rsiVal > 55) { putVotes += 1; bd[`RSI ${rsiVal.toFixed(0)}`] = '↓ BEAR' }
    else bd[`RSI ${rsiVal.toFixed(0)}`] = '→ NEUTRAL'
  }

  // ── RSI Divergence (বোনাস) ──
  if (divData && divData.type !== 'NONE') {
    totalIndicators++
    if (divData.signal === 'CALL') { callVotes += 3; bd['RSI Divergence'] = '↑ BULL DIV' }
    else { putVotes += 3; bd['RSI Divergence'] = '↓ BEAR DIV' }
  }

  // ── Bollinger Bands ──
  if (bbData) {
    totalIndicators++
    const pct = (last - bbData.lower) / (bbData.upper - bbData.lower)
    if (pct < 0.1) { callVotes += 2; bd['Bollinger'] = '↑ LOWER' }
    else if (pct < 0.35) { callVotes += 1; bd['Bollinger'] = '↑ BULL' }
    else if (pct > 0.9) { putVotes += 2; bd['Bollinger'] = '↓ UPPER' }
    else if (pct > 0.65) { putVotes += 1; bd['Bollinger'] = '↓ BEAR' }
    else bd['Bollinger'] = '→ MID'
  }

  // ── MACD ──
  if (macdData) {
    totalIndicators++
    if (macdData.crossUp) { callVotes += 2; bd['MACD'] = '↑ CROSS UP' }
    else if (macdData.crossDown) { putVotes += 2; bd['MACD'] = '↓ CROSS DOWN' }
    else if (macdData.hist > 0 && macdData.hist > macdData.prevHist) { callVotes += 1; bd['MACD'] = '↑ BULL' }
    else if (macdData.hist < 0 && macdData.hist < macdData.prevHist) { putVotes += 1; bd['MACD'] = '↓ BEAR' }
    else bd['MACD'] = '→ NEUTRAL'
  }

  // ── Stochastic ──
  if (stochData) {
    totalIndicators++
    if (stochData.signal === 'CALL') { callVotes += 2; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↑ CALL' }
    else if (stochData.signal === 'PUT') { putVotes += 2; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↓ PUT' }
    else if (stochData.k < 30) { callVotes += 1; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↑ BULL' }
    else if (stochData.k > 70) { putVotes += 1; bd[`Stoch ${stochData.k.toFixed(0)}`] = '↓ BEAR' }
    else bd[`Stoch ${stochData.k.toFixed(0)}`] = '→ NEUTRAL'
  }

  // ── CCI ──
  if (cciData) {
    totalIndicators++
    if (cciData.signal === 'CALL') { callVotes += 2; bd[`CCI ${cciData.value.toFixed(0)}`] = '↑ CALL' }
    else if (cciData.signal === 'PUT') { putVotes += 2; bd[`CCI ${cciData.value.toFixed(0)}`] = '↓ PUT' }
    else bd[`CCI ${cciData.value.toFixed(0)}`] = '→ NEUTRAL'
  }

  // ── Williams %R ──
  if (wrData) {
    totalIndicators++
    if (wrData.signal === 'CALL') { callVotes += 1; bd['Williams %R'] = '↑ BULL' }
    else if (wrData.signal === 'PUT') { putVotes += 1; bd['Williams %R'] = '↓ BEAR' }
    else bd['Williams %R'] = '→ NEUTRAL'
  }

  // ── Heikin-Ashi ──
  if (haData) {
    totalIndicators++
    if (haData.signal === 'CALL') { callVotes += 2; bd['Heikin-Ashi'] = '↑ BULL' }
    else if (haData.signal === 'PUT') { putVotes += 2; bd['Heikin-Ashi'] = '↓ BEAR' }
    else bd['Heikin-Ashi'] = '→ NEUTRAL'
    if (haData.consecutive !== 'NEUTRAL') {
      if (haData.consecutive === 'CALL') callVotes++
      else putVotes++
    }
  }

  // ── Candle Pattern ──
  if (pattern.strength > 0) {
    totalIndicators++
    const weight = pattern.strength
    if (pattern.signal === 'CALL') { callVotes += weight; bd['Pattern'] = `↑ ${pattern.pattern}` }
    else { putVotes += weight; bd['Pattern'] = `↓ ${pattern.pattern}` }
  }

  // ── Support/Resistance ──
  if (srData.signal !== 'NEUTRAL') {
    totalIndicators++
    if (srData.signal === 'CALL') { callVotes += 2; bd['S/R Level'] = '↑ SUPPORT' }
    else { putVotes += 2; bd['S/R Level'] = '↓ RESISTANCE' }
  }

  // ── Fibonacci ──
  if (fibData.signal !== 'NEUTRAL' && fibData.nearLevel) {
    callVotes += fibData.signal === 'CALL' ? 1 : 0
    putVotes += fibData.signal === 'PUT' ? 1 : 0
    bd['Fibonacci'] = fibData.signal === 'CALL' ? `↑ Level ${fibData.nearLevel}` : `↓ Level ${fibData.nearLevel}`
  }

  // ── FINAL DECISION ──
  const total = callVotes + putVotes
  if (total === 0) return EMPTY

  const callPct = (callVotes / total) * 100
  const putPct  = (putVotes / total) * 100

  // Agreement threshold
  const STRONG_THRESHOLD = 72
  const NORMAL_THRESHOLD = 62

  let direction = null
  let signalStrength = 'NORMAL'

  if (callPct >= STRONG_THRESHOLD) {
    direction = 'CALL'
    signalStrength = callPct >= 80 ? 'ULTRA' : 'STRONG'
  } else if (putPct >= STRONG_THRESHOLD) {
    direction = 'PUT'
    signalStrength = putPct >= 80 ? 'ULTRA' : 'STRONG'
  } else if (callPct >= NORMAL_THRESHOLD) {
    direction = 'CALL'
    signalStrength = 'NORMAL'
  } else if (putPct >= NORMAL_THRESHOLD) {
    direction = 'PUT'
    signalStrength = 'NORMAL'
  }

  // Ichimoku INSIDE Cloud → সিগনাল বাতিল
  if (ichimoku && ichimoku.priceVsCloud === 'INSIDE') {
    direction = null
  }

  const confidence = direction === 'CALL' ? Math.round(callPct) : Math.round(putPct)
  const strength = direction === 'CALL' ? Math.round(50 + callPct / 2) : Math.round(50 - putPct / 2)

  return {
    direction,
    strength,
    confidence,
    signalStrength,
    breakdown: bd,
    pattern: pattern.pattern,
    adxValue: adxData?.adx || 0,
    rsiValue: rsiVal || 50,
    callVotes,
    putVotes,
  }
   }
