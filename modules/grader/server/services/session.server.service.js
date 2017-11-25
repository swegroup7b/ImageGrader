module.exports = {
  newSession: newSession,
  currentImage: currentImage,
  totalImages: totalImages,
  addImage: addImage,
  getImage: getImage,
  nextImage: nextImage,
  getSession: getSession,
  getCurrentSessionIndex: getCurrentSessionIndex,
  finishCurrentImage: finishCurrentImage,
  clear: clear
};

// Returns index while in a session
// Returns -1 when a new session is created but not started
// Returns undefined if the session is invalid
function currentImage(user) {
  var sessionIndex = user.currentSessionIndex;
  // if the session is invalid, return undefined
  if (sessionIndex < 0 || sessionIndex >= user.session.length) {
    console.log("Session index is: "+sessionIndex);
    console.log("Number of sessions is: "+users.session.length);
    return undefined;
  }

  // otherwise return the current session value
  var session = user.session[sessionIndex];
  return session.currentImageIndex;
}

function totalImages(user) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) return undefined;
  var session = user.session[sessionIndex];
  return session.images.length;
}

// Append a new session and make it the current session
function newSession(user, callback) {
  var session = {
    created: new Date(),
    expires: 0,
    duration: 0,
    images: [],
    currentImageIndex: -1 // the user can uploading images
  };
  user.session.push(session);
  user.currentSessionIndex = user.session.length-1;
  user.save(function(err) {
    if (err) throw err;
    console.log("The session was changed. Index = "+user.currentSessionIndex);
    console.log(session);
    callback();
  });
}

// Add a new image to the current session
function addImage(user, image, callback) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw new Error("Invalid session");
  var session = user.session[sessionIndex];
  session.images.push(image);

  console.log("Session index: "+sessionIndex);
  user.save(callback);
}

// Returns undefined if there are no images left to grade
// i.e. current session.finished is true
function getImage(user) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length || user.session[sessionIndex].finished) {
    console.log("Session is invalid or finished");
    return;
  } else {
    // throw "Invalid session";
    console.log("Valid Session");
    var session = user.session[sessionIndex];

    // Make sure we have a valid current image
    var imageIndex = session.currentImageIndex;
    if (imageIndex < 0 || imageIndex >= session.images.length) {
      console.log("Image index is "+imageIndex);
      return null;
    }
    var image = session.images[imageIndex];
    console.log("Retrieved the current image");
    console.log(session.images);
    console.log(image);
    return image;
  }
}

// Make the session go to the next image
function nextImage(user) {
  console.log("Requesting the next image");
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw "Invalid session";
  var session = user.session[sessionIndex];
  console.log("Current: "+session.currentImageIndex);
  console.log("Lenght-1: "+(session.images.length-1));
  if (session.currentImageIndex == session.images.length - 1) {
    session.finished = true;
    user.save(function(err) {
      if (err) throw err;
      console.log("Finished the current session");
    });
  }

  session.currentImageIndex++;
  console.log("New image index "+session.currentImageIndex);

  user.save(function(err) {
    if (err) throw err;
    console.log("Saved the session index to next image");
  });
}

// Retrieve session
function getSession(user) {
  // Make sure we have a valid session index
  if (user.session.length == 0) {
    console.log("No sessions available");
    return null;
  } else {
    // Found session array with elements
    var session = user.session;
    console.log("Return session");
    return session;
  }
}

// Retrieve current session index
function getCurrentSessionIndex(user) {
  // Make sure there is at least one session
  if (user.currentSessionIndex == -1) {
    console.log("No sessions have been created");
    return null;
  } else {
    // Found at least one session
    var currentSessionIndex = user.currentSessionIndex;
    console.log("Return current session index");
    return currentSessionIndex;
  }
}

// Set the grading for the current image
function finishCurrentImage(user, grading) {
  // Make sure we have a valid session
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw new Error("Invalid session");
  var session = user.session[sessionIndex];

  // Make sure we have a valid current image
  var imageIndex = session.currentImageIndex;
  if (imageIndex < 0 || imageIndex >= session.images.length) {
    console.log("Current index: " + imageIndex);
    console.log("Session image count: "+session.images.length);
    throw new Error("Invalid image");
  }
  var image = session.images[imageIndex];

  // Set the grading results
  for (var field in grading) {
    image[field] = grading[field];
    console.log("Setting the image's "+ field + " to "+grading[field]);
  }

  // Since the current image has been graded, advance to the next one
  // (this function also saves the user object, and it finishes the
  //  session if there are no images left)
  nextImage(user);
}

// Delete images in the current session
function clear(user) {
  // Make sure we have a valid session
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw "Invalid session";
  var session = user.session[sessionIndex];

  for (var i = 0; i < session.images; i++) {
    // TODO: delete the image from the disk
  }

  user.session.pop();
  user.save(function(err) {
    if (err) throw err;
    console.log("Cleared the current session");
  });
}
