const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const pegawaiController = require('../controllers/pegawaiController');
// const { isLoggedIn, validatePegawai } = require('../middleware');

router.route('/')
    .get(catchAsync(pegawaiController.index))

router.route('/new')
    .post(catchAsync(pegawaiController.createPegawai))

router.route('/edit/:id')
    .put(catchAsync(pegawaiController.updatePegawai))

router.route('/delete/:id')
    .delete(catchAsync(pegawaiController.deletePegawai))

module.exports = router;