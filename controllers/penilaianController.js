const express = require('express');
const Penilaian = require('../models/penilaian');
const Pegawai = require('../models/pegawai');
const Kategori = require('../models/category');
const fs = require('fs');

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
      if (req.session.isLogin) {
        const penilaian = await Penilaian.find({}).populate('pegawaiID');
        const penilaianDenganTanggalBaru = penilaian.map(item => ({
          ...item.toObject(),
          tanggal: moment(item.tanggal).format('YYYY-MM-DD'),
        }));
        res.render('penilaian/index', {
          penilaian: penilaianDenganTanggalBaru
        });
      } else {
        res.redirect('/login');
      }
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
          const fileField = `file-${i}-${j}`;
          const file = req.body[fileField];

          var filePath = ""

          if (file !== "") {
            const fileName = `${Date.now()}-${file}`;
            const path = '/assets/pdf/'
            filePath = path + fileName;
          }

          files.push(filePath);

          // if (file === null) {
          //   files.push("");
          //   continue;
          // }

          // if (file) {
          //   const fileName = `${Date.now()}-${file.name}`;
          //   const filePath = path + fileName;
      
          //   fs.writeFile(filePath, file.data, (err) => {
          //     if (err) {
          //       console.error(err);
          //     } else {
          //       files.push(filePath);
          //     }
          //   });

          //   files.push(filePath);
          // }
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
    try {
      if (req.session.isLogin) {
        const pegawai = await Pegawai.find({}).populate('jabatanID');
        const kategori = await Kategori.find({});
        res.render('penilaian/addPenilaian', {
          pegawai,
          kategori
        });
      } else {
        res.redirect('/login');
      }
    } catch (e) {
      next(e);
    }
  }

  static async detailPenilaian(req, res, next) {
    try {
      if (req.session.isLogin) {
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
      } else {
        res.redirect('login');
      }
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
      if (req.session.isLogin) {
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
      } else {
        res.redirect('/login');
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PenilaianController;