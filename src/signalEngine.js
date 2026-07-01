// ══════════════════════════════════════════════════════
//   MASTER AI — ULTIMATE FOREX SIGNAL ENGINE v4.0
//   Professional Trading System
//   ১৯+ Indicator + Volume Analysis + MTF Support
//   All Bugs Fixed — Error-Free
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
  // ── CAD/CHF Crosses ──
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
  { name: 'USD/INR', id: 'OANDA:USD_INR', tv: 'FX:USDINR', cat: 'Exotic' },
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
//   MATH HELPERS — Error Safe
// ══════════════════════════════════════

const safeFloat = (v) => {
  const n = parseFloat(v)
  return isNaN(n) || !isFinite(n) ? 0 : n
}

const ema = (arr, p) => {
  if (!arr || arr.length < p) return null
  const k = 2 / (p + 1)
  let val = 0
  for (let i = 0; i < p; i++) val += arr[i]
  val /= p
  for (let i = p; i < arr.length; i++) val = arr[i] * k + val * (1 - k)
  return val
}

const sma = (arr, p) => {
  if (!arr || arr.length < p) return null
  let sum = 0
  for (let i = arr.length - p; i < arr.length; i++) sum += arr[i]
  return sum / p
}

const emaArr = (arr, p) => {
  if (!arr || arr.length < p) return []
  const k = 2 / (p + 1)
  const result = []
  let val = 0
  for (let i = 0; i < p; i++) val += arr[i]
  val /= p
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
    let gainSum = 0, lossSum = 0
    for (let j = i - p + 1; j <= i; j++) {
      const diff = arr[j] - arr[j - 1]
      if (diff > 0) gainSum += diff
      else lossSum -= diff
    }
    const ag = gainSum / p
    const al = lossSum / p
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
  let sum = 0
  for (let i = 0; i < p; i++) sum += sl[i]
  const mid = sum / p
  let sqSum = 0
  for (let i = 0; i < p; i++) sqSum += (sl[i] - mid) ** 2
  const std = Math.sqrt(sqSum / p)
  if (std === 0) return null
  return {
    upper: mid + mult * std,
    mid,
    lower: mid - mult * std,
    std,
    bandwidth: (mult * 2 * std) / mid,
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
    line: last, signal: sig,
    hist: last - sig, prevHist: prev - prevSig,
    crossUp:   last > sig && prev <= prevSig,
    crossDown: last < sig && prev >= prevSig,
  }
}

const calcStoch = (candles, p = 14) => {
  if (!candles || candles.length < p + 1) return null
  const sl = candles.slice(-p)
  let hh = -Infinity, ll = Infinity
  for (const c of sl) {
    const h = safeFloat(c.high), l = safeFloat(c.low)
    if (h > hh) hh = h
    if (l < ll) ll = l
  }
  const cl = safeFloat(candles[candles.length - 1].close)
  if (hh === ll) return { k: 50, signal: 'NEUTRAL' }
  const k = ((cl - ll) / (hh - ll)) * 100

  const prevSl = candles.slice(-p - 1, -1)
  let phh = -Infinity, pll = Infinity
  for (const c of prevSl) {
    const h = safeFloat(c.high), l = safeFloat(c.low)
    if (h > phh) phh = h
    if (l < pll) pll = l
  }
  const prevCl = safeFloat(candles[candles.length - 2].close)
  const prevK  = phh === pll ? 50 : ((prevCl - pll) / (phh - pll)) * 100

  let signal = 'NEUTRAL'
  if (k < 20 && prevK < 20 && k > prevK) signal = 'BULLISH'
  if (k > 80 && prevK > 80 && k < prevK) signal = 'BEARISH'
  return { k, prevK, signal }
}

