(function () {
  'use strict';

  angular
    .module('grader')
    .controller('ResultsController', ResultsController);

    ResultsController.$inject = ['$scope', '$state', '$filter', '$http', 'GraderService'];

    function ResultsController($scope, $state, $filter, $http, GraderService) {
      var vm = $scope;
      vm.state = $state.is('grader.history.results');
      vm.buildPager = buildPager;
      vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
      vm.pageChanged = pageChanged;

      GraderService.getSession().then(function(result) {
        vm.sessionIndex = getSessionIndex();
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

      function getSessionIndex() {
        var url = window.location.pathname;
        url = url.substr(url.lastIndexOf('/') + 1);
        return url;
      }
    }
}());
