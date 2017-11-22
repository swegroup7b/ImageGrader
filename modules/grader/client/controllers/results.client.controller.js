(function () {
  'use strict';

  angular
    .module('grader')
    .controller('ResultsController', ResultsController);

    function ResultsController($scope, $state, $http, GraderService) {
      var vm = $scope;
      vm.sessionIndex = GraderService.getSessionIndex();
      GraderService.getSession().then(function(result) {
        vm.allSessions = result;
      });
    }
}());
