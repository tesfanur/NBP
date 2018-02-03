//Image schema and model to hold profile image on to mongodb
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
*User Profile Image Schema
*/
var ImageSchema = new Schema({
  filename: {type: String},
  originalName: {type: String},
  desc: {type: String},
  created: { type: Date, default: Date.now }
});

module.exports= mongoose.model('ProfileImage', ImageSchema);
