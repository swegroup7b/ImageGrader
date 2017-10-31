var session = require('../services/session.server.service.js');

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
    /*res.json({
      name: 'IMage1.jpg',
      url: '/modules/grader/client/img/D4_KDA_3.jpg',
      step: 0
    })*/
  } else {
    res.status(500);
    res.send();
  }
};

exports.update = function(req, res) {
  var user = req.user;
  var points = req.body.points;

  console.log("Trying to update the grading");

  //var pointsAndGrading = {};
  //Object.assign(pointsAndGrading, points, grading);

  //console.log("User: ");
  //console.log(user);
  console.log("Points: ");
  console.log(points);
  if (user && points) {

    session.updateCurrentGrading(user, points);
    console.log("Did this finish?");
    // Check whether the image is done grading.
    // For now, we'll say that the image is done
    // if we've graded the "cartilageDepthPoints"
    res.send('Grading updated successfully');
  } else {
    res.status(500);
    res.send();
  }
}
