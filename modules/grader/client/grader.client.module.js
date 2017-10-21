(function (app) {
  'use strict';

  app.registerModule('grader', ['angularFileUpload']); //['angularFileUpload']
  app.registerModule('grader.routes', ['ui.router', 'core.routes']);
  app.registerModule('grader.services');

}(ApplicationConfiguration));
