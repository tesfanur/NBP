/**
*Load module dependencies
*/
var package = require('../package.json');

/**
*No operation function
*/
exports.noop = function(req, res){
    res.json({
        message : 'to be implemented'
    })
}

/**
*Error handling function
*/
exports.handleError = function(res, err){
    err.status=err.status||500;
    res.status(err.status)
       .json(err)
}
/**
*Log message to the console window
*/

exports.showMsg = function(mssg){
 console.log(mssg);
}

module.exports.formatDateToString =function (date){
 // 01, 02, 03, ... 29, 30, 31
 var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
 // 01, 02, 03, ... 10, 11, 12
 var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
 // 1970, 1971, ... 2015, 2016, ...
 var yyyy = date.getFullYear();

 // create the format you want
 return (dd + "-" + MM + "-" + yyyy);
}

/**
*Custom error handling function
*/
exports.handleError = function (res, err, obj){
    var statusCode = obj.status || 500;
    var errType = obj.type || "";

    res.status(statusCode),
    res.json({
        status: statusCode,
        message: err.message,
        type : errType
    })
}

/**
*Custom error handler
*/
exports.errorHandler = function (res, error){
      var statusCode = error.status || 500;
     return res.status(statusCode)
               .json(error);
}


/**
*Handle homepage/root[page] request
*/
exports.root = function apiInfo(req, res, next){
    res.json({"API INFO":{
        name: package.name,
        version: package.version,
        author: package.author,
        description: package.description,
        dependecies:package.dependencies,
        //THE FOLLOWING GIT URL IS NOT REAL. PLEASE REPLACE IT BY THE CORRECT
        //GITLAB URL
        repository: "http://git.gebeya.com/tesfaye.belachew/aa_lrt_ticketing_sys_api.git",
        deployedAt: "http://domainname-3147.herokuapp.com",
        documentationLocation: "./docs/index"
    }})
}
