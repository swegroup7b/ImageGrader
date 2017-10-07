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
      .state('tutorial', {
        url: '/tutorial',
        templateUrl: '/modules/training/client/views/start-training.client.view.html',
        controller: 'TrainingController',
        controllerAs: 'vm'
      })
      .state('imageset', {
        url: '/imageset',
        templateUrl: '/modules/training/client/views/imageset-training.client.view.html',
        controller: 'TrainingController',
        controllerAs: 'vm'
      });
  }
}());
