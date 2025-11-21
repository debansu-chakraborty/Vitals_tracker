from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VitalsIn(BaseModel):
    user_id: str
    timestamp: Optional[datetime]
    heart_rate: Optional[float]
    hr_variability: Optional[float]
    systolic: Optional[float]
    diastolic: Optional[float]
    spo2: Optional[float]
    steps: Optional[int]
    sleep_hours: Optional[float]
    glucose: Optional[float]
    notes: Optional[str]

class VitalsOut(VitalsIn):
    id: int
    risk_score: Optional[float]

    class Config:
        orm_mode = True