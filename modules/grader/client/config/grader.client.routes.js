(function () {
  'use strict';

  // Setting up route
  angular
    .module('grader.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Grader state routing
    $stateProvider
      .state('grader', {
        abstract: true,
        url: '/grader',
        template: '<ui-view/>'
      })
      .state('grader.upload', {
        url: '',
        templateUrl: '/modules/grader/client/views/upload-grader.client.view.html',
        controller: 'GraderController',
        controllerAs: 'vm'
      })
      .state('grader.annotater', {
        url: '',
        templateUrl: '/modules/grader/client/views/annotater-grader.client.view.html',
        controller: 'GraderController',
        controllerAs: 'vm'
      })
      .state('grader.results', {
        url: '',
        templateUrl: '/modules/grader/client/views/results-grader.client.view.html',
        controller: 'GraderController',
        controllerAs: 'vm'
      });
  }
}());
