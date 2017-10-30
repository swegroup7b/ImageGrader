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

exports.upload = function (req, res) {
  console.log(req.files);

  session.newSession(req.user);
 session.addImage(req.user);
  session.newImage(req.user);

  //may need more stuff here.
  res.send();

};
