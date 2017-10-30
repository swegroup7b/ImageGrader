(function () {
  'use strict';

  angular
    .module('users')
    .directive('passwordValidator', passwordValidator);

  passwordValidator.$inject = ['PasswordValidator'];

  function passwordValidator(PasswordValidator) {
    var directive = {
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ngModel) {
      ngModel.$validators.requirements = function (password) {
        var status = true;
        if (password) {
          var result = PasswordValidator.getResult(password);

          // Requirements Meter - visual indicator for users
          var requirementsMeter = {
            invalid: '0',
            valid: '100',
            invalidColor: 'danger',
            validColor: 'success'
          };

          if (result.requiredTestErrors.length) {
            scope.getPopoverMsg = PasswordValidator.getPopoverMsg();
            scope.passwordErrors = result.requiredTestErrors;
            scope.requirementsProgress = requirementsMeter.invalid;
            scope.requirementsColor = requirementsMeter.invalidColor;
            scope.requirementsDone = '';
            status = false;
          } else {
            scope.getPopoverMsg = '';
            scope.passwordErrors = [];
            scope.requirementsProgress = requirementsMeter.valid;
            scope.requirementsColor = requirementsMeter.validColor;
            scope.requirementsDone = 'Valid';
            status = true;
          }
        }
        return status;
      };
    }
  }
}());
