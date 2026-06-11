import React, { useState, useEffect, useRef } from 'react';

const styles = `
  body { background: #050709; color: white; font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 0; overflow: hidden; user-select: none; height: 100vh; width: 100vw; }
  .login-screen { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, #15191e 0%, #050709 100%); }
  .login-card { background: #0e1114; padding: 25px; border-radius: 20px; border: 1px solid #f3ba2f; width: 320px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.7); }
  .login-card h2 { color: #f3ba2f; margin-bottom: 20px; font-weight: 800; letter-spacing: 1px; font-size: 1.4rem; }
  .input-group { margin-bottom: 15px; text-align: left; }
  .input-group label { display: block; color: #848e9c; font-size: 0.75rem; margin-bottom: 6px; font-weight: 600; }
  .input-group input { width: 100%; padding: 12px; background: #050709; border: 1px solid #2b2f36; border-radius: 10px; color: white; box-sizing: border-box; outline: none; transition: 0.3s; font-size: 0.9rem; text-align: center; }
  .input-group input:focus { border-color: #f3ba2f; box-shadow: 0 0 8px rgba(243, 186, 47, 0.2); }
  .error-msg-box { background: rgba(246, 70, 93, 0.1); border: 1px dashed #f6465d; color: #f6465d; padding: 10px; border-radius: 8px; font-size: 0.75rem; font-weight: bold; margin-bottom: 15px; text-align: center; }
  .login-btn { width: 100%; padding: 14px; background: #f3ba2f; border: none; border-radius: 10px; color: #000; font-weight: 800; cursor: pointer; font-size: 1rem; transition: 0.3s; margin-top: 5px; }
  
  .app-container { display: flex; flex-direction: column; height: 100vh; width: 100vw; background: #050709; overflow: hidden; box-sizing: border-box; }
  header { height: 5vh; padding: 0 15px; display: flex; justify-content: space-between; align-items: center; background: #0b0e11; border-bottom: 1px solid #f3ba2f; box-sizing: border-box; }
  .gold-title { color: #f3ba2f; font-weight: 800; font-size: 0.85rem; }
  .logout-btn { background: none; border: 1px solid #f6465d; color: #f6465d; font-size: 0.65rem; padding: 2px 6px; border-radius: 5px; cursor: pointer; font-weight: bold; }
  
  .chart-box { height: 65vh; width: 100vw; background: #000; border-bottom: 1px solid #1e2329; box-sizing: border-box; overflow: hidden; }
  .bottom-box { height: 30vh; display: flex; flex-direction: column; background: #0b0e11; padding: 8px; box-sizing: border-box; justify-content: space-between; overflow: hidden; }
  .controls { display: flex; gap: 6px; height: 38px; }
  select { background: #14171a; color: #f3ba2f; border: 1px solid #2b2f36; padding: 0 8px; border-radius: 8px; flex: 1; font-weight: bold; outline: none; font-size: 0.8rem; height: 100%; }
  
  .signal-card { flex-grow: 1; display: flex; flex-direction: column; justify-content: center; background: #050709; border-radius: 12px; border: 2px solid #2b2f36; padding: 6px; text-align: center; transition: 0.3s ease; margin-top: 4px; overflow: hidden; }
  .up-glow { border-color: #0ecb81; box-shadow: 0 0 20px rgba(14, 203, 129, 0.35); }
  .down-glow { border-color: #f6465d; box-shadow: 0 0 20px rgba(246, 70, 93, 0.35); }
  .loading-glow { border-color: #f3ba2f; box-shadow: 0 0 20px rgba(243, 186, 47, 0.35); }
  
  .status-alert { color: #848e9c; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .signal-text { font-size: 1.8rem; font-weight: 900; margin: 2px 0; letter-spacing: 0.5px; }
  .color-up { color: #0ecb81; text-shadow: 0 0 8px rgba(14, 203, 129, 0.25); }
  .color-down { color: #f6465d; text-shadow: 0 0 8px rgba(246, 70, 93, 0.25); }
  .color-load { color: #f3ba2f; text-shadow: 0 0 8px rgba(243, 186, 47, 0.25); }
  
  .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; border-top: 1px solid #1a1e24; padding-top: 4px; font-size: 0.68rem; }
  .grid-lbl { color: #848e9c; text-align: left; }
  .grid-val { color: #fff; font-weight: 600; text-align: right; }
  .accuracy-badge { background: rgba(243, 186, 47, 0.08); border: 1px dashed #f3ba2f; color: #f3ba2f; padding: 4px; border-radius: 6px; margin-top: 4px; font-weight: 800; font-size: 0.8rem; }
`;

