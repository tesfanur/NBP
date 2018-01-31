var mongoose = require('mongoose');
var paginator = require('mongoose-paginate');
var Q = require('q'); // We can now use promises!
/*

Station:
======================
stationId: Number
StationName: String
locationFromStartingPoint: Number//added by me
*/

var Schema = mongoose.Schema;

var StationSchema = new Schema({
    stationId   : {type: Number, unique: true},
    stationName: {type: String},
    locationFromStartingPoint : {type: Number},

    createdAt   : {type:Date, default:Date.now},
    modifiedAt  : {type:Date, default:Date.now}

});

// Static method we can call via Station.getStationByName in our code
//since promise already added into mongoose library you don't need
//to re invent the wheel from the scratch
    StationSchema.statics.findByName = function(name) {
        //return promise object
        return this.findOne({stationName: name}).exec();
    }
// // alternative way to do the above feature Static method we can call via Station.getStationByName in our code
////using third party promise library. There are also other related libraries: bluebird, ..
// StationSchema.statics.findByName = function(name) {
// 	// Create our deferred object, which we will use in our promise chain
//
//     var deferred = Q.defer();
//
//     this.findOne({stationName: name}, function(error, station){
//
//         if (error)
//              return deferred.reject(new Error(error));
//        		// No error, continue on
//             deferred.resolve(station);
//     });
//     // Return the promise that we want to use in our chain
//     return deferred.promise;
// }

// create a promise object using native nodejs promise feature or ES6 promise
  // StationSchema.statics.findByName = function(name) {
  // 	// Create our deferred object, which we will use in our promise chain
  //   return new Promise((resolve, reject) =>{
  //     this.findOne({stationName: name}, function(error, station){
  //         if (error)
  //              return reject(new Error(error));
  //        		// No error, continue on
  //             resolve(station);
  //     });
  //   });
  // }


//Add mongoose paginate
StationSchema.plugin(paginator);

//export user model
module.exports = mongoose.model('Station', StationSchema);
