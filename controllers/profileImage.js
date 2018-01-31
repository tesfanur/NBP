var express = require('express');
var ProfileImage  = require('../models/profileImage');
var router = express.Router();

//1. save profile image detail info on mongodb
module.exports.uploadImage =  function ( req, res, next){
    // Create a new image model and fill the properties
    var newImg = req.file;
    var NewImage = new ProfileImage();
    NewImage.filename     = newImg.filename;
    NewImage.originalName = newImg.originalname;
    NewImage.desc         = newImg.desc
    NewImage.save(function(err,img) {
        if (err) {
            return res.sendStatus(400);
        }
        res.status(201).send({profileImage : img });
        console.log(img);
    });
};

//2. Get all uploaded images
module.exports.getAllProfileImage =function(req, res, next){
    // use lean() to get a plain JS object
    // remove the version key from the response
    ProfileImage.find({}, '-__v').lean().exec((err, images) => {
        if (err) {
            res.sendStatus(400);
        }
        // Manually set the correct URL to each image
        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            img.url = req.protocol + '://' + req.get('host') + '/images/' + img._id;
        }
        res.json({profileImage: images});
    })
};

//TODO:

//3. update/change/edit profile image

module.exports.updateImageInfo= function(req,res){
  var updateProfileImage= req.file;
  console.log(updateProfileImage.filename+'\n');
  var imageId= req.params.imageId;
  var modifiedAt = new Date();
  ProfileImage.findOneAndUpdate({_id:imageId},
      {$set:{
        desc     : req.body.desc,
        originalName  : updateProfileImage.originalName,
        filename  : updateProfileImage.filename,
        created : modifiedAt
        }
    },
    {upsert:true},

  function(err, updatedProfileImage){
          if(err){
            console.log('Error occurred. Detail Error message: ' +err);
          }else{
            console.log(updatedProfileImage);
            res.send(updatedProfileImage);
            //res.status(204);//User succesfully updated
          }
         });
};


//4. get image by id
module.exports.getImageById = function(req, res){
    console.log('Getting image by id:');
    ProfileImage.findOne({ _id:req.params.imageId}).exec(function(err,retrievedImage){
      if (err) {
        res.send('Error has occurred\n Error:' +err);
      }
      else{
        console.log(retrievedImage);
        res.json(retrievedImage);
      }
});
};

//5. Delete/remove profile image
module.exports.deleteImageById= function(req,res){
  var imageId=req.params.imageId;
  ProfileImage.findOneAndRemove({_id:imageId},
         function(err, retrievedImage){
          if(err)  res.send('Error Deleteing');
           else  {res.send("No content found");
           //res.json(retrievedImage);
         }
         });
}
