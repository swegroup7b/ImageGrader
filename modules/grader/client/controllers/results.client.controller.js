(function () {
  'use strict';

  angular
    .module('grader')
    .controller('ResultsController', ResultsController);

    function ResultsController($scope, $state, $http, GraderService) {
      var vm = $scope;

      GraderService.getSession().then(function(result) {
        vm.allSessions = result;
      });
      GraderService.getCurrentSessionIndex().then(function(result) {
        vm.currentSessionIndex = result;
      });
    }
}());
