# train.py - Final training script
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import joblib

# Load dataset
try:
    df = pd.read_csv('dataset_sample.csv')
except FileNotFoundError:
    print("Error: dataset_sample.csv not found. Please run clean_data.py first.")
    exit()

# Features MUST match the columns created in clean_data.py AND the order in utils.py
features = [
    'heart_rate',
    'hr_variability',
    'systolic',
    'diastolic',
    'spo2',
    'steps',
    'sleep_hours',
    'glucose'
] 
X = df[features]
y = df['label'] # 0 = Normal, 1 = At-risk

pipeline = Pipeline([
    ('impute', SimpleImputer(strategy='mean')),
    ('scale', StandardScaler()),
    ('clf', RandomForestClassifier(n_estimators=200, random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline.fit(X_train, y_train)

print('\n--- Model Training Results ---')
print('Train score (Accuracy):', pipeline.score(X_train, y_train))
print('Test score (Accuracy):', pipeline.score(X_test, y_test))

joblib.dump(pipeline, 'model.joblib')
print('Model saved as model.joblib')