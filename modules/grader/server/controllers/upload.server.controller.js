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
