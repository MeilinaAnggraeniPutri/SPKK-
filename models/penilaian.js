const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PenilaianSchema = new Schema({
    pegawaiID: {
        type: Schema.Types.ObjectId,
        ref: 'Pegawai'
    },
    tanggal: {
        type: Date,
        default: Date.now
    },
    bulanPenilaian: {
        type: String,
        required: true
    },
    izin: {
        type: Number,
        required: true
    },
    tanpaIzin: {
        type: Number,
        required: true
    },
    total_nilai: {
        type: Number,
        required: true
    },
    DetailPenilaian : [{
        categoryID: {
            type: Schema.Types.ObjectId,
            ref: 'category'
        },
        nilai: {
            type: Number,
            required: true
        }
    }]

});

module.exports = mongoose.model('Penilaian', PenilaianSchema);