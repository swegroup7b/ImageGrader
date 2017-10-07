(function () {
  'use strict';

  angular
    .module('training')
    .controller('TrainingController', TrainingController);

  TrainingController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function TrainingController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;

  }
}());
