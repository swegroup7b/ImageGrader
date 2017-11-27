(function () {
  'use strict';

  angular
    .module('grader')
    .controller('UploadController', UploadController);


    UploadController.$inject = ['$scope', '$state', '$http', 'FileUploader'];

    function UploadController($scope, $state, $http, FileUploader) {
      var vm = this;

      var uploader = $scope.uploader = new FileUploader({
        url: '/api/grader/upload'
      });

      // FILTERS

      // a sync filter
      uploader.filters.push({
          name: 'syncFilter',
          fn: function(item /*{File|FileLikeObject}*/, options) {
              console.log('syncFilter');
              return this.queue.length < 250;
          }
      });

      // an async filter
      uploader.filters.push({
          name: 'asyncFilter',
          fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
              console.log('asyncFilter');
              setTimeout(deferred.resolve, 1e3);
          }
      });

      // CALLBACKS

      uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
          console.info('onWhenAddingFileFailed', item, filter, options);
      };
      uploader.onAfterAddingFile = function(fileItem) {
          console.info('onAfterAddingFile', fileItem);
      };
      uploader.onAfterAddingAll = function(addedFileItems) {
          console.info('onAfterAddingAll', addedFileItems);
          $http({
            method: 'GET',
            url: '/api/grader/newSession'
          }).then(function successCallback(response) {
              console.log("Created new session");
            }, function errorCallback(err) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              throw err;
            });
      };
      uploader.onBeforeUploadItem = function(item) {
          console.info('onBeforeUploadItem', item);
      };
      uploader.onProgressItem = function(fileItem, progress) {
          console.info('onProgressItem', fileItem, progress);
      };
      uploader.onProgressAll = function(progress) {
          console.info('onProgressAll', progress);
      };
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
          console.info('1 onSuccessItem', fileItem, response, status, headers);
      };
      uploader.onErrorItem = function(fileItem, response, status, headers) {
          console.info('onErrorItem', fileItem, response, status, headers);
      };
      uploader.onCancelItem = function(fileItem, response, status, headers) {
          console.info('onCancelItem', fileItem, response, status, headers);
      };
      uploader.onCompleteItem = function(fileItem, response, status, headers) {
          console.info('onCompleteItem', fileItem, response, status, headers);
      };
      uploader.onCompleteAll = function() {
          console.info('2 onCompleteAll');
          $http({
            method: 'GET',
            url: '/api/grader/doneUploading'
          }).then(function successCallback(response) {
              $state.go('grader.annotate');
            }, function errorCallback(err) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              throw err;
            });
      };

      console.info('uploader', uploader);
    }

}());
