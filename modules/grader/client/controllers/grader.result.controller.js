(function () {
  'use strict';

  angular
    .module('grader')
    .controller('ResultController', ResultController);

    function ResultController($scope, $state, $http, GraderService) {
      var vm = $scope;

      GraderService.getSession().then(function(result) {
        vm.allSessions = result;
      });
      GraderService.getCurrentSessionIndex().then(function(result) {
        vm.currentSessionIndex = result;
      });
    }
}());
