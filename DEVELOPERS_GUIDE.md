# Developer's Guide - KrishiSaarthi AI

Complete guide for developers to understand, extend, and customize the system.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  React Frontend (Port 3000)                             │
│  - Pages: Home, Advisors, Labs, Schemes                 │
│  - Components: Forms, Results, Cards                    │
│  - Services: API client with Axios                      │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────┐
│  Express Backend (Port 5000)                            │
│  - Routes: /recommendations, /soil-labs, /schemes       │
│  - Services: Recommendation Engine                      │
│  - Data: Mock JSON data                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure Details

### Frontend Structure

```
frontend/src/
├── App.js                    # Main router component
├── index.js                  # React entry point
│
├── pages/                    # Page components
│   ├── Home.js               # Landing page
│   ├── SoilReportAdvisor.js  # Soil test input
│   ├── QuestionnaireAdvisor.js # Q&A form
│   ├── SoilTestingLabs.js    # Lab finder
│   └── GovernmentSchemes.js  # Schemes display
│
├── services/                 # API services
│   └── api.js                # Axios configuration
│
└── styles/                   # CSS files
    ├── App.css              # Global styles
    ├── Forms.css            # Form and advisor styles
    ├── Utilities.css        # Labs and schemes styles
    └── index.css            # Base styles
```

### Backend Structure

```
backend/
├── server.js                 # Express app setup
│
├── routes/                   # API route handlers
│   ├── recommendations.js    # Crop & fertilizer API
│   ├── soilLabs.js          # Lab finder API
│   └── schemes.js           # Schemes API
│
├── services/                 # Business logic
│   └── recommendationEngine.js # Scoring & calculation
│
├── data/                     # Mock data
│   ├── soilLabs.js          # Labor directory
│   └── schemes.js           # Government schemes
│
├── package.json              # Dependencies
└── .env.example              # Configuration template
```

---

## 🛠️ Key Files Explained

### Backend: server.js

```javascript
// Core Express setup
// - CORS configuration
// - Body parser setup
// - Route mounting
// - Error handling

Main functions:
- app.listen() - Start server
- Error handler - 404 and 500 responses
```

### Backend: recommendationEngine.js

```javascript
class RecommendationEngine
├── Properties:
│   ├── cropDatabase    # Crop definitions with requirements
│   ├── fertilizers     # Fertilizer specifications
│   └── Rules           # NPK requirements, compatibility
│
├── Methods:
│   ├── scoreCrop()           # Score one crop
│   ├── recommendCrops()      # Top 3 crops
│   ├── calculateNPK()        # NPK deficit calculation
│   ├── recommendFertilizers()# Fertilizer selection
│   └── generateRecommendations() # Complete recommendation
```

### Frontend: App.js

```javascript
// Main React component
// - Router setup
// - Navigation
// - Layout structure

Components used:
- React Router (Routes, Link)
- All page components
```

### Frontend: SoilReportAdvisor.js

```javascript
Form Flow:
1. User enters soil parameters
2. Form validation
3. API call to backend
4. Display results in cards

Key states:
- formData { soilN, soilP, soilK, pH, crop, budget }
- results { recommendations, fertilizer, costs }
- loading, error
```

---

## 📖 Component Usage

### App.js - Router Setup
```javascript
<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/soil-report" element={<SoilReportAdvisor />} />
    <Route path="/questionnaire" element={<QuestionnaireAdvisor />} />
    <Route path="/soil-labs" element={<SoilTestingLabs />} />
    <Route path="/schemes" element={<GovernmentSchemes />} />
  </Routes>
</Router>
```

### API Service - api.js
```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Usage in components:
api.post('/recommendations/get', data)
api.get('/soil-labs/maharashtra')
```

---

## 🧠 Recommendation Engine Logic

### 1. Crop Scoring Algorithm

```
scoreCrop(cropName, inputs) {
  score = 100
  
  // Soil type check
  if (crop.soilType doesn't contain inputs.soilType) {
    score -= 15
  }
  
  // Season check
  if (crop.season doesn't contain inputs.season) {
    score -= 20
  }
  
  // pH compatibility
  if (inputs.pH outside crop.phRange) {
    score -= 10
  }
  
  // Water availability
  if (inputs.waterAvailability doesn't match crop.waterNeeds) {
    score -= 25
  }
  
  // Budget fit
  if (inputs.budget < crop cost) {
    score -= 15
  }
  
  return max(0, score)
}
```

