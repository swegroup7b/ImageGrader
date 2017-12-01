(function () {
  'use strict';

  angular
    .module('training')
    .controller('TrainingController', TrainingController);

  TrainingController.$inject = ['$scope', '$state'];

  function TrainingController($scope, $state) {
    var vm = this;
    $scope.currentAnnotation = 0;
    $scope.goBack = function() {
      $scope.currentAnnotation -= 1;
    };
    $scope.goNext = function() {
      $scope.currentAnnotation += 1;
    };
    $scope.goFirst = function() {
      $scope.currentAnnotation = 0;
    };
    $scope.on = {
      url: "public/modules/training/client/img/grader/D4_KDA_1.jpg"
    };

  }

}());
