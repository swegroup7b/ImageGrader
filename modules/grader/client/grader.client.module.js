(function (app) {
  'use strict';

  app.registerModule('grader');
  app.registerModule('grader.services');
  app.registerModule('grader.routes', ['ui.router', 'core.routes', 'grader.services']);
}(ApplicationConfiguration));
