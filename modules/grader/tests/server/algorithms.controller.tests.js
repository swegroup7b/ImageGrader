var assert = require('should'),
  path = require('path'),
  controller = require(path.resolve('../../server/controllers/algorithms.controller'));
  //app = require(path.resolve('../../../../config/lib/express'))
  //request = require('supertest');

// ensures that the area function works
describe("Test Area Function", function () {
  it('calculates the area of a polygon', function(){
    var points = [[0,0],[2,2],[3,5],[4,3],[4,0]];
    var enclosed_area = controller.area(points);
    enclosed_area.should.be.approximately(9.5,0.01)
  })
});

// ensures that that the coordinate translation works
describe("Test Coordinate Translation", function () {
  it('recalculates coordinates relative to a given line', function(){
    var ref_point = [1,3];
    var slope = -1;
    var points = [[1,1],[1,2]];
    var new_points = controller.translate(slope, ref_point[0], ref_point[1], points);
    new_points[0][0].should.be.approximately(Math.sqrt(2)/2, 0.01);
    new_points[0][1].should.be.approximately(-Math.sqrt(2), 0.01);
  })
});

// ensure that the minimum distance function works
describe("Test Minimum Distance Function", function() {
  it('calculates the minimum distance a point and a two-dimensional surface', function(){
    var surface = [[0,0],[2,0],[4,2]];
    var point = [6,4];
    var distance = controller.min_distance(point, surface);
    distance.should.be.approximately(2*Math.sqrt(2), 0.001);
    point = [4,0];
    distance = controller.min_distance(point, surface);
    distance.should.be.approximately(Math.sqrt(2), 0.001);
  })
});

describe("Test Vertical Distance Function", function() {
  it('calculates the vertical distance between two horizontal lines at a given x-value', function(){
    var distance = controller.vertical_distance(2, [0,0], [5,0], [0,1], [5,1]);
    distance.should.be.equal(1);
  });
  it('uses a slightly more complex scenario', function() {
    var distance = controller.vertical_distance(2, [0,0], [4,0], [0,2], [4,4]);
    distance.should.be.equal(3);
  });
});

// ensure that the cartilage is properly analyzed
describe("Test Cartilage Analysis", function() {
  describe("test using flat lines", function() {
    it('calculates the average width (and standard deviation) for segments of cartilage', function () {
      var surface = [[1,1], [2,1], [3,1], [4,1], [5,1]];
      var oc_interface = [[0,0], [1,0], [2,0], [4,0], [5,0]];
      var data = controller.evaluateCartilage(surface, oc_interface, 3);
      console.log(data);
    })
  });
  describe("more complex case", function() {
    it('calculates the average width (and standard deviation) for segments of cartilage', function() {
      var surface = [[1.1,1], [2,1.5], [3.3,1.2], [4,1.3], [4.9,1], [5.7,1]];
      var oc_interface = [[0,0], [1,0], [2,0], [4,0], [5,0], [7,0.5]];
      var data = controller.evaluateCartilage(surface, oc_interface, 3);
      console.log(data);
    })
  });
});

describe('Test Lesion Analysis', function() {
  it('tests the function with a simple trapazoidal region', function() {
    var plateau = [[0,1], [4,1]];  // a horizontal line
    var surface = [[0,0], [4,0]];
    var border = [[0,0], [1,-1], [2,-1], [3,0]];
    var data = controller.evaluateLesion(plateau, border, surface);
    console.log(data);
  });
});

/**
// test router
describe("test route", function (){
  it('sends a message to /grade', function(){
    request.post('/grade').body('{}').expect('200');
  })
});

**/
