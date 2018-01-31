//Load module dependecies
var debug = require('debug');
var moment = require('moment');
var mongoose = require('mongoose');
var _        = require('lodash');//lodash can also do the same.check?

var StationDal = require('../dal/station_');
var handleError = require('../lib/utils').handleError;
var errorHandler = require('../lib/utils').errorHandler;

var errorObj = {
    status : 500,
    type : "STATION_ERROR"
}
var customError = {
    status : 500,
    type : "STATION_ERROR",
    message:""
}

//1. Create station
exports.createStation = function (req, res, next){
    var body = req.body;
    //pick only the required attributes from the body
    //do the same for other post requests
    var body = _.pick(req.body,"stationName","stationId","locationFromStartingPoint");

    StationDal.create(body, function (err, station){
        if(err){
            customError=err;
            customError.type= 'CREATE_STATION_ERROR';
            return errorHandler(res, customError);
        }
        res.status(201).json(station);//station created succesfully
    });

}

//2. Get stations
exports.getAllStations = function(req, res, next){
    StationDal.getAllStations({}, function (err, stations){
        if(err){
            errorObj.type = 'GET_STATIONS_ERROR';
            return handleError(res, err, errorObj);
        }
        res.status(200).json(stations || {});
    })
}
//3. Get station by id
exports.getStationById = function(req, res, next){
      //var stationId = req.params.id.trim
      //var stationId = mongoose.Types.ObjectId(req.params.id);
      var stationId = mongoose.mongo.ObjectId( req.params.id.trim());
    console.log(typeof stationId)

    StationDal.getStationById({_id : stationId}, function(err, station){
        if(err){
            errorObj.type = 'GET_STATION_ERROR';
            console.log(err);
            return handleError(res, err, errorObj);
        }
        res.status(200).json(station || {});
    })
}

//4. Search station by query instead of req.body
exports.searchStation = function (req, res, next){
    var query = req.body;

    StationDal.get(query, function(err, station){
        if(err){
            errorObj.type = 'SEARCH_STATION_ERROR';
            return handleError(res, err, errorObj);
        }
        res.status(200)
           .json(station || {});
    })
}

//5. Update station
exports.updateStation = function(req, res, next){
    var stationId = req.params.id;

    var update = req.body;
    var now = moment().toISOString();
    update.lastModified = now;

    StationDal.update(stationId, update, function(err, station){
        if(err){
            errorObj.type = 'UPDATE_STATION_ERROR';
            return handleError(res, err, errorObj);
        }
        res.json(station || {});
    })
}
//6. Delete station
exports.deleteStation = function(req, res, next){
    var stationId = req.params.id;

    StationDal.delete({_id: stationId}, function(err, station){
        if(err){
            errorObj.type = 'DELETE_STATION_ERROR';
            return handleError(res, err, errorObj);
        }
        res.json(station || {});
        if(!station)
        res.status(404).json({"message":"No station found with id " +stationId});

    })
}
//7. Get collection paginate
exports.getStationByPagination = function(req, res, next){
    debug('Get station collection by pagination');

    var query = req.query.query || {};
    var qs = req.query;

    StationDal.getStationByPagination(query, qs, function(err, docs){
        if(err){
            errorObj.type = 'GET_STATIONs_PAGINATE_ERROR';
            return handleError(res, err, errorObj);
        }
        res.json(docs);
    })
}
