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
        controller: 'UploadController',
        controllerAs: 'vm'
      })
      .state('grader.annotate', {
        url: '/annotate',
        templateUrl: '/modules/grader/client/views/annotator-grader.client.view.html',
        controller: 'GraderController',
        controllerAs: 'vm',
        resolve: {
          currentImage: function(GraderService) {
            console.log("Resolving currentImage");
            return GraderService.getImage();
          }
        }
      })
      .state('grader.results', {
        url: '/results/:id',
        templateUrl: '/modules/grader/client/views/results-grader.client.view.html',
        controller: 'ResultsController',
        controllerAs: 'vm'
      })
      .state('grader.history', {
        abstract: true,
        url: '/history',
        template: '<ui-view/>'
      })
      .state('grader.history.list', {
        url: '/list',
        templateUrl: '/modules/grader/client/views/history-grader.client.view.html',
        controller: 'HistoryController',
        controllerAs: 'vm'
      })
      .state('grader.history.results', {
        url: '/results/:id',
        templateUrl: '/modules/grader/client/views/results-grader.client.view.html',
        controller: 'ResultsController',
        controllerAs: 'vm'
      });

      $urlRouterProvider
        .when('/grader', '/grader/annotate');
  }
}());
