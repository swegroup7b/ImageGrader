/* Moved everything to grader.server.routes.js
module.exports = function (app) {
  // User Routes
  var results = require('../controllers/results.server.controller');

  app.route('/api/grader/CSV').post(results.getCSV);
  // Finish by binding the user middleware
};
*/