const calcATR = (candles, p = 14) => {
  if (!candles || candles.length < p + 1) return null
  let sum = 0
  for (let i = candles.length - p; i < candles.length; i++) {
    const h  = safeFloat(candles[i].high)
    const l  = safeFloat(candles[i].low)
    const pc = safeFloat(candles[i - 1].close)
    sum += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  return sum / p
}

const calcSuperTrend = (candles, p = 10, mult = 3) => {
  if (!candles || candles.length < p + 2) return null
  let atrSum = 0
  const len = candles.length
  for (let i = len - p; i < len; i++) {
    const h  = safeFloat(candles[i].high)
    const l  = safeFloat(candles[i].low)
    const pc = safeFloat(candles[i - 1].close)
    atrSum += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  const atrSMA    = atrSum / p
  const last      = candles[len - 1]
  const hl2       = (safeFloat(last.high) + safeFloat(last.low)) / 2
  const upperBand = hl2 + mult * atrSMA
  const lowerBand = hl2 - mult * atrSMA
  const close     = safeFloat(last.close)
  const trend     = close > lowerBand ? 'BULLISH' : close < upperBand ? 'BEARISH' : 'NEUTRAL'
  return { trend, upperBand, lowerBand, value: trend === 'BULLISH' ? lowerBand : upperBand }
}

const calcIchimoku = (candles) => {
  if (!candles || candles.length < 52) return null
  const period = (arr, p) => {
    const sl = arr.slice(-p)
    let hi = -Infinity, lo = Infinity
    for (const c of sl) {
      const h = safeFloat(c.high), l = safeFloat(c.low)
      if (h > hi) hi = h
      if (l < lo) lo = l
    }
    return (hi + lo) / 2
  }
  const tenkan   = period(candles, 9)
  const kijun    = period(candles, 26)
  const senkouA  = (tenkan + kijun) / 2
  const senkouB  = period(candles, 52)
  const close    = safeFloat(candles[candles.length - 1].close)
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
    const h  = safeFloat(sl[i].high),  l  = safeFloat(sl[i].low)
    const ph = safeFloat(sl[i-1].high), pl = safeFloat(sl[i-1].low)
    const pc = safeFloat(sl[i-1].close)
    const upMove = h - ph, downMove = pl - l
    if (upMove > downMove && upMove > 0) plusDM += upMove
    if (downMove > upMove && downMove > 0) minusDM += downMove
    tr += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc))
  }
  if (tr === 0) return null
  const plusDI = (plusDM / tr) * 100
  const minusDI = (minusDM / tr) * 100
  const diSum = plusDI + minusDI
  if (diSum === 0) return null
  const dx = (Math.abs(plusDI - minusDI) / diSum) * 100
  return { adx: dx, plusDI, minusDI, trend: plusDI > minusDI ? 'BULLISH' : 'BEARISH' }
}

const calcCCI = (candles, p = 20) => {
  if (!candles || candles.length < p + 1) return null
  const tps = candles.slice(-p).map(c =>
    (safeFloat(c.high) + safeFloat(c.low) + safeFloat(c.close)) / 3
  )
  let sum = 0
  for (const tp of tps) sum += tp
  const smaTp = sum / p
  let mdSum = 0
  for (const tp of tps) mdSum += Math.abs(tp - smaTp)
  const meanDev = mdSum / p
  if (meanDev === 0) return null
  const cci = (tps[tps.length - 1] - smaTp) / (0.015 * meanDev)

  const prevTps = candles.slice(-p - 1, -1).map(c =>
    (safeFloat(c.high) + safeFloat(c.low) + safeFloat(c.close)) / 3
  )
  let pSum = 0
  for (const tp of prevTps) pSum += tp
  const prevSma = pSum / p
  let pMdSum = 0
  for (const tp of prevTps) pMdSum += Math.abs(tp - prevSma)
  const prevMD = pMdSum / p
  const prevCCI = prevMD === 0 ? 0 : (prevTps[prevTps.length - 1] - prevSma) / (0.015 * prevMD)

  let signal = 'NEUTRAL'
  if (cci > -100 && prevCCI <= -100) signal = 'BULLISH'
  if (cci < 100  && prevCCI >= 100)  signal = 'BEARISH'
  if (cci < -150) signal = 'BULLISH'
  if (cci > 150)  signal = 'BEARISH'
  return { value: cci, prevValue: prevCCI, signal }
}

