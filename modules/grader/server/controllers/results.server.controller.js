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

  //   images: [{
  //     name: String,
  //     url: String,
  //     gradingTime: Number,
  //     plateauPoints: [{ x: Number, y: Number }],
  //     lesionArea: Number,
  //     lesionWidth: {
  //       at0Depth: Number,
  //       at50Depth: Number,
  //       at95Depth: Number
  //     },
  //     lesionMaxDepthPosition: Number,
  //     lesionMaxDepth: Number,
  //     lesionSurfacePoints: [{ x: Number, y: Number }],
  //     lesionSurfaceWidth: Number,
  //     osteophyteAreaPoints: [{ x: Number, y: Number }],
  //     osteophyteArea: Number,
  //     osteochondralInterfacePoints: [{ x: Number, y: Number }],
  //     cartilageDepth: {
  //       avgDepth: Number,
  //       std: Number
  //     }
  //   }]
  // }],


exports.getCSV = function(req, res) {
  var user = req.user;
  var currentSession = user.session[user.currentSessionIndex];
  var images = currentSession.images;
  var csv="";
  for (var i=0; i< images.length; i++){
  csv += images[i].name +"," +"a href ='images[i].url' " +"," +  images[i].gradingTime + "," +images[i].lesionArea +  "," +images[i].lesionWidth.at0Depth +"," + images[i].lesionWidth.at0Depth +"," + image[i].lesionWidth.at95Depth + "," + image[i].lesionMaxDepth +"," + image[i].lesionSurfaceWidth +"," +image[i].osteophyteArea +"," +image[i].cartilageDepth.avgDepth +"," +image[i].cartilageDepth.std+"\n";
  }
  res.send(csv);
}


