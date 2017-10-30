var session = require('../services/session.service.js');

exports.getImage = function(req, res) {
  var user = req.user;
  if (user) {
    res.json(session.getImage(user));
  } else {
    res.status(500);
    res.send();
  }
};

exports.update = function(req, res) {
  var user = req.user;
  var points = req.body.points;
  var grading = req.grading;

  var pointsAndGrading = {};
  Object.assign(pointsAndGrading, points, grading);

  if (user && grading) {
    session.updateCurrentGrading(user, pointsAndGrading);

    // Check whether the image is done grading.
    // For now, we'll say that the image is done
    // if we've graded the "cartilageDepthPoints"
    if (grading.cartilageDepthPoints) {
      session.nextImage();
    }
    res.send();
  } else {
    res.status(500);
    res.send();
  }
}
