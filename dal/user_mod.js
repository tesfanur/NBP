/**
*Load module dependencies
*/
  'use strict';
var UserModel = require('../models/user');

var debug   = require('debug')('api:user-dal');

var UserDalModule = (function(UserModel){
/**
*1. Create User
*/
 function createUser(data, cb){
    debug('creating a new user');
    var user = new UserModel(data);
          user.save()
              .then(function(userData){
                        getUserById({_id:userData._id},
                          function (err, user){
                            if(err) return cb(null,err)
                            cb (null, user);});})
              .catch(function(err){
                         return cb(err);//short form of if else statement
                    });
}
/**
*2. Get all Users
*/
function getAllUsers(query, cb){
    debug('getting all user collection');
 UserModel.find(query)
        .exec()
        .then(function(users){
            cb(null, users || {});})
        .catch(function(err){
            if(err) return cb(err)});

}
//
/**
*3.Get User by Id
*/
function getUserById(query, cb){
    debug('getting a user', query);
 UserModel.findOne(query)
        .exec()
        .then(function(user){
            cb(null, user || {});})
        .catch(function(err){
            return cb(err)});
}
/**
*4. Update User
*/
function updateUser(query, update, cb){
    debug('updating a user', query);
    var opts = {
        'new': true
    };
 UserModel.findOneAndUpdate(query, update, opts)
        .exec()
        .then(function (user){
            cb(null, user || {})})
        .catch(function (err){
            if(err) return cb(err);});
}
/**
*5. Remove User
*/
function deleteUser(query, cb){
    debug('deleting a user');
 UserModel.findOne(query)
        .exec()
        .then(function (user){
            if(!user) {
               res.status(404);
              return cb(null, {"message":"Not found"})}
              ////cb(null, user);

            user.remove(function(err, data){
                if(err) return cb(err)
                cb(null, data);})
                ;})
         .catch(function (err){
                    return cb(err); });
}
//
/**
*6. Get user by pagination
*/
function getUserByPagination(query, qs, cb){
    debug('fetching a collection of users');

    var opts = {
        sort: qs.sort || {},
        page: qs.page || 1,
        limit: qs.per_page || 10
    };

    UserModel.paginate(query, opts, function (err, data){
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
* return UserDalModule public APIs
*/
  return {create : createUser,
  getAll : getAllUsers,
  getById : getUserById,
  update : updateUser,
  delete : deleteUser,
  paginate : getUserByPagination
};
}(UserModel));
/**
* export UserDalModule
*/
module.exports= UserDalModule;
