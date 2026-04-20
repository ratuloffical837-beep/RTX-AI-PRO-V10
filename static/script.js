let chart, series, ws, isAnalyzing = false;
let candleHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('chart-area');
    chart = LightweightCharts.createChart(el, {
        layout: { background: { color: '#0d0d0d' }, textColor: '#aaa' },
        grid: { vertLines: { color: '#161616' }, horzLines: { color: '#161616' } },
        width: el.offsetWidth, height: el.offsetHeight
    });
    series = chart.addCandlestickSeries();

    window.addEventListener('resize', () => {
        chart.applyOptions({ width: el.offsetWidth, height: el.offsetHeight });
    });

    document.getElementById('ignite-btn').addEventListener('click', igniteRTX);
});

function igniteRTX() {
    const appId = document.getElementById('app-id').value;
    const apiKey = document.getElementById('api-key').value;
    const market = document.getElementById('market').value; // ফিক্সড ID

    if(!appId || !apiKey) return alert("Credentials Missing!");

    if (ws) ws.close();
    
    ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);
    
    ws.onopen = () => {
        const led = document.getElementById('led');
        if(led) led.className = 'led-on';
        addLog("RTX ENGINE ONLINE");
        ws.send(JSON.stringify({
            ticks_history: market,
            count: 50, end: "latest", style: "candles", granularity: 300, subscribe: 1
        }));
    };

    ws.onclose = () => {
        const led = document.getElementById('led');
        if(led) led.className = 'led-off';
        addLog("CONNECTION INTERRUPTED");
    };

    ws.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        if (data.candles) {
            candleHistory = data.candles.map(c => ({
                time: parseInt(c.epoch), open: parseFloat(c.open), high: parseFloat(c.high), low: parseFloat(c.low), close: parseFloat(c.close)
            }));
            series.setData(candleHistory);
        }
        if (data.ohlc) {
            const o = data.ohlc;
            const tick = { time: parseInt(o.open_time), open: parseFloat(o.open), high: parseFloat(o.high), low: parseFloat(o.low), close: parseFloat(o.close) };
            series.update(tick);
            
            const last = candleHistory[candleHistory.length - 1];
            if (last && last.time === tick.time) candleHistory[candleHistory.length - 1] = tick;
            else {
                candleHistory.push(tick);
                if (candleHistory.length > 100) candleHistory.shift();
            }

            const remaining = 300 - (parseInt(o.epoch) % 300);
            document.getElementById('timer').innerText = `${Math.floor(remaining/60)}:${(remaining%60).toString().padStart(2,'0')}`;

            // বিশ্লেষণ শুরু করার লজিক (৫মিনিটের ক্যান্ডেল শেষ হওয়ার ১০ সেকেন্ড আগে)
            if (remaining <= 10 && remaining > 2 && !isAnalyzing) {
                isAnalyzing = true;
                processAI();
            }
            if (remaining > 290) isAnalyzing = false;
        }
    };
}

async function processAI() {
    addLog("ANALYZING MARKET...");
    const loader = document.getElementById('loader');
    if(loader) loader.classList.remove('hidden');
    
    try {
        const res = await fetch('/predict', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                api_choice: document.getElementById('ai-model').value,
                api_key: document.getElementById('api-key').value,
                candles: candleHistory
            })
        });
        const result = await res.json();
        updateUI(result);
    } catch (e) { 
        addLog("AI LINK ERROR"); 
    }
    if(loader) loader.classList.add('hidden');
}

function updateUI(res) {
    if(!res || res.error) return addLog("AI ERROR: " + (res.error || "No Response"));

    const icon = document.getElementById('sig-icon');
    const status = document.getElementById('sig-status');
    const accuracy = document.getElementById('sig-accuracy');
    const logic = document.getElementById('sig-logic-text');

    if(icon) {
        icon.innerText = res.color === 'Green' ? '🟢' : (res.color === 'Red' ? '🔴' : '⚪');
        icon.style.color = res.color === 'Green' ? '#00ff41' : (res.color === 'Red' ? '#ff003c' : '#555');
    }
    if(status) status.innerText = `SIGNAL: ${res.color.toUpperCase()}`;
    if(accuracy) accuracy.innerText = `ACCURACY: ${res.confidence}`;
    if(logic) logic.innerText = res.reason || "";
}

function addLog(m) {
    const l = document.getElementById('terminal');
    if(!l) return;
    const time = new Date().toLocaleTimeString([], { hour12: false });
    l.innerHTML += `<div>[${time}] >> ${m}</div>`;
    l.scrollTop = l.scrollHeight;
        }
