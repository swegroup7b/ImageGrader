'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
/**
module.exports = _.extend(
  require('./users/users.authentication.server.controller'),
  require('./users/users.authorization.server.controller'),
  require('./users/users.password.server.controller'),
  require('./users/users.profile.server.controller')
);
*/

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
  for (var i = 0; i < points.length; i++){
    var current_point = points[i];
    var distance = Math.abs(-slope*current_point[0] + current_point[1] + slope*x0 - y0) / Math.sqrt(slope*slope + 1);
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
  for (var i = 0; i < closest_points.length; i++){
    var new_x = Math.sqrt(Math.pow(closest_points[i][0]-leftmost_point[0], 2) + Math.pow(closest_points[i][1]-leftmost_point[1], 2)); // distance from leftmost point
    var new_y = -closest_points[i][2];
    new_points.push([new_x,new_y]);
  }
  return new_points;
};

exports.translate = translate;

function width_at_depth (points, percent_depth){
  var max_depth = 0;
  for (var i = 0; i < points.length; i++){
    if (Math.abs(points[i][1]) > max_depth){
      max_depth = Math.abs(points[i][1]);
    }
  }
  var pair1 = [];
  var pair2 = []; // defines the line segments that intersect with y = -max_depth/2
  var target_depth = max_depth*percent_depth;
  for (var i = 0; i < points.length; i++){
    if (i === 0){
      // if on the first point, compare with the last point
      if (((points[points.length-1][1]+target_depth) * (points[0][1]+target_depth)) <= 0){
        // if the differences between the y-coordinates and half of max_depth have opposite signs
        if (pair1.length === 0) {
          pair1 = [points[0], points[points.length - 1]];
        } else{
          pair2 = [points[0], points[points.length - 1]];
        }
      }
    } else {
      if (((points[i-1][1]+target_depth) * (points[i][1]+target_depth)) <= 0){
        if (pair1.length === 0) {
          pair1 = [points[i-1], points[i]];
        } else{
          pair2 = [points[i-1], points[i]];
        }
      }
    }
  }
  // find x-coordinates of intersections
  console.log(pair1);
  console.log(pair2);
  var slope1 = (pair1[1][1]-pair1[0][1]) / (pair1[1][0]-pair1[0][0]);
  var slope2 = (pair2[1][1]-pair2[0][1]) / (pair2[1][0]-pair2[0][0]);
  var intersection1 = (-target_depth-pair1[0][1]) / slope1 + pair1[0][0];
  var intersection2 = (-target_depth-pair2[0][1]) / slope2 + pair2[0][0];
  return Math.abs(intersection1-intersection2);
}

function area(border) {
  // calculate area
  var area = 0;
  for (var i = 0; i < border.length; i++){
    if (i < border.length-1){
      area += (border[i][0]*border[i+1][1]) - (border[i+1][0]*border[i][1]);
    } else{
      area += (border[i][0]*border[0][1]) - (border[0][0]*border[i][1]);
    }
  }
  area /= 2;
  return Math.abs(area);  // counterclockwise arrangement leads to negative values
}

exports.area = area;

exports.evaluateLesion = function (plateau, border, surface){
  var lesion_area = area(border);
  // calculate surface slope and width
  var surface_slope = (surface[1][1]-surface[0][1]) / (surface[1][0]-surface[0][0]);
  var surface_width = Math.sqrt(Math.pow(surface[1][1]-surface[0][1],2) + Math.pow(surface[1][0]-surface[0][0], 2));
  // convert coordinates
  var new_points = translate(surface_slope, surface[0][0], surface[0][1], border);
  // find maximum depth
  var max_depth = 0;
  for (var i = 0; i < new_points.length; i++){
    if (Math.abs(new_points[i][1]) > max_depth){
      max_depth = Math.abs(new_points[i][1]);
    }
  }
  // calculate lesion width at the surface
  var width_0 = width_at_depth(new_points, 0);
  // calculate lesion width at 50%
  var width_50 = width_at_depth(new_points, 0.5);
  // calculate lestion width at 95%
  var width_95 = width_at_depth(new_points, 0.95);
  // return data as JSON object
  return {"area": lesion_area, "depth": max_depth, "surface": surface_width, "width_0": width_0, "width_50": width_50,
    "width_95": width_95};
};
