(function () {
  'use strict';

  angular
    .module('grader')
    .controller('ResultsController', ResultsController);

    ResultsController.$inject = ['$scope', '$state', '$filter', '$http', 'GraderService'];

    function ResultsController($scope, $state, $filter, $http, GraderService) {
      var vm = $scope;
      vm.sessionIndex = GraderService.getSessionIndex();
      vm.buildPager = buildPager;
      vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
      vm.pageChanged = pageChanged;

      GraderService.getSession().then(function(result) {
        vm.images = result[vm.sessionIndex].images;
        vm.buildPager();
      });

      function buildPager() {
        vm.pagedItems = [];
        vm.itemsPerPage = 7;
        vm.currentPage = 1;
        vm.figureOutItemsToDisplay();
      }

      function figureOutItemsToDisplay() {
        vm.filteredItems = $filter('filter')(vm.images, {
          $: vm.search
        });
        vm.filterLength = vm.filteredItems.length;
        var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
        var end = begin + vm.itemsPerPage;
        vm.pagedItems = vm.filteredItems.slice(begin, end);
      }

      function pageChanged() {
        vm.figureOutItemsToDisplay();
      }
    }
}());
