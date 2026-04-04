const express = require('express');
const Scheme = require('../models/Scheme');

const router = express.Router();

// GET /api/schemes/list
router.get('/list', async (req, res) => {
  try {
    const schemes = await Scheme.find({});
    return res.json({
      success: true,
      totalSchemes: schemes.length,
      data: schemes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch schemes from database',
      message: error.message
    });
  }
});

// GET /api/schemes/category/:category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const filtered = await Scheme.find({ category: new RegExp(category, 'i') });

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
      error: 'Failed to fetch schemes from database',
      message: error.message
    });
  }
});

module.exports = router;
