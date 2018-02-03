/**
*Load module dependecies
*/
var debug    = require('debug');
var moment   = require('moment');
var mongoose = require('mongoose');
var _        = require('lodash');//lodash can also do the same.check?
var Station  = require('../models/station_rev');
var expressValidator = require('express-validator');

var StationDal   = require('../dal/station_rev');
var handleError  = require('../lib/utils').handleError;
var errorHandler = require('../lib/utils').errorHandler;
var logMsg       = require('../lib/utils').showMsg;

var errorObj = {
    status : 500,
    type : "STATION_ERROR"
}
var customError = {
    status : 500,
    type : "STATION_ERROR",
    message:""
}

//create global station object and attach any required fields to it
//then export the object to expose its feature from other source Profile

var StationModule = (function (StationDal) {
  'use strict';
  //private members
  function _validateUserRegistationInput(req, res,next){
    req.checkBody('name','station name is required').notEmpty();
    req.checkBody('stationId','station id is required').notEmpty();
    req.checkBody('userId','user id is required').notEmpty();
    req.checkBody('latitude','latitude is required').notEmpty();
    req.checkBody('longitude','longitude is required').notEmpty();
      var errors = req.validationErrors();
      if(errors){
        logMsg(errors);
       return res.status(500).json(errors);
       }

  }
/**
*1. Create station
*/
function createStation (req, res, next){
        _validateUserRegistationInput(req, res, next);
        var body = req.body;
        //pick only the required attributes from the body
        //do the same for other post requests
        var body = _.pick(req.body,["name","stationId","userId","latitude","longitude"]);

        StationDal.create(body, function (err, station){
            if(err){
                customError=err;
                customError.type= 'CREATE_STATION_ERROR';
                return errorHandler(res, customError);
            }
             res.status(201).json(station);//station created succesfully
        });

}
/**
*2. Get all stations
*/
function getAllStations(req, res, next){
    StationDal.getAll({}, function (err, stations){
        if(err){
            errorObj.type = 'GET_STATIONS_ERROR';
            return handleError(res, err, errorObj);
        }
        res.status(200).json(stations || {});
    })
}
/**
*3. Get station by id
*/
function getStationById (req, res, next){
      //var stationId = req.params.id.trim
      //var stationId = mongoose.Types.ObjectId(req.params.id);
      var stationId = mongoose.mongo.ObjectId( req.params.id.trim());
    console.log(typeof stationId)

    StationDal.getById({_id : stationId}, function(err, station){
        if(err){
            errorObj.type = 'GET_STATION_ERROR';
            logMsg(err);
            return handleError(res, err, errorObj);
        }
        res.status(200).json(station || {});
    })
}
/**
*4. Search station by query instead of req.body
*/
 function searchStation  (req, res, next){
    var query = req.body;
    customError.type = 'SEARCH_STATION_ERROR';

    StationDal.getById(query, function(err, station){
         if(!station){
           customError.message = "COULDN'T FIND STATIION \'"+query+".";

           return handleError(res, customError);
           }
        if(err)  return handleError(res, customError);
        //if succesfull
        res.status(200).json(station || {});
    })
}
/**
*5. Update station
*/
function updateStation (req, res, next){
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
/**
*6. Delete station
*/
function deleteStation (req, res, next){
    var stationId = req.params.id;

    StationDal.delete({_id: stationId}, function(err, station){
        if(err){
            errorObj.type = 'DELETE_STATION_ERROR';
            errorObj.status=404;
            return handleError(res, err, errorObj);
        }
        res.json(station || {});
        if(!station)
        res.status(404).json({"message":"No station found with id " +stationId});

    })
}
/**
*7. Get collection paginate
*/
function getStationByPagination (req, res, next){
    debug('Get station collection by pagination');

    var query = req.query.query || {};
    var qs = req.query;

    StationDal.paginate(query, qs, function(err, docs){
        if(err){
            customError.type = 'GET_STATIONs_PAGINATE_ERROR';
            //return handleError(res, err, errorObj);
            return errorHandler(res, customError);
        }
        res.json(docs);
    })
}
/**
*8. find station by nam
*/
function findStationByName (req, res, next){
     //local variables
      var name = req.params.name.trim();
      customError.message="STATION \'"+ name +"\' NOT FOUND";
    console.log(typeof stationId);

    Station.findByName(name)
           .then(function(station){
             if(!station)
             errorHandler(res, customError);
             res.json({"station": station});
           })
           .catch(function(err){
             errorHandler(res, err);
             showMsg(err);
             //res.status(500).json({"error":"Something went wrong. " + err});
           });
}
/**
*Return public API
*/
 return {
        create   : createStation,
        getAll   : getAllStations,
        getById  : getStationById,
        search   : searchStation,
        update   : updateStation,
        delete   : deleteStation,
        paginate : getStationByPagination,
        findByName: findStationByName
      };

}(StationDal));
/**
*expose station controllers
*/
module.exports=StationModule;
