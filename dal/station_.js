//Load module dependencies

var Station = require('../models/station');

var debug = require('debug')('api:station-dal');

//1. Create Station
exports.create = function createStation(data, cb){
    debug('creating a new station');

    var stationModel = new Station(data);
        stationModel.save()
                    .then(function(stationData){
                        exports.getStationById({_id:stationData._id}, function (err, station){
                            if(err) return cb(err)
                            cb (null, station);});})
                    .catch(function(err){
                         return cb(err);//short form of if else statement
                    });
};
// 2. Get all Stations
exports.getAllStations = function(query, cb){
    debug('getting all station collection');
 Station.find(query)
        .exec()
        .then(function(stations){
            cb(null, stations || {});})
        .catch(function(err){
            if(err) return cb(err)});

}
// //Get Station by Id
exports.getStationById = function getStation(query, cb){
    debug('getting a station', query);
 Station.findOne(query)
        .exec()
        .then(function(station){
            cb(null, station || {});})
        .catch(function(err){
            return cb(err)});
}
//Update Station
exports.update = function updateStation(query, update, cb){
    debug('updating a station', query);
    var opts = {
        'new': true
    };
 Station.findOneAndUpdate(query, update, opts)
        .exec()
        .then(function (station){
            cb(null, station || {})})
        .catch(function (err){
            if(err) return cb(err);});
}
//Remove Station
exports.delete = function deleteStation(query, cb){
    debug('deleting a station');
 Station.findOne(query)
        .exec()
        .then(function (station){
            if(!station) {
              return cb(null, {"message":"Not found"})}
              ////cb(null, station);

            station.remove(function(err, data){
                if(err) return cb(err)
                cb(null, data);})
                ;})
         .catch(function (err){
                    return cb(err); });
}
//Get collection by pagination
exports.getStationByPagination = function getStationByPagination(query, qs, cb){
    debug('fetching a collection of stations');

    var opts = {
        sort: qs.sort || {},
        page: qs.page || 1,
        limit: qs.per_page || 10
    };

    Station.paginate(query, opts, function (err, data){
        if(err) return cb(err);

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
