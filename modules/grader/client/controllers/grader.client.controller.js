(function () {
  'use strict';

  angular
    .module('grader')
    .controller('GraderController', GraderController);

  function GraderController($scope, $state, GraderService, currentImage) {
    var vm = $scope;

    vm.on = currentImage;
    vm.annotationSteps = GraderService.annotationSteps();
    vm.annotations = [new GraderService.Annotation(
                        vm.annotationSteps[vm.on.step])];
    vm.numImages = GraderService.numImages();
    vm.numCompleted = GraderService.numCompleted();

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
      vm.on.step = (1 + vm.on.step) % vm.annotationSteps.length;
      vm.annotations.push(new GraderService.Annotation(
                          vm.annotationSteps[vm.on.step]));
      if (vm.on.step == 0) {
        vm.on = GraderService.getImage();
        vm.annotations = [new GraderService.Annotation(
                            vm.annotationSteps[vm.on.step])];
        vm.numImages = GraderService.numImages();
        vm.numCompleted = GraderService.numCompleted();
      }
      vm.redraw();
      vm.$apply()
    };

    //vm.loadImage('/modules/grader/client/img/D4_KDA_5.jpg');
  }
}());