### 2. NPK Calculation

```
Required = cropDatabase[crop].nFertilizer.application
Current = inputs.soilN
Deficit = max(0, Required - Current)

Applied to N, P, K separately
```

### 3. Fertilizer Selection

```
1. Calculate what DEF nutrients needed
2. Recommend DAP (gets P + some N)
3. Add Urea (remaining N)
4. Add MOP (K requirements)
5. Check budget
6. Suggest organic alternatives
```

---

## 🔄 Adding New Features

### Add a New Crop

**File:** `backend/services/recommendationEngine.js`

```javascript
// In cropDatabase object:
this.cropDatabase.sugarcane = {
  soilType: ['clay', 'loamy', 'black'],
  season: ['kharif', 'rabi'],
  phRange: { min: 6.0, max: 7.5 },
  nFertilizer: { application: 200 },
  pFertilizer: { application: 80 },
  kFertilizer: { application: 100 },
  waterNeeds: 'high',
  minRainfall: 75,
  climate: ['tropical', 'subtropical'],
  costPerKg: 5,
  yieldPotential: { min: 60, max: 100 }
};
```

**Steps:**
1. Add crop object to `cropDatabase`
2. Include all required properties
3. Update the questionnaire `<select>` in frontend
4. Test with API calls

### Add a New State with Soil Labs

**File:** `backend/data/soilLabs.js`

```javascript
"rajasthan": [
  {
    id: 6,
    name: "ICAR Lab",
    location: "Jaipur",
    address: "...",
    phone: "...",
    email: "...",
    distance: 10,
    testCost: 200,
    turnaround: "3-5 days"
  }
]
```

**Update Frontend:**
- Add state to select dropdown in SoilTestingLabs.js

### Add a New Government Scheme

**File:** `backend/data/schemes.js`

```javascript
{
  id: 7,
  name: "New Scheme Name",
  description: "What it does",
  category: "Category",
  eligibility: "Who can apply",
  premium: "Cost to farmer",
  benefits: "What you get",
  link: "https://...",
  state: "Where available"
}
```

### Add a New Fertilizer

**File:** `backend/services/recommendationEngine.js`

```javascript
// In fertilizers object:
this.fertilizers.calcium_nitrate = {
  nContent: 15,
  pContent: 0,
  kContent: 0,
  costPerBag: 450,
  applicationType: 'foliar',
  timing: ['flowering'],
  soilPhSuitability: 'acidic'
};
```

---

## 🎨 Customizing UI

### Change Color Theme

**File:** `frontend/src/styles/App.css`

```css
:root {
  --primary-color: #2ecc71;      /* Green */
  --secondary-color: #3498db;    /* Blue */
  --danger-color: #e74c3c;       /* Red */
  --warning-color: #f39c12;      /* Orange */
  --dark-color: #2c3e50;         /* Dark */
  --light-color: #ecf0f1;        /* Light */
  --text-color: #333;
  --border-radius: 8px;
  --transition: all 0.3s ease;
}
```

### Create New Page Component

```javascript
// File: frontend/src/pages/NewPage.js
import React from 'react';
import '../styles/NewPage.css';

function NewPage() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>Page Title</h1>
        {/* Content */}
      </div>
    </div>
  );
}

export default NewPage;
```

Add to App.js:
```javascript
import NewPage from './pages/NewPage';

// In Routes:
<Route path="/new-page" element={<NewPage />} />

// In navbar:
<li><Link to="/new-page">New Page</Link></li>
```

---

## 🔗 API Development

### Adding a New Route

**File:** `backend/routes/newRoute.js`

```javascript
const express = require('express');
const router = express.Router();

// GET endpoint
router.get('/:id', (req, res) => {
  try {
    const id = req.params.id;
    // Process request
    return res.json({
      success: true,
      data: {},
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error message',
      message: error.message
    });
  }
});

module.exports = router;
```

**Register in server.js:**
```javascript
const newRoute = require('./routes/newRoute');
app.use('/api/new', newRoute);
```

### Request Validation

```javascript
router.post('/endpoint', (req, res) => {
  const { field1, field2 } = req.body;
  
  // Validation
  if (!field1 || !field2) {
    return res.status(400).json({
      error: 'Missing fields',
      required: ['field1', 'field2']
    });
  }
  
  // Process...
});
```

---

## 💾 Database Integration

