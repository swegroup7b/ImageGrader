'use strict';
var path = require('path'),
  results = require('../controllers/results.server.controller.js'),
  grader = require('../controllers/grader.server.controller.js'),
  algorithms = require('../services/algorithms.server.service.js');


module.exports = function (app) {
  // load controller
  app.route('/api/grader/getImage').get(grader.getImage);
  app.route('/api/grader/getSession').get(grader.getSession);
  app.route('/api/grader/getCurrentSessionIndex').get(grader.getCurrentSessionIndex);
  app.route('/api/grader/grade').post(grader.submitGrading);
  app.route('/api/grader/currentImage').get(grader.currentImage);
  app.route('/api/grader/totalImages').get(grader.totalImages);
  app.route('/api/grader/CSV').get(results.getCSV);
  app.route('/api/grader/reset').get(function(req, res) {
    console.log(req.user);
    req.user.set('session', []);
    req.user.save(function(err){
      if (err) throw err;
      res.send();
    });
  });
};
