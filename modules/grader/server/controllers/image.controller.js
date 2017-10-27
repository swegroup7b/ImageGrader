model = require('../../../users/server/models/user.server.model');
mongoose = require('mongoose');

var model = model.User;

exports.next_image = function(req, res){
  var username = req.body['username']; // revisit this
  var record = model.find({'username': username});
  var session_index = record['currentSessionIndex'];
  var session = record['session'][session_index];
  var image_url = record['images'][record['currentImageIndex']];
  res.body = JSON.stringify({'url': image_url});
};
