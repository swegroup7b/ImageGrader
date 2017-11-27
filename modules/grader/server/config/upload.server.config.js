'use strict';

/**
 * Module dependencies
 */
var bb = require('express-busboy');

/**
 * Module init function
 */
module.exports = function (app) {
  bb.extend(app, {
    upload: true,
    path: 'public/uploaded-images',
    allowedPath: /./
  });
};
