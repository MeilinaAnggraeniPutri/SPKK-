const express = require('express');
const fileUpload = require('express-fileupload');
const Penilaian = require('../models/penilaian');
const Pegawai = require('../models/pegawai');
const Kategori = require('../models/category');

const moment = require('moment');

const {
  getMatriksKeputusan
} = require("../assets/js/gmm");
const {
  normalisasiMatriks
} = require("../assets/js/topsis");
const {
  pembobotanMatriks
} = require("../assets/js/topsis");
const {
  getSolusiIdeal
} = require("../assets/js/topsis");
const {
  getJarakIdeal
} = require("../assets/js/topsis");
const {
  getNilaiPreferensi
} = require("../assets/js/topsis");
const {
  getRanking
} = require("../assets/js/topsis");

class PenilaianController {
  static async index(req, res, next) {
    try {
      const penilaian = await Penilaian.find({}).populate('pegawaiID');
      const penilaianDenganTanggalBaru = penilaian.map(item => ({
        ...item.toObject(),
        tanggal: moment(item.tanggal).format('YYYY-MM-DD'),
      }));
      res.render('penilaian/index', {
        penilaian: penilaianDenganTanggalBaru
      });
    } catch (err) {
      next(err);
    }
  }


  static async createPenilaian(req, res, next) {
    const kategori = await Kategori.find({});

    try {
      const {
        pegawaiID,
        tanggal,
        bulanPenilaian,
        izin,
        tanpaIzin
      } = req.body;

      const criterias = [];

      for (let i = 0; i < kategori.length; i++) {
        const criteria = [];
        const files = [];

        for (let j = 0; j < kategori[i].subCriterias.length; j++) {
          const subCriteria = req.body[`subCriteria-${i}-${j}`];

          criteria.push(subCriteria);
        }

        for (let j = 0; j < kategori[i].documents.length; j++) {
          const file = req.files[`file-${i}-${j}`];
          console.log(file);
          const path = '/assets/pdf/'

          if (file === null) {
            files.push("");
            continue;
          }

          if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path + fileName;
      
            file.mv(filePath, (err) => {
              if (err) {
                console.error(err);
              } else {
                files.push(`/assets/pdf/${fileName}`);
              }
            });
          }
          files.push(file);
        }

        const fuse = {
          subCriteria: criteria,
          document: files,
        };

        criterias.push(fuse);
      };

      const penilaian = new Penilaian({
        pegawaiID,
        tanggal,
        bulanPenilaian,
        izin,
        tanpaIzin,
        criterias
      });

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
    res.render('penilaian/addPenilaian', {
      pegawai,
      kategori
    });
  }

  static async detaillPenilaian(req, res, next) {
    try {
      const {
        id
      } = req.params;
      const penilaian = await Penilaian.findById(id).populate('pegawaiID');

      const penilaianDenganTanggalBaru = {
        ...penilaian.toObject(),
        tanggal: moment(penilaian.tanggal).format('YYYY-MM-DD'),
      };

      const kategori = await Kategori.find({});

      const idPegawai = penilaian['pegawaiID'];
      const pegawai = await Pegawai.findById(idPegawai).populate('jabatanID');
      
      res.render('penilaian/detailPenilaian', {
        penilaian: penilaianDenganTanggalBaru,
        kategori: kategori,
        pegawai: pegawai
      });
    } catch (e) {
      next(e);
    }
  }

  static async deletePenilaian(req, res, next) {
    try {
      const {
        id
      } = req.params;
      await Penilaian.findByIdAndDelete(id);
      res.redirect('/penilaian');
    } catch (err) {
      next(err);
    }
  }

  static async rankPenilaian(req, res, next) {
    try {
      // Operasi GMM
      const pegawaiId = await Pegawai.find({}, {
        _id: 1
      });
      const matriksKeputusan = await getMatriksKeputusan(Penilaian, pegawaiId);

      // Operasi Topsis
      // Normalisasi Matriks
      const matriksTernormalisasi = await normalisasiMatriks(matriksKeputusan);

      // Pembobotan Matriks
      const bobotData = await Kategori.find({}, {
        _id: 0,
        weight: 1
      });
      const bobot = bobotData.map(item => item.weight);
      const matriksTerbobot = await pembobotanMatriks(matriksTernormalisasi, bobot);

      // Solusi Ideal Positif dan Negatif
      const tipeCriteriaData = await Kategori.find({}, {
        _id: 0,
        categoryType: 1
      });
      const tipeCriteria = tipeCriteriaData.map(item => item.categoryType);
      const solusiIdealPositif = await getSolusiIdeal(matriksTerbobot, tipeCriteria, 1);
      const solusiIdealNegatif = await getSolusiIdeal(matriksTerbobot, tipeCriteria, 0);

      // Jarak Ideal Positif dan Negatif
      const jarakIdealPositif = await getJarakIdeal(matriksTerbobot, solusiIdealPositif);
      const jarakIdealNegatif = await getJarakIdeal(matriksTerbobot, solusiIdealNegatif);

      // Nilai Preferensi
      const nilaiPreferensi = await getNilaiPreferensi(jarakIdealPositif, jarakIdealNegatif);

      // Perankingan Nilai Preferensi
      const rangking = await getRanking(nilaiPreferensi);

      const pegawai = await Pegawai.find().populate('jabatanID');

      res.render('penilaian/rankPenilaian', {
        pegawai,
        nilaiPreferensi,
        rangking
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PenilaianController;