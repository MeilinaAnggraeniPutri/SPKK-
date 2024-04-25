const Pegawai = require('../models/pegawai');
const Kategori = require('../models/category');

class dashboardController {
    static async index(req, res, next) {
        var username = 'Guest';
        var userId = '010';
        if (req.session.isLogin) {
            username = req.session.username;
            userId = req.session.userId;

            res.render('dashboard', {username, userId});
        } else {
            res.redirect('/login');
        }
    } 
}

module.exports = dashboardController;