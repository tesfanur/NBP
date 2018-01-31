//Load module dependencies

var TicketModel = require('../models/ticket');

var debug   = require('debug')('api:ticket-dal');

var TicketDalModule = (function(TicketModel){
  'use strict';
//1. Create Ticket
 function createTicket(data, cb){
    debug('creating a new ticket');
    var ticket = new TicketModel(data);
          ticket.save()
                .then(function(ticketData){
                        getTicketById({_id:ticketData._id},
                          function (err, ticket){
                            if(err) return cb(null,err)
                            cb (null, ticket);});})
                  .catch(function(err){
                         return cb(err);//short form of if else statement
                    });
}
// 2. Get all Tickets
function getAllTickets(query, cb){
    debug('getting all ticket collection');
 TicketModel.find(query)
        .exec()
        .then(function(tickets){
            cb(null, tickets || {});})
        .catch(function(err){
            if(err) return cb(err)});

}
//Get Ticket by Id
function getTicketById(query, cb){
    debug('getting a ticket', query);
 TicketModel.findOne(query)
        .exec()
        .then(function(ticket){
            cb(null, ticket || {});})
        .catch(function(err){
            return cb(err)});
}

//Update Ticket
function updateTicket(query, update, cb){
    debug('updating a ticket', query);
    var opts = {
        'new': true
    };
 TicketModel.findOneAndUpdate(query, update, opts)
        .exec()
        .then(function (ticket){
            cb(null, ticket || {})})
        .catch(function (err){
            if(err) return cb(err);});
}
//Remove Ticket
function deleteTicket(query, cb){
    debug('deleting a ticket');
 TicketModel.findOne(query)
        .exec()
        .then(function (ticket){
            if(!ticket) {
               res.status(404);
              return cb(null, {"message":"Not found"})}
              ////cb(null, ticket);

            ticket.remove(function(err, data){
                if(err) return cb(err)
                cb(null, data);})
                ;})
         .catch(function (err){
                    return cb(err); });
}
//Get ticket by pagination
function getTicketByPagination(query, qs, cb){
    debug('fetching a collection of tickets');

    var opts = {
        sort: qs.sort || {},
        page: qs.page || 1,
        limit: qs.per_page || 10
    };

    TicketModel.paginate(query, opts, function (err, data){
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

//return TicketDalModule public APIs
  return {create : createTicket,
  getAll : getAllTickets,
  getById : getTicketById,
  update : updateTicket,
  delete : deleteTicket,
  paginate : getTicketByPagination
};
}(TicketModel));

module.exports= TicketDalModule;
