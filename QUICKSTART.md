# Quick Start Guide - KrishiSaarthi AI

Get the application running in 5 minutes!

## ⚡ Quick Start (5 mins)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Create .env File

In the `backend` folder, create a `.env` file:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Expected output: 🚀 KrishiSaarthi AI Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Browser will automatically open http://localhost:3000
```

## ✅ Verification

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response: `{"status": "Server is running"}`

2. **Frontend**: Should open automatically at `http://localhost:3000`

3. **Test API:**
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

## 📋 Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Home page loads correctly
- [ ] Navigation menu works
- [ ] Questionnaire page loads
- [ ] Soil Report page loads
- [ ] Can submit questionnaire and get results
- [ ] Soil Labs page shows data
- [ ] Government Schemes displays properly

## 🎯 Demo Data to Try

### Soil Report Test
- Nitrogen: 200 mg/kg
- Phosphorus: 20 mg/kg
- Potassium: 150 mg/kg
- pH: 6.8
- Crop: Wheat
- Budget: 5000

### Questionnaire Test
- Soil Type: Loamy
- Season: Rabi
- Water Availability: High
- Previous Crop: Rice
- Fertilizer History: Moderate
- Budget: 5000

## 🔍 What to Look For

### Home Page
- Hero section with welcome message
- Feature cards describing capabilities
- Call-to-action buttons

### Soil Report Advisor
- Form with input fields for NPK, pH
- Results section showing recommendations
- Fertilizer schedule with costs

### Questionnaire Advisor
- Multiple choice questions
- Top 3 crop recommendations
- Detailed fertilizer plans
- Cost optimization tips

### Soil Labs
- State selector buttons
- Lab listings with contact info
- Soil testing guide

### Government Schemes
- List of active schemes
- Category filter
- Detailed scheme information

## 🚨 Common Issues

**Issue: "Cannot GET /api/health"**
- Solution: Backend not running. Run `npm run dev` in backend folder

**Issue: "Failed to fetch from API"**
- Solution: Frontend can't reach backend. Check if backend is running on port 5000

**Issue: Port 5000 already in use**
- Solution: Kill existing process (see main README) or change PORT in .env

**Issue: Page shows blank**
- Solution: Run `npm install` again or clear browser cache (Ctrl+Shift+Delete)

## 📱 Feature Walkthrough

### Step 1: Home Page
- Click on "📊 Soil Report" or "❓ Questionnaire"

### Step 2: Soil Report
- Enter: N=200, P=20, K=150, pH=6.8
- Select: Wheat
- Click: "Get Recommendations"
- Review: Fertilizer schedule and costs

### Step 3: Questionnaire
- Select: Loamy soil, Rabi season, High water
- Enter: Budget (optional)
- Click: "Get Recommendations"
- View: Top crops with detailed plans

### Step 4: Resources
- Click "🔬 Testing Labs" to find nearby soil testing centers
- Click "📜 Schemes" to explore government benefits

## 💾 File Locations Quick Reference

- Backend server: `backend/server.js`
- Recommendation engine: `backend/services/recommendationEngine.js`
- Frontend app: `frontend/src/App.js`
- API service: `frontend/src/services/api.js`
- Mock data: `backend/data/`

## 🔧 Configuration

### Change Backend Port
Edit `backend/.env`:
```
PORT=3001
```

### Change API URL in Frontend
Edit or create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:3001/api
```

### Add More Crops
Edit `backend/services/recommendationEngine.js` in `cropDatabase` object

### Add More States
Edit `backend/data/soilLabs.js` with new state entries

## 📊 Database / Mock Data

Currently using JavaScript objects for data storage. To upgrade to real database:

1. Install MongoDB: `npm install mongoose`
2. Create models in `backend/models/`
3. Replace data service calls with database queries
4. Add user authentication if needed

## 📚 Key Files to Understand

1. **Recommendation Engine** (`backend/services/recommendationEngine.js`)
   - Scoring algorithm for crops
   - NPK calculation logic
   - Fertilizer recommendations

2. **API Routes** (`backend/routes/`)
   - Request validation
   - Data processing
   - Response formatting

3. **React Components** (`frontend/src/pages/`)
   - Form handling
   - API calls
   - Data display

4. **Styling** (`frontend/src/styles/`)
   - Responsive CSS
   - Theme colors in `:root`

## 🎨 Customization Ideas

1. **Change Colors:** Edit `:root` in `frontend/src/styles/App.css`
2. **Add Crops:** Extend `cropDatabase` in recommendation engine
3. **Add Fertilizers:** Add to `fertilizers` object
4. **Modify Forms:** Edit React components in `pages/`
5. **Add Languages:** Use i18n library for translations

## ✉️ Next Steps

1. Test all features thoroughly
2. Add database integration
3. Implement user authentication
4. Deploy to cloud (Heroku, Vercel, etc.)
5. Add real soil testing lab data
6. Integrate weather API
7. Add more crop varieties
8. Implement mobile app version

## 📞 Need Help?

1. Check the main README.md for detailed documentation
2. Review console logs (F12 in browser)
3. Check backend terminal for server logs
4. Verify API endpoints with cURL or Postman

---

**Happy Farming! 🚜🌾**
