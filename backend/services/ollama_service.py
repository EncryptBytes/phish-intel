import httpx
import os
import json
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral")

SYSTEM_PROMPT = """You are a cybersecurity expert specialising in phishing attack classification. 
You will receive text from a suspicious email, SMS, URL, or screenshot and you must classify it 
using the following phishing taxonomy.

ATTACK TYPES (pick the best match):
- Email Phishing (generic mass campaign)
- Spear Phishing (targeted individual or organisation)
- Whaling (targeting senior executives/CEOs)
- Smishing (SMS-based phishing)
- Vishing (voice call phishing)
- Clone Phishing (duplicating a legitimate email)
- Pharming (DNS redirect to fake site)
- Social Media Phishing
- Business Email Compromise (BEC)
- Credential Harvesting Page

SOPHISTICATION LEVELS: Low / Medium / High / Very High
CHANNELS: Email / SMS / Voice / Social Media / Web / Multi-channel
RISK LEVELS: Low / Medium / High / Critical

You MUST respond ONLY with a valid JSON object. No preamble, no explanation, no markdown. 
Respond ONLY with this exact JSON structure:

{
  "attack_type": "string",
  "subtype": "string (be specific)",
  "channel": "string",
  "sophistication": "Low|Medium|High|Very High",
  "era": "string (e.g. 2010-present)",
  "technique_description": "string (2-3 sentences explaining the technique used)",
  "indicators": ["indicator1", "indicator2", "indicator3"],
  "target_sector": "string (e.g. Banking, General Public, Corporate)",
  "risk_level": "Low|Medium|High|Critical",
  "recommendation": "string (1-2 sentences on what the victim should do)"
}"""

async def analyse_text(text: str) -> dict:
    prompt = f"{SYSTEM_PROMPT}\n\nANALYSE THIS TEXT:\n\n{text}"
    
    async with httpx.AsyncClient(timeout=120.0) as client:
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
