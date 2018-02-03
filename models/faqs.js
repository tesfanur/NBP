var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
/**
*frequently asked questions and answers schema
*/
var FaqSchema = new Schema({
    question : {type: String, required: true},
    answer   : {type: String, required: true},
    postedBy : {type: String, required: true},
    datePosted   : {type: Date, default: Date.now},
    dateModified : {type: Date, default: Date.now}
});



//export user model
module.exports = mongoose.model('FAQs', FaqSchema);
