const Pegawai = require('../models/pegawai');
const Kategori = require('../models/category');
const Penilaian = require('../models/penilaian');
const Jabatan = require('../models/jabatan');

class dashboardController {
    static async index(req, res, next) {
        try {
            var username = 'Guest';
            var userId = '010';

            
            if (req.session.isLogin) {
                username = req.session.username;
                userId = req.session.userId;

                const totalPegawai = await Pegawai.countDocuments();
                const totalKategori = await Kategori.countDocuments();
                const totalPenilaian = await Penilaian.countDocuments();
                const totalJabatan = await Jabatan.countDocuments()

                res.render('dashboard', {username, userId, totalPegawai, totalKategori, totalPenilaian, totalJabatan});
            } else {
                res.redirect('/login');
            }
        } catch (e) {
            next(e);
        }
    } 
}

module.exports = dashboardController;