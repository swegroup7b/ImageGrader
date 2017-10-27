(function () {
  'use strict';


  // Users service used for communicating with the users REST endpoint
  angular
    .module('grader.routes')
    .factory('GraderService', GraderService);
  GraderService.$inject = ['$http'];

  var index = 0;
  var images = [
    {
      id: '1010',
      url: '/modules/grader/client/img/D4_KDA_3.jpg',
      step: 0
    },
    {
      id: '2010',
      url: '/modules/grader/client/img/D4_KDA_4.jpg',
      step: 0
    },
    {
      id: '2310',
      url: '/modules/grader/client/img/D4_KDA_5.jpg',
      step: 0
    }
  ];

  function GraderService($http) {
    var service = {
      Annotation: Annotation,
      getImage: function() {
        // Replace this with an http requeset
        console.log("Inside GraderService");
        index = (index + 1) % images.length;
        return images[index];
      },
      numImages: function() {
        return images.length;
      },
      numCompleted: function() {
        return index;
      },
      annotationSteps: function() {
        return [
          {
            name: "Fibial Palate",
            color: "#ff0000",
            type: "polygon"
          },
          {
            name: "Ulner Thinga",
            color: "#50ff00",
            type: "line"
          }
        ]

      },
      submitAnnotation: function(id, points) {
        // Do some http request to submit annotation for the image
        console.log("Submitting annotation");
      },
    };

    return service;
  }

  function Annotation(step) {
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
}());
