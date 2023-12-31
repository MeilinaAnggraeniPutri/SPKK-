const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const dashboardController = require('../controllers/dashboardController');

router.route('/dashboard')
    .get(catchAsync(dashboardController.index))

module.exports = router;