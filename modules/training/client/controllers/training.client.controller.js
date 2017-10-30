(function () {
  'use strict';

  angular
    .module('training')
    .controller('TrainingController', TrainingController);

  TrainingController.$inject = ['$scope', '$state'];

  function TrainingController($scope, $state) {
    var vm = this;
 
    $scope.currentAnnotation = 0;
 
    $scope.goBack = function(){
    
    	$scope.currentAnnotation -= 1;
    
    };
 
    $scope.goNext = function(){

    	$scope.currentAnnotation += 1;
    
    };
  
  }

}());