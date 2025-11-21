
import joblib
import numpy as np
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent / 'ml' / 'model.joblib'

def load_model():
    try:
        return joblib.load(MODEL_PATH)
    except Exception:
        return None


def build_feature_vector(entry: dict):
    
    v = []
    v.append(entry.get('heart_rate', np.nan))
    v.append(entry.get('hr_variability', np.nan))
    v.append(entry.get('systolic', np.nan))
    v.append(entry.get('diastolic', np.nan))
    v.append(entry.get('spo2', np.nan))
    v.append(entry.get('steps', np.nan))
    v.append(entry.get('sleep_hours', np.nan))
    v.append(entry.get('glucose', np.nan))
    return np.array(v).reshape(1, -1)

def predict_risk(entry: dict):
    model = load_model()
    if model is None:
        return None
    X = build_feature_vector(entry)

    try:
        prob = model.predict_proba(X)[0][1]
        return float(prob)
    except:
        return None