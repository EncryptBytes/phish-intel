import httpx
import os
import json
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:4002")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")

SYSTEM_PROMPT = """Classify the phishing message and return ONLY JSON:

{
  "attack_type": "",
  "subtype": "",
  "channel": "",
  "sophistication": "Low|Medium|High|Very High",
  "risk_level": "Low|Medium|High|Critical",
  "indicators": [],
  "recommendation": ""
}

Text:
"""

async def analyse_text(text: str) -> dict:
    prompt = f"{SYSTEM_PROMPT}{text}"

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "num_predict": 120,
                    "temperature": 0.2,
                    "top_p": 0.9
                }
            }
        )
        response.raise_for_status()
        raw = response.json()["response"].strip()

        # Clean markdown fences
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        # Fallback fix (VERY IMPORTANT)
        try:
            return json.loads(raw)
        except:
            return {
                "attack_type": "Unknown",
                "subtype": "Parsing Failed",
                "channel": "Unknown",
                "sophistication": "Medium",
                "risk_level": "Medium",
                "indicators": [],
                "recommendation": "Model response could not be parsed"
            }
