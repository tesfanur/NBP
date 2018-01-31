//var express = require('express');
var multer = require('multer');
var path  = require('path');

var utils = require('../lib/utils');
var Image  = require('../models/profileImage');
//var router = express.Router();

//========================================
var date =new Date();
var storage = multer.diskStorage(
    {
        destination: './images/',
        filename: function ( req, file, cb ) {
             cb( null,'Profile_Img_'+
              utils.formatDateToString(date) + '_'+
              (Math.random().toString(36)).slice(2, 10) +
              path.extname(file.originalname));
    },
    onFileUploadStart: function () {
        console.log("Upload is starting...");
    },
    onFileUploadComplete: function () {
        console.log("File uploaded");
    }

    }
);

upload = multer( { storage: storage } ).single('image');
module.exports=upload;
