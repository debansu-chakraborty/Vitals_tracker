import pandas as pd
import numpy as np

NUM_ROWS = 1000

#. Generate random data for healthy people (Low Risk)
# We make 500 "healthy" rows
healthy = pd.DataFrame({
    'heart_rate': np.random.randint(60, 80, 500),
    'hr_variability': np.random.randint(50, 100, 500),
    'systolic': np.random.randint(110, 120, 500),
    'diastolic': np.random.randint(70, 80, 500),
    'spo2': np.random.randint(97, 100, 500),
    'steps': np.random.randint(8000, 12000, 500),
    'sleep_hours': np.random.uniform(7.0, 9.0, 500),
    'glucose': np.random.randint(70, 99, 500),
    'label': 0  # 0 = Healthy
})

# 3. Generate random data for "At Risk" people (High Risk)
# We make 500 "unhealthy" rows
unhealthy = pd.DataFrame({
    'heart_rate': np.random.randint(90, 110, 500),
    'hr_variability': np.random.randint(10, 40, 500),
    'systolic': np.random.randint(140, 160, 500),
    'diastolic': np.random.randint(90, 100, 500),
    'spo2': np.random.randint(90, 95, 500),
    'steps': np.random.randint(1000, 3000, 500),
    'sleep_hours': np.random.uniform(4.0, 6.0, 500),
    'glucose': np.random.randint(110, 150, 500),
    'label': 1  # 1 = At Risk
})

# 4. Combine and Shuffle
df = pd.concat([healthy, unhealthy])
df = df.sample(frac=1).reset_index(drop=True) # Shuffle rows

# 5. Save exactly where train.py expects it
df.to_csv('dataset_sample.csv', index=False)
print(" Perfect mock dataset created: dataset_sample.csv")