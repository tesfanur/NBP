/**
*Load module dependecies
*/
var debug    = require('debug');
var moment   = require('moment');
var mongoose = require('mongoose');
var _        = require('lodash');//lodash can also do the same.check?
var expressValidator = require('express-validator');

var FareDal         = require('../dal/fare');
var StationDal      = require('../dal/station_rev');

var handleError  = require('../lib/utils').handleError;
var errorHandler = require('../lib/utils').errorHandler;
var logMsg       = require('../lib/utils').showMsg;


var customError = {
    status : 500,
    type : "FARE_ERROR",
    message:""
}

//create global fare object and attach any required fields to it
//then export the object to expose its feature from other source Profile

var FareModule = (function (FareDal) {
  'use strict';
  //private members
  function _validateUserRegifareInput(req, res,next){
    req.checkBody('userId','userId is required').notEmpty();
    req.checkBody('from','starting destination is required').notEmpty();
    req.checkBody('to','destination station id is required').notEmpty();
    req.checkBody('distance','distance b/n is required').notEmpty();
      var errors = req.validationErrors();
      if(errors){
        logMsg(errors);
       return res.status(500).json(errors);
       }

  }
/**
*1. Create fare
*/
function createFare (req, res, next){
        _validateUserRegifareInput(req, res, next);
        var body = req.body;
        logMsg(body);
        //pick only the required attributes from the body
        //do the same for other post requests
        var body = _.pick(req.body,["userId","from","to","distance","fare"]);

        FareDal.create(body, function (err, fare){
            if(err){
                customError=err;
                logMsg(err);
                customError.type= 'CREATE_FARE_ERROR';
                return errorHandler(res, customError);
            }
             res.status(201).json(fare);//fare created succesfully
        });

}
/**
*2. Get all fares
*/
function getAllFares(req, res, next){
    FareDal.getAll({}, function (err, fares){
        if(err){
            customError.type = 'GET_FARES_ERROR';
            return handleError(res, err, customError);
        }
        res.status(200).json(fares || {});
    })
}
/**
*3. Get fare by id
*/
function getFareById (req, res, next){
      //var fareId = req.params.id.trim
      //var fareId = mongoose.Types.ObjectId(req.params.id);
      var fareId = mongoose.mongo.ObjectId( req.params.id.trim());
    console.log(typeof fareId)

    FareDal.getById({_id : fareId}, function(err, fare){
        if(err){
            customError.type = 'GET_FARE_ERROR';
            logMsg(err);
            return handleError(res, err, customError);
        }
        if(!fare) return res.status(404).json({"error":"Bad request"});
        res.status(200).json(fare || {});
    })
}
/**
*4. Search fare by query instead of req.body
*/
 function searchFare  (req, res, next){
    var query = req.body;
    customError.type = 'SEARCH_FARE_ERROR';

    FareDal.getById(query, function(err, fare){
         if(!fare){
           customError.message = "COULDN'T FIND STATIION \'"+query+".";

           return handleError(res, customError);
           }
        if(err)  return handleError(res, customError);
        //if succesfull
        res.status(200).json(fare || {});
    })
}
/**
*5. Update fare
*/
function updateFare (req, res, next){
    var fareId = req.params.id;

    var update = req.body;
    var now = moment().toISOString();
    update.lastModified = now;

    FareDal.update(fareId, update, function(err, fare){
        if(err){
            customError.type = 'UPDATE_FARE_ERROR';
            return handleError(res, err, customError);
        }
        res.json(fare || {});
    })
}
/**
*6. Delete fare
*/
function deleteFare (req, res, next){
    var fareId = req.params.id;

    FareDal.delete({_id: fareId}, function(err, fare){
        if(err){
            customError.type = 'DELETE_FARE_ERROR';
            customError.status=404;
            return handleError(res, err, customError);
        }
        res.json(fare || {});
        if(!fare)
        res.status(404).json({"message":"No fare found with id " +fareId});

    })
}
/**
*7. Get collection paginate
*/
function getFareByPagination (req, res, next){
    debug('Get fare collection by pagination');

    var query = req.query.query || {};
    var qs = req.query;

    FareDal.paginate(query, qs, function(err, docs){
        if(err){
            customError.type = 'GET_FAREs_PAGINATE_ERROR';
            //return handleError(res, err, customError);
            return errorHandler(res, customError);
        }
        res.json(docs);
    })
}
/**
*3. Get fare by id
*/
function findFareAndPopulate (req, res, next){
      //var fareId = req.params.id.trim
      //var fareId = mongoose.Types.ObjectId(req.params.id);
      var fareId = mongoose.mongo.ObjectId( req.params.id.trim());
    console.log(typeof fareId)

    FareDal.findAndPopulate({_id : fareId}, function(err, fare){
        if(err){
            customError.type = 'GET_FARE_ERROR';
            logMsg(err);
            return handleError(res, err, customError);
        }
        if(!fare) return res.status(404).json({"error":"Bad request"});
        res.status(200).json(fare || {});
    })
}
/**
*Return public API
*/
 return {
        create   : createFare,
        getAll   : getAllFares,
        getById  : getFareById,
        search   : searchFare,
        update   : updateFare,
        delete   : deleteFare,
        paginate : getFareByPagination,
        findAndPopulate:findFareAndPopulate
      };

}(FareDal));
/**
*expose fare controllers
*/
module.exports=FareModule;