const calcWilliamsR = (candles, p = 14) => {
  if (!candles || candles.length < p) return null
  const sl = candles.slice(-p)
  let hh = -Infinity, ll = Infinity
  for (const c of sl) {
    const h = safeFloat(c.high), l = safeFloat(c.low)
    if (h > hh) hh = h
    if (l < ll) ll = l
  }
  const cl = safeFloat(candles[candles.length - 1].close)
  if (hh === ll) return null
  const wr = ((hh - cl) / (hh - ll)) * -100
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
    const o = safeFloat(candles[i].open), h = safeFloat(candles[i].high)
    const l = safeFloat(candles[i].low),  cl = safeFloat(candles[i].close)
    const haClose = (o + h + l + cl) / 4
    const haOpen  = i === 0 ? (o + cl) / 2 : (ha[i-1].open + ha[i-1].close) / 2
    const haHigh  = Math.max(h, haOpen, haClose)
    const haLow   = Math.min(l, haOpen, haClose)
    ha.push({ open: haOpen, high: haHigh, low: haLow, close: haClose })
  }
  const last = ha[ha.length-1], prev = ha[ha.length-2], prev2 = ha[ha.length-3]
  const isBull = last.close > last.open
  const noLower = last.low === Math.min(last.open, last.close)
  const noUpper = last.high === Math.max(last.open, last.close)
  const consec = (isBull && prev.close > prev.open && prev2.close > prev2.open) ? 'BULLISH'
    : (!isBull && prev.close < prev.open && prev2.close < prev2.open) ? 'BEARISH' : 'NEUTRAL'
  let signal = 'NEUTRAL'
  if (isBull && noLower)  signal = 'BULLISH'
  if (!isBull && noUpper) signal = 'BEARISH'
  return { signal, consecutive: consec, isBull }
}

const calcRSIDivergence = (candles, closes) => {
  if (!candles || candles.length < 30) return null
  const rsiVals = rsiArr(closes, 14)
  if (rsiVals.length < 15) return null
  const prices = closes.slice(-rsiVals.length)
  const len = prices.length
  if (len < 15) return null
  const recentPrices = prices.slice(-15, -1)
  const priceLL = prices[len-1] < Math.min(...recentPrices)
  const rsiHL   = rsiVals[rsiVals.length-1] > rsiVals[rsiVals.length-8]
  const priceHH = prices[len-1] > Math.max(...recentPrices)
  const rsiLH   = rsiVals[rsiVals.length-1] < rsiVals[rsiVals.length-8]
  if (priceLL && rsiHL) return { type: 'BULLISH', signal: 'BULLISH' }
  if (priceHH && rsiLH) return { type: 'BEARISH', signal: 'BEARISH' }
  return { type: 'NONE', signal: 'NEUTRAL' }
}

const detectPatterns = (candles) => {
  if (!candles || candles.length < 3)
    return { signal: 'NEUTRAL', pattern: 'None', strength: 0 }
  const last = candles.slice(-3).map(c => {
    const o = safeFloat(c.open), cl = safeFloat(c.close)
    const h = safeFloat(c.high), l = safeFloat(c.low)
    const body = Math.abs(cl - o)
    return { o, cl, h, l, body, lw: Math.min(o,cl)-l, uw: h-Math.max(o,cl), bull: cl > o }
  })
  const [a, b, c] = last
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
  if (c.lw > c.body*2 && c.uw < c.body*0.5)
    return { signal: 'BULLISH', pattern: 'Hammer 🔨', strength: 3 }
  if (c.uw > c.body*2 && c.lw < c.body*0.5 && !c.bull)
    return { signal: 'BEARISH', pattern: 'Shooting Star 💫', strength: 3 }
  if (!b.bull && c.bull && c.cl > (b.o+b.cl)/2)
    return { signal: 'BULLISH', pattern: 'Piercing Line', strength: 2 }
  if (b.bull && !c.bull && c.cl < (b.o+b.cl)/2)
    return { signal: 'BEARISH', pattern: 'Dark Cloud Cover', strength: 2 }
  return { signal: 'NEUTRAL', pattern: 'No Pattern', strength: 0 }
}

