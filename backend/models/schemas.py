from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AnalysisResult(BaseModel):
    attack_type: str
    subtype: str
    channel: str
    sophistication: str          # Low / Medium / High / Very High
    era: str                     # e.g. "2015–present"
    technique_description: str
    indicators: List[str]
    target_sector: str
    risk_level: str              # Low / Medium / High / Critical
    recommendation: str
    raw_input: str
    input_method: str            # screenshot / url / text
    source: str = "User Submission"
    detected_at: datetime = Field(default_factory=datetime.utcnow)

class TaxonomyEntry(BaseModel):
    id: str
    type: str
    subtype: str
    channel: str
    era: str
    sophistication: str
    technique: str
    indicators: List[str]
    target_sector: str
    success_rate: str
    source: str = "Preset DB"
