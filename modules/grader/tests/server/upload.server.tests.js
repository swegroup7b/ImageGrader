var path = require('path');
var models = require(path.resolve('./modules/users/server/models/user.server.model'));
var uploader = require(path.resolve('./modules/grader/server/controllers/upload.server.controller'));
var chai = require('chai')


// test user object
var user1 = {
  firstName: "test",
  lastName: "test",
  displayName: "test",
  organization: "test",
  email: "test@test.com",
  username: "test",
  currentSessionIndex: -1,
  session: []
};

describe("Tests image uploading", function(){
  it("starts with no existing session", function(){
    // create simulated request and response
    user1.save = function(callback){ callback(); };
    var req = {
      user: user1,
      files: {
        file: {
          filename: "image.png",
          file: "path_to_file"
        }
      }
    };
    var res = {success: false};
    res.send = function(){ this.success = true; }; // this is called if the test succeeds
    // test function
    uploader.upload(req, res);
    console.log(req);
    chai.expect(res.success).to.equal(true);
  });
});
