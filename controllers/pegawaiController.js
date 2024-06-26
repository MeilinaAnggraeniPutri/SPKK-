const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');

class pegawaiController{
    
    static async index(req, res, next){
        try {
            if (req.session.isLogin) {
                const pegawai = await Pegawai.find().populate('jabatanID');
                const penilaian = await Penilaian.find();
                const allJabatans = await Jabatan.find();

                const unusedPegawai = pegawai.filter(j => !penilaian.some(p => p.pegawaiID.equals(j._id))).map(j => j._id);

                res.render('pegawai/index', {
                    pegawai,
                    allJabatans,
                    unusedPegawai,
                });
            } else {
                res.redirect('/login');
            }
        } catch (e) {
            next(e);
        }
    }

    static async createPegawai(req, res, next){
        const { namaPegawai, NIP, jabatanID } = req.body;
        const pegawai = new Pegawai({ NIP, namaPegawai, jabatanID });
        await pegawai.save();
        res.redirect('/pegawai');
    }

    static async updatePegawai(req, res, next) {
        const { id } = req.params;
        const { NIP } = req.body;
        const { namaPegawai } = req.body;
        const { jabatanID } = req.body;
        const newJabatan = await Pegawai.findByIdAndUpdate(id, { NIP, namaPegawai, jabatanID });

        res.redirect(`/pegawai`);
    }

    static async deletePegawai(req, res, next){
        const { id } = req.params;
        await Pegawai.findByIdAndDelete(id);
        res.redirect('/pegawai');
    }
    
}

module.exports = pegawaiController;