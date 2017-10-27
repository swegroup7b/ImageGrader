model = require('../../../users/server/models/user.server.model');
mongoose = require('mongoose');

var model = model.User;

exports.next_image = function(req, res){
  var username = req.body['username']; // revisit this
  model.find({'username': username}, function(err, record) {
    if (err) throw err;  // catch errors
    var session_index = record['currentSessionIndex'];
    var session = record['session'][session_index];
    var image_url = record['images'][record['currentImageIndex']];
    res.body = JSON.stringify({'url': image_url});  // send URL
    if (record['currentImageIndex'] == record['images'].length-1){
      record['currentImageIndex'] = 0;
      record['session'][session_index]['finished'] = true;  // mark current session as finished
    } else {
      record['currentImageIndex'] += 1;
    }
    record.save();  // update user record
  });
};
