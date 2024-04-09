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
    const kategori = await Kategori.find({});

    try {
      const { pegawaiID, tanggal, bulanPenilaian, izin, tanpaIzin} = req.body;

      const criterias = [];

      for (let i = 0; i < kategori.length; i++) {
        const criteria = [];
        const files = [];
        const criteriaType = req.body[`criteriaType-${i}`];

        for (let j = 0; j < kategori[i].subCriterias.length; j++) {
          const subCriteria = req.body[`subCriteria-${i}-${j}`];

          criteria.push(subCriteria);
        }

        for (let j = 0; j < kategori[i].documents.length; j++) {
          const file = req.body[`file-${i}-${j}`];
          files.push(file);
        }

        const fuse = {
          subCriteria: criteria,
          document: files,
          criteriaType: criteriaType
        };

        criterias.push(fuse);
      };

      const penilaian = new Penilaian({ pegawaiID, tanggal, bulanPenilaian, izin, tanpaIzin, criterias});
      console.log(penilaian.criterias[0].subCriteria);

      await penilaian.save();
      res.redirect('/penilaian');
    } catch (err) {
      next(err);
    }
  }


  static async addPenilaian(req, res, next) {
    // console.log("Penilaian Baru Ditambahkan");
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
