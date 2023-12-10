const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const jabatanController = require('../controllers/jabatanController');
// const { isLoggedIn, validateJabatan } = require('../middleware');

router.route('/')
    .get(catchAsync(jabatanController.index))

router.route('/new')
    // .get(catchAsync(jabatanController.renderNewForm))
    .post(catchAsync(jabatanController.createJabatan))

router.route('/edit/:id')
    .put(catchAsync(jabatanController.editJabatan))

router.route('/delete/:id')
    .delete(catchAsync(jabatanController.deleteJabatan))


module.exports = router;