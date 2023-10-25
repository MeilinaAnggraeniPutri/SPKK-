const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PegawaiSchema = new Schema({
    NIP : String,
    namaPegawai : String,
    jabatanID : {
        type : Schema.Types.ObjectId,
        ref : 'Jabatan'
    },
});

module.exports = mongoose.model('Pegawai', PegawaiSchema);