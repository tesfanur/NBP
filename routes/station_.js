//Load module dependencies

var express = require('express');

var stationController = require('../controllers/station_');
var noop = require('../lib/utils').noop;

var router = express.Router();
/**
 * @api {POST} /stations/ Create station
 * @apiName CreateStation
 * @apiGroup Station
 * @apiDescription Creates a new Station
 *
 * @apiParam {String} firstName The first name of the Station
 * @apiParam {String} lastName The last name of the Station
 * @apiParam {String} email The email address of the Station
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
router.post('/', stationController.createStation);

/**
 * @api {GET} /stations/ Get Stations
 * @apiName GetStations
 * @apiGroup Station
 *
 *
 */
 router.get('/', stationController.getAllStations);
//
// /**
//  * @api {GET} /stations/paginate Station Paginate
//  * @apiName GetStationsPaginate
//  * @apiGroup Station
//  *
//  * @
//  */
router.get('/paginate', stationController.getStationByPagination);
/**
 * @api {PUT} /stations/search Search Station
 * @apiName SearchStations
 * @apiGroup Station
 *
 * @apiParamExample Request Example
 *
 * {"email": "john1@aksum.com"}
 */
router.put('/search', stationController.searchStation);

/**
 * @api {GET} /stations/:id Get Station
 * @apiName GetStation
 * @apiGroup Station
 *
 * @apiParamExample Request Example
 *
 * http://localhost:3000/stations/5a478c962698af267483b1ee
 */
router.get('/:id', stationController.getStationById);

/**
 * @api {UPDATE} /stations/:id Update Station
 * @apiName UpdateStations
 * @apiGroup Station
 *
 * @apiParamExample Request Example
 *
 * http://localhost:3000/stations/5a478c962698af267483b1ee
 */
router.put('/:id', stationController.updateStation);

/**
 * @api {DELETE} /stations/:id Delete Station
 * @apiName DeleteStations
 * @apiGroup Station
 *
 * @apiParamExample Request Example
 *
 * http://localhost:3000/stations/5a478c962698af267483b1ee
 */
router.delete('/:id', stationController.deleteStation);

module.exports = router;
