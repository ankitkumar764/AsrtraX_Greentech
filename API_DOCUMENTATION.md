# KrishiSaarthi AI - API Documentation

Complete API reference for KrishiSaarthi Backend

## Base URL
```
http://localhost:5000/api
```

## 📌 Common Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {},
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response (400/500)
```json
{
  "error": "Error title",
  "message": "Detailed error explanation"
}
```

---

## 🌾 Recommendations Endpoints

### 1. Get Crop & Fertilizer Recommendations (Questionnaire Mode)

**Endpoint:** `POST /recommendations/get`

**Description:** Get crop and fertilizer recommendations based on questionnaire answers

**Request Body:**
```json
{
  "soilType": "sandy|clay|loamy|black|unknown",
  "soilTexture": "dry|sticky|medium",
  "previousCrop": "wheat|rice|maize|cotton|sugarcane|pulses|vegetables|fallow",
  "fertilizationHistory": "low|moderate|excessive",
  "waterAvailability": "low|moderate|high",
  "season": "kharif|rabi",
  "location": "maharashtra|uttar_pradesh|karnataka|...",
  "budget": 5000,
  "cropIssues": "optional description of issues"
}
```

**Required Fields:**
- `soilType`
- `fertilizationHistory`
- `waterAvailability`
- `season`

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/recommendations/get \
  -H "Content-Type: application/json" \
  -d '{
    "soilType": "loamy",
    "season": "rabi",
    "waterAvailability": "high",
    "fertilizationHistory": "moderate",
    "budget": 5000
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "rank": 1,
        "cropName": "Wheat",
        "matchScore": 85,
        "reasoning": [
          "✓ Perfect season match for rabi",
          "✓ Ideal for loamy soil",
          "✓ Well-suited for high water availability areas"
        ],
        "npkRequirements": {
          "nitrogen": {
            "required": 100,
            "deficit": 0,
            "applicationType": "urea"
          },
          "phosphorus": {
            "required": 50,
            "deficit": 30,
            "applicationType": "dap"
          },
          "potassium": {
            "required": 40,
            "deficit": 0,
            "applicationType": "mop"
          }
        },
        "fertilizerPlan": {
          "recommendations": [
            {
              "name": "DAP",
              "bags": 1,
              "timing": "At planting",
              "cost": 1100,
              "reason": "Provides phosphorus for root development"
            }
          ],
          "totalCost": 1100,
          "notes": [
            "✓ Fertilizer plan is within budget"
          ]
        },
        "estimatedYield": {
          "min": 4,
          "max": 6
        },
        "costOptimization": [
          "Use organic manure to reduce chemical costs",
          "Buy fertilizers in bulk",
          "Consider government schemes"
        ]
      }
    ],
    "generalAdvice": [
      "🔍 Get a soil test done for better recommendations",
      "💧 Consider drip irrigation for water management"
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Missing required inputs",
  "requiredFields": ["season", "soilType"],
  "message": "Please provide either season or soil type"
}
```

---

### 2. Soil Report Recommendations

**Endpoint:** `POST /recommendations/soil-report`

**Description:** Get detailed recommendations based on soil test report

**Request Body:**
```json
{
  "soilN": 200,
  "soilP": 20,
  "soilK": 150,
  "pH": 6.8,
  "crop": "wheat|rice|maize|cotton|sugarcane|pulses|vegetables",
  "budget": 5000
}
```

**Required Fields:**
- `soilN` - Nitrogen in mg/kg
- `soilP` - Phosphorus in mg/kg
- `soilK` - Potassium in mg/kg
- `pH` - Soil pH (4-10)
- `crop` - Crop name

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/recommendations/soil-report \
  -H "Content-Type: application/json" \
  -d '{
    "soilN": 200,
    "soilP": 20,
    "soilK": 150,
    "pH": 6.8,
    "crop": "wheat",
    "budget": 5000
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "crop": "wheat",
    "soilAnalysis": {
      "nitrogen": 200,
      "phosphorus": 20,
      "potassium": 150,
      "pH": 6.8
    },
    "npkRequirements": {
      "nitrogen": {
        "required": 100,
        "deficit": 0
      },
      "phosphorus": {
        "required": 50,
        "deficit": 30
      },
      "potassium": {
        "required": 40,
        "deficit": 0
      }
    },
    "fertilizerPlan": {
      "recommendations": [
        {
          "name": "DAP (Di-Ammonium Phosphate)",
          "bags": 2,
          "timing": "At the time of planting",
          "cost": 2200,
          "reason": "Provides phosphorus and nitrogen for root development"
        },
        {
          "name": "Urea",
          "bags": 1,
          "timing": "Split application: Half at tillering, half at boot stage",
          "cost": 250,
          "reason": "Provides nitrogen for vegetative growth"
        }
      ],
      "totalCost": 2450,
      "notes": [
        "✓ Fertilizer plan is within budget with ₹2550 remaining",
        "💡 For organic farming, use compost or vermicompost",
        "🌾 Always follow local agricultural officer recommendations"
      ]
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Missing soil parameters",
  "required": ["soilN", "soilP", "soilK", "pH"]
}
```

