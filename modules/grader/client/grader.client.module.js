(function (app) {
  'use strict';

  app.registerModule('grader');
  app.registerModule('grader.routes', ['ui.router', 'core.routes']);
  app.registerModule('grader.services');
}(ApplicationConfiguration));
