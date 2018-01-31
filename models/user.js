var
mongoose = require('mongoose'),
bcrypt   = require('bcrypt'),
config = require('../config/config');//the higher the value the more secure hash it generates
//find all other function that are supported by mongoose model/Schema
//before you do from scratch
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email    : {type: String, required: 'please enter email',trim: true, unique:true},
    password : {type: String, required: 'please enter your password'},
    username : {type: String, trim: true, required: 'please enter your username'},
    firstName: {type: String, trim: true},
    lastName : {type: String, trim: true},
    createdAt :{type:Date, default:Date.now},
    modifiedAt :{type:Date, default:Date.now}
});
//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
      .exec()
      .then(function (user) {
        if (!user) {
          var err = {};
          err.status = 401;
          err.message= 'User not found.';
          return callback(err);
        }
        bcrypt.compare(password, user.password, function (err, result) {
          console.log("result",result);
          if (result === true) return callback(null, user);
          return callback();
        })
      },function (err) {
        if (err) return callback(err)
      })
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  if(typeof user.email ==="string"){
  //move this feature while validating user input using express-validator  
  user.email = user.email.toLowerCase();
  }
  bcrypt.hash(user.password, config.SALT_WORK_FACTOR, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

//write verify password here on the Schema

//export user model
//module.exports = mongoose.model('User', UserSchema);
var User = mongoose.model('User', UserSchema);
module.exports = User;
