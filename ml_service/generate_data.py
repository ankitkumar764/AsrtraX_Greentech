import pandas as pd
import numpy as np

# Seed for reproducibility
np.random.seed(42)

# Define crops and their ideal soil/climate ranges
# Column order: N, P, K, temperature, humidity, ph, rainfall, label
crops_data = {
    'rice':   {'N': (60, 100), 'P': (35, 60), 'K': (35, 45), 'temp': (20, 30), 'hum': (80, 95), 'ph': (5.0, 6.5), 'rain': (200, 300)},
    'maize':  {'N': (60, 100), 'P': (35, 60), 'K': (15, 25), 'temp': (18, 30), 'hum': (55, 75), 'ph': (5.5, 7.5), 'rain': (60, 110)},
    'chickpea':{'N': (20, 60),  'P': (55, 80), 'K': (75, 85), 'temp': (17, 21), 'hum': (15, 20), 'ph': (6.0, 8.5), 'rain': (65, 95)},
    'kidneybeans': {'N': (10, 40), 'P': (55, 80), 'K': (15, 25), 'temp': (15, 25), 'hum': (18, 25), 'ph': (5.5, 6.0), 'rain': (60, 150)},
    'pigeonpeas': {'N': (10, 40), 'P': (65, 80), 'K': (15, 25), 'temp': (18, 35), 'hum': (30, 70), 'ph': (4.5, 7.5), 'rain': (90, 200)},
    'mothbeans': {'N': (0, 40),   'P': (35, 60), 'K': (15, 25), 'temp': (24, 32), 'hum': (40, 65), 'ph': (3.5, 9.5), 'rain': (30, 75)},
    'mungbean': {'N': (0, 40),   'P': (35, 60), 'K': (15, 25), 'temp': (27, 30), 'hum': (80, 90), 'ph': (6.0, 7.0), 'rain': (35, 60)},
    'blackgram': {'N': (20, 60), 'P': (55, 80), 'K': (15, 25), 'temp': (23, 35), 'hum': (60, 70), 'ph': (6.5, 7.5), 'rain': (60, 75)},
    'lentil': {'N': (10, 40),   'P': (55, 80), 'K': (15, 25), 'temp': (18, 30), 'hum': (60, 70), 'ph': (5.5, 7.5), 'rain': (40, 55)},
    'pomegranate': {'N': (0, 40), 'P': (5, 30),  'K': (35, 45), 'temp': (18, 25), 'hum': (85, 95), 'ph': (5.5, 7.5), 'rain': (100, 115)},
    'banana': {'N': (80, 120),  'P': (70, 95), 'K': (45, 55), 'temp': (25, 30), 'hum': (75, 85), 'ph': (5.5, 6.5), 'rain': (90, 120)},
    'mango': {'N': (0, 40),     'P': (15, 35), 'K': (25, 35), 'temp': (27, 35), 'hum': (45, 55), 'ph': (4.5, 7.0), 'rain': (90, 100)},
    'grapes': {'N': (0, 40),    'P': (120, 145), 'K': (195, 205), 'temp': (10, 40), 'hum': (80, 85), 'ph': (5.5, 6.5), 'rain': (60, 75)},
    'watermelon': {'N': (80, 120), 'P': (5, 30), 'K': (45, 55), 'temp': (24, 27), 'hum': (80, 90), 'ph': (6.0, 7.0), 'rain': (40, 60)},
    'muskmelon': {'N': (80, 120), 'P': (5, 30), 'K': (45, 55), 'temp': (27, 30), 'hum': (90, 95), 'ph': (6.0, 7.0), 'rain': (20, 30)},
    'apple': {'N': (0, 40),     'P': (120, 145), 'K': (195, 205), 'temp': (21, 25), 'hum': (90, 95), 'ph': (5.5, 6.5), 'rain': (100, 125)},
    'orange': {'N': (10, 40),   'P': (5, 30), 'K': (5, 15), 'temp': (23, 35), 'hum': (90, 95), 'ph': (6.0, 8.0), 'rain': (100, 120)},
    'papaya': {'N': (30, 70),   'P': (45, 70), 'K': (25, 35), 'temp': (23, 45), 'hum': (90, 95), 'ph': (6.5, 7.0), 'rain': (230, 255)},
    'coconut': {'N': (0, 40),   'P': (5, 30), 'K': (25, 35), 'temp': (25, 30), 'hum': (90, 100), 'ph': (5.5, 6.5), 'rain': (130, 230)},
    'cotton': {'N': (100, 140), 'P': (35, 60), 'K': (15, 25), 'temp': (22, 26), 'hum': (75, 85), 'ph': (5.8, 8.0), 'rain': (60, 100)},
    'jute': {'N': (60, 100),    'P': (35, 60), 'K': (35, 45), 'temp': (23, 27), 'hum': (70, 90), 'ph': (6.0, 7.5), 'rain': (150, 200)},
    'coffee': {'N': (80, 120),  'P': (15, 35), 'K': (25, 35), 'temp': (23, 28), 'hum': (50, 65), 'ph': (6.0, 7.5), 'rain': (115, 195)}
}

samples_per_crop = 100
data = []

for crop, ranges in crops_data.items():
    for _ in range(samples_per_crop):
        row = [
            np.random.randint(ranges['N'][0], ranges['N'][1] + 1),
            np.random.randint(ranges['P'][0], ranges['P'][1] + 1),
            np.random.randint(ranges['K'][0], ranges['K'][1] + 1),
            np.random.uniform(ranges['temp'][0], ranges['temp'][1]),
            np.random.uniform(ranges['hum'][0], ranges['hum'][1]),
            np.random.uniform(ranges['ph'][0], ranges['ph'][1]),
            np.random.uniform(ranges['rain'][0], ranges['rain'][1]),
            crop
        ]
        data.append(row)

# Create DataFrame
df = pd.DataFrame(data, columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'label'])

# Save to CSV
df.to_csv('crop_dataset.csv', index=False)
print("Successfully generated crop_dataset.csv with 2200 samples.")
