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
        abstract: true,
        url: '/training',
        template: '<ui-view/>'
      })
      .state('training.example', {
        url: '',
        templateUrl: '/modules/training/client/views/training.client.view.html',
        controller: 'TrainingController',
        controllerAs: 'vm'
      })
      .state('training.interactive', {
        url: '',
        templateUrl: '/modules/training/client/views/interactive-training.client.view.html',
        controller: 'TrainingController',
        controllerAs: 'vm'
      });
  }
}());
