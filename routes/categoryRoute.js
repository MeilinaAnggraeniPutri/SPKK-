const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const categoryController = require('../controllers/categoryController');

router.route('/')
    .get(catchAsync(categoryController.index))

router.route('/new')
.get(categoryController.addCategory)
    .post(catchAsync(categoryController.createCategory))

router.route('/edit/:id')
.get(categoryController.editCategory)
    .put(catchAsync(categoryController.updateCategory))

router.route('/delete/:id')
    .delete(catchAsync(categoryController.deleteCategory))

module.exports = router;