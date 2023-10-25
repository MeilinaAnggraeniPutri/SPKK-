const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');

class pegawaiController{
    
    static async index(req, res, next){
        let page = parseInt(req.query.page) || 1;
        if(page < 1) page = 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        
        const totalPegawai = await Pegawai.countDocuments();
        const totalPages = Math.ceil(totalPegawai / limit);
        
        const pegawai = await Pegawai.find().populate('jabatanID').skip(skip).limit(limit);
        const allJabatans = await Jabatan.find();
        
        res.render('pegawai/index', {
            pegawai,
            currentPage: page,
            totalPages, allJabatans
        });
    }

    static async createPegawai(req, res, next){
        const { namaPegawai,NIP, jabatanID } = req.body; // Corrected `jabatan` to `jabatanID`
        const pegawai = new Pegawai({ NIP, namaPegawai, jabatanID });
        await pegawai.save();
        res.redirect('/pegawai');
    }

    static async deletePegawai(req, res, next){
        const { id } = req.params;
        await Pegawai.findByIdAndDelete(id);
        res.redirect('/pegawai');
    }
    
}

module.exports = pegawaiController;