const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JabatanSchema = new Schema({
    namaJabatan: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Jabatan', JabatanSchema);