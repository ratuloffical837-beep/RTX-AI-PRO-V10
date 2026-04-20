import json, re, openai, ast
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import google.generativeai as genai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

def calculate_rsi(candles, period=14):
    if len(candles) < period + 1: return 50.0
    try:
        closes = [float(c['close']) for c in candles]
        deltas = [closes[i] - closes[i-1] for i in range(1, len(closes))]
        gains = [d if d > 0 else 0 for d in deltas]
        losses = [-d if d < 0 else 0 for d in deltas]
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        if avg_loss == 0: return 100.0
        return 100 - (100 / (1 + (avg_gain / avg_loss)))
    except: return 50.0

@app.get("/", response_class=HTMLResponse)
async def read_index():
    try:
        with open("static/index.html", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return "Critical Error: static/index.html not found!"

@app.post("/predict")
async def predict(data: Request):
    try:
        req = await data.json()
        api_choice, api_key, candles = req.get("api_choice"), req.get("api_key"), req.get("candles")
        
        if len(candles) < 14: return {"color": "Gray", "confidence": "0%", "reason": "Low Data"}

        rsi_val = calculate_rsi(candles)
        closes = [float(c['close']) for c in candles]
        
        # SMA-50 Precision & Fallback
        if len(closes) >= 50:
            sma_50 = sum(closes[-50:]) / 50
        else:
            sma_50 = sum(closes) / len(closes)
            
        trend = "UPWARD" if closes[-1] > sma_50 else "DOWNWARD"
        
        last = candles[-1]
        body = abs(float(last['close']) - float(last['open']))
        u_wick = float(last['high']) - max(float(last['close']), float(last['open']))

        prompt = f"""
        STRICT: RTX AI PRO. Trend (SMA-50): {trend}. RSI: {rsi_val:.2f}.
        Anatomy: Body {body:.4f}, Upper Wick {u_wick:.4f}.
        Policies:
        - Trend UP + RSI < 30 = Green. Trend DOWN + RSI > 70 = Red.
        - RSI 45-55 is NEUTRAL zone: Avoid signal unless Confidence > 90%.
        - Upper Wick > Body*2 at RSI > 70 is strong SELL.
        - No signal for Doji (Body < 0.0001) unless RSI extreme (<15 or >85).
        Return ONLY JSON: {{"color": "Green/Red/Gray", "confidence": "0-100%", "reason": "concise logic"}}
        """

        if api_choice == "gpt":
            openai.api_key = api_key
            res = openai.ChatCompletion.create(model="gpt-4o", messages=[{"role": "user", "content": prompt}], temperature=0.1)
            raw_res = res.choices[0].message.content
        else:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            raw_res = model.generate_content(prompt).text

        match = re.search(r'\{.*\}', raw_res.strip(), re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except:
                return ast.literal_eval(match.group())
        return {"color": "Gray", "confidence": "0%", "reason": "Format error"}
    except Exception as e:
        return {"error": str(e)}
