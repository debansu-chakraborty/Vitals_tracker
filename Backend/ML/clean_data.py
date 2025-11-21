import pandas as pd
import numpy as np
import os

# --- Configuration (UPDATED FILENAME) ---
# This filename MUST EXACTLY match the CSV file you moved into the backend/ml/ folder.
INPUT_FILE = 'Copy of patients_data_with_alerts_Updated Final.csv'
OUTPUT_FILE = 'dataset_sample.csv'
RISK_CONDITIONS = ['Arrhythmia', 'Asthma', 'Hypertension', 'Diabetes Mellitus']
# --- End Configuration ---

if not os.path.exists(INPUT_FILE):
    print(f"Error: {INPUT_FILE} not found. Please move it to the backend/ml/ folder.")
    exit()

df = pd.read_csv(INPUT_FILE)

# 1. Rename and Map Core Vitals
df = df.rename(columns={
    'Heart Rate (bpm)': 'heart_rate',
    'SpO2 Level (%)': 'spo2',
    'Systolic Blood Pressure (mmHg)': 'systolic',
    'Diastolic Blood Pressure (mmHg)': 'diastolic',
    'Predicted Disease': 'disease'
})

# 2. Synthesize Missing Frontend Features (Crucial for feature vector order)
# We generate realistic dummy data for features missing in the clinical sheet (steps, sleep, glucose, HRV)
np.random.seed(42)

df['hr_variability'] = np.random.randint(30, 80, df.shape[0])
df['steps'] = np.random.randint(5000, 15000, df.shape[0])
df['sleep_hours'] = np.random.uniform(6.0, 9.0, df.shape[0]).round(1)
df['glucose'] = np.random.randint(80, 110, df.shape[0])

# 3. Create Binary Target 'label'
# 1 = Risk (Any disease), 0 = Normal
df['label'] = df['disease'].apply(lambda x: 1 if x in RISK_CONDITIONS else 0)

# 4. Final Feature Selection (Must match the order in train.py and utils.py)
final_features = [
    'heart_rate', 
    'hr_variability', 
    'systolic', 
    'diastolic', 
    'spo2', 
    'steps', 
    'sleep_hours', 
    'glucose', 
    'label'
]

final_df = df[final_features].copy()
final_df = final_df.fillna(final_df.mean()) # Handle any remaining NaNs

final_df.to_csv(OUTPUT_FILE, index=False)
print(f" Data cleaned and saved as {OUTPUT_FILE} (Rows: {final_df.shape[0]})")