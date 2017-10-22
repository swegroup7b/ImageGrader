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
    path: 'uploaded-images',     //eventually will be google drive (possiblu)
    allowedPath: /./
  });

};
