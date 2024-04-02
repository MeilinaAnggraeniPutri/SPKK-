const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name : String,
    subCriterias: [String],
    maxValues: [Number],
    documents: [String]
});

module.exports = mongoose.model('Category', CategorySchema);