---

## 🔬 Soil Labs Endpoints

### 1. Get Labs by State

**Endpoint:** `GET /soil-labs/:state`

**Description:** Get soil testing labs for a specific state

**Parameters:**
- `state` - State name (lowercase, use underscore for spaces)
  - Example: `maharashtra`, `uttar_pradesh`, `karnataka`

**Example Request:**
```bash
curl http://localhost:5000/api/soil-labs/maharashtra
```

**Success Response (200):**
```json
{
  "success": true,
  "state": "maharashtra",
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "ICAR-IISR Soil Science Lab",
      "location": "Pune",
      "address": "Dr. RAJENDRA MASHELKAR ROAD, PUNE - 411005",
      "phone": "020-25951233",
      "email": "iisr@icar.gov.in",
      "distance": 5,
      "testCost": 200,
      "turnaround": "3-5 days"
    },
    {
      "id": 2,
      "name": "Soil Testing Lab, Dept. of Soil Science",
      "location": "Kolhapur",
      "address": "Mahatma Phule Krishi Vidyapeeth, Rahuri",
      "phone": "02425-258340",
      "email": "soil@mpkv.ac.in",
      "distance": 45,
      "testCost": 150,
      "turnaround": "5-7 days"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No soil testing labs found for rajasthan",
  "data": [],
  "note": "Available states: maharashtra, uttar_pradesh, karnataka"
}
```

---

### 2. Get All Labs

**Endpoint:** `GET /soil-labs`

**Description:** Get all soil testing labs across all states

**Example Request:**
```bash
curl http://localhost:5000/api/soil-labs
```

**Success Response (200):**
```json
{
  "success": true,
  "totalLabs": 5,
  "data": [
    {
      "id": 1,
      "name": "ICAR-IISR Soil Science Lab",
      "location": "Pune",
      "state": "maharashtra",
      "phone": "020-25951233",
      "testCost": 200,
      "turnaround": "3-5 days"
    }
  ],
  "note": "Query specific state using /api/soil-labs/:state",
  "availableStates": ["maharashtra", "uttar pradesh", "karnataka"]
}
```

---

## 📜 Government Schemes Endpoints

### 1. Get All Schemes

**Endpoint:** `GET /schemes/list`

**Description:** Get all available government schemes

**Example Request:**
```bash
curl http://localhost:5000/api/schemes/list
```

