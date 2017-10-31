angular.module('grader').controller('resultController', ['$scope', 'Listings', 

  function($scope, Listings) {
    console.log("Loading the controller");
    $scope.results = Listings;
    $scope.detailedInfo = undefined;
     $scope.searchListing = function(input){
    };
    $scope.showResults = function(index){
     $scope.results = $scope.listings[index];
     console.log("results");
    };
  }
]);