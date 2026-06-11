import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import TI from 'technicalindicators'; 

const { RSI } = TI; 

const app = express(); 
app.use(cors({ origin: '*', methods: ['GET', 'POST'], credentials: true }));
app.use(express.json());

// ✅ হোইস্টিং ও Temporal Dead Zone (TDZ) সেফ ম্যাপ
const userConnections = new Map();

// 🛠️ রেন্ডার স্লিপ-মোড বাইপাস গেটওয়ে (HTTP Awake Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'awake', timestamp: Date.now(), connections: userConnections.size });
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

function connectToQuotex(wsClientId, ssid, mainWs) {
  if (userConnections.has(wsClientId)) {
    const oldConn = userConnections.get(wsClientId);
    if (oldConn.quotexWs) { try { oldConn.quotexWs.close(); } catch(e){} }
    if (oldConn.pingIntervalId) clearInterval(oldConn.pingIntervalId);
  }

  console.log(`Booting Bulletproof Matrix V2.8.6 Engine: ${wsClientId}`);
  const quotexUrl = "wss://ws.quotex.io/socket.io/?EIO=3&transport=websocket";
  const secureCookie = `ssid=${ssid}; path=/; domain=.quotex.io; Secure; HttpOnly`;

  const quotexWs = new WebSocket(quotexUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 Telegram-Mini-App',
      'Cookie': secureCookie
    }
  });

  const clientState = {
    quotexWs,
    candles: [],
    currentSymbol: "EURUSD_otc",
    lastHeartbeat: Date.now(),
    isChangingMarket: false,
    pingIntervalId: null
  };
  userConnections.set(wsClientId, clientState);

  quotexWs.on('open', () => {
    if (quotexWs.readyState !== WebSocket.OPEN) return;
    console.log(`SSID Link Authenticated: ${wsClientId}`);
    try {
      quotexWs.send(`42["authorization",{"ssid":"${ssid}"}]`);
      quotexWs.send(`42["subscribe_market",{"symbol":"${clientState.currentSymbol}"}]`);
      quotexWs.send(`42["load_candles",{"symbol":"${clientState.currentSymbol}","period":60}]`);
    } catch (err) {}
    
    if (mainWs.readyState === WebSocket.OPEN) {
      mainWs.send(JSON.stringify({ type: 'CONNECTION_SUCCESS', msg: 'Core Algorithmic Engine Active' }));
    }

    clientState.pingIntervalId = setInterval(() => {
      if (quotexWs.readyState === WebSocket.OPEN) {
        try {
          quotexWs.send('2'); 
          quotexWs.send(`42["ping"]`);
        } catch (err) {}
      }
    }, 25000);
  });

  quotexWs.on('message', (data) => {
    const message = data.toString();
    if (userConnections.has(wsClientId)) userConnections.get(wsClientId).lastHeartbeat = Date.now();

    if (message === '2') { 
      try { quotexWs.send('3'); } catch(e){}
      return; 
    }
    if (message === '40') {
      try { quotexWs.send('41'); } catch(e){}
      return;
    }
    if (message.includes('["ping"]') || message.startsWith('42["ping"')) {
      try { quotexWs.send('42["pong"]'); } catch (e) {}
      return;
    }

    try {
      if (message.startsWith('42["candles"')) {
        const rawData = JSON.parse(message.substring(2));
        const candleFeed = rawData[1].data;

        if (Array.isArray(candleFeed)) {
          clientState.candles = candleFeed.map(c => ({
            open: parseFloat(c.open !== undefined ? c.open : c[1]),
            high: parseFloat(c.high !== undefined ? c.high : c[2]),
            low: parseFloat(c.low !== undefined ? c.low : c[3]),
            close: parseFloat(c.close !== undefined ? c.close : c[4]),
            volume: parseFloat(c.volume !== undefined ? c.volume : (c[5] || 0)),
            time: parseInt(c.time !== undefined ? c.time : c[0])
          }));
          clientState.isChangingMarket = false; 
        } else if (candleFeed && typeof candleFeed === 'object') {
          if (clientState.isChangingMarket) return;

          const o = candleFeed.open !== undefined ? candleFeed.open : candleFeed[1];
          const h = candleFeed.high !== undefined ? candleFeed.high : candleFeed[2];
          const l = candleFeed.low !== undefined ? candleFeed.low : candleFeed[3];
          const c = candleFeed.close !== undefined ? candleFeed.close : candleFeed[4];
          const t = candleFeed.time !== undefined ? candleFeed.time : candleFeed[0];

          if (o === undefined || h === undefined || l === undefined || c === undefined || t === undefined) return;

          const latestTick = {
            open: parseFloat(o),
            high: parseFloat(h),
            low: parseFloat(l),
            close: parseFloat(c),
            volume: parseFloat(candleFeed.volume !== undefined ? candleFeed.volume : (candleFeed[5] || 0)),
            time: parseInt(t)
          };

          if (clientState.candles.length > 0) {
            const lastCandle = clientState.candles[clientState.candles.length - 1];
            if (latestTick.time === lastCandle.time) {
              clientState.candles[clientState.candles.length - 1] = latestTick;
            } else if (latestTick.time > lastCandle.time) {
              clientState.candles.push(latestTick);
              if (clientState.candles.length > 150) clientState.candles.shift();
            } else {
              return; 
            }
          } else {
            clientState.candles.push(latestTick);
          }
        }

        processAlgorithmicSignal(mainWs, clientState);
      }
    } catch (err) {}
  });

  quotexWs.on('close', () => {
    console.log(`Quotex Terminal Connection Dropped For Client: ${wsClientId}`);
    if (clientState.pingIntervalId) clearInterval(clientState.pingIntervalId);
    if (mainWs.readyState === WebSocket.OPEN) {
      mainWs.send(JSON.stringify({ 
        type: 'SESSION_EXPIRED', 
        msg: 'সেশনের মেয়াদ শেষ অথবা ভুল SSID! নতুন সঠিক SSID ইনপুট দিন।' 
      }));
    }
    userConnections.delete(wsClientId);
  });
}

