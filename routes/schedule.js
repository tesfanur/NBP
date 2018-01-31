var express = require('express');
var router  = express.Router();

//var session = express('express-session');

//load local/custom modules
var Schedule = require('../controllers/schedule');

//Mount all routes on router express instance

//create  new schedule using validation
router.post('/',Schedule.createSchedule);

// Retrieve all schedules
router.get('/', Schedule.getAllSchedule);

// Retrieve single schedule with ScheduleId
router.get('/:scheduleId', Schedule.getScheduleById);

// Update schedule with scheduleId
router.put('/:scheduleId', Schedule.updateScheduleInfo);

// Delete schedule with scheduleId
router.delete('/:scheduleId', Schedule.deleteScheduleById);

//expose router to other files
module.exports =router;
