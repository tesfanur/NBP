var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//try to redesign this schema so that your can clearly relate the schedule with
// the static data regarding stations records
/**
*Train Schedule
*/
var ScheduleSchema = new Schema({
    scheduleId      : {type: Number},
    sourceStationId : {type: Schema.Types.ObjectId, required: true, ref:'Station'},
    destinationStationId    : {type: Schema.Types.ObjectId, required: true, ref:'Station'},
    price                   : {type: Number, required:true},
    distanceBetweenStations : {type: Number},
    createdAt  :{type:Date, default:Date.now},
    modifiedAt :{type:Date, default:Date.now}

});
//export user model
module.exports = mongoose.model('Schedule', ScheduleSchema);
