
var Station = require('../models/station');
//Load module dependecies

var handleServerError = require('../lib/utils').handleError;

//1. create a new station
module.exports.createStation= function(req, res){
        var newStation  = req.body;
        var stationId    = newStation.stationId;
        var stationName  = newStation.stationName;
        var locationFromStartingPoint = newStation.locationFromStartingPoint;

    //before saving check station if it exists
    //=====================================

  Station.findOne({ stationId: stationId }, function(err, station) {
    if (err) { return next(err); }

    if (station) {
      console.log("error: "+ stationId + " already exists");
      //here the return statement exits the remaining code from being executed
      return res.json({message:stationId+" already exists"});;
    }


    //=====================================
    //if(email && stationname && password && firstName & lastName){
    var addStation = new Station({stationId: stationId,
        stationName:stationName,
        name:name,
        locationFromStartingPoint: locationFromStartingPoint});

        addStation.save()
                  .then(function(_station){
                       res.json(_station);})
                  .catch(function(err){
                          return res.json({error: true,
                          error: err});
                      });
                });
   };


   //2. get list of all stations
module.exports.getAllStation= function(req, res){
  Station.find({})
         .exec()
         .then(function(stations) {
                 console.log(stations);
                 return res.json(stations);
                })
        .catch(function(err) {
                return next(err); })
   };

  //3. get station by stationId
//promise based functions
module.exports.getStationById = function(req, res){
    console.log('Getting station by id:');
    var stationId=req.params.stationId;

    Station.findOne({ _id:stationId})
        .exec()//returns a promise
        .then(function(retrievedStation){
             if(!retrievedStation){
              res.json({"message": "No station found with this id: "+ stationId});
              return console.log("No station found with this id:"+ stationId);
             }
            console.log("Here is the station detail info:"+ retrievedStation);
            res.json(retrievedStation); })
         .catch(function(err){
            res.send('Error has occurred:\n' +err);
           });

};

//4. update station info

module.exports.updateStationInfo= function(req,res){
  var updateStation= req.body;
  var modifiedAt = new Date();
  var stationDataUpades={
    stationId    : updateStation.stationId,
    stationName  : updateStation.stationName,
    locationFromStartingPoint  : updateStation.locationFromStartingPoint,
    modifiedAt: modifiedAt
  };

    // Station.findOneAndUpdate({_id:req.params.stationId},
    //     {$set: stationDataUpades },
    //     {upsert:true},
    //     //{new: true},//return new info
    // function(err, updatedStation){
    //         if(err){
    //           console.log('Error occurred. Detail Error message: ' +err);
    //         }else{
    //           console.log(updatedStation);
    //           res.send(updatedStation);
    //         }
    //        });

    Station.findOneAndUpdate({_id:req.params.stationId},
        {$set: stationDataUpades },
        {upsert:true})
        .then(  function(updatedStation){
                    console.log(updatedStation);
                    res.send(updatedStation);})
        .catch(  function(err){
                    console.log('Error occurred. Detail Error message: ' +err);
              })

};

//5. find and delete a Station

module.exports.deleteStationById= function(req,res){
  var StationId=req.params.stationId;
  Station.findOneAndRemove({_id:StationId},
         function(err, retrievedStation){
          if(err)  res.send('Error Deleteing');
           else  {res.send("No content found");
           //res.json(retrievedStation);
         }
         });

}

//===================================================