### Currently: Mock JSON Data
```javascript
// backend/data/soilLabs.js
const soilTestingLabs = {
  "maharashtra": [ ... ]
};
module.exports = soilTestingLabs;
```

### Upgrade to MongoDB

**1. Install mongoose:**
```bash
npm install mongoose dotenv
```

**2. Create model:**
```javascript
// backend/models/SoilLab.js
const mongoose = require('mongoose');

const soilLabSchema = new mongoose.Schema({
  name: String,
  location: String,
  address: String,
  phone: String,
  email: String,
  testCost: Number,
  turnaround: String
});

module.exports = mongoose.model('SoilLab', soilLabSchema);
```

**3. Update route:**
```javascript
const SoilLab = require('../models/SoilLab');

router.get('/:state', async (req, res) => {
  try {
    const labs = await SoilLab.find({ state: req.params.state });
    return res.json({ success: true, data: labs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

**4. Environment variables:**
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/Krishna
```

---

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Test soil report
curl -X POST http://localhost:5000/api/recommendations/soil-report \
  -H "Content-Type: application/json" \
  -d '{"soilN":200,"soilP":20,"soilK":150,"pH":6.8,"crop":"wheat"}'

# Test labs
curl http://localhost:5000/api/soil-labs/maharashtra

# Test schemes
curl http://localhost:5000/api/schemes/list
```

### Using Postman

1. Create new request
2. Set method (GET/POST)
3. Enter URL: `http://localhost:5000/api/...`
4. Add body (for POST)
5. Send

### Using JavaScript Fetch

```javascript
fetch('http://localhost:5000/api/recommendations/get', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## 📱 Frontend Form Handling

### State Management Example

```javascript
const [formData, setFormData] = useState({
  soilType: '',
  season: '',
  waterAvailability: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  // API call with formData
};
```

### Form Validation

```javascript
const validateForm = (data) => {
  const errors = [];
  
  if (!data.soilType) errors.push('Soil type is required');
  if (!data.season) errors.push('Season is required');
  
  return errors;
};
```

---

## 🚀 Deployment Guide

### Deploy Backend to Heroku

```bash
# 1. Create Heroku app
heroku create krishisaarthi-api

# 2. Set environment variables
heroku config:set FRONTEND_URL=https://krishisaarthi.vercel.app

# 3. Deploy
git push heroku main

# 4. Check logs
heroku logs --tail
```

### Deploy Frontend to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd frontend
vercel --prod

# 3. Set environment variable
# Set REACT_APP_API_URL in Vercel dashboard
```

### Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🐛 Debugging Tips

### Frontend Debugging

1. **Browser Console** (F12)
   - Check for errors
   - Log API responses
   - Check network tab

2. **React DevTools**
   - Install extension
   - Inspect component state
   - Track re-renders

### Backend Debugging

1. **Terminal logs**
   ```javascript
   console.log('Debug:', variable);
   ```

2. **Postman requests**
   - Test each endpoint
   - Check response format

3. **Check .env**
   - Verify configuration
   - Check port settings

---

## 📝 Code Standards

### Naming Conventions
- Components: PascalCase `(ClickMe.js)`
- Functions: camelCase `(clickMe())`
- Constants: UPPER_CASE `(API_URL)`
- CSS classes: kebab-case `(.click-me)`

### File Organization
- Keep components focused
- Separate concerns
- Group related logic
- Comment complex code

### Error Handling
```javascript
try {
  // operation
} catch (error) {
  console.error('Operation failed:', error);
  // User-friendly message
}
```

---

## 🎓 Learning Resources

For deeper understanding:
- React docs: https://react.dev
- Express docs: https://expressjs.com
- REST API design: https://restfulapi.net
- CSS Grid: https://css-tricks.com/snippets/css/complete-guide-grid

---

## ✅ Development Checklist

- [ ] Code follows naming conventions
- [ ] Error handling implemented
- [ ] API validated and tested
- [ ] Frontend form validation works
- [ ] Responsive design tested
- [ ] Console shows no errors
- [ ] Performance acceptable
- [ ] Documentation updated

---

## 📊 Performance Tips

1. **Frontend:**
   - Code splitting
   - Lazy loading
   - Minimize re-renders
   - Optimize images

2. **Backend:**
   - Query optimization
   - Caching responses
   - Database indexing
   - Load balancing

3. **General:**
   - Minimize dependencies
   - Compress assets
   - Use CDN
   - Monitor performance

---

**Happy Developing! 🚀**
