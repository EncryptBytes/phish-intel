import httpx
import os
import json
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:4002")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")

SYSTEM_PROMPT = """You are a cybersecurity expert.

Classify the following text as a phishing attack.

Return ONLY valid JSON in this format:
{
  "attack_type": "",
  "subtype": "",
  "channel": "",
  "sophistication": "Low|Medium|High|Very High",
  "risk_level": "Low|Medium|High|Critical",
  "indicators": [],
  "recommendation": ""
}

Text:"""

async def analyse_text(text: str) -> dict:
    prompt = f"{SYSTEM_PROMPT}\n\nANALYSE THIS TEXT:\n\n{text}"
    
    async with httpx.AsyncClient(timeout=1200.0) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            }
        )
        response.raise_for_status()
        raw = response.json()["response"].strip()
        
        # Clean response — strip any markdown fences if model adds them
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()
        
        return json.loads(raw)
