var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kepriSchema = new Schema({
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

let kepri = mongoose.model('kepri', kepriSchema)

module.exports = kepri
