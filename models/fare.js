var mongoose = require('mongoose');
var moment   = require('moment');

var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
/**
*Train Transport payment/fare Schema
*/
var FareSchema = new Schema({
    userId : {type: ObjectId, required: true, ref:'User'},
    from   : {type: ObjectId, required: true, ref:'Station'},
    to     : {type: ObjectId, required: true, ref:'Station'},
    distance    : Number,
    fare        : Number,

    createdAt   : {type:Date},
    modifiedAt  : {type:Date}
});
//CALULATE FARE AMOUNT USING DISTANCE AS INPUT
FareSchema.pre('save', function (next) {
  var _this = this;
  _this.distance=parseInt(_this.distance)*6/16000;//payment in birr
  next();
});
FareSchema.pre('save', (next)=> {
  var _this = this;

  // set date modifications
  var now = moment().toISOString();

  _this.createdAt = now;
  _this.modifiedAt = now;

  next();

});
FareSchema.statics.whitelist = {
  _id: 1,
  userId:   1,
  from: 1,
  to: 1,
  fare: 1,  
  distance: 1,
  createdAt: 1,
  modifiedAt: 1
};

//export fare model
module.exports = mongoose.model('Fare', FareSchema);
