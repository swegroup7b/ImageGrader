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

// Upload the file. If a session does not exist, a new session is created first.
exports.upload = function (req, res) {
  console.log(req.files);
  if (session.currentImage(req.user) === undefined) {
    session.newSession(req.user, addImage);
  } else {
    addImage();
  }

  // Function that adds a new image to the session.
  function addImage() {
    session.addImage(req.user, {
      name: req.files.file.filename,
      url: req.files.file.file,
      step: 0
    });
    // Tell client that the image was uploaded successfully
    res.send();
  }
};

//create a new session
exports.newSession = function(req, res) {
  console.log("New session controller");
  session.newSession(req.user, function() {
    res.send();
  });
}
