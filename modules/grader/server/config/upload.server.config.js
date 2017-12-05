'use strict';

/**
 * Module dependencies
 */
var bb = require('express-busboy');

/*this uses the busboy module to download the images
into the public/uploaded-images folder*/
module.exports = function (app) {
  bb.extend(app, {
    upload: true,
    path: 'public/uploaded-images',
    allowedPath: /./
  });
};
