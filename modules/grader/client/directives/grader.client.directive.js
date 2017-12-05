(function () {
  'use strict';

  // Users directive used to force lowercase input
  angular
    .module('grader')
    .directive('annotator', ['$document', annotator]);

  var drawing = false;

  function annotator($document) {
    var directive = {
      replace: false,
      link: link
    };

    return directive;

    function link(scope, elem, attrs, modelCtrl) {
      var domElement = elem[0];
      elem.addClass("annotator");

      var context =  domElement.getContext("2d");
      var offsetTop = domElement.getBoundingClientRect().top;
      var offsetLeft = domElement.getBoundingClientRect().left;

      var mouseX;
      var mouseY;
      var mouseDown; // bool

      var mImage = new Image();

      angular.element(mImage).on('load', function() {
        console.log("Image loaded");
        redraw();
      });

      // $scope.on contains the url of the current image
      scope.$watch('on', function(newValue, oldValue) {
        console.log("$scope.on was changed to: ");
        console.log(newValue);
        if (newValue && newValue.url) {
          newValue.url = newValue.url.substring(6);
          var aImage = new Image();
          aImage.onload = function() {
            console.log("Loaded image");
            mImage.src = newValue.url;
          }
          aImage.src = newValue.url;
        } else {
          if (newValue === undefined) {
            console.log("vm.on is undefined");
          }
        }
      });

      // refreshes the canvas based on the annotations in scope.annotations
      scope.redraw = redraw;

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

      function drawImage() {
        //var width=490, height=425;
        var width=domElement.width, height=domElement.height;
        var canvasRatio = width/height;
        var imageRatio = mImage.width/mImage.height;
        // If the image is wider than ours, use their width to set the height

        if (imageRatio > canvasRatio) {
          height = width/imageRatio;
        } else {
          width = height * imageRatio;
        }

        context.drawImage(mImage, 0, 0, width, height);
      }

      function redraw(highlight){
        // Clear the canvas
        context.clearRect(0, 0, domElement.width, domElement.height);
        drawImage();
        for (var i = 0; i < scope.annotations.length; i++) {
          var annotation = scope.annotations[i];
          if (annotation.pointX.length == 0) {
            continue;
          }

          context.lineJoin = "round";
          context.strokeStyle = annotation.strokeColor;
          context.lineWidth = annotation.strokeWidth;

          if (i == scope.on.step && highlight) {
            context.strokeStyle = annotation.highlightColor;
          }

          if (scope.on.step == i) {
            drawPolygon(annotation.pointX, annotation.pointY, mouseX, mouseY);
          } else {
            drawPolygon(annotation.pointX, annotation.pointY);
          }
        }
      }

      elem.on('mousedown', function(e) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;

        console.log("Mouse Down, "+mouseX+", "+mouseY);
        var ann = scope.annotations[scope.on.step];

        function dist(x1, y1, x2, y2) {
          return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
        }

        switch (ann.annotationType) {
          case "polyline":
            if (ann.pointX.length > 0 && (e.ctrlKey || e.metaKey)) {
              ann.addPoint(mouseX, mouseY);
              drawing = false;
              redraw();
              scope.addAnnotation();
            } else {
                ann.addPoint(mouseX, mouseY);
                drawing = true;
                redraw();
            }
            break;
          case "line":
            if (ann.pointX.length == 2) break;

            // First point in line
            ann.addPoint(mouseX, mouseY);
            drawing = true;

            if (ann.pointX.length == 2) {
              drawing = false;
              scope.addAnnotation();
            }
            break;
        }
        redraw();
      });

      elem.on('mousemove', function(e) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;

        if (drawing) {
          var ann = scope.annotations[scope.on.step];
          if ((e.ctrlKey || e.metaKey) && ann.annotationType == "polyline" && ann.pointX.length > 0) {
            // highlight the polyline before the user ends it
            redraw(true);
          } else {
            // don't highlight the currnent line
            redraw(false);
          }
        }
      });

      elem.on('mouseup', function(e){
        //paint = false;
      });

      elem.css('cursor', 'crosshair');

      $document.on('keydown', function(e) {
        console.log('Key down: '+e.which);
        if (e.which == 8) {
          scope.resetAnnotation();
          redraw();
        }
      });
    }
  }
}());
