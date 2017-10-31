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
  req.user.session[req.user.currentSessionIndex].currentImageIndex = 0;
  req.user.save(function(err) {
    if (err) throw err;
    res.send();
  });
}

exports.upload = function (req, res) {
  console.log(req.files);
  if (session.currentImage(req.user) === undefined) {
    session.newSession(req.user, addImage);
  } else {
    addImage();
  }

  function addImage() {
    session.addImage(req.user, {
      name: req.files.file.filename,
      url: req.files.file.file,
      step: 0
    });
  }


  //may need more stuff here.
  res.send();

};
