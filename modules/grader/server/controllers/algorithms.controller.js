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
    total += Math.pow((total-mean), 2);
  }
  return Math.sqrt(total/values.length);
}

exports.std = std;

// helper function to determine if a number is between two values
function between(num, bound1, bound2){
  return (((bound1 > num) && (bound2 < num)) || ((bound1 < num) && (bound2 > num)))
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

// finds the width of a lesion at a given percentage of its maximum depth
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
  var slope1 = (pair1[1][1]-pair1[0][1]) / (pair1[1][0]-pair1[0][0]);
  var slope2 = (pair2[1][1]-pair2[0][1]) / (pair2[1][0]-pair2[0][0]);
  var intersection1 = (-target_depth-pair1[0][1]) / slope1 + pair1[0][0];
  var intersection2 = (-target_depth-pair2[0][1]) / slope2 + pair2[0][0];
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
};

// analyzes lesion
function evaluateLesion(plateau, border, surface){
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
}

// analyzes cartilage width, accepts two sets of points representing the cartilage surface and osteochondral interface
function evaluateCartilage(surface, oc_interface, interval_count){
  var results = [];
  var x_interval = (oc_interface[oc_interface.length-1][0] - oc_interface[0][0]) / interval_count;
  for (var i = 0; i < interval-1; i++){
    // find points within interval and their distances from the surface
    var points = [];
    var distances = [];
    var lower_bound = oc_interface[0][0] + (x_interval*i);
    var upper_bound = lower_bound + interval;
    for (var j = 0; j < oc_interface.length; j++){
      if (between(oc_interface[j][0], lower_bound, upper_bound)){
        points.push(oc_interface[j]);
        distances.push(min_distance(oc_interface, surface));
      }
    }
    var mean = avg(distances);
    var deviation = std(distances);
    results.push({"mean": mean, "std": deviation});
  }
  return results;
}

/**
 * function to handle requests from the client
 * Input format:
 * {
 *  "osteophytes":
 *    [{"border": [(X1,Y1),...(Xn,Yn)]}, ...],
 *  "lesion": {
 *    "plateau": [(X1,Y1),(X2,Y2)],
 *    "depth": ...,
 *    "surface": [(X1,Y1),...(Xn,Yn)],
 *  },
 *  "interface": [(X1,Y1),...(Xn,Yn)],
 *  "surface": [(X1,Y1),...(Xn,Yn)],
 * }
 */
exports.analyze = function(req, res){
  var data = JSON.parse(req.body);
  var results = {"lesion_properties": {}, "osteophyte_properties": [], "cartilage_widths": {}};
  // find area of each osteophyte
  for (var i = 0; i < data.osteophytes.length; i++){
    var points = data.osteophytes[i].border;
    results.osteophyte_properties.push(evaluateOsteophyte(points));
  }
  // find properties of lesion
  results.lesion_properties = evaluateLesion(data.lesion.plateau, data.lesion.border, data.lesion.surface);
  // find widths (along with standard deviation) over regular intervals
  results.cartilage_properties = evaluateCartilage(data.surface, data.interface, 3);

  res.body = JSON.stringify(results);
};
