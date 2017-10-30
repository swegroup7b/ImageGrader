module.exports = {
  newSession: newSession,
  addImage:addImage,
  currentImage: currentImage,
  nextImage: nextImage,
  updateCurrentGrading: updateCurrentGrading,
  clear: clear
}

// Append a new session and make it the current session
function newSession(user) {
  var session = {
    created: new Date();
    expires: 0,
    duration: 0,
    images: [],
  };

  user.session.push(session);
  user.save();
}

// Add a new image to the current session
function addImage(user, image) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw err;
  var session = user.session[sessionIndex];

  session.images.push(image);
  user.save(function(err) {
    if (err) throw;
    console.log("Added image to the current session");
  });
}

function currentImage(user) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw err;
  var session = user.session[sessionIndex];

  // Make sure we have a valid current image
  var imageIndex = session.currentImageIndex;
  if (imageIndex < 0 || imageIndex >= session.images.length) throw err;
  var image = session.images[imageIndex];
  console.log("Retrieved the current image");
  return image;
}

// Make the session go to the next image
function nextImage(user) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw err;
  var session = user.session[sessionIndex];

  session.currentImageIndex++;
  user.save(function(err) {
    if (err) throw;
    console.log("Save the session index to next image");
  });
}

// Set the grading for the current image
function updateCurrentGrading(user, grading) {
  // Make sure we have a valid session
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw err;
  var session = user.session[sessionIndex];

  // Make sure we have a valid current image
  var imageIndex = session.currentImageIndex;
  if (imageIndex < 0 || imageIndex >= session.images.length) throw err;
  var image = session.images[imageIndex];

  for (var field in grading) {
    image[field] = grading[field];
    console.log("Setting the image's "+field+" to "+grading[field]);
  }
  user.save(function(err) {
    if (err) throw;
    console.log("Saved the updated grading");
  });
}

// Delete images in the current session
function clear(user) {
  // Make sure we have a valid session
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw err;
  var session = user.session[sessionIndex];

  for (var i = 0; i < session.images; i++) {
    // TODO: delete the image from the disk
  }

  user.session.pop();
  user.save(function(err) {
    if (err) throw;
    console.log("Cleared the current session");
  });
}
