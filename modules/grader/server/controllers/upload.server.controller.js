'use strict'


/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  session = require('../services/session.server.service.js');

//sends a response when all of the uploads have been completed
exports.doneUploading = function(req, res) {
  console.log("Done loading controller");
  req.user.session[req.user.currentSessionIndex].currentImageIndex = 0;
  console.log("Current session: "+req.user.currentSessionIndex);
  console.log("Current image index: "+req.user.session[req.user.currentSessionIndex].currentImageIndex);
  req.user.save(function(err) {
    if (err) throw err;
    res.send();
  });
}

//uploads the file. if a session does not exist, a new session is created first.
exports.upload = function (req, res) {
  console.log(req.files);
  if (session.currentImage(req.user) === undefined) {
    session.newSession(req.user, addImage);
  } else {
    addImage();
  }

//function that adds a new image to the session.
  function addImage() {
    session.addImage(req.user, {
      name: req.files.file.filename,
      url: req.files.file.file,
      step: 0
    });
  }


  //may need more stuff here.
  res.send();

exports.newSession= function(req, res) {
  console.log("New session controller");
  session.newSession(req.user, function() {
    res.send();
  });
}

exports.upload = function (req, res) {
  console.log(req.files);
  var current = session.currentImage(req.user);
  console.log("Current image is: "+current);

  session.addImage(req.user, {
    name: req.files.file.filename,
    url: req.files.file.file,
    step: 0
  }, function() {
    //may need more stuff here.
    res.send();
  });
};
