(function () {
  'use strict';

  angular
    .module('grader')
    .controller('GraderController', GraderController);

  function GraderController($scope, $state, GraderService, currentImage) {
    var vm = $scope;
    var annotationSteps = vm.annotationSteps = GraderService.annotationSteps();
    vm.on = currentImage;
    vm.on.step = 0;
    vm.annotations = [new GraderService.Annotation(vm.on.step)];
    GraderService.numImages().then(function(result) {
      vm.numImages = result;
    });
    GraderService.numCompleted().then(function(result) {
      vm.numCompleted = result;
    });

    vm.resetAnnotation = function() {
      var ann = vm.annotations[vm.on.step];
      ann.clear();
    };

    vm.goBack = function() {
      if (vm.on.step > 0) {
        vm.annotations.pop();
        vm.on.step--;
        vm.annotations[vm.on.step].clear();
        vm.redraw();
      }
    };

    vm.finishAnnotation = function() {
      console.log("Finishing Step "+vm.on.step);
      // Update the server
      GraderService.submitAnnotation(vm.annotations[vm.on.step]).then(function() {
        if (vm.on.step == annotationSteps.length - 1) {
          // If this was the last annotation, fetch a new image from the server
          GraderService.getImage().then(function(result) {
            vm.on = result;
            vm.on.step = 0;
            // reset the annotations
            vm.annotations = [new GraderService.Annotation(vm.on.step)];
            vm.numImages = GraderService.numImages();
            vm.numCompleted++;
            console.log(vm.on);
          });
        } else {
          // Go to the next annotation
          vm.on.step = (1 + vm.on.step) % annotationSteps.length;
          vm.annotations.push(new GraderService.Annotation(vm.on.step));
        }
        GraderService.numImages().then(function(result) {
          vm.numImages = result;
        });      GraderService.numCompleted().then(function(result) {
          vm.numCompleted = result;
        });
        vm.redraw();
        //vm.$apply();
      });
    };
  }
}());
