const Jabatan = require('../models/jabatan');
const Pegawai = require('../models/pegawai');
const Penilaian = require('../models/penilaian');
const Kategori = require('../models/category');
const moment = require('moment');
const perPage = 5;

class penilaianController{
static async index(req, res, next) {
  try {
    // Get the current page from the query parameters, default to page 1 if not specified
    const currentPage = parseInt(req.query.page) || 1;

    // Calculate the skip value based on the current page and perPage
    const skip = (currentPage - 1) * perPage;

    // Query the database for total count and paginated data
    const totalCount = await Penilaian.countDocuments({});
    const penilaian = await Penilaian.find({})
      .populate('pegawaiID')
      .skip(skip)
      .limit(perPage);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / perPage);

    // Convert dates and render the view
    const penilaianDenganTanggalBaru = penilaian.map(item => ({
      ...item.toObject(),
      tanggal: moment(item.tanggal).format('YYYY-MM-DD'),
    }));

    res.render('penilaian/index', {
      penilaian: penilaianDenganTanggalBaru,
      currentPage,
      totalPages,
      perPage,
      totalEntries: totalCount,
    });
  } catch (err) {
    next(err); // Handle errors appropriately
  }
}
static async renderCreateForm(req, res, next) {
    const pegawai = await Pegawai.find({}).populate('jabatanID');
    const kategori = await Kategori.find({});
    res.render('penilaian/addPenilaian', { pegawai, kategori });
    }

    static async createpenilain(req, res, next) {
        const { pegawaiID, jabatan, tanggal, bulanPenilaian, izin, tanpaIzin } = req.body;
        console.log (req.body.bulanPenilaian);
        // console.log (req.body.bulan);
        const penilaian = new Penilaian({
          pegawaiID,
          jabatan,
          tanggal,
          bulanPenilaian,
          izin,
          tanpaIzin,
        });

        const kategoriData = [];
        let nilai=0;
        let total_nilai=0;
        // Mendapatkan data kategori dari formulir yang dikirimkan
        const kategoriCount = await Kategori.countDocuments({});
        for (let i = 0; i < kategoriCount; i++) {

            const kategoriID = req.body[`kategori${i}_id`];
            const nilaiHuruf = req.body[`kategori${i}`];
            if(nilaiHuruf == 'SB'){
                nilai = 5;
            }else if(nilaiHuruf == 'B'){
                nilai = 4;
            }
            else if(nilaiHuruf == 'C'){
                nilai = 3;
            }
            else if(nilaiHuruf == 'K'){
                nilai = 2;
            }
            else if(nilaiHuruf == 'SK'){
                nilai = 1;
            }
            else{
                nilai = 0;
            };
            total_nilai += nilai;
            // kategoriData.push(kategoriID, nilai);
            penilaian.DetailPenilaian.push({ kategoriID, nilai });

        }
        penilaian.total_nilai = total_nilai;
        await penilaian.save();
        res.redirect('/penilaian');
    }

    static async renderEditForm(req, res, next) {
        const { id } = req.params;
        const penilaian = await Penilaian.findById(id).populate('pegawaiID');
        const pegawai = await Pegawai.find({}).populate('jabatanID');
        const kategori = await Kategori.find({});
        res.render('penilaian/editPenilaian', { penilaian, pegawai, kategori });
      }

      static async deletePenilaian(req, res, next) {
        const { id } = req.params;
        await Penilaian.findByIdAndDelete(id);
        res.redirect('/penilaian');
      }
    
}

module.exports = penilaianController;