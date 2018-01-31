//Load module dependencies

var Ticket = require('../models/ticket');

var debug = require('debug')('api:ticket-dal');

//Create Ticket
exports.create = function createTicket(data, cb){
    debug('creating a new ticket');

    var ticketModel = new Ticket(data);

    ticketModel.save(function saveTicket(err, ticketData){
        if(err) return cb(err);

        exports.get({_id:ticketData._id}, function (err, ticket){
            if(err) return cb(err)
            cb (null, ticket);
        });

    });
};
// //Get Tickets
exports.getTickets = function(query, cb){
    debug('getting all ticket collection');

    Ticket
        .find(query)
        .exec(function(err, tickets){
            if(err) return cb(err)

            cb(null, tickets || {});
        })
}
// //Get Ticket
exports.get = function getTicket(query, cb){
    debug('getting a ticket', query);
    Ticket
        .findOne(query)
        .exec(function(err, ticket){
            if(err) return cb(err)
            cb(null, ticket || {});
        })
}
//Update Ticket
exports.update = function updateTicket(query, update, cb){
    debug('updating a ticket', query);
    var opts = {
        'new': true
    };

    Ticket
        .findOneAndUpdate(query, update, opts)
        .exec(function (err, ticket){
            if(err) return cb(err);
            cb(null, ticket || {})
        })
}
//Remove Ticket
exports.delete = function deleteTicket(query, cb){
    debug('deleting a ticket');
    Ticket
        .findOne(query)
        .exec(function (err, ticket){
            if(err) return cb(err)

            if(!ticket) return cb(null, {})

            Ticket.remove(function(err, data){
                if(err) return cb(err)
                cb(null, data);
            })

        })
}
//Get collection by pagination
exports.getTicketByPagination = function getTicketByPagination(query, qs, cb){
    debug('fetching a collection of tickets');

    var opts = {
        sort: qs.sort || {},
        page: qs.page || 1,
        limit: qs.per_page || 10
    };

    Ticket.paginate(query, opts, function (err, data){
        if(err) return cb(err);

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
