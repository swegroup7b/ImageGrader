(function () {
  'use strict';

  angular
    .module('grader')
    .controller('ResultController', ResultController);

    //ResultController.$inject = ['$scope', '$state', '$http', 'GraderService'];

    function ResultController($scope, $state, $http, GraderService) {
      var vm = $scope;
      GraderService.getSession().then(function(result) {
        console.log("grader.result.controller: " + result[0].images[0].name);
        vm.session = result;
      });
    }
}());