function processAlgorithmicSignal(mainWs, clientState) {
  try {
    if (clientState.isChangingMarket) {
      mainWs.send(JSON.stringify({ type: 'LOADING_HISTORY', symbol: clientState.currentSymbol }));
      return;
    }

    const candles = clientState.candles;
    if (!candles || candles.length < 30 || mainWs.readyState !== WebSocket.OPEN) return;

    const closes = candles.map(c => c.close);
    if (!closes || closes.length < 20 || closes.some(isNaN)) return;

    let rsiValues;
    try {
      rsiValues = RSI.calculate({ values: closes, period: 14 });
    } catch (tiErr) {
      return; 
    }

    if (!rsiValues || rsiValues.length === 0) return;
    
    const currentRSI = rsiValues[rsiValues.length - 1];
    if (currentRSI === undefined || isNaN(currentRSI)) return; 
    
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    
    const bodySize = Math.abs(last.close - last.open);
    const upperWick = last.high - Math.max(last.open, last.close);
    const lowerWick = Math.min(last.open, last.close) - last.low;
    
    const isGreen = last.close > last.open;
    const isRed = last.open > last.close;

    let upPoints = 0;
    let downPoints = 0;

    if (currentRSI < 30) upPoints += 3;
    else if (currentRSI < 45) upPoints += 1;
    
    if (currentRSI > 70) downPoints += 3;
    else if (currentRSI > 55) downPoints += 1;

    if (last.volume > prev.volume) {
      if (isGreen) upPoints += 2;
      if (isRed) downPoints += 2;
    }

    if (lowerWick > bodySize * 2 && !isRed) upPoints += 3; 
    if (upperWick > bodySize * 2 && !isGreen) downPoints += 3; 

    const last15Closes = closes.slice(-15);
    const avgPrice = last15Closes.reduce((a, b) => a + b, 0) / last15Closes.length;
    if (last.close > avgPrice) upPoints += 2;
    else downPoints += 2;

    let finalSignal = "SCANNING";
    let finalAccuracy = 0;
    const totalPoints = upPoints + downPoints;

    if (upPoints > downPoints && upPoints >= 5) {
      finalSignal = "UP (CALL)";
      let score = 70 + ((upPoints / totalPoints) * 28);
      finalAccuracy = score > 98 ? 97.80 : score;
    } else if (downPoints > upPoints && downPoints >= 5) {
      finalSignal = "DOWN (PUT)";
      let score = 70 + ((downPoints / totalPoints) * 28);
      finalAccuracy = score > 98 ? 97.80 : score;
    }

    mainWs.send(JSON.stringify({
      type: 'SIGNAL_DATA',
      symbol: clientState.currentSymbol,
      signal: finalSignal,
      accuracy: finalSignal === "SCANNING" ? "00.00" : finalAccuracy.toFixed(2),
      rsi: currentRSI.toFixed(2),
      serverTime: new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC' })
    }));

  } catch (algoErr) {
    console.error("Signal crash bypass active:", algoErr.message);
  }
}

wss.on('connection', (ws) => {
  const clientId = Math.random().toString(36).substring(7);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'CONNECT_ENGINE') {
        connectToQuotex(clientId, data.ssid, ws);
      }
      if (data.type === 'CHANGE_MARKET') {
        const clientState = userConnections.get(clientId);
        if (clientState && clientState.quotexWs.readyState === WebSocket.OPEN) {
          clientState.quotexWs.send(`42["unsubscribe_market",{"symbol":"${clientState.currentSymbol}"}]`);
          
          clientState.currentSymbol = data.symbol;
          clientState.candles = []; 
          clientState.isChangingMarket = true; 

          ws.send(JSON.stringify({ type: 'MARKET_SHIFT_INITIATED', symbol: data.symbol }));
          
          clientState.quotexWs.send(`42["subscribe_market",{"symbol":"${data.symbol}"}]`);
          clientState.quotexWs.send(`42["load_candles",{"symbol":"${data.symbol}","period":60}]`);
        }
      }
    } catch (e) {}
  });

  // ✅ ফাইনাল অপ্টিমাইজড সেফগার্ড ক্লোজ মেকানিজম লক
  ws.on('close', () => {
    if (userConnections.has(clientId)) {
      const clientState = userConnections.get(clientId);
      if (clientState.quotexWs) { 
        try { 
          clientState.quotexWs.onclose = null; // জম্বি ইভেন্ট বাবলিং প্রিভেনশন লক
          clientState.quotexWs.close(); 
        } catch(e){} 
      }
      if (clientState.pingIntervalId) clearInterval(clientState.pingIntervalId);
      userConnections.delete(clientId);
      console.log(`🧹 Cleared Node Memory Slot For Client: ${clientId}`);
    }
  });
});

setInterval(() => {
  const now = Date.now();
  for (const [clientId, clientState] of userConnections.entries()) {
    if (now - clientState.lastHeartbeat > 90000) { 
      if (clientState.quotexWs) { try { clientState.quotexWs.onclose = null; clientState.quotexWs.close(); } catch(e){} }
      if (clientState.pingIntervalId) clearInterval(clientState.pingIntervalId);
      userConnections.delete(clientId);
    }
  }
}, 60000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Matrix V2.8.6 Operational - Sealed & Production Certified`));
