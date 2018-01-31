var express      = require('express'),
		morgan       = require('morgan'),
		debug        = require('debug')('api'),
		cookieParser = require('cookie-parser'),
		bodyParser   = require('body-parser'),
	  expressValidator = require('express-validator'),
		expressSession   = require('express-session'),
		passport   = require('passport'),
		mongoose   = require('mongoose');

 //Load local modules
var  db      = require('./config/connection'),
		 config  = require('./config/config'),
		 User    = require('./models/user'),
		 Profile = require('./models/profile'),
		 display = require('./lib/utils').showMsg;

//instantiate express server
var app  = express();
debug('AA LRT ONLINE TICKETING SYSTEM');
//configuration your app
app.set('PORT', config.PORT)
app.set('SECRET', config.SECRET)

//strat database connection
db.connectMongoDB(mongoose);

//use middlewares required for express app
app.use(bodyParser.json());//parse json object from html body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(morgan('dev')); //Logging HTTP Method and URL
//add url econcoded feature for file upload
app.use(cookieParser());
app.use(expressSession(
	{secret:"kjlrt437658349yt3iugsdf",//use salt from bcrypt
	resave:false,
	saveUninitialized:true}));

/*
TODO:
authentication middleware using passportjs and third party passport strategies [facebook & google+]
....
*/


// Require user routes
var router =require('./routes');
router(app);

//Handle if page requested not found
app.use(function pageNotFound(req, res, next){
    res.status(404)
		   .json({status: 404,
				      type: 'NOT_FOUND_ERROR',
				      message: req.protocol +'://'+ req.hostname+ req.originalUrl + ' is not found! Please type the address properly'})
  });

//Handle errors

app.use(function errorHandler(err, req, res, next){
	res.json({ message: err.message });
});
function handleServerStartup(){
    display("\nEXPRESS SERVER APP STARTED LISTENING REQUESTS ON PORT "+app.get('PORT')+"!");
    display('PRESS CTRL+C TO EXIT\n');
}

app.listen(app.get('PORT'), handleServerStartup);

module.exports=app;
