const Pegawai = require('../models/pegawai');
const Kategori = require('../models/category');
const moment = require('moment');

class dashboardController {
    static async index(req, res, next) {
        res.render('dashboard');
    } 
}

module.exports = dashboardController;