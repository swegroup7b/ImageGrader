(function () {
  'use strict';

  angular
    .module('grader')
    .controller('GraderController', GraderController);

  GraderController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function GraderController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;

  }
}());
