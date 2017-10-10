(function () {
  'use strict';

  // Users directive used to force lowercase input
  angular
    .module('grader')
    .directive('annotator', ['$document', annotator]);

  function annotator($document) {
    var directive = {
      replace: false,
      link: link
    };

    return directive;

    function Annotation(type) {
      this.pointX = [];
      this.pointY = [];
      this.annotationType = type;
      this.strokeColor = "#df4b26";
      this.strokeWidth = 2;

      this.addPoint = function(x, y) {
        this.pointX.push(x);
        this.pointY.push(y);
      }
    }

    function link(scope, elem, attrs, modelCtrl) {
      var domElement = elem[0];

      var context =  domElement.getContext("2d");
      var offsetTop = domElement.getBoundingClientRect().top;
      var offsetLeft = domElement.getBoundingClientRect().left;

      var annotations = new Array();
      annotations.push(new Annotation("polygon"))
      scope.currentAnnotation = 0;

      var mouseX;
      var mouseY;
      var mouseDown; // bool

      var mImage = new Image();
      mImage.src = '/modules/grader/client/img/D4_KDA_5.jpg';
      elem.addClass("annotator");

      angular.element(mImage).on('load', function() {
        onReady();
      });

      function onReady() {
        redraw();
      }

      scope.goBack = function() {
        if (scope.currentAnnotation > 0) {
          annotations.pop();
          scope.currentAnnotation--;
          annotations[scope.currentAnnotation].pointX = [];
          annotations[scope.currentAnnotation].pointY = [];
          redraw();
        }
      }

      //scope.clearAnnotation = clearAnnotation;
      //scope.newAnnotation = newAnnotation;

      function resetAnnotation() {
        var ann = annotations[scope.currentAnnotation];
        ann.pointX = [];
        ann.pointY = [];
      }

      function finishAnnotation() {
        annotations.push(new Annotation("polygon"));
        scope.currentAnnotation += 1;
        scope.$apply();
      };

      // If this polygon is being drawn interactively, show a line to
      // the current mouse position.
      function drawPolygon(pointX, pointY, mouseX, mouseY) {
        context.beginPath();
        context.moveTo(pointX[0], pointY[0]);
        for (var i = 1; i < pointX.length; i++) {
          context.lineTo(pointX[i], pointY[i]);
          context.moveTo(pointX[i], pointY[i]);
        }
        if (typeof mouseX !== 'undefined') {
          context.lineTo(mouseX, mouseY);
        }
        context.closePath();
        context.stroke();
      }

      function redraw(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        context.drawImage(mImage, 0, 0, mImage.width, mImage.height);

        for (var i = 0; i < annotations.length; i++) {
          var annotation = annotations[i];
          if (annotation.pointX.length == 0) {
            continue;
          }

          context.lineJoin = "round";
          context.strokeStyle = annotation.strokeColor;
          context.lineWidth = annotation.strokeWidth;

          var drawFunction;
          switch (annotation.annotationType) {
            case "polygon":
              drawFunction = drawPolygon;
              break;
            default:
              drawFunction = drawPolygon
          }

          if (scope.currentAnnotation == i) {
            drawFunction(annotation.pointX, annotation.pointY, mouseX, mouseY);
          } else {
            drawFunction(annotation.pointX, annotation.pointY);
          }
        }
      }

      elem.on('mousedown', function(e) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;

        console.log("Mouse Down, "+mouseX+", "+mouseY);
        var ann = annotations[scope.currentAnnotation];

        function dist(x1, y1, x2, y2) {
          return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
        }

        switch (ann.annotationType) {
          case "polygon":
            if (dist(mouseX, mouseY, ann.pointX[0], ann.pointY[0]) < 10) {
              ann.addPoint(ann.pointX[0], ann.pointY[0]);
              finishAnnotation();
            } else {
              ann.addPoint(mouseX, mouseY);
            }
            break;
          case "line":
            ann.addPoint(mouseX, mouseY);
            if (ann.pointX.length == 2) {
              finishAnnotation();
            }
            break;
        }
        redraw();
      });

      elem.on('mousemove', function(e) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;

        var ann = annotations[scope.currentAnnotation];
        if (ann.annotationType == "polygon" && ann.pointX.length > 0) {
          redraw();
        }
      });

      elem.on('mouseup', function(e){
        //paint = false;
      });

      elem.on('mouseover', function() {
        elem.css('cursor', 'pointer');
      });

      $document.on('keypress', function(e) {
        console.log('Key pressed: '+e.which);
        resetAnnotation();
        redraw();
      });
    }
  }
}());
