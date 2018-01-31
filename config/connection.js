var config  = require('./config');
var mongooseOpts ={ useMongoClient: true,
				 connectTimeoutMS: 5000  };
//var mongooseOpts ={ useMongoClient: true}

//create db connection using NODEJS NATIVE promises
module.exports.connectMongoDB = function(mongoose){

mongoose.Promise=global.Promise;//overide deprecated promise function

mongoose.connect(config.PROD_MONGODB, mongooseOpts)
    .then(function () {
          console.log('DB CONNECTION ESTABLISHED SUCCESSFULLY!\n');
    }).catch(function (err) {
        console.log("DB CONNECTION FAILED.\nPEASE CHECK YOUR MONGODB SERVER RUNNING STATUS!\n");
        console.log("ACTUAL ERROR: "+ err.message);
    })

 }
