var session = require('../services/session.server.service.js'),
  grader = require('../services/algorithms.server.service.js')
exports.currentImage = function(req, res) {
  console.log("Getting the current index API");
  var user = req.user;
  if (user) {
    res.json({result: session.currentImage(user)});
  } else {
    res.status(500);
    res.send();
  }
}

exports.totalImages = function(req, res) {
  console.log("Getting the total index API");

  var user = req.user;
  if (user) {
    res.json({result: session.totalImages(user)});
  } else {
    res.status(500);
    res.send();
  }
}

exports.getImage = function(req, res) {
  var user = req.user;
  if (user) {
    console.log("Getting an image");
    res.json(session.getImage(user));
  } else {
    res.status(500);
    res.send();
  }
};

exports.getSession = function(req, res) {
  var user = req.user;
  if(user) {
    console.log("Getting sessions array")
    res.json(session.getSession(user));
  } else {
    res.status(500);
    res.send();
  }
}

exports.getCurrentSessionIndex = function(req, res) {
  var user = req.user;
  if(user) {
    console.log("Getting current session index")
    res.json(session.getCurrentSessionIndex(user));
  } else {
    res.status(500);
    res.send();
  }
}

exports.submitGrading = function(req, res) {
  var user = req.user;
  var points = req.body.points;

  console.log("Trying to update the grading");
  // TODO: Verify that we have all the info we need
  console.log(points);
  if (user && points) {
    grading = grader.grade(points);
    session.finishCurrentImage(user, grading);
    // Check whether the image is done grading.
    // For now, we'll say that the image is done
    // if we've graded the "cartilageDepthPoints"
    res.send('Grading updated successfully');
  } else {
    res.status(500);
    res.send();
  }
}
