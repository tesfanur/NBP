// Load Module Dependencies

//var authRouter = require('./auth');
var userRouter = require('./user');
var profileRouter = require('./profile');
var profileImageRouter = require('./profileImage');
var scheduleRouter = require('./schedule');
var stationRouter = require('./station_rev');
var fareRouter = require('./fare');
var ticketRouter = require('./ticket');
var home = require('../lib/utils').root;


module.exports = function appRouter(app) {

	//User router
	app.use('/users', userRouter);
	//profile routes
	app.use('/images', profileImageRouter);
	//Station routes
	app.use('/stations', stationRouter);
	//Schedule routes
	app.use('/schedules', scheduleRouter);
	//Ticket routes
	app.use('/tickets', ticketRouter);
	//Fare/Payment routes
	app.use('/fares', fareRouter);
 //get home page
	app.get('/',home);


}