**Success Response (200):**
```json
{
  "success": true,
  "totalSchemes": 6,
  "data": [
    {
      "id": 1,
      "name": "PM Fasal Bima Yojana",
      "description": "Provides insurance coverage for farmers against crop losses",
      "category": "Insurance",
      "eligibility": "All farmers growing notified crops",
      "premium": "2% of SI (Kharif), 1.5% (Rabi)",
      "benefits": "Coverage against natural disasters, pest attacks, and diseases",
      "link": "https://pmfby.gov.in",
      "state": "All India"
    },
    {
      "id": 6,
      "name": "Pradhan Mantri Kisan Samman Nidhi",
      "description": "Direct income support to farmers",
      "category": "Income Support",
      "eligibility": "All farmers holding cultivable land",
      "premium": "₹6000/year (₹2000 per instalment)",
      "benefits": "Direct cash transfer, financial stability",
      "link": "https://pmkisan.gov.in",
      "state": "All India"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get Schemes by Category

**Endpoint:** `GET /schemes/category/:category`

**Description:** Get schemes filtered by category

**Parameters:**
- `category` - Scheme category
  - Insurance
  - Irrigation
  - Testing
  - Marketing
  - Organic Farming
  - Income Support

**Example Request:**
```bash
curl http://localhost:5000/api/schemes/category/Insurance
```

**Success Response (200):**
```json
{
  "success": true,
  "category": "Insurance",
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "PM Fasal Bima Yojana",
      "description": "Provides insurance coverage for farmers against crop losses",
      "category": "Insurance",
      "eligibility": "All farmers growing notified crops",
      "premium": "2% of SI (Kharif), 1.5% (Rabi)",
      "benefits": "Coverage against natural disasters, pest attacks, and diseases",
      "link": "https://pmfby.gov.in",
      "state": "All India"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No schemes found for category: Subsidies",
  "data": []
}
```

---

## 🏥 Health Check Endpoint

**Endpoint:** `GET /health`

**Description:** Check if API server is running

**Example Request:**
```bash
curl http://localhost:5000/api/health
```

**Response (200):**
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📊 Soil NPK Levels Reference

### Low Levels (Deficient)
- Nitrogen: < 150 mg/kg
- Phosphorus: < 15 mg/kg
- Potassium: < 120 mg/kg

### Medium Levels (Optimal)
- Nitrogen: 150-250 mg/kg
- Phosphorus: 15-30 mg/kg
- Potassium: 120-200 mg/kg

### High Levels (Excess)
- Nitrogen: > 250 mg/kg
- Phosphorus: > 30 mg/kg
- Potassium: > 200 mg/kg

### pH Ranges
- Acidic: < 6.0
- Neutral: 6.0 - 7.0
- Alkaline: > 7.0

---

## 🎯 Crop-Specific Recommendations

### Wheat
- Best pH: 6.0 - 7.5
- Nitrogen: 100 kg/ha
- Phosphorus: 50 kg/ha
- Season: Rabi
- Water: Moderate

### Rice
- Best pH: 5.5 - 7.0
- Nitrogen: 120 kg/ha
- Phosphorus: 60 kg/ha
- Season: Kharif
- Water: High

### Maize
- Best pH: 5.8 - 7.3
- Nitrogen: 150 kg/ha
- Phosphorus: 70 kg/ha
- Season: Kharif/Rabi
- Water: Moderate

### Cotton
- Best pH: 6.0 - 7.5
- Nitrogen: 100 kg/ha
- Phosphorus: 50 kg/ha
- Season: Kharif
- Water: Moderate

### Sugarcane
- Best pH: 6.0 - 7.5
- Nitrogen: 200 kg/ha
- Phosphorus: 80 kg/ha
- Season: Kharif/Rabi
- Water: High

### Pulses
- Best pH: 6.0 - 7.5
- Nitrogen: 20 kg/ha (low, nitrogen-fixing)
- Phosphorus: 45 kg/ha
- Season: Rabi
- Water: Low

---

## 🔄 Data Validation Rules

### Soil Report Validation
```
soilN: 0-500 (mg/kg)
soilP: 0-100 (mg/kg)
soilK: 0-300 (mg/kg)
pH: 4.0-10.0
budget: 0-unlimited (₹)
```

### Questionnaire Validation
```
soilType: enum (sandy, clay, loamy, black, unknown)
season: enum (kharif, rabi)
waterAvailability: enum (low, moderate, high)
fertilizationHistory: enum (low, moderate, excessive)
```

---

## 📈 Example Integration

### JavaScript (Fetch API)
```javascript
const getRecommendations = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/recommendations/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        soilType: 'loamy',
        season: 'rabi',
        waterAvailability: 'high',
        fertilizationHistory: 'moderate',
        budget: 5000
      })
    });
    
    const data = await response.json();
    console.log('Recommendations:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Python (Requests)
```python
import requests

url = 'http://localhost:5000/api/recommendations/get'
payload = {
    'soilType': 'loamy',
    'season': 'rabi',
    'waterAvailability': 'high',
    'fertilizationHistory': 'moderate',
    'budget': 5000
}

response = requests.post(url, json=payload)
data = response.json()
print(data)
```

---

## 🐛 Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Recommendations returned |
| 400 | Bad Request | Missing required fields |
| 404 | Not Found | Lab state not found |
| 500 | Server Error | Internal server error |

---

## 📞 Error Handling

Always check `success` field:
```javascript
if (response.data.success) {
  // Process recommendations
} else {
  // Handle error
  console.error(response.data.error);
}
```

---

**Last Updated:** January 2024
