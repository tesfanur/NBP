var Passenger = require('../models/passenger');

//Load module dependecies
var userDal = require('../dal/user');
var handleServerError = require('../lib/utils').handleError;

//1. create a new user
module.exports.createPassenger= function(req, res){
        var newPassenger  = req.body;
        var email    = newPassenger.email;
        var username = newPassenger.username;
        var password = newPassenger.password;
        var firstName= newPassenger.firstName;
        var lastName = newPassenger.lastName;

    //before saving check user if it exists
    //=====================================

  Passenger.findOne({ email: email }, function(err, user) {
    if (err) { return next(err); }

    if (user) {
      console.log("error: "+ email + " already exists");
      //here the return statement exits the remaining code from being executed
      return res.json({message:email+" already exists"});;
    }
    //=====================================
    //if(email && username && password && firstName & lastName){
    var addPassenger = new Passenger({email: email,
      username:username,
        password: password,
        firstName:firstName,
        lastName:lastName});

        addPassenger.save(function(err, user){
            if(err){
                return res.json({error: true});
            }
            res.json({error:false,
                      user: user});
    });
     });
   };


   //2. get list of all users
module.exports.getAllPassenger= function(req, res){
  Passenger.find({}, function(err, user) {
        if (err) {
          return next(err); }
         else{
          console.log(user);
          return res.json(user);
         }

     });
   };

  //3. get user by userId
//promise based functions
module.exports.getPassengerById = function(req, res){
    console.log('Getting user by id:');
    var userId=req.params.userId;
    Passenger.findOne({ _id:userId})
        .exec()//returns a promise
        .then(function(retrievedPassenger){
             if(!retrievedPassenger){
              res.json({"message": "No user found with this id: "+ userId});
              return console.log("No user found with this id:"+ userId);
             }
            console.log("Here is the user detail info:"+ retrievedPassenger);
            res.json(retrievedPassenger); })
        .catch(function(err){
            res.send('Error has occurred:\n' +err);
           });

};

//4. update user info

module.exports.updatePassengerInfo= function(req,res){
  var updatePassenger= req.body;
  var modifiedAt = new Date();
  var userDataUpades={
    email     : updatePassenger.email,
    username  : updatePassenger.username,
    password  : updatePassenger.password,
    modifiedAt: modifiedAt,
    firstName : updatePassenger.firstName,
    lastName  : updatePassenger.lastName
  };

  Passenger.findOneAndUpdate({_id:req.params.userId},
      {$set: userDataUpades },
      {upsert:true},
      //{new: true},//return new info
  function(err, updatedPassenger){
          if(err){
            console.log('Error occurred. Detail Error message: ' +err);
          }else{
            console.log(updatedPassenger);
            res.send(updatedPassenger);
            //res.status(204);//Passenger succesfully updated
          }
         });
};

//5. find and delete a Passenger

module.exports.deletePassengerById= function(req,res){
  var PassengerId=req.params.userId;
  Passenger.findOneAndRemove({_id:PassengerId},
         function(err, retrievedPassenger){
          if(err)  res.send('Error Deleteing');
           else  {res.send("No content found");
           //res.json(retrievedPassenger);
         }
         });

}

//===================================================
