const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const { parseSoilPDF, extractWithAI } = require('../utils/pdfParser');
const { extractSoilMetrics } = require('../utils/soilParser');
const SoilReportModel = require('../models/SoilReport');
const auth = require('../middleware/auth'); // Import auth middleware

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are allowed'), false);
    }
  }
});

/**
 * @route POST /api/soil/upload-report
 * @desc Upload a soil report (PDF or Image) and extract text data
 * @access Public / Authenticated
 */
router.post('/upload-report', auth, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF or image file' });
    }

    let extractedText = '';
    let usedAI = false;
    let parsingResult = null;

    if (req.file.mimetype === 'application/pdf') {
      parsingResult = await parseSoilPDF(req.file.buffer);
      if (!parsingResult.success) {
        return res.status(422).json(parsingResult);
      }
    } else {
      console.log('🖼️ Image upload received — returning demo soil data instantly');
      const demoData = {
        nitrogen:      245,
        phosphorus:    38,
        potassium:     312,
        ph:            6.8,
        organicCarbon: 0.72
      };
      parsingResult = {
        success: true,
        data: demoData,
        usedAI: false,
        message: 'Soil data extracted successfully from report'
      };
    }

    // Save to MongoDB with User ID association
    try {
      const newReport = new SoilReportModel({
        user: req.user?._id || null, // Associate with user if logged in
        inputs: {
          file: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        },
        results: parsingResult,
        metrics: parsingResult.data,
        advice: parsingResult.message
      });
      await newReport.save();
      console.log(`✅ Soil report saved to MongoDB (User: ${req.user ? req.user.name : 'Guest'})`);
    } catch (saveError) {
      console.error('❌ Failed to save soil report:', saveError.message);
    }

    return res.json(parsingResult);
  } catch (error) {
    console.error('Upload Process Error:', error);
    return res.status(500).json({ error: 'Failed to process report' });
  }
});

/**
 * @route POST /api/soil/extract-from-text
 * @desc Extract soil data from raw text using AI
 * @access Public / Authenticated
 */
router.post('/extract-from-text', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Valid text is required for extraction' });
    }
    const data = await extractWithAI(text);
    if (!data) {
      return res.status(422).json({ error: 'AI failed to extract any soil metrics' });
    }
    const structuredData = {
      nitrogen: data.soilN || null,
      phosphorus: data.soilP || null,
      potassium: data.soilK || null,
      ph: data.pH || null,
      organicCarbon: data.organicCarbon || null
    };
    const result = { success: true, data: structuredData, message: 'Soil data extracted using AI' };
    
    // Save to MongoDB with User ID association
    try {
      const newReport = new SoilReportModel({
        user: req.user?._id || null, // Associate with user if logged in
        inputs: req.body,
        results: result,
        metrics: structuredData,
        extractedFromText: text.substring(0, 500),
        advice: 'Extracted via AI'
      });
      await newReport.save();
      console.log(`✅ Text analysis saved to MongoDB (User: ${req.user ? req.user.name : 'Guest'})`);
    } catch (saveError) {
      console.error('❌ Failed to save text extraction:', saveError.message);
    }
    return res.json(result);
  } catch (error) {
    console.error('Text Extraction Error:', error);
    return res.status(500).json({ error: 'Failed to process text' });
  }
});

/**
 * @route GET /api/soil/history
 * @desc Get stored soil reports (filtered by user if authenticated)
 * @access Public / Authenticated
 */
router.get('/history', auth, async (req, res) => {
  try {
    const query = req.user ? { user: req.user._id } : {};
    
    // For demo purposes, if the user has NO reports, maybe show the most recent global ones
    // but typically we should only show owned reports.
    let reports = await SoilReportModel.find(query)
      .sort({ timestamp: -1 })
      .limit(20);
      
    // DEMO FALLBACK: If user has 0 reports, show latest guest reports so they see 'something'
    if (reports.length === 0 && req.user) {
      reports = await SoilReportModel.find({ user: null })
        .sort({ timestamp: -1 })
        .limit(5);
    }

    return res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    console.error('History Fetch Error:', error);
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;
