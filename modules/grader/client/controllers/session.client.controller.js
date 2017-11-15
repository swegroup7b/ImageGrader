(function () {
  'use strict';

  angular
    .module('grader')
    .controller('SessionController', SessionController);

    function SessionController($scope, $state, $http, GraderService) {
      var vm = $scope;

      GraderService.getSession().then(function(result) {
        vm.allSessions = result;
      });
      GraderService.getCurrentSessionIndex().then(function(result) {
        vm.currentSessionIndex = result;
      });
    }
}());
