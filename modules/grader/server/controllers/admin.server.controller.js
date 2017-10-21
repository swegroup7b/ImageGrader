'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};

/**
 * These functions calculate the lesion area, maximum depth, lesion width at 0%, 50%, and 95% of maximum depth,
 * and the length of the affected surface.
 * The input parameters are a pair of points defining the medial tibial plateau, a set of points defining the
 * border of the lesion, and a pair of points defining the surface of the lesion.
 * The output is a JSON object in the following format:
 * {"area": ..., "depth": ..., "surface": ..., "width_0": ..., "width_50": ..., "width_95"}
 **/

// helper function to create new coordinate system
function translate (slope, x0, y0, points){
  // defines each point relative to the line with a given slope passing through (x0,y0)
  var closest_points = []; // closest points along surface line
  var leftmost_point = [];
  var leftmost_x = 10000000; // arbitrarily large number
  for (i = 0; i < points.length(); i++){
    var current_point = points[i];
    var distance = abs(-slope*x + y + slope*x0 - y0) - Math.sqrt(slope*slope + 1);
    var x = (current_point[0] + slope*current_point[1] + slope*(slope*x0-y0)) / (slope*slope + 1);
    var y = (-slope*(-current_point[0] - slope*current_point[1]) - slope*x0 + y0) / (slope*slope + 1);
    closest_points.push([x,y,distance]);
    if (x < leftmost_x){
      leftmost_point = [x,y];
      leftmost_x = x;
    }
  }
  // define points on new coordinate system with leftmost point along the surface line as the origin
  var new_points = [];
  for (i = 0; i < closest_points.length(); i++){
    var new_x = Math.sqrt((closest_points[i][0]-leftmost_point[0])^2 + (closest_points[i][1]-leftmost_point[1])^2); // distance from leftmost point
    var new_y = -closest_points[i][2];
    new_points.push([new_x,new_y]);
  }
  return new_points;
};

function width_at_depth (points, percent_depth){
  var max_depth = 0;
  for (i = 0; i < points.length(); i++){
    if (abs(new_points[i][1]) > max_depth){
      max_depth = abs(points[i][1]);
    }
  }
  var pair1 = [];
  var pair2 = []; // defines the line segments that intersect with y = -max_depth/2
  var target_depth = max_depth*percent_depth;
  for (i = 0; i < points.length(); i++){
    if (i === 0){
      // if on the first point, compare with the last point
      if ((points[points.length()-1][1]+target_depth) * (points[0][1]+target_depth) < 0){
        // if the differences between the y-coordinates and half of max_depth have opposite signs
        if (pair1 === []) {
          pair1 = [points[0], points[points.length() - 1]];
        } else{
          pair2 = [points[0], points[points.length() - 1]];
        }
      }
    } else {
      if ((points[i-1][1]+target_depth) * (points[0][1]+target_depth) < 0){
        if (pair1 === []) {
          pair1 = [points[0], points[points.length() - 1]];
        } else{
          pair2 = [points[0], points[points.length() - 1]];
        }
      }
    }
  }
  // find x-coordinates of intersections
  var slope1 = (pair1[1][1]-pair1[0][1]) / (pair1[1][0]-pair1[0][0]);
  var slope2 = (pair2[1][1]-pair2[0][1]) / (pair2[1][0]-pair2[0][0]);
  var intersection1 = (-target_depth-pair1[0][1]) / slope1 + pair1[0][0];
  var intersection2 = (-target_depth-pair2[0][1]) / slope2 + pair2[0][0];
  return abs(intersection1-intersection2);
}

exports.evaluateLesion = function (plateau, border, surface){
  // calculate area
  var area = 0;
  for (i = 0; i < border.length(); i++){
    if (i < border.length()-1){
      area += (border[i][0]*border[i+1][1]) - (border[i+1][0]*border[i][1]);
    } else{
      area += (border[i][0]*border[0][1]) - (border[0][0]*border[i][1]);
    }
  }
  area /= 2;
  // calculate maximum depth
  var surface_slope = (surface[1][1]-surface[0][1]) / (surface[1][0]-slope[0][0]);
  var surface_width = Math.sqrt((surface[1][1]-surface[0][1])^2 + (surface[1][0]-slope[0][0])^2)
  // convert coordinates
  var new_points = translate(surface_slope, surface[0][0], surface[0][1], border);
  // calculate lesion width at the surface
  var width_0 = width_at_depth(new_points, 0);
  // calculate lesion width at 50%
  var width_50 = width_at_depth(new_points, 0.5);
  // calculate lestion width at 95%
  var width_95 = width_at_depth(new_points, 0.95);
  // return data as JSON object
  return {"area": area, "depth": max_depth, "surface": surface_width, "width_0": width_0, "width_50": width_50,
    "width_95": width_95};
};
