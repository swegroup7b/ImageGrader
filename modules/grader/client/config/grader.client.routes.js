(function () {
  'use strict';

  // Setting up route
  angular
    .module('grader.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function routeConfig($stateProvider, $urlRouterProvider) {
    // Grader state routing
    $stateProvider
      .state('grader', {
        abstract: true,
        url: '/grader',
        template: '<ui-view/>'
      })
      .state('grader.upload', {
        url: '/upload',
        templateUrl: '/modules/grader/client/views/upload-grader.client.view.html',
        controller: 'GraderController',
        controllerAs: 'vm'
      })
      .state('grader.annotator', {
        url: '/annotate',
        templateUrl: '/modules/grader/client/views/annotator-grader.client.view.html',
        controller: 'GraderController',
        controllerAs: 'vm'
      })
      .state('grader.results', {
        url: '/results',
        templateUrl: '/modules/grader/client/views/results-grader.client.view.html',
        controller: 'GraderController',
        controllerAs: 'vm'
      });

      $urlRouterProvider
        .when('/grader', '/grader/annotate');
  }
}());
