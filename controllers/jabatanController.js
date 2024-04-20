const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');

class jabatanController{
    static async index(req, res, next){
        const jabatan = await Jabatan.find();
        res.render('jabatan/index', {
            jabatan
        });
    }

    static async createJabatan(req, res, next){
        const {namaJabatan} = req.body;
        const jabatan = new Jabatan({namaJabatan});
        await jabatan.save();
        res.redirect(`/jabatan`);
    }

    static async editJabatan(req, res, next){
        const { id} = req.params;
        const { namaJabatan } = req.body;
        const newJabatan = await Jabatan.findByIdAndUpdate(id, { namaJabatan });
        res.redirect(`/jabatan`);
    }

    static async deleteJabatan(req, res, next){
        const { id } = req.params;
        await Jabatan.findByIdAndDelete(id);
        res.redirect('/jabatan');
    }
}

module.exports = jabatanController;