const detectSRLevels = (candles) => {
  if (!candles || candles.length < 20) return { signal: 'NEUTRAL' }
  const recent = candles.slice(-30)
  const close  = safeFloat(candles[candles.length-1].close)
  let resistance = -Infinity, support = Infinity
  for (const c of recent.slice(-20)) {
    const h = safeFloat(c.high), l = safeFloat(c.low)
    if (h > resistance) resistance = h
    if (l < support) support = l
  }
  const range = resistance - support
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
  let high = -Infinity, low = Infinity
  for (const c of recent) {
    const h = safeFloat(c.high), l = safeFloat(c.low)
    if (h > high) high = h
    if (l < low) low = l
  }
  const diff  = high - low
  if (diff === 0) return { signal: 'NEUTRAL' }
  const close = safeFloat(candles[candles.length-1].close)
  const levels = {
    l0: high, l236: high-diff*0.236, l382: high-diff*0.382,
    l500: high-diff*0.5, l618: high-diff*0.618, l786: high-diff*0.786, l100: low,
  }
  const tolerance = diff * 0.01
  let signal = 'NEUTRAL', nearLevel = ''
  for (const [key, val] of Object.entries(levels)) {
    if (Math.abs(close - val) < tolerance) {
      nearLevel = key
      const prevClose = safeFloat(candles[candles.length-2].close)
      signal = close > prevClose ? 'BULLISH' : 'BEARISH'
      break
    }
  }
  return { signal, nearLevel, levels }
}

// ── নতুন: Parabolic SAR ──
const calcParabolicSAR = (candles, step = 0.02, max = 0.2) => {
  if (!candles || candles.length < 10) return null
  let bull = true, af = step
  let ep  = safeFloat(candles[0].low)
  let sar = safeFloat(candles[0].high)

  for (let i = 1; i < candles.length; i++) {
    const high = safeFloat(candles[i].high)
    const low  = safeFloat(candles[i].low)
    const pLow = i > 1 ? safeFloat(candles[i-2].low) : safeFloat(candles[i-1].low)
    const pHigh = i > 1 ? safeFloat(candles[i-2].high) : safeFloat(candles[i-1].high)

    sar = sar + af * (ep - sar)
    if (bull) {
      sar = Math.min(sar, safeFloat(candles[i-1].low), pLow)
      if (low < sar) { bull = false; sar = ep; ep = low; af = step }
      else if (high > ep) { ep = high; af = Math.min(af + step, max) }
    } else {
      sar = Math.max(sar, safeFloat(candles[i-1].high), pHigh)
      if (high > sar) { bull = true; sar = ep; ep = high; af = step }
      else if (low < ep) { ep = low; af = Math.min(af + step, max) }
    }
  }
  return { sar, bull, signal: bull ? 'BULLISH' : 'BEARISH' }
}

// ── নতুন: Pivot Points ──
const calcPivotPoints = (candles) => {
  if (!candles || candles.length < 2) return null
  const prev = candles[candles.length - 2]
  const high = safeFloat(prev.high), low = safeFloat(prev.low), close = safeFloat(prev.close)
  const pivot = (high + low + close) / 3
  const r1 = 2*pivot - low, s1 = 2*pivot - high
  const curr = safeFloat(candles[candles.length-1].close)
  let signal = 'NEUTRAL'
  if (curr > pivot) signal = 'BULLISH'
  else if (curr < pivot) signal = 'BEARISH'
  return { pivot, r1, s1, signal, abovePivot: curr > pivot }
}

// ── নতুন: Donchian Channel ──
const calcDonchian = (candles, p = 20) => {
  if (!candles || candles.length < p) return null
  const sl = candles.slice(-p)
  let upper = -Infinity, lower = Infinity
  for (const c of sl) {
    const h = safeFloat(c.high), l = safeFloat(c.low)
    if (h > upper) upper = h
    if (l < lower) lower = l
  }
  const range = upper - lower
  if (range === 0) return null
  const close = safeFloat(candles[candles.length-1].close)
  const pct = (close - lower) / range
  let signal = 'NEUTRAL'
  if (pct < 0.2) signal = 'BULLISH'
  else if (pct > 0.8) signal = 'BEARISH'
  return { upper, lower, mid: (upper+lower)/2, pct, signal }
}

