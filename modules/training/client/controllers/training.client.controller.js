(function () {
  'use strict';

  angular
    .module('training')
    .controller('TrainingController', TrainingController);


  function TrainingController($scope, $state, GraderService) {
    var vm = this;

    $scope.currentAnnotation = 0;

    $scope.goBack = function() {
      $scope.currentAnnotation -= 1;
      $scope.on.step--;
      $scope.annotations[$scope.on.step] = new GraderService.Annotation($scope.on.step);
      $scope.redraw();
    };

    $scope.goNext = function() {
      $scope.currentAnnotation += 1;
      $scope.on.step++;
    };

    $scope.goFirst = function() {
      $scope.currentAnnotation = 0;
      $scope.on.step = 0;
      $scope.annotations = []
      var annotationSteps = GraderService.annotationSteps();
      for (var i = 0; i < annotationSteps.length; i++) {
        $scope.annotations.push(new GraderService.Annotation(i));
      }
      $scope.redraw();
    };

    $scope.on = {
      url: "public/modules/training/client/img/grader/D4_KDA_1.jpg",
      step: 0
    };

    $scope.annotations = []
    var annotationSteps = GraderService.annotationSteps();
    for (var i = 0; i < annotationSteps.length; i++) {
      $scope.annotations.push(new GraderService.Annotation(i));
    }

    $scope.addAnnotation = function() {
      $scope.goNext();
      $scope.$apply();
    }

  }

}());
