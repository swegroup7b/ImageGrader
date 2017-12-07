(function () {
  'use strict';

  angular
    .module('training')
    .controller('TrainingController', TrainingController);


  function TrainingController($scope, $state, GraderService) {
    var vm = this;

    $scope.currentAnnotation = 0;

    //Go back to the previous grading step
    $scope.goBack = function() {
      $scope.currentAnnotation -= 1;
      $scope.on.step--;
      $scope.annotations[$scope.on.step] = new GraderService.Annotation($scope.on.step);
      $scope.redraw();
    };

    //Move on to the next grading step
    $scope.goNext = function() {
      $scope.currentAnnotation += 1;
      $scope.on.step++;
    };

    //Restarts the grading from the first step
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

    //Sets the image used by the grader on the training page
    $scope.on = {
      url: "public/modules/training/client/img/grader/D4_KDA_1.jpg",
      step: 0
    };

    //Adds the grading steps to the training page from the grader module
    $scope.annotations = []
    var annotationSteps = GraderService.annotationSteps();
    for (var i = 0; i < annotationSteps.length; i++) {
      $scope.annotations.push(new GraderService.Annotation(i));
    }

    //Moves on to the next grading step and saves the annotation
    $scope.onAnnotationEnd = function() {
      $scope.goNext();
      $scope.$apply();
    }

    // Called by the directive when the user tries to clear the current annotation
    $scope.resetAnnotation = function() {
      var ann = $scope.annotations[$scope.on.step];
      ann.clear();
    };

    $scope.updateStatus = function (){
      var vm = $scope;
      var ann = vm.annotations[vm.on.step];
      var annotationSteps = GraderService.annotationSteps();

      if (!ann) {
        vm.status = 'Finished grading the image';
      }
      if (ann.pointX.length && ann.type == 'polyline') {
        vm.status = 'Hold control to mark the end of the polyline.';
      }
      else if (ann.type == 'polyline') {
        vm.status = 'Draw a polyline to mark the '+ann.niceName;
      }
      else if (ann.type == 'line' && !ann.pointX.length) {
        vm.status = 'Draw a line to mark the '+ann.niceName;
      }
      else if (ann.pointX.length) {
        vm.status = 'Press backspace to clear.';
      }
      else {
        vm.status = "";
      }
    };

    $scope.updateStatus();


  }

}());
