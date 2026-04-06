from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app) # Enable CORS for frontend integration

# Load the trained model
try:
    model = joblib.load('crop_model.pkl')
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Required fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Prepare feature array
        features = np.array([[
            data['N'], data['P'], data['K'], 
            data['temperature'], data['humidity'], 
            data['ph'], data['rainfall']
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get confidence score
        probabilities = model.predict_proba(features)
        confidence = np.max(probabilities) * 100
        
        return jsonify({
            'recommended_crop': prediction.capitalize(),
            'confidence': round(confidence, 2)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    # Start Flask on port 5001 as requested
    app.run(host='0.0.0.0', port=5001, debug=True)
