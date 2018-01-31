//load first party module dependecies
var express = require('express');

//load local/custom module dependecies
var ProfileImage = require('../controllers/profileimage');
var uploadImage = require('../controllers/imageupload');

//instantiate router object
var router  = express.Router();

//create  new image using validation
router.post('/', uploadImage, ProfileImage.uploadImage);

// Retrieve all images
router.get('/',ProfileImage.getAllProfileImage);

// Retrieve single image with ProfileImageId
router.get('/:imageId', ProfileImage.getImageById);

// Update image with imageId
router.put('/:imageId',uploadImage, ProfileImage.updateImageInfo);

// Delete image with imageId
router.delete('/:imageId', ProfileImage.deleteImageById);

//router.get('/', ProfileImage.homepage);

//expose router to other files
module.exports =router;
