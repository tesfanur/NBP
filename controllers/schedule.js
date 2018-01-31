var Schedule = require('../models/schedule');

//Load module dependecies
//var scheduleDal = require('../dal/schedule');
var handleServerError = require('../lib/utils').handleError;
//1. create a new schedule
module.exports.createSchedule= function(req, res){
  var newSchedule  = req.body;

  var ScheduleToBeCreated = new Schedule();
  ScheduleToBeCreated.scheduleId              = newSchedule.scheduleId;
  ScheduleToBeCreated.sourceStationId         = newSchedule.sourceStationId;
  ScheduleToBeCreated.destinationStationId    = newSchedule.destinationStationId;
  ScheduleToBeCreated.distanceBetweenStations = newSchedule.distanceBetweenStations;
  ScheduleToBeCreated.price                   = newSchedule.price;


  // ScheduleToBeCreated
  //            .save()
  //            .then(function(sched){
  //                 res.json(sched);})
  //            .catch(function(err){
  //             res.json({error:err});
  //           });

    //before saving check schedule if it exists
        Schedule.findOne({scheduleId:  newSchedule.scheduleId },
                function(err, schedule) {
                    if(err) return res.json(err);
                  if(schedule){
                    console.log("error: " + newSchedule.scheduleId+" already exists");
                    //here the return statement exits the remaining code from being executed
                    return res.json({message:newSchedule.scheduleId+" already exists"});
                    }

                    ScheduleToBeCreated.save(function(err, sched){
                            if(err) return res.json(err);
                            else res.json(sched);});
                       });


   };


   //2. get list of all schedules
module.exports.getAllSchedule= function(req, res){
  Schedule.find({}, function(err, schedule) {
        if (err) {
          return next(err); }
         else{
          console.log(schedule);
          return res.json(schedule);
         }

     });
   };

  //3. get schedule by scheduleId
//promise based functions
module.exports.getScheduleById = function(req, res){
    console.log('Getting schedule by id:');
    var scheduleId=req.params.scheduleId;
    Schedule.findOne({ _id:scheduleId})
        .exec()//returns a promise
        .then(function(retrievedSchedule){
             if(!retrievedSchedule){
              res.json({"message": "No schedule found with this id: "+ scheduleId});
              return console.log("No schedule found with this id:"+ scheduleId);
             }
            console.log("Here is the schedule detail info:"+ retrievedSchedule);
            res.json(retrievedSchedule); })
        .catch(function(err){
            res.send('Error has occurred:\n' +err);
           });

};

//4. update schedule info

module.exports.updateScheduleInfo= function(req,res){
  var updateSchedule= req.body;
  var modifiedAt = new Date();
  var scheduleDataUpades={
    email     : updateSchedule.email,
    schedulename  : updateSchedule.schedulename,
    password  : updateSchedule.password,
    modifiedAt: modifiedAt,
    firstName : updateSchedule.firstName,
    lastName  : updateSchedule.lastName
  };

  Schedule.findOneAndUpdate({_id:req.params.scheduleId},
      {$set: scheduleDataUpades },
      {upsert:true},
      //{new: true},//return new info
  function(err, updatedSchedule){
          if(err){
            console.log('Error occurred. Detail Error message: ' +err);
          }else{
            console.log(updatedSchedule);
            res.send(updatedSchedule);
            //res.status(204);//Schedule succesfully updated
          }
         });
};

//5. find and delete a Schedule

module.exports.deleteScheduleById= function(req,res){
  var ScheduleId=req.params.scheduleId;
  Schedule.findOneAndRemove({_id:ScheduleId},
         function(err, retrievedSchedule){
          if(err)  res.send('Error Deleteing');
           else  {res.send("No content found");
           //res.json(retrievedSchedule);
         }
         });

}

//===================================================
