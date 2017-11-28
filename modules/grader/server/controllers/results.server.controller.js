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
  var csv="Image Name,Lesion Area,Lesion Width 0,Lesion Width 50,Lesion Width 95,Lesion Max Depth,Lesion Surface Width,Osteophyte Area,Cartilage Mean Depth 0,Cartilage Std Depth 0\n";
  for (var i=0; i< images.length; i++){
  csv += images[i].name +"," +images[i].lesionArea +
        "," +images[i].lesionWidth.at0Depth +"," + images[i].lesionWidth.at50Depth +"," +
         images[i].lesionWidth.at95Depth + "," + images[i].lesionMaxDepth +"," +
         images[i].lesionSurfaceWidth +"," +images[i].osteophyteArea +"," +
         images[i].cartilageDepth[0].avgDepth +"," +images[i].cartilageDepth[0].std+"\n";
  }
  res.set({
    'Content-Disposition': 'attachment; filename=export.csv'
  });
  res.contentType("text/csv");
  res.send(csv);
}
