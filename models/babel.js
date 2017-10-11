var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var babelSchema = new Schema({
  title: {
    type: String,
  },
  pubDate: {
    type: String
  },
  category: {
    type: String
  },
  location: {
    type: String
  },
  expert: {
    type: String
  },
  link: {
    type: String
  },
  description: {
    type: String
  }
})

let babel = mongoose.model('babel', babelSchema)

module.exports = babel
