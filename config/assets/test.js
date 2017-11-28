'use strict';

module.exports = {
  tests: {
    client: ['modules/*/tests/client/authentication.client.controller.tests.js',
      'modules/*/tests/client/password.client.controller.tests.js'],
    server: ['modules/*/tests/server/user.server.model.tests.js',
      'modules/*/tests/server/user.server.routes.tests.js',
      'modules/*/tests/server/algorithms.controller.tests.js'], //['modules/*/tests/server/**/*.js'],
    e2e: [] //['modules/*/tests/e2e/**/*.js']
  }
};
