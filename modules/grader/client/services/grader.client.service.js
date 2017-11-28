(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('grader.routes')
    .factory('GraderService', GraderService);
  GraderService.$inject = ['$http', '$state'];

  function Annotation(stepNumber) {
    console.log("Creating annotation number: "+stepNumber);
    var step = annotationSteps[stepNumber];
    this.name = step.name;
    this.pointX = [];
    this.pointY = [];
    this.annotationType = step.type;
    this.strokeColor = step.color || "#ff0000";
    this.strokeWidth = step.width || 2;

    this.addPoint = function(x, y) {
      this.pointX.push(x);
      this.pointY.push(y);
    };

    this.clear = function() {
      this.pointX = [];
      this.pointY = [];
    };
  }

  function GraderService($http) {
    var service = {
      Annotation: Annotation,
      getImage: function() {
        // Replace this with an http requeset
        return $http({
          method: 'GET',
          url: '/api/grader/getImage'
        }).then(function successCallback(response) {
            return response.data;
          }, function errorCallback(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            throw err;
          });
      },
      getSession: function() {
        // Replace this with an http requeset
        return $http({
          method: 'GET',
          url: '/api/grader/getSession'
        }).then(function successCallback(response) {
            console.log("Current session array");
            console.log(response);
            return response.data;
          }, function errorCallback(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            throw err;
          });
      },
      getCurrentSessionIndex: function() {
        // Replace this with an http request
        return $http({
          method: 'GET',
          url: '/api/grader/getCurrentSessionIndex'
        }).then(function successCallback(response) {
            console.log("Current session index is" + response);
            return response.data;
          }, function errorCallback(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            throw err;
          });
      },
      numImages: function() {
        return $http({
          method: 'GET',
          url: '/api/grader/totalImages'
        }).then(function successCallback(response) {
            return Math.max(0, response.data.result);
          }, function errorCallback(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            throw err;
          });
      },
      numCompleted: function() {
        return $http({
          method: 'GET',
          url: '/api/grader/currentImage'
        }).then(function successCallback(response) {
            return Math.max(0, response.data.result);
          }, function errorCallback(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            throw err;
          });
      },
      submitGrading: function(annotations) {
        var points = {};
        for (var i = 0; i < annotations.length; i++) {
          var annotation = annotations[i];
          points[annotation.name] = [];
          for (var j = 0; j < annotation.pointX.length; j++) {
            points[annotation.name].push([
              annotation.pointX[j],
              annotation.pointY[j]
            ]);
          }
        }
        return $http.post('/api/grader/grade', {
          points: points
        }, {}).then(
          function successCallback(response) {
            return response.data;
          },
          function errorCallback(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert("Internal error");
            location.reload();
            throw err;
          });
      },
      annotationSteps: function() {
        return annotationSteps;
      }
    };
    return service;
  }

  var annotationSteps = [
    {
      name: "osteophytePoints",
      color: "#ff0000",
      type: "polygon"
    },
    {
      name: "plateauPoints",
      color: "#50ff00",
      type: "line"
    },
    {
      name: "lesionBorderPoints",
      color: "#50ff00",
      type: "polygon"
    },
    {
      name: "lesionSurfacePoints",
      color: "#50ff00",
      type: "line"
    },
    {
      name: "interfacePoints",
      color: "#50ff00",
      type: "polygon"
    },
    {
      name: "surfacePoints",
      color: "#50ff00",
      type: "polygon"
    },
  ];
}());