// ── নতুন: Volume Analysis ──
const calcVolumeSignal = (candles) => {
  if (!candles || candles.length < 20) return null
  const vols = candles.map(c => safeFloat(c.volume))
  const allZero = vols.every(v => v === 0)
  if (allZero) return null

  let avgSum = 0
  const recent20 = vols.slice(-20)
  for (const v of recent20) avgSum += v
  const avgVol = avgSum / 20

  if (avgVol === 0) return null
  const lastVol = vols[vols.length - 1]
  const ratio   = lastVol / avgVol

  let confirm = true
  let signal  = 'NORMAL'
  if (ratio > 1.5) signal = 'HIGH'
  else if (ratio < 0.5) { signal = 'LOW'; confirm = false }

  return { signal, ratio: parseFloat(ratio.toFixed(2)), confirm, lastVol, avgVol: parseFloat(avgVol.toFixed(0)) }
}

// ══════════════════════════════════════════
//   MASTER SIGNAL ENGINE v4.0
//   ১৯+ Indicator + Volume + MTF
// ══════════════════════════════════════════

export const runSignalEngine = (candles, tfLabel = '5M') => {
  const EMPTY = {
    direction: null, strength: 50, confidence: 0,
    breakdown: {}, keyIndicators: {},
    pattern: 'N/A', adxValue: 0, rsiValue: 50,
    callVotes: 0, putVotes: 0, tfLabel,
    volumeSignal: null,
  }

  if (!candles || candles.length < 60) return EMPTY

  const closes = candles.map(c => safeFloat(c.close))
  const last   = closes[closes.length - 1]

  if (last === 0) return EMPTY

  // ── Calculate All Indicators ──
  const adxData    = calcADX(candles, 14)
  const atrVal     = calcATR(candles, 14)
  const smVal      = sma(closes, 20)
  const atrPct     = atrVal && smVal && smVal !== 0 ? (atrVal / smVal) * 100 : 999
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
  const psarData   = calcParabolicSAR(candles)
  const pivotData  = calcPivotPoints(candles)
  const donchian   = calcDonchian(candles, 20)
  const volData    = calcVolumeSignal(candles)

  const e8   = ema(closes, 8)
  const e21  = ema(closes, 21)
  const e50  = ema(closes, 50)
  const e100 = ema(closes, 100)
  const e200 = ema(closes, 200)

  // ── ATR Gate ──
  if (atrPct < 0.02 || atrPct > 2.0) {
    return {
      ...EMPTY,
      breakdown: { '⛔ ATR Gate': atrPct < 0.02 ? 'মার্কেট মৃত' : 'অতিরিক্ত Volatile' },
      keyIndicators: { adx: adxData, superTrend, ichimoku },
      volumeSignal: volData,
    }
  }

  // ── ADX Gate ──
  if (adxData && adxData.adx < 18) {
    return {
      ...EMPTY,
      breakdown: { '⛔ ADX Gate': `Trend দুর্বল (${adxData.adx.toFixed(1)})` },
      keyIndicators: { adx: adxData, superTrend, ichimoku },
      volumeSignal: volData,
    }
  }

  const bd = {}
  let callVotes = 0, putVotes = 0

  // EMA Ribbon
  if (e8 && e21 && e50) {
    if (e8 > e21 && e21 > e50)      { callVotes += 2; bd['EMA Ribbon'] = '↑ BULLISH' }
    else if (e8 < e21 && e21 < e50) { putVotes  += 2; bd['EMA Ribbon'] = '↓ BEARISH' }
    else bd['EMA Ribbon'] = '→ MIXED'
  }

  // EMA 100/200
  if (e100 && e200) {
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

  // ADX Direction
  if (adxData) {
    if (adxData.adx > 25) {
      if (adxData.trend === 'BULLISH')      { callVotes++; bd[`ADX ${adxData.adx.toFixed(0)}`] = '↑ STRONG' }
      else if (adxData.trend === 'BEARISH') { putVotes++;  bd[`ADX ${adxData.adx.toFixed(0)}`] = '↓ STRONG' }
    } else bd[`ADX ${adxData.adx.toFixed(0)}`] = '→ WEAK'
  }

  // RSI
  if (rsiVal !== null) {
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
      const pct = (last - bbData.lower) / range
      if      (pct < 0.10) { callVotes += 2; bd['Bollinger'] = '↑ LOWER BAND' }
      else if (pct < 0.35) { callVotes += 1; bd['Bollinger'] = '↑ BULLISH' }
      else if (pct > 0.90) { putVotes  += 2; bd['Bollinger'] = '↓ UPPER BAND' }
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

  // Candle Pattern
  if (pattern.strength > 0) {
    const w = pattern.strength
    if      (pattern.signal === 'BULLISH') { callVotes += w; bd['Pattern'] = `↑ ${pattern.pattern}` }
    else if (pattern.signal === 'BEARISH') { putVotes  += w; bd['Pattern'] = `↓ ${pattern.pattern}` }
  }

  // S/R Levels
  if (srData.signal !== 'NEUTRAL') {
    if      (srData.signal === 'BULLISH') { callVotes += 2; bd['S/R'] = '↑ SUPPORT' }
    else if (srData.signal === 'BEARISH') { putVotes  += 2; bd['S/R'] = '↓ RESIST' }
  }

  // Fibonacci
  if (fibData.signal !== 'NEUTRAL' && fibData.nearLevel) {
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
    else bd['Pivot'] = '→ NEUTRAL'
  }

  // Donchian
  if (donchian) {
    if      (donchian.signal === 'BULLISH') { callVotes += 1; bd['Donchian'] = '↑ LOWER' }
    else if (donchian.signal === 'BEARISH') { putVotes  += 1; bd['Donchian'] = '↓ UPPER' }
    else bd['Donchian'] = '→ MID'
  }

  // Volume Confirmation
  if (volData) {
    if (volData.signal === 'HIGH') {
      bd['Volume'] = `↑ HIGH (${volData.ratio}x)`
    } else if (volData.signal === 'LOW') {
      bd['Volume'] = `⚠️ LOW (${volData.ratio}x)`
    } else {
      bd['Volume'] = `→ NORMAL (${volData.ratio}x)`
    }
  }

  // ── FINAL DECISION ──
  const total = callVotes + putVotes
  if (total === 0) return { ...EMPTY, keyIndicators: { adx: adxData, superTrend, ichimoku }, volumeSignal: volData }

  const callPct = (callVotes / total) * 100
  const putPct  = (putVotes  / total) * 100

  let direction = null, signalStrength = 'NORMAL'

  if      (callPct >= 80) { direction = 'CALL'; signalStrength = 'ULTRA' }
  else if (callPct >= 72) { direction = 'CALL'; signalStrength = 'STRONG' }
  else if (callPct >= 62) { direction = 'CALL'; signalStrength = 'NORMAL' }
  else if (putPct  >= 80) { direction = 'PUT';  signalStrength = 'ULTRA' }
  else if (putPct  >= 72) { direction = 'PUT';  signalStrength = 'STRONG' }
  else if (putPct  >= 62) { direction = 'PUT';  signalStrength = 'NORMAL' }

  // Ichimoku Kill-Switch
  if (ichimoku && ichimoku.priceVsCloud === 'INSIDE') {
    direction = null
    bd['⛔ Ichimoku'] = 'IN CLOUD — বাতিল'
  }

  // Volume Kill-Switch
  if (volData && !volData.confirm && direction) {
    bd['⚠️ Volume'] = 'Low Volume — সতর্কতা'
  }

  const confidence = direction === 'CALL' ? Math.round(callPct) : direction === 'PUT' ? Math.round(putPct) : 0
  const strength   = direction === 'CALL' ? Math.round(50 + callPct / 2)
                   : direction === 'PUT'  ? Math.round(50 - putPct / 2) : 50

  return {
    direction, strength, confidence, signalStrength,
    breakdown: bd,
    keyIndicators: { adx: adxData, superTrend, ichimoku },
    pattern: pattern.pattern,
    adxValue: adxData?.adx || 0,
    rsiValue: rsiVal || 50,
    callVotes, putVotes, tfLabel,
    volumeSignal: volData,
  }
    }
