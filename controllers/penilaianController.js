const Penilaian = require('../models/penilaian');
const Pegawai = require('../models/pegawai');
const Kategori = require('../models/category');
const moment = require('moment');

class PenilaianController {
  static async index(req, res, next) {
    try {
      const penilaian = await Penilaian.find({}).populate('pegawaiID');
      const penilaianDenganTanggalBaru = penilaian.map(item => ({
        ...item.toObject(),
        tanggal: moment(item.tanggal).format('YYYY-MM-DD'),
      }));
      res.render('penilaian/index', { penilaian: penilaianDenganTanggalBaru });
    } catch (err) {
      next(err);
    }
  }


  static async createPenilaian(req, res, next) {
    try {
      const { pegawaiID, tanggal, bulanPenilaian, izin, tanpaIzin } = req.body;
      const penilaian = new Penilaian({ pegawaiID, tanggal, bulanPenilaian, izin, tanpaIzin });

      let totalNilai = 0;
      const kategoriCount = await Kategori.countDocuments({});

      for (let i = 0; i < kategoriCount; i++) {
        const kategoriID = req.body[`kategori${i}_id`];
        const nilaiHuruf = req.body[`kategori${i}`];
        const nilaiMapping = { SB: 5, B: 4, C: 3, K: 2, SK: 1 };
        const nilai = nilaiMapping[nilaiHuruf] || 0;
        totalNilai += nilai;
        console.log('sebelum push');
        console.log({ kategoriID, nilai });
        penilaian.DetailPenilaian.push({ categoryID: kategoriID, nilai });
      }

      penilaian.total_nilai = totalNilai;
      await penilaian.save();
      res.redirect('/penilaian');
    } catch (err) {
      next(err);
    }
  }


  static async addPenilaian(req, res, next) {
    console.log("asdasds");
    const pegawai = await Pegawai.find({}).populate('jabatanID');
    const kategori = await Kategori.find({});
    res.render('penilaian/addPenilaian', { pegawai, kategori });
}

static async detaillPenilaian(req, res, next) {
    const { id } = req.params;
    const penilaian = await Penilaian.findById(id)
    .populate('DetailPenilaian.categoryID')
    .populate({
      path: 'pegawaiID',
      populate: {
        path: 'jabatanID',
        model: 'Jabatan', // Replace 'Jabatan' with your actual model name for Jabatan
      },
    })
    .exec();  
    if(!penilaian) res.redirect('/penilaian');    
    console.log(penilaian.DetailPenilaian[0].categoryID.name);
    console.log(penilaian);
    
    const penilaianDenganTanggalBaru = {
      ...penilaian.toObject(),
      tanggal: moment(penilaian.tanggal).format('YYYY-MM-DD'),  
    };
    res.render('penilaian/detailPenilaian', { penilaian: penilaianDenganTanggalBaru });
  }
  
  static async deletePenilaian(req, res, next) {
    try {
      const { id } = req.params;
      await Penilaian.findByIdAndDelete(id);
      res.redirect('/penilaian');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PenilaianController;
