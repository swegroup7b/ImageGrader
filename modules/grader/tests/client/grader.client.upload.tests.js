
var should = require('should'),
supertest = require('supertest');
var request = supertest('localhost:3000');
var mongoose = require('mongoose');
var path = require('path');
var express = require(path.resolve(__dirname, './config/lib/express'));

var app,
agent;

describe('upload', function() {

  before(function (done) {
  // Get flication
   app = express.init(mongoose);
   agent = request.agent(app);
  done();
});

    it('an image file', function(done) {
       request.post('/api/grader/upload')
              .attach('newImage', './modules/users/client/img/profile/default.png')
              .end(function(err, res) {
                  res.should.have.status(200) // 'success' status
                  done();
              });
    });
});
