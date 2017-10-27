'use strict'

module.exports = function (app) {
  // load controller
  var controller = require('../controllers/algorithms.controller.js');
  app.route('/grade').post(controller.analyze);
};
