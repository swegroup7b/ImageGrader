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

  // Access requested session id from client-side
  var selectedSession = user.session[req.query.id];

  // Retrieve images from the requested session
  var images = selectedSession.images;

  // CSV file column headers
  var csv="Image Name,Lesion Area,Lesion Width 0,Lesion Width 50,Lesion Width 95,Lesion Max Depth,Lesion Surface Width,Osteophyte Area,Cartilage Mean Depth 0-33,Cartilage Std Depth 0-33,Cartilage Mean Depth 34-66,Cartilage Std Depth 34-66,Cartilage Mean Depth 67-100,Cartilage Std Depth 67-100\n";

  // Add all defined image measurements to CSV file
  for (var i=0; i< images.length; i++){
  if(images[i].lesionArea != undefined){
    csv += images[i].name +"," +images[i].lesionArea +
          "," +images[i].lesionWidth.at0Depth +"," + images[i].lesionWidth.at50Depth +"," +
           images[i].lesionWidth.at95Depth + "," + images[i].lesionMaxDepth +"," +
           images[i].lesionSurfaceWidth +"," +images[i].osteophyteArea +"," +
           images[i].cartilageDepth[0].avgDepth +"," +images[i].cartilageDepth[0].std+"," +
           images[i].cartilageDepth[1].avgDepth +"," +images[i].cartilageDepth[1].std+"," +
           images[i].cartilageDepth[2].avgDepth +"," +images[i].cartilageDepth[2].std+"\n";
    }
  }

  // Send CSV file download to client-side
  res.set({
    'Content-Disposition': 'attachment; filename=export.csv'
  });
  res.contentType("text/csv");
  res.send(csv);
}
