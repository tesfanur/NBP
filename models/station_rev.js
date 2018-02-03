var mongoose = require('mongoose');
var paginator = require('mongoose-paginate');
var Q = require('q'); // We can now use promises!

var Schema = mongoose.Schema;
var ObjectId =Schema.Types.ObjectId;
/**
*Train Stations Schema
*/
var StationSchema = new Schema({
    stationId   :  {type: String, unique: true},
    userId      :  {type: ObjectId, required: true, ref:'User'},
    name        :  {type: String},
    latitude    :  {type: Number},
    longitude   :  {type: Number},

    createdAt   :  {type:Date, default:Date.now},
    modifiedAt  :  {type:Date, default:Date.now}

});

//Static method we can call via Station.getStationByName in our code
//since promise already added into mongoose library you don't need
//to re invent the wheel from the scratch
    StationSchema.statics.findByName = function(name) {
        //return promise object
        return this.findOne({stationName: name}).exec();
    }

//Add mongoose paginate
StationSchema.plugin(paginator);

//export user model
module.exports = mongoose.model('Station', StationSchema);
