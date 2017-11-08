(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('grader.routes')
    .factory('GraderService', GraderService);
  GraderService.$inject = ['$http'];

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
            console.log(response);
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
            console.log("Num images");
            console.log(response);
            return response.data.result;
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
            return response.data.result;
          }, function errorCallback(err) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            throw err;
          });
      },
      submitAnnotation: function(annotation) {
        var points = {};
        points[annotation.name] = [];
        for (var i = 0; i < annotation.pointX.length; i++) {
          points[annotation.name].push([
            annotation.pointX[i],
            annotation.pointY[i]
          ]);
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
      type: "line"
    },
    {
      name: "plateauPoints",
      color: "#50ff00",
      type: "polygon"
    },
    {
      name: "lesionBorderPoints",
      color: "#50ff00",
      type: "line"
    },
    {
      name: "lesionSurfacePoints",
      color: "#50ff00",
      type: "polygon"
    },
    {
      name: "interfacePoints",
      color: "#50ff00",
      type: "line"
    },
    {
      name: "sufacePoints",
      color: "#50ff00",
      type: "polygon"
    },
  ];
}());
