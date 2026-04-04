const express = require('express');
const diseaseController = require('../controllers/diseaseController');

const router = express.Router();

/**
 * @route POST /api/disease/predict
 * @desc  Predicts crop diseases based on symptoms and description
 */
router.post('/predict', diseaseController.predictDisease);

module.exports = router;
