const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const jabatanController = require('../controllers/jabatanController');
// const { isLoggedIn, validateJabatan } = require('../middleware');

router.route('/')
    .get(catchAsync(jabatanController.index))

router.route('/new')
    .post(catchAsync(jabatanController.createJabatan))

router.route('/edit/:id')
    .put(catchAsync(jabatanController.updateJabatan))

router.route('/delete/:id')
    .delete(catchAsync(jabatanController.deleteJabatan))


module.exports = router;