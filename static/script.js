let chart, series, ws, isAnalyzing = false;
let candleHistory = [];
const beep = document.getElementById('alert-beep');

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
    if(!appId || !apiKey) return alert("Fill Credentials!");

    beep.play().then(() => beep.pause()); 
    if (ws) ws.close();
    
    ws = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${appId}`);
    
    ws.onopen = () => {
        document.getElementById('led').className = 'led-on';
        addLog("RTX ENGINE ONLINE");
        ws.send(JSON.stringify({
            ticks_history: document.getElementById('market-id').value,
            count: 50, end: "latest", style: "candles", granularity: 300, subscribe: 1
        }));
    };

    ws.onclose = () => {
        document.getElementById('led').className = 'led-off';
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
    document.getElementById('loader').classList.remove('hidden');
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
        beep.play().catch(() => {});
    } catch (e) { addLog("AI LINK ERROR"); }
    document.getElementById('loader').classList.add('hidden');
}

function updateUI(res) {
    const icon = document.getElementById('sig-icon');
    icon.innerText = res.color === 'Green' ? '🟢' : (res.color === 'Red' ? '🔴' : '⚪');
    icon.style.color = res.color === 'Green' ? '#00ff41' : (res.color === 'Red' ? '#ff003c' : '#555');
    document.getElementById('sig-status').innerText = `SIGNAL: ${res.color.toUpperCase()}`;
    document.getElementById('sig-accuracy').innerText = `ACCURACY: ${res.confidence}`;
    document.getElementById('sig-logic-text').innerText = res.reason;
}

function addLog(m) {
    const l = document.getElementById('terminal');
    const time = new Date().toLocaleTimeString([], { hour12: false });
    l.innerHTML += `<div>[${time}] >> ${m}</div>`;
    l.scrollTop = l.scrollHeight;
      }
