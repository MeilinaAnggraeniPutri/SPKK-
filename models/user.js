// npm i passport passport-local passport-local-mongoose
// npm install mongoose@"<7.0.0"
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    nip: {
        type: String,
        required: true
    },
    jabatanID: {
        type : Schema.Types.ObjectId,
        ref : 'Jabatan'
    }
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);