(function () {
  'use strict';

  // Setting up route
  angular
    .module('training.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Training state routing
    $stateProvider
      .state('training', {
        url: '/training',
        templateUrl: '/modules/training/client/views/training.client.view.html',
        controller: 'TrainingController',
        controllerAs: 'vm'
      })
  }
}());
