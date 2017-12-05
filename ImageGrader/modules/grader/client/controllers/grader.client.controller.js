(function () {
  'use strict';

  angular
    .module('grader')
    .controller('GraderController', GraderController);

  function GraderController($scope, $state, GraderService, currentImage) {
    var vm = $scope;
    var annotationSteps = vm.annotationSteps = GraderService.annotationSteps();
    if (currentImage && currentImage.url) {
      currentImage.url = currentImage.url.substring(6);
      console.log(currentImage);
      vm.on = currentImage;
      vm.on.step = 0;
      vm.annotations = [new GraderService.Annotation(vm.on.step)];
    } else {
      vm.finished = true;
    }

    GraderService.getCurrentSessionIndex().then(function(result) {
      vm.currentSessionIndex = result;
    });

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

    vm.setSessionIndex = function() {
      GraderService.setSessionIndex(vm.currentSessionIndex);
      GraderService.setTransHistory(false);
    };

    // This function is called by the grading directive whenever
    // the user has inputted a new annotation
    vm.addAnnotation = function(callback)  {
      console.log("Finishing Step "+vm.on.step);
      // Update the server with the image's grading
      if (vm.on.step == annotationSteps.length - 1) {
        GraderService.submitGrading(vm.annotations)
          .then(GraderService.getImage)
          .then(function(result) {
            if (result) {
              // there was a new image to fetch
              vm.on = result;
              vm.on.step = 0;

              // reset the annotations
              vm.annotations = [new GraderService.Annotation(0)];
            } else {
              // we're done grading images
              vm.finished = true;
            }
            // the user has completed one more image
            vm.numCompleted++;
          });
      } else {
        // Go to the next annotation
        vm.on.step = (1 + vm.on.step) % annotationSteps.length;
        vm.annotations.push(new GraderService.Annotation(vm.on.step));
        vm.$apply();
      }
      if (callback) {
        callback();
      }
    }
  }
}());
