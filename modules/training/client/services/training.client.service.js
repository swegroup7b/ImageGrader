(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('training.services')
    .factory('TrainingService', TrainingService);

  TrainingService.$inject = ['$resource'];

  function TrainingService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      }
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      removeSocialAccount: function (provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function (credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function (token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      userSignup: function (credentials) {
        return this.signup(credentials).$promise;
      },
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      }
    });

    return Users;
  }

  // TODO this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    return $resource('/api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  var annotationSteps = [
    {
      name: "osteophytePoints",
      niceName: "Osteophyte Region",
      color: "#1b9e77",
      highlightColor: "#ff33ff",
      type: "polyline"
    },
    {
      name: "plateauPoints",
      niceName: "Plateau Span",
      color: "#d95f02",
      type: "line"
    },
    {
      name: "lesionBorderPoints",
      niceName: "Lesion Border",
      color: "#7570b3",
      type: "polyline",
      highlightColor: "#ff33ff"
    },
    {
      name: "lesionSurfacePoints",
      niceName: "Lesion Surface Span",
      color: "#e7298a",
      type: "line"
    },
    {
      name: "interfacePoints",
      color: "#66a61e",
      type: "polyline",
      niceName: "Cartilage Interface",
      highlightColor: "#ff33ff"
    },
    {
      name: "surfacePoints",
      niceName: "Cartilage Surface",
      color: "#e6ab02",
      type: "polyline",
      highlightColor: "#ff33ff"
    }
  ];
}());