const marketPairs = [
  { id: "EURUSD_otc", name: "EUR/USD (OTC Mode)", tvSymbol: "FX_IDC:EURUSD" },
  { id: "NZDUSD_otc", name: "NZD/USD (OTC Mode)", tvSymbol: "FX_IDC:NZDUSD" },
  { id: "EURNZD_otc", name: "EUR/NZD (OTC Mode)", tvSymbol: "FX_IDC:EURNZD" },
  { id: "GBPNZD_otc", name: "GBP/NZD (OTC Mode)", tvSymbol: "FX_IDC:GBPNZD" },
  { id: "CADCHF_otc", name: "CAD/CHF (OTC Mode)", tvSymbol: "FX_IDC:CADCHF" },
  { id: "NZDJPY_otc", name: "NZD/JPY (OTC Mode)", tvSymbol: "FX_IDC:NZDJPY" },
  { id: "NZDCAD_otc", name: "NZD/CAD (OTC Mode)", tvSymbol: "FX_IDC:NZDCAD" },
  { id: "USDARS_otc", name: "USD/ARS (OTC Mode)", tvSymbol: "FX:USDARS" },
  { id: "USDEGP_otc", name: "USD/EGP (OTC Mode)", tvSymbol: "FX:USDEGP" },
  { id: "USDIDR_otc", name: "USD/IDR (OTC Mode)", tvSymbol: "FX:USDIDR" },
  { id: "USDMXN_otc", name: "USD/MXN (OTC Mode)", tvSymbol: "FX:USDMXN" },
  { id: "USDNGN_otc", name: "USD/NGN (OTC Mode)", tvSymbol: "FX:USDNGN" },
  { id: "USDPKR_otc", name: "USD/PKR (OTC Mode)", tvSymbol: "FX:USDPKR" },
  { id: "USDZAR_otc", name: "USD/ZAR (OTC Mode)", tvSymbol: "FX:USDZAR" },
  { id: "USDDZD_otc", name: "USD/DZD (OTC Mode)", tvSymbol: "FX:USDDZD" },
  { id: "USDPHP_otc", name: "USD/PHP (OTC Mode)", tvSymbol: "FX:USDPHP" },
  { id: "NZDCHF_otc", name: "NZD/CHF (OTC Mode)", tvSymbol: "FX_IDC:NZDCHF" },
  { id: "AUDNZD_otc", name: "AUD/NZD (OTC Mode)", tvSymbol: "FX_IDC:AUDNZD" },
  { id: "USDBRL_otc", name: "USD/BRL (OTC Mode)", tvSymbol: "FX:USDBRL" },
  { id: "USDBDT_otc", name: "USD/BDT (OTC Mode)", tvSymbol: "FX:USDBDT" },
  { id: "USDINR_otc", name: "USD/INR (OTC Mode)", tvSymbol: "FX:USDINR" },
  { id: "USDCOP_otc", name: "USD/COP (OTC Mode)", tvSymbol: "FX:USDCOP" },
  { id: "USDJPY", name: "USD/JPY (Real Feed)", tvSymbol: "FX:USDJPY" },
  { id: "EURJPY", name: "EUR/JPY (Real Feed)", tvSymbol: "FX:EURJPY" },
  { id: "EURUSD", name: "EUR/USD (Real Feed)", tvSymbol: "FX:EURUSD" },
  { id: "GBPJPY", name: "GBP/JPY (Real Feed)", tvSymbol: "FX:GBPJPY" },
  { id: "AUDJPY", name: "AUD/JPY (Real Feed)", tvSymbol: "FX:AUDJPY" },
  { id: "CADJPY", name: "CAD/JPY (Real Feed)", tvSymbol: "FX:CADJPY" },
  { id: "CHFJPY", name: "CHF/JPY (Real Feed)", tvSymbol: "FX:CHFJPY" },
  { id: "EURAUD", name: "EUR/AUD (Real Feed)", tvSymbol: "FX:EURAUD" },
  { id: "AUDCAD", name: "AUD/CAD (Real Feed)", tvSymbol: "FX:AUDCAD" },
  { id: "AUDCHF", name: "AUD/CHF (Real Feed)", tvSymbol: "FX:AUDCHF" },
  { id: "EURCAD", name: "EUR/CAD (Real Feed)", tvSymbol: "FX:EURCAD" },
  { id: "EURCHF", name: "EUR/CHF (Real Feed)", tvSymbol: "FX:EURCHF" },
  { id: "GBPUSD", name: "GBP/USD (Real Feed)", tvSymbol: "FX:GBPUSD" },
  { id: "USDCAD", name: "USD/CAD (Real Feed)", tvSymbol: "FX:USDCAD" },
  { id: "AUDUSD", name: "AUD/USD (Real Feed)", tvSymbol: "FX:AUDUSD" },
  { id: "GBPAUD", name: "GBP/AUD (Real Feed)", tvSymbol: "FX:GBPAUD" },
  { id: "EURGBP", name: "EUR/GBP (Real Feed)", tvSymbol: "FX:EURGBP" },
  { id: "GBPCAD", name: "GBP/CAD (Real Feed)", tvSymbol: "FX:GBPCAD" },
  { id: "GBPCHF", name: "GBP/CHF (Real Feed)", tvSymbol: "FX:GBPCHF" },
  { id: "USDCHF", name: "USD/CHF (Real Feed)", tvSymbol: "FX:USDCHF" },
  { id: "SOL_otc", name: "Solana (OTC Mode)", tvSymbol: "BINANCE:SOLUSDT" },
  { id: "ATOM_otc", name: "Cosmos (OTC Mode)", tvSymbol: "BINANCE:ATOMUSDT" },
  { id: "XRP_otc", name: "Ripple (OTC Mode)", tvSymbol: "BINANCE:XRPUSDT" },
  { id: "ETC_otc", name: "Ethereum Classic (OTC Mode)", tvSymbol: "BINANCE:ETCUSDT" },
  { id: "BTC_otc", name: "Bitcoin (OTC Mode)", tvSymbol: "BINANCE:BTCUSDT" },
  { id: "LTC_otc", name: "Litecoin (OTC Mode)", tvSymbol: "BINANCE:LTCUSDT" },
  { id: "TON_otc", name: "Toncoin (OTC Mode)", tvSymbol: "BINANCE:TONUSDT" },
  { id: "DOT_otc", name: "Polkadot (OTC Mode)", tvSymbol: "BINANCE:DOTUSDT" },
  { id: "AVAX_otc", name: "Avalanche (OTC Mode)", tvSymbol: "BINANCE:AVAXUSDT" },
  { id: "DASH_otc", name: "Dash (OTC Mode)", tvSymbol: "BINANCE:DASHUSDT" },
  { id: "ZEC_otc", name: "Zcash (OTC Mode)", tvSymbol: "BINANCE:ZECUSDT" },
  { id: "UKBRENT_otc", name: "UKBrent (OTC Mode)", tvSymbol: "TVC:UKOIL" },
  { id: "USCRUDE_otc", name: "USCrude (OTC Mode)", tvSymbol: "TVC:USOIL" },
  { id: "SILVER_otc", name: "Silver (OTC Mode)", tvSymbol: "TVC:SILVER" },
  { id: "GOLD_otc", name: "Gold (OTC Mode)", tvSymbol: "TVC:GOLD" }
];

