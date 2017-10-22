module.exports = function (app) {
  // User Routes
  var upload = require('../controllers/upload.server.controller');

  app.route('/api/grader/uploads').post(upload.upload);
  // Finish by binding the user middleware
};
