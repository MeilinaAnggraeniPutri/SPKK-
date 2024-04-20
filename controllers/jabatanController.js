const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');

class jabatanController{
    static async index(req, res, next){
        try {
            const jabatan = await Jabatan.find();
            const pegawai = await Pegawai.find();

            const unusedJabatan = jabatan.filter(j => !pegawai.some(p => p.jabatanID.equals(j._id))).map(j => j._id);

            res.render('jabatan/index', {
                jabatan,
                unusedJabatan
            });
        } catch (e) {
            next(e);
        }
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