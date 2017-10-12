var assert = require('should'),
  path = require('path'),
  controller = require(path.resolve('../../server/controllers/users.server.controller'));

describe("Test Area Function", function () {
  it('calculates the area of a polygon', function(){
    var points = [[0,0],[2,2],[3,5],[4,3],[4,0]];
    var enclosed_area = controller.area(points);
    enclosed_area.should.be.approximately(9.5,0.01)
  })
});

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
