//Load module dependecies
var debug = require('debug');
var moment = require('moment');
var expressValidator= require('express-validator');

var TicketDal = require('../dal/ticket_');
var handleError = require('../lib/utils').handleError;
var errorHandler = require('../lib/utils').errorHandler;

var errorObj = {
    status : 500,
    type : "TICKET_ERROR"
}
var Error = {
    status : 500,
    type : "TICKET_ERROR",
    message:""
}

//1. Create tikcet
exports.createTicket = function (req, res, next){
    var body = req.body;

    TicketDal.create(body, function (err, tikcet){
        if(err){
            //errorObj.type = 'CREATE_TICKET_ERROR';
            //return handleError(res, err, errorObj);
            Error=err;
            Error.type= 'CREATE_TICKET_ERROR';
            errorHandler(res, Error);

        }
        res.status(201).json(tikcet);
    })
}

// //Get tikcets
exports.getTickets = function(req, res, next){
    TicketDal.getTickets({}, function (err, tikcets){
        if(err){
            errorObj.type = 'GET_TICKETS_ERROR';
            return handleError(res, err, errorObj);
        }
        res.status(200);
        res.json(tikcets || {});
    })
}
//2. Get tikcet by id
exports.getTicket = function(req, res, next){
    var tikcetId = req.params.id;

    TicketDal.get({_id : tikcetId}, function(err, tikcet){
        if(err){
            errorObj.type = 'GET_TICKET_ERROR';
            return handleError(res, err, errorObj);
        }
        res.status(200);
        res.json(tikcet || {});
    })
}
//3. Search tikcet
exports.searchTicket = function (req, res, next){
    var query = req.body;

    TicketDal.get(query, function(err, tikcet){
        if(err){
            errorObj.type = 'SEARCH_TICKET_ERROR';
            return handleError(res, err, errorObj);
        }
        res.status(200)
           .json(tikcet || {});
    })
}

//4. Update tikcet
exports.updateTicket = function(req, res, next){
    var tikcetId = req.params.id;

    var update = req.body;
    var now = moment().toISOString();
    update.lastModified = now;

    TicketDal.update(tikcetId, update, function(err, tikcet){
        if(err){
            errorObj.type = 'UPDATE_TICKET_ERROR';
            return handleError(res, err, errorObj);
        }
        res.json(tikcet || {});
    })
}
//5. Delete tikcet
exports.deleteTicket = function(req, res, next){
    var tikcetId = req.params.id;

    TicketDal.delete({_id: tikcetId}, function(err, tikcet){
        if(err){
            errorObj.type = 'DELETE_TICKET_ERROR';
            return handleError(res, err, errorObj);
        }
        res.json(tikcet || {});
    })
}
//6. Get collection paginate
exports.getTicketByPagination = function(req, res, next){
    debug('Get tikcet collection by pagination');

    var query = req.query.query || {};
    var qs = req.query;

    TicketDal.getTicketByPagination(query, qs, function(err, docs){
        if(err){
            errorObj.type = 'GET_TICKETs_PAGINATE_ERROR';
            return handleError(res, err, errorObj);
        }
        res.json(docs);
    })
}
