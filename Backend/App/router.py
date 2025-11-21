from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
# REMOVED: from sqlalchemy import desc (This was causing the error)
from . import models, schemas, db, utils
from .models import VitalsEntry
from datetime import datetime
from typing import List

router = APIRouter()

@router.post('/vitals', response_model=schemas.VitalsOut)
def create_vitals(entry: schemas.VitalsIn, db: Session = Depends(db.get_db)):
    
    # Predict risk using the ML model
    risk = utils.predict_risk(entry.dict())
    
    # Create the database record
    vit = VitalsEntry(
        user_id=entry.user_id,
        timestamp=entry.timestamp or datetime.utcnow(),
        heart_rate=entry.heart_rate,
        hr_variability=entry.hr_variability,
        systolic=entry.systolic,
        diastolic=entry.diastolic,
        spo2=entry.spo2,
        steps=entry.steps,
        sleep_hours=entry.sleep_hours,
        glucose=entry.glucose,
        notes=entry.notes,
        risk_score=risk
    )
    db.add(vit)
    db.commit()
    db.refresh(vit)
    return vit

@router.get('/vitals/{user_id}', response_model=List[schemas.VitalsOut])
def get_vitals(user_id: str, db: Session = Depends(db.get_db)):
    # Fetch all vitals for a user, ordered by most recent
    # FIX: Use .desc() method directly on the column instead of importing the function
    rows = db.query(VitalsEntry).filter(VitalsEntry.user_id == user_id).order_by(VitalsEntry.timestamp.desc()).all()
    return rows

@router.get('/healthscore/{user_id}')
def get_healthscore(user_id: str, db: Session = Depends(db.get_db)):
    # Fetch the last 7 entries
    # FIX: Use .desc() method directly on the column
    rows = db.query(VitalsEntry).filter(VitalsEntry.user_id == user_id).order_by(VitalsEntry.timestamp.desc()).limit(7).all()
    
    scores = [r.risk_score for r in rows if r.risk_score is not None]
    if not scores:
        return {"health_score": None}
    
    # Calculate health score (100 - avg_risk * 100)
    avg_risk = sum(scores) / len(scores)
    health_score = (1 - avg_risk) * 100
    
    return {"health_score": float(health_score)}