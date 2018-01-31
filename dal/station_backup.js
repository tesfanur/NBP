//Load module dependencies

var Station = require('../models/station');

var debug = require('debug')('api:station-dal');

//Create Station
exports.create = function createStation(data, cb){
    debug('creating a new station');

    var stationModel = new Station(data);
        //
        stationModel.save(function saveStation(err, stationData){
            if(err) return cb(err);//short form of if else statement

            exports.get({_id:stationData._id}, function (err, station){
                if(err) return cb(err)
                cb (null, station);});

        });

};
// //Get Stations
exports.getStations = function(query, cb){
    debug('getting all station collection');

    Station
        .find(query)
        .exec(function(err, stations){
            if(err) return cb(err)

            cb(null, stations || {});
        })

}
// //Get Station
exports.get = function getStation(query, cb){
    debug('getting a station', query);
    Station
        .findOne(query)
        .exec(function(err, station){
            if(err) return cb(err)
            cb(null, station || {});
        })
}
//Update Station
exports.update = function updateStation(query, update, cb){
    debug('updating a station', query);
    var opts = {
        'new': true
    };

    Station
        .findOneAndUpdate(query, update, opts)
        .exec(function (err, station){
            if(err) return cb(err);
            cb(null, station || {})
        })

}
//Remove Station
exports.delete = function deleteStation(query, cb){
    debug('deleting a station');
    Station
        .findOne(query)
        .exec(function (err, station){
            if(err) return cb(err)

            if(!station) return cb(null, {})

            Station.remove(function(err, data){
                if(err) return cb(err)
                cb(null, data);
            })

        })
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
