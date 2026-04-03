const express = require('express');
const multer = require('multer');
const { parseSoilPDF } = require('../utils/pdfParser');

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

/**
 * @route POST /api/soil/upload-report
 * @desc Upload a soil report PDF and extract text data
 * @access Public
 */
router.post('/upload-report', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    const result = await parseSoilPDF(req.file.buffer);
    
    if (!result.success) {
      return res.status(422).json({
        success: false,
        errorType: result.errorType,
        message: result.message
      });
    }

    return res.json({
      success: true,
      data: result.data,
      usedAI: result.usedAI,
      message: result.usedAI ? 'Soil data extracted using AI Assistant' : 'Soil data extracted successfully'
    });
  } catch (error) {
    console.error('Upload Process Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process report', 
      message: error.message 
    });
  }
});

/**
 * @route POST /api/soil/extract-from-text
 * @desc Extract soil data from raw text using AI
 * @access Public
 */
router.post('/extract-from-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Valid text is required for extraction' });
    }

    const { extractWithAI } = require('../utils/pdfParser');
    const data = await extractWithAI(text);

    if (!data) {
      return res.status(422).json({ error: 'AI failed to extract any soil metrics from the text' });
    }

    return res.json({
      success: true,
      data,
      message: 'Soil data extracted using AI'
    });
  } catch (error) {
    console.error('Text Extraction Error:', error);
    return res.status(500).json({ error: 'Failed to process text' });
  }
});

module.exports = router;
