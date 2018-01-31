// Load Module Dependencies

//var authRouter = require('./auth');
var userRouter = require('./user');
var profileRouter = require('./profile');
var profileImageRouter = require('./profileImage');
var scheduleRouter = require('./schedule');
var stationRouter = require('./station_mod');
var ticketRouter = require('./ticket');
var home = require('../lib/utils').root;


module.exports = function appRouter(app) {

	// Auth Routes
	//app.use('/auth', authRouter);
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
 //get home page
	app.get('/',home);


}
