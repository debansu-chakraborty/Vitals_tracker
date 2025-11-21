from sqlalchemy import Column, Integer, Float, String, DateTime
# from sqlalchemy.ext.declarative import declarative_base # <-- REMOVED
from .db import Base # <-- UPDATED IMPORT
import datetime

class VitalsEntry(Base):
    __tablename__ = 'vitals'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    heart_rate = Column(Float, nullable=True)
    hr_variability = Column(Float, nullable=True)
    systolic = Column(Float, nullable=True)
    diastolic = Column(Float, nullable=True)
    spo2 = Column(Float, nullable=True)
    steps = Column(Integer, nullable=True)
    sleep_hours = Column(Float, nullable=True)
    glucose = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    risk_score = Column(Float, nullable=True)