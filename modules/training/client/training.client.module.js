(function (app) {
  'use strict';

  app.registerModule('training');
  app.registerModule('training.routes', ['ui.router', 'core.routes']);
  app.registerModule('training.services');
}(ApplicationConfiguration));
