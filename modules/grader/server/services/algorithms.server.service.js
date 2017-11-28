'use strict';

/**
 * These functions calculate the lesion area, maximum depth, lesion width at 0%, 50%, and 95% of maximum depth,
 * and the length of the affected surface.
 * The input parameters are a pair of points defining the medial tibial plateau, a set of points defining the
 * border of the lesion, and a pair of points defining the surface of the lesion.
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

// helper function for finding distance between two points
function distance(point1, point2){
  return Math.sqrt(Math.pow(point1[0]-point2[0], 2) + Math.pow(point1[1]-point2[1], 2));
}

exports.distance = distance;

// helper function to find average
function avg(values){
  var sum = 0;
  for (var i = 0; i < values.length; i++){
    sum += values[i];
  }
  return sum/values.length;
}

exports.avg = avg;

// helper function to find standard deviation
function std(values){
  var total = 0;
  var mean = avg(values);
  for (var i = 0; i < values.length; i++){
    total += Math.pow((values[i]-mean), 2);
  }
  return Math.sqrt(total/values.length);
}

exports.std = std;

// helper function to determine if a number is between two values
function between(num, bound1, bound2){
  return (((bound1 >= num) && (bound2 <= num)) || ((bound1 <= num) && (bound2 >= num)))
}

exports.between = between;

// helper function to find the minimum distance between a single point and a surface defined by a set of points
function min_distance(point, surface){
  var minimum = 1000000000; // arbitrarily large
  // find two closest points on surface
  var p1 = surface[0];
  var p2 = surface[1];
  var d1 = distance(p1, point); // second closest
  var d2 = distance(p2, point); // closest
  // swap values if necessary
  if (d1 < d2){
    var p_temp = p1;
    var d_temp = d1;
    d1 = d2;
    p1 = p2;
    d2 = d_temp;
    p2 = p_temp;
  }
  for (var i = 2; i < surface.length; i++){
    var current_distance = distance(point, surface[i]);
    if (current_distance < d1){
      if (current_distance < d2){
        p2 = surface[i];
        d2 = current_distance;
      } else{
        p1 = surface[i];
        d1 = current_distance;
      }
    }
  }
  // find distance between the given point and the line defined by the closest points on the surface
  var m = (p1[1]-p2[1]) / (p1[0]-p2[0]);
  var d_line = Math.abs(m*(p1[0]-point[0]) + (p1[1]-point[1])) / Math.sqrt(m*m + 1);
  // find intersection point
  var x_intersect = (point[0] + m*point[1] + m*(m*p1[0] - p1[1])) / (m*m + 1);
  // find if the intersection point is between the two boundary points
  if (between(x_intersect, p1[0], p2[0])){
    return d_line;
  } else{
    return d2;
  }
}

exports.min_distance = min_distance;

// finds the vertical distance between two lines at a given x-value
function vertical_distance(x, line1_p1, line1_p2, line2_p1, line2_p2){
  // detect invalid values (not between x-ranges of both segments)
  if (!(between(x, line1_p1[0], line1_p2[0]) && (between(x, line2_p1[0], line2_p2[0])))){
    return NaN;
  }
  // find corresponding points on both lines
  var slope1 = (line1_p1[1]-line1_p2[1]) / (line1_p1[0]-line1_p2[0]);
  var slope2 = (line2_p1[1]-line2_p2[1]) / (line2_p1[0]-line2_p2[0]);
  var y1 = line1_p1[1] + ((x - line1_p1[0]) * slope1);
  var y2 = line2_p1[1] + ((x - line2_p1[0]) * slope2);
  return Math.abs(y1-y2);
}

exports.vertical_distance = vertical_distance;

// finds the width of a lesion at a given percentage of its maximum depth
function width_at_depth (points, percent_depth){
  var lowest = 1000000;
  var highest = -1000000;
  for (var i = 0; i < points.length; i++){
    if (points[i][1] < lowest){
      lowest = points[i][1];
    }
    if (points[i][1] > highest){
      highest = points[i][1];
    }
  }
  var pair1 = [];
  var pair2 = []; // defines the line segments that intersect with y = -max_depth/2
  var target_y = highest - (Math.abs(highest-lowest)*percent_depth);
  console.log(target_y);
  for (var i = 0; i < points.length; i++){
    if (i === 0){
      // if on the first point, compare with the last point
      if (((points[points.length-1][1]-target_y) * (points[0][1]-target_y)) <= 0){
        // if the differences between the y-coordinates and half of max_depth have opposite signs
        if (pair1.length === 0) {
          pair1 = [points[0], points[points.length - 1]];
        } else{
          pair2 = [points[0], points[points.length - 1]];
        }
      }
    } else {
      if (((points[i-1][1]-target_y) * (points[i][1]-target_y)) <= 0){
        if (pair1.length === 0) {
          pair1 = [points[i-1], points[i]];
        } else{
          pair2 = [points[i-1], points[i]];
        }
      }
    }
  }
  // find x-coordinates of intersections
  var slope1 = (pair1[1][1]-pair1[0][1]) / (pair1[1][0]-pair1[0][0]);
  var slope2 = (pair2[1][1]-pair2[0][1]) / (pair2[1][0]-pair2[0][0]);
  var intersection1 = (target_y-pair1[0][1]) / slope1 + pair1[0][0];
  var intersection2 = (target_y-pair2[0][1]) / slope2 + pair2[0][0];
  return Math.abs(intersection1-intersection2);
}

// calculates the area enclosed by a set of points
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

// acts as a wrapper for the area function
function evaluateOsteophyte(border){
  return area(border);
}

// analyzes lesion
function evaluateLesion(plateau, border, surface){
  var lesion_area = area(border);
  var plateau_slope = (plateau[1][1]-plateau[0][1]) / (plateau[1][0]-plateau[0][0]);
  var surface_width = distance(surface[0], surface[1]);
  // convert coordinates
  var new_points = translate(plateau_slope, plateau[0][0], plateau[0][1], border);
  // find maximum depth
  var highest = -1000000;
  var lowest = 1000000;
  for (var i = 0; i < new_points.length; i++){
    if (new_points[i][1] > highest){
      highest = new_points[i][1];
    }
    if (new_points[i][1] < lowest){
      lowest = new_points[i][1];
    }
  }
  var max_depth = highest - lowest;
  // find position of maximum depth
  var left_bound = 1000000;
  var right_bound = -1000000;
  for (var i = 0; i < new_points.length; i++){
    if (new_points[i][0] < left_bound){
      left_bound = new_points[i][0];
    }
    if (new_points[i][0] > right_bound){
      right_bound = new_points[i][0];
    }
  }
  var max_depth_pos = 0;
  for (var i = 0; i < new_points.length; i++){
    if (new_points[0][1] === lowest){
      max_depth_pos = (new_points[i][0]-left_bound) / (right_bound-left_bound);  // as a fraction of the total width
    }
  }
  // calculate lesion width at the surface
  var width_0 = width_at_depth(new_points, 0.03); // this constant can be adjusted
  // calculate lesion width at 50%
  var width_50 = width_at_depth(new_points, 0.5);
  // calculate lestion width at 95%
  var width_95 = width_at_depth(new_points, 0.95);
  // return data as JSON object
  return {"area": lesion_area, "depth": max_depth, "maxDepthPosition": max_depth_pos, "surface": surface_width,
    "width_0": width_0, "width_50": width_50, "width_95": width_95};
}

exports.evaluateLesion = evaluateLesion;

// analyzes cartilage width, accepts two sets of points representing the cartilage surface and osteochondral interface
function evaluateCartilage(surface, oc_interface, interval_count){
  // transform coordinates so that a line between the ends of the OC interface is horizontal
  var oc_slope = (oc_interface[oc_interface.length-1][1]-oc_interface[0][1]) /
    (oc_interface[oc_interface.length-1][0]-oc_interface[0][0]);
  var new_surface = translate(oc_slope, oc_interface[0][0], oc_interface[0][1], surface);
  var new_interface = translate(oc_slope, oc_interface[0][0], oc_interface[0][1], oc_interface);
  // compute boundaries and intervals
  var interface_x = [];
  var surface_x = [];
  for (var i = 0; i < new_interface.length; i++){ interface_x.push(new_interface[i][0]); }
  for (var i = 0; i < new_surface.length; i++){ surface_x.push(new_surface[i][0]); }
  var lower = Math.max.apply(null, [Math.min.apply(null, interface_x), Math.min.apply(null, surface_x)]);
  var upper = Math.min.apply(null, [Math.max.apply(null, interface_x), Math.max.apply(null, surface_x)]);
  var results = [];
  var x_interval = (upper-lower) / interval_count;
  for (var i = 0; i < interval_count; i++){
    // find points within interval and their distances from the surface
    var points = [];
    var distances = [];
    for (var j = 0; j < 10; j++){
      var current_x = lower + (x_interval*i) + (x_interval*j/10);
      // find boundary points in OC interface and define a line intersecting them
      var line1_p1;
      var line1_p2;
      for (var k = 0; k < new_interface.length-1; k++){
        if (between(current_x, new_interface[k][0], new_interface[k+1][0])){
          line1_p1 = new_interface[k];
          line1_p2 = new_interface[k+1];
          break;
        }
      }
      var line2_p1;
      var line2_p2;
      for (var k = 0; k < surface.length-1; k++){
        if (between(current_x, new_surface[k][0], new_surface[k+1][0])){
          line2_p1 = new_surface[k];
          line2_p2 = new_surface[k+1];
          break;
        }
      }
      if (line1_p1 && line1_p2 && line2_p1 && line2_p2) {
        distances.push(vertical_distance(current_x, line1_p1, line1_p2, line2_p1, line2_p2));
      }
    }
    if (distances.length == 0) {
      distances = [0];
    }
    var mean = avg(distances);
    var deviation = std(distances);
    results.push({"avgDepth": mean, "std": deviation});
  }
  return results;
}

exports.evaluateCartilage = evaluateCartilage;

/**
 * function to handle requests from the client
 * Input format:
 * {
 *  "osteophytes":
 *    [{"border": [(X1,Y1),...(Xn,Yn)]}, ...],
 *  "lesion": {
 *    "plateau": [(X1,Y1),(X2,Y2)],
 *    "surface": [(X1,Y1),...(Xn,Yn)],
 *  },
 *  "interface": [(X1,Y1),...(Xn,Yn)],
 *  "surface": [(X1,Y1),...(Xn,Yn)],
 * }
 *
 * Output format:
 * {
 *  "lesionArea": ...,
 *  "lesionWidth": {
 *    "at0Depth": ...,
 *    "at50Depth": ...,
 *    "at95Depth": ...,
 *  }
 *  "lesionMaxDepth": ...,
 *  "lesionMaxDepthPosition": ...,
 *  "lesionSurfaceWidth: ...,
 *  "osteophyteArea": ...,
 *  "cartilageDepth": [{
 *    "avgDepth": ...,
 *    "std": ...
 *   }
 *  ]
 */
exports.grade = function(data) {
  console.log('Grading an image!');
  var results = {};

  if (data.osteophytePoints) {
    var points = data.osteophytePoints;
    results['osteophyteArea'] = evaluateOsteophyte(points);
  }

  if (data.plateauPoints && data.lesionBorderPoints && data.lesionSurfacePoints) {
    var lesionProperties = evaluateLesion(data.plateauPoints, data.lesionBorderPoints, data.lesionSurfacePoints);
    results['lesionArea'] = lesionProperties.area;
    results['lesionMaxDepth'] = lesionProperties.depth;
    results['lesionMaxDepthPosition'] = lesionProperties.maxDepthPosition;
    results['lesionWidth'] = {
      'at0Depth': lesionProperties.width_0,
      'at50Depth': lesionProperties.width_50,
      'at95Depth': lesionProperties.width_95
    };
    results['lesionSurfaceWidth'] = lesionProperties.surface;
  }

  // find properties of lesion
  // find widths (along with standard deviation) over regular intervals
  if (data.interfacePoints && data.surfacePoints) {
    results['cartilageDepth'] = evaluateCartilage(data.surfacePoints, data.interfacePoints, 3);
  }

  return results;
};
