const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const penilainController = require('../controllers/penilaianController');
// const { isLoggedIn, validatepenilain } = require('../middleware');

router.route('/')
    .get(catchAsync(penilainController.index))

router.route('/new')
.get(penilainController.addPenilaian)
    .post(catchAsync(penilainController.createPenilaian))

router.route('/ranking')
.get(catchAsync(penilainController.rankPenilaian))
    
router.route('/:id')
.get(catchAsync(penilainController.detaillPenilaian))

router.route('/delete/:id')
    .delete(catchAsync(penilainController.deletePenilaian))

module.exports = router;