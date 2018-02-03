/**
*Load module dependecies
*/
const FareModel = require('../models/fare');

const debug   = require('debug')('api:fare-dal');
const logMsg = require('../lib/utils').showMsg;
const errorHandler = require('../lib/utils').errorHandler;

var returnFields = FareModel.whitelist;
// var population = [{
//   path: 'user',
//   select: User.whitelist
// }];

const FareDalModule = (function(FareModel){
  'use strict';
/**
*1. Create FareModel
*/
 function createFare(data, cb){
    debug('creating a new fare');
    logMsg({from:data.from, to:data.to});
    FareModel.findOne({from:data.from, to:data.to})
             .exec()
             .then(result => {
               if(!result){
                   logMsg("This record doesn't exists.", result)
               let fare = new FareModel(data);
                      fare.save()
                            .then(fareData => {
                               if(!fareData) return cb(null,null);
                               cb(null,fareData);
                            },
                            err => {logMsg(err.message);
                                    return cb(err,null);
                                  })
                                  }
                    else{
                    cb(null,{"result":"This record already exists."});
                    logMsg("This record already exists.", result)
                    }
             }).catch(err => {console.log(err);})

}
/**
*2. Get all FareModels
*/
function getAllFares(query, cb){
    debug('getting all fare collection');
 FareModel.find(query,returnFields)
          .populate('from',["name"])
          .populate('to',["name"])
          .populate('userId',["username"])
          .exec()
          .then(fares => {
            var publicFares ={};
            //publicFares = fares[0];
            publicFares.from = fares[0].from.name;
            publicFares.to = fares[0].to.name;
            publicFares.distance = fares[0].distance;
            publicFares.fare = fares[0].fare;


            logMsg(publicFares);

            cb(null, fares || {});})
          .catch(function(err){
            if(err) return cb(err)});

}
/**
*3.Get Fare by Id  cb({error},{result})
*/
function getFareById(query, cb){
    debug('getting a fare', query);
 FareModel.findOne(query)
          .exec()
          .then(fare => {
             if(!fare) return cb({"error": "No record found"},null);
               //no error
              cb(null, fare);})
          .catch(err => {
              return cb(err,null)});
}
/**
*3.Update Fare
*/
function updateFare(query, update, cb){
    debug('updating a fare', query);
    var opts = {
        'new': true
    };
 FareModel.findOneAndUpdate(query, update, opts)
        .exec()
        .then(fare => cb(null, fare || {}))
        .catch( err   => {if(err) return cb(err);});
}
/**
*4.Remove Fare
*/
function deleteFare(query, cb){
    debug('deleting a fare');
 FareModel.findOne(query)
        .exec()
        .then(function (fare){
            if(!fare) {
              return cb(null, {fare : fare,
                "message":"Fare not found"
            })}
              ////cb(null, fare);

            fare.remove((err, data)=>{
                if(err) return cb(err)
                cb(null, data);})
                ;})
         .catch(err=>{return cb(err)} );
}
/**
*5.Get fare by pagination
*/
function getFareByPagination(query, qs, cb){
    debug('fetching a collection of fares');

    var opts = {
        sort: qs.sort || {},
        page: qs.page || 1,
        limit: qs.per_page || 10
    };

    FareModel.paginate(query, opts, (err, data)=>{
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
/**
*6.Get Fare by Id  cb({error},{result})
*/
function getFareByIdAndPopulate(query, cb){
 FareModel.findOne(query,{_id:0})
          .populate('from',["name"])
          .populate('to',["name"])
          .exec()
          .then(fare => {
             if(!fare) return cb({"error": "No record found"},null);
               //no error
              cb(null, fare);})
          .catch(err => {
              return cb(err,null)});
}

//
/**
*8.return FareDalModule public APIs
*/
  return {create : createFare,
  getAll : getAllFares,
  getById : getFareById,
  update : updateFare,
  delete : deleteFare,
  paginate : getFareByPagination,
  findAndPopulate :getFareByIdAndPopulate
};
}(FareModel));

module.exports= FareDalModule;
