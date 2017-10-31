'use strict';
var path = require('path'),
  grader = require('../controllers/grader.server.controller.js'),
  algorithms = require('../services/algorithms.server.service.js');


module.exports = function (app) {
  // load controller
  app.route('/api/grader/getImage').get(grader.getImage);
  app.route('/api/grader/grade').post(grader.update);
  app.route('/api/grader/currentImage').get(grader.currentImage);
  app.route('/api/grader/totalImages').get(grader.totalImages);
  app.route('/api/grader/reset').get(function(req, res) {
    req.user.session = [];
    req.user.currentImageIndex = 0;
    req.user.save();
    res.send();
  });
};
