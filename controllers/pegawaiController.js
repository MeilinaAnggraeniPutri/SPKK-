const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');

class pegawaiController{
    
    static async index(req, res, next){
        const pegawai = await Pegawai.find().populate('jabatanID');
        const allJabatans = await Jabatan.find();
        
        res.render('pegawai/index', {
            pegawai,
            allJabatans
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