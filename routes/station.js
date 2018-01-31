var express = require('express');
var router  = express.Router();
//load local/custom modules
var Station = require('../controllers/station');

var mware =require('../middleware/auth');
var requireAuthentication = mware.requireAuthentication;

//Mount all routes on router express instance

//create  new station using validation
router.post('/',requireAuthentication,Station.createStation);

// Retrieve all stations
router.get('/',requireAuthentication, Station.getAllStation);

// Retrieve single station with StationId
router.get('/:stationId', requireAuthentication,Station.getStationById);

// Update station with stationId
router.put('/:stationId', requireAuthentication,Station.updateStationInfo);

// Delete station with stationId
router.delete('/:stationId', requireAuthentication,Station.deleteStationById);

//expose router to other files
module.exports =router;
