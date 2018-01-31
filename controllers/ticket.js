var Ticket = require('../models/user');
var Ticket = require('../models/ticket');

var TicketSchema = new Schema({
    ticketid    : {type: Number, required: true,unique:true},
    ticketType : {type: String, required: true},
    price : {type: Numebr, required: true},
    status: {type: Enum},//refer how to use enumeration types using mongoose
    passengerId : {type: String},
    sourceStationId    : {type: String, required: true,unique:true},
    destinationStationId : {type: Date, required: true},
    dateTicketBought : {type: Date, required: true},
    dateTicketReturned: {type: Date},
    //are the following fields required or already included by the above fields
    createdAt :{type:Date, default:Date.now},
    modifiedAt :{type:Date, default:Date.now}

});

//Load module dependecies

var userDal = require('../dal/user');
var handleServerError = require('../lib/utils').handleError;

//1. create a new user
module.exports.createNewTicket= function(req, res){
        var newTicket  = req.body;
        var NewTicket = new Ticket();
        NewTicket.ticketid    = newTicket.ticketid;
        NewTicket.ticketType  = newTicket.ticketType;
        NewTicket.price       = newTicket.price;
        NewTicket.sourceStationId = newTicket.sourceStationId;
        NewTicket.destinationStationId = newTicket.destinationStationId;
        NewTicket.dateTicketBought = newTicket.dateTicketBought;
        NewTicket.dateTicketReturned = newTicket.dateTicketReturned;

    //before saving check user if it exists
    //=====================================

  Ticket.findOne({ ticketid: ticketid }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      console.log("error: "+ ticketid + " already exists");
      //here the return statement exits the remaining code from being executed
      return res.json({message: ticketid +" already exists"});;
    }
    //=====================================
    //if(email && username && password && firstName & lastName){
    //var addTicket = new Ticket(ticketData);

            //     NewTicket.save(function(err, user){
            //         if(err){
            //             return res.json({error: true});
            //         }
            //         res.json({error:false,
            //                   user: user});
            // });
            NewTicket.save()
            .then(function(user){
                res.json({error:false,
                          user: user});})
            .catch(function(err){
                return res.json({error: true});});
     });
   };


   //2. get list of all users
module.exports.getAllTicket= function(req, res){
  Ticket.find({}, function(err, user) {
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
module.exports.getTicketById = function(req, res){
    console.log('Getting user by id:');
    var userId=req.params.userId;
    Ticket.findOne({ _id:userId})
        .exec()//returns a promise
        .then(function(retrievedTicket){
             if(!retrievedTicket){
              res.json({"message": "No user found with this id: "+ userId});
              return console.log("No user found with this id:"+ userId);
             }
            console.log("Here is the user detail info:"+ retrievedTicket);
            res.json(retrievedTicket); })
        .catch(function(err){
            res.send('Error has occurred:\n' +err);
           });

};
//=======================

      // var promise = Ticket.findById('123').exec();
      //
      // promise.then(function(user) {
      //   user.name = 'Robert Paulson';
      //
      //   return user.save(); // returns a promise
      // })
      // .then(function(user) {
      //   console.log('updated user: ' + user.name);
      //   // do something with updated user
      // })
      // .catch(function(err){
      //   // just need one of these
      //   console.log('error:', err);
      // });
//========================
//4. update user info

module.exports.updateTicketInfo= function(req,res){
  var updateTicket= req.body;
  var modifiedAt = new Date();
  var userDataUpades={
    email     : updateTicket.email,
    username  : updateTicket.username,
    password  : updateTicket.password,
    modifiedAt: modifiedAt,
    firstName : updateTicket.firstName,
    lastName  : updateTicket.lastName
  };

  Ticket.findOneAndUpdate({_id:req.params.userId},
      {$set: userDataUpades },
      {upsert:true},
      //{new: true},//return new info
  function(err, updatedTicket){
          if(err){
            console.log('Error occurred. Detail Error message: ' +err);
          }else{
            console.log(updatedTicket);
            res.send(updatedTicket);
            //res.status(204);//Ticket succesfully updated
          }
         });
};

//5. find and delete a Ticket

module.exports.deleteTicketById= function(req,res){
  var TicketId=req.params.userId;
  Ticket.findOneAndRemove({_id:TicketId},
         function(err, retrievedTicket){
          if(err)  res.send('Error Deleteing');
           else  {res.send("No content found");
           //res.json(retrievedTicket);
         }
         });

}

//===================================================
