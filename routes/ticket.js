//Load module dependencies

var express = require('express');

var ticketController = require('../controllers/ticket_');
var noop = require('../lib/utils').noop;

var router = express.Router();
/**
 * @api {POST} /tickets/ Create ticket
 * @apiName CreateTicket
 * @apiGroup Ticket
 * @apiDescription Creates a new Ticket
 *
 * @apiParam {String} firstName The first name of the Ticket
 * @apiParam {String} lastName The last name of the Ticket
 * @apiParam {String} email The email address of the Ticket
 * @apiParam {String} password The user password
 *
 * @apiParamExample Request Example
 *
 * {
 *	"email": "john1@aksum.com",
 *	"password": "password",
 *	"firstName": "John",
 *	"lastName": "Doe"
 * }
 *
 * @apiSuccessExample Response Example
 *
 * {
 *   "_id": "5a478c962698af267483b1ee",
 *   "email": "john1@aksum.com",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "dateCreated": "2017-12-30T12:54:46.419Z",
 *   "lastModified": "2017-12-30T12:54:46.419Z",
 *   "__v": 0
 * }
 */
router.post('/', ticketController.createTicket);

/**
 * @api {GET} /tickets/ Get Tickets
 * @apiName GetTickets
 * @apiGroup Ticket
 *
 *
 */
 router.get('/', ticketController.getTickets);
//
// /**
//  * @api {GET} /tickets/paginate Ticket Paginate
//  * @apiName GetTicketsPaginate
//  * @apiGroup Ticket
//  *
//  * @
//  */
router.get('/paginate', ticketController.getTicketByPagination);

/**
 * @api {PUT} /tickets/search Search Ticket
 * @apiName SearchTickets
 * @apiGroup Ticket
 *
 * @apiParamExample Request Example
 *
 * {"email": "john1@aksum.com"}
 */
router.put('/search', ticketController.searchTicket);

/**
 * @api {GET} /tickets/:id Get Ticket
 * @apiName GetTicket
 * @apiGroup Ticket
 *
 * @apiParamExample Request Example
 *
 * http://localhost:3000/tickets/5a478c962698af267483b1ee
 */
router.get('/:id', ticketController.getTicket);

/**
 * @api {UPDATE} /tickets/:id Update Ticket
 * @apiName UpdateTickets
 * @apiGroup Ticket
 *
 * @apiParamExample Request Example
 *
 * http://localhost:3000/tickets/5a478c962698af267483b1ee
 */
router.put('/:id', ticketController.updateTicket);

/**
 * @api {DELETE} /tickets/:id Delete Ticket
 * @apiName DeleteTickets
 * @apiGroup Ticket
 *
 * @apiParamExample Request Example
 *
 * http://localhost:3000/tickets/5a478c962698af267483b1ee
 */
 router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
