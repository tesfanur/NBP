var User = require('../models/user');
var _    = require('lodash');


//Load module dependecies

var userDal = require('../dal/user');
var handleServerError = require('../lib/utils').handleError;

//1. create a new user
module.exports.createUser= function(req, res){
        //take only the required field from req.body object
        //use array and destract method to make the following code
        var newUser = _.pick(req.body,"email","username","password","firstName","lastName");

        var email    = newUser.email;
        var username  = newUser.username;
        var password = newUser.password;
        var firstName= newUser.firstName;
        var lastName = newUser.lastName;

    //before saving check user if it exists
    //=====================================

  User.findOne({ email: email }, function(err, user) {
    if (err) { return next(err); }

    if (user) {
      console.log("error: "+ email + " already exists");
      //here the return statement exits the remaining code from being executed
      return res.json({message:email+" already exists"});;
    }
    //=====================================
    //if(email && username && password && firstName & lastName){
    var addUser = new User({email: email,
      username:username,
        password: password,
        firstName:firstName,
        lastName:lastName});

        addUser.save(function(err, user){
            if(err){
                return res.json({error: true});
            }
            res.json({error:false,
                      user: user});
    });
     });
   };


   //2. get list of all users
module.exports.getAllUser= function(req, res){
  User.find({}, function(err, user) {
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
module.exports.getUserById = function(req, res){
    console.log('Getting user by id:');
    var userId=req.params.userId;
    User.findOne({ _id:userId})
        .exec()//returns a promise
        .then(function(retrievedUser){
             if(!retrievedUser){
              res.json({"message": "No user found with this id: "+ userId});
              return console.log("No user found with this id:"+ userId);
             }
            console.log("Here is the user detail info:"+ retrievedUser);
            res.json(retrievedUser); })
        .catch(function(err){
            res.send('Error has occurred:\n' +err);
           });

};

//4. update user info

module.exports.updateUserInfo= function(req,res){
  var updateUser= req.body;
  var modifiedAt = new Date();
  var userDataUpades={
    email     : updateUser.email,
    username  : updateUser.username,
    password  : updateUser.password,
    modifiedAt: modifiedAt,
    firstName : updateUser.firstName,
    lastName  : updateUser.lastName
  };

  User.findOneAndUpdate({_id:req.params.userId},
      {$set: userDataUpades },
      {upsert:true},
      //{new: true},//return new info
  function(err, updatedUser){
          if(err){
            console.log('Error occurred. Detail Error message: ' +err);
          }else{
            console.log(updatedUser);
            res.send(updatedUser);
            //res.status(204);//User succesfully updated
          }
         });
};

//5. find and delete a User

module.exports.deleteUserById= function(req,res){
  var UserId=req.params.userId;
  User.findOneAndRemove({_id:UserId},
         function(err, retrievedUser){
          if(err)  res.send('Error Deleteing');
           else  {res.send("No content found");
           //res.json(retrievedUser);
         }
         });

}

//6. user login
module.exports.login= function(req,res){
  //var body = _.pick(req.body, "email","password","username");
    // if(typeof body.email !=="string" || typeof body.password!=='string' || typeof body.username !== "string")
    //  return res.status(400).send({"error":"Bad request"});
    //
    //  var user = User.findOne({where:{email: body.email}});
    //
    //  user.then(function(userData){
    //    if(!userData) return res.status(401).send({"error":"Unauthorized access request"});
    //     res.json(userData);
    //  },
    //  function(err){
    //      res.status(500).json({"error":"Server error has occurred"});
    //  });
///================
  var userD=req.body;
  //console.log(User);//added for temp test

if (userD.email && userD.password) {
 User.authenticate(userD.email, userD.password, function (error, user) {
   if (error || !user) {
     var err = new Error('Wrong email or password.');
     err.status = 401;
     //console.log(err);//added for temp test
     //return next(err);
     return res.status(401).json({err,error, user: user});

   } else {
     //req.session.userId = user._id;
     //return res.redirect('/profile');
     return res.json({"message": "Hello "+user.firstName+ " "+user.lastName + ". Welcome to AA LRT ONLINE tCIKETING SYSTEM!"});
   }
 });
} else {
 var err = new Error('All fields required.');
 err.status = 400;
 return next(err);
}

}






//===================================================
