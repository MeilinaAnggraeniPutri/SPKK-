const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');

class jabatanController{
    static async index(req, res, next){
        let page = parseInt(req.query.page) || 1;
        if(page < 1) page = 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        
        const totalJabatan = await Jabatan.countDocuments();
        const totalPages = Math.ceil(totalJabatan / limit);
        
        const jabatan = await Jabatan.find().skip(skip).limit(limit);
        
        res.render('jabatan/index', {
            jabatan,
            currentPage: page,
            totalPages
        });
    }

    static async createJabatan(req, res, next){
        const {namaJabatan} = req.body;
        const jabatan = new Jabatan({namaJabatan});
        console.log(jabatan);
        await jabatan.save();
        res.redirect(`/jabatan`);
    }

    static async deleteJabatan(req, res, next){
        const { id } = req.params;
        await Jabatan.findByIdAndDelete(id);
        res.redirect('/jabatan');
    }
}

module.exports = jabatanController;