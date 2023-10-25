const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const penilainController = require('../controllers/penilaianController');
// const { isLoggedIn, validatepenilain } = require('../middleware');

router.route('/')
    .get(catchAsync(penilainController.index))

router.route('/new')
    .get(catchAsync(penilainController.renderCreateForm))
    .post(catchAsync(penilainController.createpenilain))

router.route('/delete/:id')
    .delete(catchAsync(penilainController.deletePenilaian))


module.exports = router;