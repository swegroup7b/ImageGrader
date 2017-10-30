'use strict'
var path = require('path'),
  grader = require('../controllers/grader.controller.js'),
  algorithms = require('../services/algorithms.service.js');


module.exports = function (app) {
  // load controller
  app.route('/api/getImage').get(grader.getImage);
  app.route('/api/grade').post(grader.update);
  app.route('/api/grade').use(algorithms.gradingMiddleware);
};
