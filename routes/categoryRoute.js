const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const categoryController = require('../controllers/categoryController');

router.route('/')
    .get(catchAsync(categoryController.index))

router.route('/new')
    .post(catchAsync(categoryController.createCategory))

router.route('/delete/:id')
    .delete(catchAsync(categoryController.deleteCategory))

module.exports = router;