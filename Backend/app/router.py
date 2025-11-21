from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, db, utils
from .models import VitalsEntry
from datetime import datetime

router = APIRouter()

@router.post('/vitals', response_model=schemas.VitalsOut)
def create_vitals(entry: schemas.VitalsIn, db: Session = Depends(db.get_db)):
   
    risk = utils.predict_risk(entry.dict())
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

@router.get('/vitals/{user_id}', response_model=list[schemas.VitalsOut])
def get_vitals(user_id: str, db: Session = Depends(db.get_db)):
    rows = db.query(VitalsEntry).filter(VitalsEntry.user_id == user_id).order_by(VitalsEntry.timestamp.desc()).all()
    return rows

@router.get('/healthscore/{user_id}')
def get_healthscore(user_id: str, db: Session = Depends(db.get_db)):
    rows = db.query(VitalsEntry).filter(VitalsEntry.user_id == user_id).order_by(VitalsEntry.timestamp.desc()).limit(7).all()
    
    scores = [r.risk_score for r in rows if r.risk_score is not None]
    if not scores:
        return {"health_score": None}
    avg = sum(scores) / len(scores)
    
    return {"health_score": float((1 - avg) * 100)}