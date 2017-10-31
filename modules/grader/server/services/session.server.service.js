module.exports = {
  newSession: newSession,
  currentImage: currentImage,
  totalImages: totalImages,
  addImage: addImage,
  getImage: getImage,
  nextImage: nextImage,
  updateCurrentGrading: updateCurrentGrading,
  clear: clear
};

function currentImage(user) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw new Error("Invalid session");
  var session = user.session[sessionIndex];
  return session.currentImageIndex;
}

function totalImages(user) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw new Error("Invalid session");
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

function getImage(user) {
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length || user.session[sessionIndex].finished) {
    console.log("Create a new session because this is invalid or finished");
    newSession(user, function() {
      addImage(user, {
        name: 'IMage1.jpg',
        url: '/modules/grader/client/img/D4_KDA_3.jpg',
        step: 0
      }, function() {
        addImage(user, {
          name: 'IMage1.jpg',
          url: '/modules/grader/client/img/D4_KDA_4.jpg',
          step: 0
        })
      });
    });
  } else {
    // throw "Invalid session";
    console.log("Valid Session");
    var session = user.session[sessionIndex];

    // Make sure we have a valid current image
    var imageIndex = session.currentImageIndex;
    if (imageIndex < 0 || imageIndex >= session.images.length) {
      //throw new Error("Invalid image");
      session.currentImageIndex = 0;
      user.save();
    }
    var image = session.images[imageIndex];
    console.log("Retrieved the current image");
    return image;
  }
}

// Make the session go to the next image
function nextImage(user) {
  console.log("Requesting the next time");
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw "Invalid session";
  var session = user.session[sessionIndex];

  if (session.currentImageIndex == session.length - 1) {
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

// Set the grading for the current image
function updateCurrentGrading(user, grading) {
  // Make sure we have a valid session
  var sessionIndex = user.currentSessionIndex;
  if (sessionIndex < 0 || sessionIndex >= user.session.length) throw new Error("Invalid session");
  var session = user.session[sessionIndex];

  // Make sure we have a valid current image
  var imageIndex = session.currentImageIndex;
  if (imageIndex < 0 || imageIndex >= session.images.length) throw new Error("Invalid image");
  var image = session.images[imageIndex];

  for (var field in grading) {
    image[field] = grading[field];
    console.log("Setting the image's points "+ field + " to "+grading[field]);
  }

  // For now, assume this means the grading is done
  if (grading["sufacePoints"]) {
    nextImage(user);
  }

  user.save(function(err) {
    if (err) throw err;
    console.log("Saved the updated grading");
  });
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
