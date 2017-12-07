(function () {
  'use strict';

  angular
    .module('grader')
    .controller('GraderController', GraderController);

  function GraderController($scope, $state, GraderService, currentImage) {
    var vm = $scope;
    var annotationSteps = vm.annotationSteps = GraderService.annotationSteps();

    // Controller methods aren't defined inline
    vm.updateStatus = updateStatus;
    vm.advanceAnnotation = advanceAnnotation;

    // If we have an image, grade it
    if (currentImage && currentImage.url) {
      console.log(currentImage);
      vm.on = currentImage;
      vm.on.step = 0;
      vm.annotations = [];
      for (var i = 0; i < annotationSteps.length; i++) {
        vm.annotations.push(new GraderService.Annotation(i));
      }
      updateStatus();
    } else {
      // Otherwise display the stuff about viewing results
      vm.finished = true;
    }

    // Retrieve the current image index from most recent session
    GraderService.getCurrentSessionIndex().then(function(result) {
      vm.currentSessionIndex = result;
    });

    GraderService.numImages().then(function(result) {
      vm.numImages = result;
    });

    GraderService.numCompleted().then(function(result) {
      vm.numCompleted = result;
    });

    // Method for going back to the last step and clearing it
    vm.goBack = function() {
      // Find the most recent skip step, and undo the skip if it brought us to
      // the current step.
      for (var i = vm.on.step-1; i >= 0; i--) {
        if (annotationSteps[i].skipNum) {
          // Did this skip step bring us here?
          console.log("i: "+i+" skip: "+annotationSteps[i].skipNum+" this:"+vm.on.step);
          if (annotationSteps[i].skipNum > 1 && annotationSteps[i].skipNum + i == vm.on.step && vm.annotations[i].pointX.length == 0) {
            vm.on.step -= annotationSteps[i].skipNum;
            vm.resetAnnotation();
            vm.redraw();
            vm.updateStatus();
            return;
          }
          break;
        }
      }

      if (vm.on.step > 0) {
        vm.on.step--;
        vm.resetAnnotation();
        vm.redraw();
        vm.updateStatus();
      }
    };

    // Called by the directive when the user tries to clear the current annotation
    vm.resetAnnotation = function() {
      var ann = vm.annotations[vm.on.step];
      ann.clear();
    };

    // Called by the directive when the user tries to skip an annotation
    vm.skipAnnotations = function(skipNum) {
      if (vm.on.step + skipNum >= annotationSteps.length) {
        finishImage();
      } else {
        // Add 'skipNum' blank annotations
        for (var i = 0; i < skipNum; i++) {
          vm.on.step = (1 + vm.on.step) % annotationSteps.length;
          vm.annotations[vm.on.step] = new GraderService.Annotation(vm.on.step);
        }
        vm.updateStatus();
        vm.$apply();
      }
    }

    // Called by the grading directive whenever the user has inputted a
    // new annotation
    vm.onAnnotationEnd = function(callback)  {
      console.log("Finishing Step "+vm.on.step);
      // Update the server with the image's grading
      if (vm.on.step == annotationSteps.length - 1) {
        finishImage();
      } else {
        advanceAnnotation();
      }
      if (callback) {
        callback();
      }
    }

    function updateStatus() {
      var ann = vm.annotations[vm.on.step];
      if (!ann.pointX.length && ann.skipNum) {
        vm.status = 'Control-click to skip if no ' + ann.niceName+ ' present.';
      }
      else if (ann.pointX.length && ann.type == 'polyline') {
        vm.status = 'Hold control to mark the end of the '+ann.niceName;
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
    }

    function advanceAnnotation() {
      // Go to the next annotation
      vm.on.step = (1 + vm.on.step) % annotationSteps.length;
      vm.updateStatus();
      vm.$apply();
    }

    function finishImage() {
      GraderService.submitGrading(vm.annotations)
        .then(GraderService.getImage)
        .then(function(result) {
          if (result) {
            // there was a new image to fetch
            vm.on = result;
            vm.on.step = 0;

            // reset the annotations
            vm.annotations = [];
            for (var i = 0; i < annotationSteps.length; i++) {
              vm.annotations.push(new GraderService.Annotation(i));
            }
          } else {
            // we're done grading images
            vm.finished = true;
          }
          // the user has completed one more image
          vm.numCompleted++;
          vm.updateStatus();
        });
    }
  }
}());
