//Load module dependecies
var _    = require('lodash');
var expressValidator= require('express-validator');
var User = require('../models/user');

const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const UserModel = require('../models/user');
const config    = require('../config/config');

var userDal           = require('../dal/user');
var handleServerError = require('../lib/utils').handleError;
/**
*1. User Registration Controller
*/
function createUser(req, res){
  //validateUse(email,username,password,firstName,lastName);
  req.checkBody('email','Email you entered is invalid. Please try again').isEmail().trim();
  req.checkBody('username','Invalid username. It must be b/n 4 and 15 characters long').notEmpty().trim().len(4,15);
  //req.checkBody('password','password is required').matches();
  //req.checkBody('confirmPassword','password is required').matches();
  req.checkBody('password', 'Password doesn\'t match').equals(req.body.confirmPassword);

  req.checkBody('firstName','first name is required').notEmpty();
  req.checkBody('lastName','last name is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
     console.log(errors);
     return res.status(500).json({'validation-errors':errors});
     }
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
                return res.json({error: true,
                errorMessage:err});
            }
            res.json({error:false,
                      user: user});
    });
     });
   }
/**
*2. Find all list of users controller
*/
function findAllUser(req, res){
  User.find({}, function(err, user) {
        if (err) {
          return next(err); }
         else{
          console.log(user);
          return res.json(user);
         }

     });
   }
/**
*3. Find user by their ID controller
*/
function findUserById(req, res){
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

}
/**
*4. Update User Info Controller
*/
function updateUserInfo(req,res){
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
}
/**
*5. Delete User Controller
*/
function deleteUserById(req,res){
  var UserId=req.params.userId;
  User.findOneAndRemove({_id:UserId},
         function(err, retrievedUser){
          if(err)  res.send('Error Deleteing');
           else  {res.send("No content found");
           //res.json(retrievedUser);
         }
         });

}
/**
*6. User Login Controller
*/
function loginUser(req,res){
  var body = _.pick(req.body, "email","password","username");
   var userD=body;
if (userD.email && userD.password) {
     User.authenticate(userD.email, userD.password, function (error, user) {
       console.log({error, user:user});
       if (error || !user) {
         var err ={};
          err.message='Wrong email or password.';
          err.status  = error;
         return res.status(401).json({"error":"AUTHENTICATION FAILED",
          "actual error":err});
       }
       if (!user) {
           err.message='User not found';
          return res.status(401).json({"error":"AUTHENTICATION FAILED",
        error:err});
        }
         //req.session.userId = user._id;
         //return res.redirect('/profile');
         return res.json({"message": "Hello "+user.firstName+ " "+
         user.lastName + ". Welcome to AA LRT ONLINE TICKETING SYSTEM!",
       "user":_.pick(user,"email","username","firstName","lastName")});

     });
} else {
 var err = {};
 err.status = 400;//bad request status code
 err.message='Bad Request.All fields are required.';
 //return next(err);
 return res.status(400).json({"error":err});//bad request
}

}

//===================================================
//added on Jan 29-01-2018
//===================================================
/**
*I. User Registration Controller
*/
function registerUser (req, res)  {
  var salt = bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
  bcrypt.hash(req.body.password, salt)
        .then( generatedHash => {
          userData ={username:req.body.username,password: generatedHash };
          const newUser = new UserModel(userData);
          newUser.save()
                 .then(registeredUser => {
                   console.log(registeredUser);
                   res.status(201).json({"success":"User registered succesfully",
                    user: registeredUser});
                 })
                 .catch(err => {console.log(err);
                  res.status(400).json({error: err })
                });

          //res.status(201).send('registered')
        })
        .catch(err => {console.log(err);
        res.status(500).json("something went wrong while you login")});
}
/**________________________________
* User Login Controller
*__________________________________*/
function userLogin(req, res) {
    var email    = req.body.email;
    var password = req.body.password;

UserModel.findOne({email:email}).exec()
        .then(userFound => {
              if(!userFound) return res.status(400).json({"message": "No user found"});

               bcrypt.compare(password, userFound.password)
                     .then(function(result) {
                       if(!result) return res.status(400).json({"message": "Incorrect Password"});
                       console.log("result:", result);
                       if(result){
                         //TODO: add jwt features like expire time,...
                         //sign a token with 1 hour of expiration time
                         var token ="JWT " + jwt.sign({ username: userFound.username,
                         exp: Math.floor(Date.now() / 1000) + (60 * 60)}, config.SECRET)

                       return res.header("Auth",token).status(201).json( {"message":`Hello ${userFound.username}. Welcome to our website`,
                       user: userFound,token: token})}
                       })
                     .catch(err => {console.log(err)});

         })
        .catch(err => {console.log(err)});
}
/**
*II. Find user using their token value instead of plain old text
*/
function findUserByToken(){
  return new Promise(function(resolve, reject){
    try{
      var decodedJWT =jwt.verify(token, config.SECRET);
      var bytes = cryptojs.AES.decrypt(decodedJWT,config.SECRET);
      var tokenData = JSON.parse(bytes.toString(cryptojs.enc.utf8));
      userModel.findById(tokenData._id)
               .then(function(user){
                 if(user){
                   resolve(user);
                 }
                 else{
                   reject();
                 }
               },
             function(e){
               reject();
             })
    }catch(e){
      reject();
    }
  }

  );
}
/**
*II. Export User Controllers
*/
module.exports = {
    //register    : registerUser,
    login       : userLogin,
    //findByToken : findUserByToken,
    create      : createUser,
    findAll     : findAllUser,
    findById    : findUserById,
    update      : updateUserInfo,
    //login       : loginUser,
    delete      : deleteUserById
}