const sanitizeBackendUrl = (url) => {
  if (!url) return "your-backend-service.onrender.com";
  return url.replace(/^(https?:\/\/)/i, "").replace(/\/+$/, "");
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [ssid, setSsid] = useState(localStorage.getItem('dyn_ssid') || '');
  const [errorMessage, setErrorMessage] = useState('');

  const [symbol, setSymbol] = useState('EURUSD_otc');
  const [tvSymbol, setTvSymbol] = useState('FX_IDC:EURUSD');
  const [timeframe, setTimeframe] = useState('1m');
  const [signal, setSignal] = useState('SCANNING');
  const [accuracy, setAccuracy] = useState('00.00');
  const [serverTime, setServerTime] = useState('--:--:--');
  const [entryTime, setEntryTime] = useState('--:--:--');
  const [alertStatus, setAlertStatus] = useState('PROCESSING TELEMETRY MATRIX...');

  const ws = useRef(null);
  
  const RAW_BACKEND_NAME = import.meta.env.VITE_RENDER_BACKEND || "your-backend-service.onrender.com";
  const CLEAN_BACKEND_NAME = sanitizeBackendUrl(RAW_BACKEND_NAME);

  const currentHost = window.location.hostname;
  const isLocal = currentHost === "localhost" || currentHost === "127.0.0.1";
  
  const BACKEND_URL = isLocal
    ? `ws://localhost:3000`
    : `wss://${CLEAN_BACKEND_NAME}`;
    
  const PING_HTTP_URL = isLocal
    ? `http://localhost:3000/health`
    : `https://${CLEAN_BACKEND_NAME}/health`;

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
    
    return () => { 
      try { document.head.removeChild(styleEl); } catch(e){}
    };
  }, []);

  // ✅ রেন্ডার স্লিপ প্রোটেকশন মার্জিন নিরাপদ করতে ৪ মিনিট থেকে কমিয়ে ২.৫ মিনিট (১৫০০০০ ms) করা হলো
  useEffect(() => {
    if (!isConnected) return;
    const keepAliveInterval = setInterval(() => {
      fetch(PING_HTTP_URL).catch(() => {});
    }, 150000); 
    return () => clearInterval(keepAliveInterval);
  }, [isConnected]);

  const sessionKickoutCleanup = (msg) => {
    cleanSocketBindings();
    localStorage.removeItem('dyn_ssid'); 
    setIsConnected(false);
    setErrorMessage(msg || 'সংযোগ বিচ্ছিন্ন হয়েছে! নতুন SSID দিন।');
  };

  const cleanSocketBindings = () => {
    if (ws.current) {
      ws.current.onopen = null;
      ws.current.onmessage = null;
      ws.current.onerror = null;
      ws.current.onclose = null;
      if (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING) {
        try { ws.current.close(); } catch(e){}
      }
      ws.current = null;
    }
  };

  const handleConnectEngine = (e) => {
    e.preventDefault();
    if (!ssid) return;
    setErrorMessage('');

    cleanSocketBindings(); 
    ws.current = new WebSocket(BACKEND_URL);

    ws.current.onopen = () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'CONNECT_ENGINE', ssid }));
      }
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'CONNECTION_SUCCESS') {
          setIsConnected(true);
          localStorage.setItem('dyn_ssid', ssid);
          setAlertStatus(data.msg);
        }

        if (data.type === 'MARKET_SHIFT_INITIATED') {
          setSignal("SYNCING");
          setAccuracy("00.00");
          setAlertStatus(`LOADING HISTORICAL DATA FOR ${data.symbol.toUpperCase()}...`);
        }

        if (data.type === 'LOADING_HISTORY') {
          setSignal("SYNCING");
          setAlertStatus("SYNCHRONIZING KLINE BLOCKS...");
        }

        if (data.type === 'SIGNAL_DATA') {
          setSignal(data.signal);
          setAccuracy(data.accuracy);
          setServerTime(data.serverTime);

          const now = new Date();
          const currentSec = now.getSeconds();
          const remaining = 60 - currentSec;
          
          if (data.signal === "SCANNING") {
            setAlertStatus("MARKET TREND NEUTRAL - LOOKING FOR SETUP");
            setEntryTime('--:--:--'); 
          } else {
            if (remaining > 15) {
              setAlertStatus("MATHEMATICAL SIGNAL LOCK");
            } else {
              setAlertStatus(`SURE SHOT MATRIX READY -> CHOOSE ${data.signal}`);
            }
            const nextCandleTime = new Date(now.getTime() + remaining * 1000);
            setEntryTime(nextCandleTime.toLocaleTimeString('en-GB'));
          }
        }

        if (data.type === 'SESSION_EXPIRED') {
          sessionKickoutCleanup(data.msg);
        }
      } catch (err) {}
    };

    ws.current.onclose = () => {
      setIsConnected(false);
    };

    ws.current.onerror = () => {
      setErrorMessage('সার্ভার কানেকশন এরর! ব্যাকএন্ড সচল আছে কি না তা নিশ্চিত করুন।');
    };
  };

  const handleDisconnect = () => {
    sessionKickoutCleanup('সফলভাবে ডিসকানেক্ট করা হয়েছে।');
  };

  const changeMarket = (newSymbol) => {
    setSymbol(newSymbol);
    const selectedPair = marketPairs.find(p => p.id === newSymbol);
    if (selectedPair) setTvSymbol(selectedPair.tvSymbol); 

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'CHANGE_MARKET', symbol: newSymbol }));
    }
  };

  if (!isConnected) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <h2>RTX MATRIX V2.8.6</h2>
          
          {errorMessage && <div className="error-msg-box">{errorMessage}</div>}

          <form onSubmit={handleConnectEngine}>
            <div className="input-group">
              <label>QUOTEX SSID TOKEN</label>
              <input 
                type="text" 
                required 
                value={ssid} 
                onChange={e => setSsid(e.target.value)} 
                placeholder="Enter Session SSID Only" 
              />
            </div>
            <button type="submit" className="login-btn">BOOT UP ENGINE</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div className="gold-title">RTX BULLETPROOF V2.8.6-PRO</div>
        <button onClick={handleDisconnect} className="logout-btn">DISCONNECT</button>
      </header>

      <div className="chart-box">
        <iframe 
          src={`https://s.tradingview.com/widgetembed/?symbol=${tvSymbol}&theme=dark&style=1&timezone=UTC`}
          width="100%" height="100%" frameBorder="0" allowFullScreen>
        </iframe>
      </div>

      <div className="bottom-box">
        <div className="controls">
          <select value={symbol} onChange={(e) => changeMarket(e.target.value)}>
            {marketPairs.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="1m">1 MINUTE</option>
          </select>
        </div>

        <div className={`signal-card ${
          signal.includes('UP') ? 'up-glow' : 
          signal.includes('DOWN') ? 'down-glow' : 
          signal === 'SYNCING' ? 'loading-glow' : ''
        }`}>
          <div className="status-alert">{alertStatus}</div>
          <div className={`signal-text ${
            signal.includes('UP') ? 'color-up' : 
            signal.includes('DOWN') ? 'color-down' : 
            signal === 'SYNCING' ? 'color-load' : ''
          }`}>
            {signal}
          </div>
          
          <div className="data-grid">
            <div className="grid-lbl">SERVER UTC TIME:</div><div className="grid-val">{serverTime}</div>
            <div className="grid-lbl">NEXT CANDLE ENTRY:</div><div className="grid-val">{entryTime}</div>
            <div className="grid-lbl">SELECTED MARKET:</div><div className="grid-val">{symbol.toUpperCase()}</div>
            <div className="grid-lbl">SYSTEM STATUS:</div><div className="grid-val" style={{color: '#0ecb81'}}>V2.8.6 LIVE LOCK</div>
          </div>

          <div className="accuracy-badge">TRUE CONFIDENCE SCORE: {accuracy}%</div>
        </div>
      </div>
    </div>
  );
}

export default App;
