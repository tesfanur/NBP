//Load module dependencies

var StationModel = require('../models/station');

var debug   = require('debug')('api:station-dal');
var logMsg = require('../lib/utils').showMsg;

var StationDalModule = (function(StationModel){
  'use strict';
//1. Create StationModel
 function createStation(data, cb){
    debug('creating a new station');
    var station = new StationModel(data);
          // station.save()
          //        .then(function(stationData){
          //               getStationById({_id:stationData._id},
          //                 function (err, station){
          //                   if(err)  return cb(err,null);
          //                   cb (null, station);});})
          //         .catch(function(err){
          //               logMsg(err.message);
          //                return cb(err,null);
          //                  });

          station.save()
                 .then(function(stationData){
                    if(!stationData) return cb(null,null);
                    cb(null,stationData);
                 })
                 .catch(function(err){
                        logMsg(err.message);
                         return cb(err,null);
                           });
}
// 2. Get all StationModels
function getAllStations(query, cb){
    debug('getting all station collection');
 StationModel.find(query)
        .exec()
        .then(function(stations){
            cb(null, stations || {});})
        .catch(function(err){
            if(err) return cb(err)});

}
//Get Station by Id
function getStationById(query, cb){
    debug('getting a station', query);
 StationModel.findOne(query)
        .exec()
        .then(function(station){
           if(!station){
             errorHandler(res,customError);
           }
             //no error
            cb(null, station || {});})
        .catch(function(err){
            return cb(err)});
}

//Update Station
function updateStation(query, update, cb){
    debug('updating a station', query);
    var opts = {
        'new': true
    };
 StationModel.findOneAndUpdate(query, update, opts)
        .exec()
        .then(function (station){
            cb(null, station || {})})
        .catch(function (err){
            if(err) return cb(err);});
}
//Remove Station
function deleteStation(query, cb){
    debug('deleting a station');
 StationModel.findOne(query)
        .exec()
        .then(function (station){
            if(!station) {
               res.status(404);
              return cb(null, {"message":"Not found"})}
              ////cb(null, station);

            station.remove(function(err, data){
                if(err) return cb(err)
                cb(null, data);})
                ;})
         .catch(function (err){
                    return cb(err); });
}
//Get station by pagination
function getStationByPagination(query, qs, cb){
    debug('fetching a collection of stations');

    var opts = {
        sort: qs.sort || {},
        page: qs.page || 1,
        limit: qs.per_page || 10
    };

    StationModel.paginate(query, opts, function (err, data){
        if(err) return cb(err,null);

        var response = {
            page: data.page,
            total_docs: data.total,
            total_pages: data.pages,
            per_page: data.limit,
            docs: data.docs
        };

        cb(null, response);
    });
}

//return StationDalModule public APIs
  return {create : createStation,
  getAll : getAllStations,
  getById : getStationById,
  update : updateStation,
  delete : deleteStation,
  paginate : getStationByPagination
};
}(StationModel));

module.exports= StationDalModule;
