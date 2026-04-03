# KrishiSaarthi AI - Smart Farming Advisor

A web application that helps farmers make crop and fertilizer decisions using simple inputs, even without soil reports.

## 🌾 Overview

KrishiSaarthi AI is a hackathon-ready farming recommendation system that provides:
- **Crop Recommendations**: Suggest top 2-3 crops based on farm conditions
- **Fertilizer Planning**: Detailed NPK recommendations with costs
- **Multiple Input Methods**: Soil report or simple questionnaire
- **Location-based Guidance**: Find nearby soil testing labs
- **Government Schemes**: Information on agricultural benefits and subsidies

## 🚀 Features

### Core Features
1. **Soil Report Analysis** - Upload soil test results (N, P, K, pH) for precise recommendations
2. **Questionnaire Mode** - Simple questions for farmers without soil reports
3. **Smart Recommendations**:
   - Crop suitability scoring
   - Fertilizer calculation and scheduling
   - Cost optimization suggestions
   - Yield potential estimates

4. **Support Services**:
   - Soil testing lab finder with contact details
   - Government schemes information
   - Agricultural best practices guide
   - Cost-saving tips

## 📁 Project Structure

```
AstraX_Greentech/
├── frontend/                 # React Frontend
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── SoilReportAdvisor.js
│   │   │   ├── QuestionnaireAdvisor.js
│   │   │   ├── SoilTestingLabs.js
│   │   │   └── GovernmentSchemes.js
│   │   ├── services/        # API services
│   │   │   └── api.js       # Axios configuration
│   │   ├── styles/          # CSS files
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                  # Node.js Backend
│   ├── routes/              # API routes
│   │   ├── recommendations.js
│   │   ├── soilLabs.js
│   │   └── schemes.js
│   ├── services/            # Business logic
│   │   └── recommendationEngine.js
│   ├── data/                # Mock data
│   │   ├── soilLabs.js
│   │   └── schemes.js
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios (HTTP client)
- CSS3 (Responsive Design)

**Backend:**
- Node.js
- Express.js
- CORS
- dotenv

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ankitkumar764/AstraX_Greentech.git
cd AstraX_Greentech
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start the backend server
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup (in new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
# Frontend opens at http://localhost:3000
```

## 🎯 Usage Guide

### Soil Report Mode
1. Click on "📊 Soil Report" from navigation
2. Enter your soil test parameters (N, P, K, pH)
3. Select your crop and budget
4. Get detailed fertilizer recommendations

### Questionnaire Mode
1. Click on "❓ Questionnaire"
2. Answer simple questions about your farm
3. Receive top 3 crop recommendations with fertilizer plans

### Other Features
- **Soil Testing Labs**: Find nearby labs with contact details
- **Government Schemes**: Browse agricultural subsidies and benefits
- **Testing Guide**: Learn how to collect soil samples

## 📊 API Endpoints

### Recommendations
```
POST /api/recommendations/get
POST /api/recommendations/soil-report
```

### Soil Labs
```
GET /api/soil-labs/:state
GET /api/soil-labs
```

### Government Schemes
```
GET /api/schemes/list
GET /api/schemes/category/:category
```

## 🎓 Supported Crops

- Wheat (Rabi)
- Rice (Kharif)
- Maize (Kharif/Rabi)
- Cotton (Kharif)
- Sugarcane (Kharif/Rabi)
- Pulses (Rabi)
- Vegetables (Year-round)

## 🧮 How Recommendations Work

1. **Crop Scoring**: Algorithm evaluates soil type, season, pH, water needs, and budget
2. **Fertilizer Calculation**: Determines NPK deficit and calculates optimal fertilizer mix
3. **Cost Optimization**: Provides cost-saving suggestions and government scheme info

## 📋 Fertilizer Types

| Fertilizer | N% | P% | K% | Cost/50kg |
|-----------|-----|-----|-----|-----------|
| Urea | 46 | 0 | 0 | ₹250 |
| DAP | 18 | 46 | 0 | ₹1100 |
| MOP | 0 | 0 | 60 | ₹600 |
| Neem | 3 | 1 | 1 | ₹400 |

## 🔐 Environment Variables

Create `.env` in backend directory:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 📱 Example API Responses

### Soil Report API
```json
{
  "success": true,
  "crop": "wheat",
  "soilAnalysis": {
    "nitrogen": 200,
    "phosphorus": 20,
    "potassium": 150,
    "pH": 6.8
  },
  "fertilizerPlan": {
    "recommendations": [
      {
        "name": "DAP",
        "bags": 2,
        "timing": "At planting",
        "cost": 2200
      }
    ],
    "totalCost": 3500
  }
}
```

## 🚀 Deployment

### Backend (Heroku)
```bash
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

## 🔄 Extending the System

### Add New Crops
Edit `backend/services/recommendationEngine.js` and add to `cropDatabase`

### Add States in Soil Labs
Edit `backend/data/soilLabs.js`

### Add Government Schemes
Edit `backend/data/schemes.js`

## 🐛 Troubleshooting

**Backend not running:**
- Ensure Node.js is installed: `node --version`
- Run `npm install` in backend folder
- Check port 5000 is free

**Frontend API errors:**
- Verify backend is running
- Check REACT_APP_API_URL in frontend .env
- Open browser console for error messages

**Port in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

## 📞 Support

For issues or questions, check:
1. Troubleshooting section above
2. Browser console (F12)
3. Backend terminal logs

## 🎯 Future Enhancements

- [ ] Database integration (MongoDB)
- [ ] User authentication
- [ ] Real crop price updates
- [ ] Weather-based recommendations
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Plant disease detection
- [ ] Historical yield tracking

---

**Made with 🌱 for Indian Farmers**