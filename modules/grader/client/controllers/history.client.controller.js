(function () {
  'use strict';

  angular
    .module('grader')
    .controller('HistoryController', HistoryController);

  HistoryController.$inject = ['$scope', '$state', '$filter', '$http', 'GraderService'];

  function HistoryController($scope, $state, $filter, $http, GraderService) {
    var vm = $scope;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    GraderService.getSession().then(function(result) {
      vm.allSessions = result;
      vm.buildPager();
    });

    vm.setSessionIndex = function(index) {
      GraderService.setSessionIndex(index);
      GraderService.setTransHistory(true);
    };

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 6;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.allSessions, {
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
