const express = require('express');
const schemes = require('../data/schemes');

const router = express.Router();

// GET /api/schemes/list
router.get('/list', (req, res) => {
  try {
    return res.json({
      success: true,
      totalSchemes: schemes.length,
      data: schemes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch schemes',
      message: error.message
    });
  }
});

// GET /api/schemes/category/:category
router.get('/category/:category', (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const filtered = schemes.filter(s => s.category.toLowerCase() === category);

    if (filtered.length === 0) {
      return res.json({
        success: false,
        message: `No schemes found for category: ${req.params.category}`,
        data: []
      });
    }

    return res.json({
      success: true,
      category: req.params.category,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch schemes',
      message: error.message
    });
  }
});

module.exports = router;
