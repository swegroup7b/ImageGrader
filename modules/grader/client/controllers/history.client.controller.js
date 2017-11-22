(function () {
  'use strict';

  angular
    .module('grader')
    .controller('HistoryController', HistoryController);

    function HistoryController($scope, $state, $http, GraderService) {
      var vm = $scope;

      GraderService.getSession().then(function(result) {
        vm.allSessions = result;
      });

      vm.setSessionIndex = function(index) {
        GraderService.setSessionIndex(index);
      };
    }
}());
