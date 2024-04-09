const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KriteriaSchema = new Schema({
    subCriteria: [Number],
    document: [String],
  });