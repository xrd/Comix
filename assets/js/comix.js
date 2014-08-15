(function() {
  var cache_animation, doSomething, init, mod, scrollorama, setupScroll;

  mod = angular.module('Comix', []);

  doSomething = function() {
    return console.log("Did it");
  };

  scrollorama = void 0;

  setupScroll = function(scope) {
    return $('.scrollblock').on('inview', function(event, elem) {
      var parent, parentId;
      parent = event.target.classList[event.target.classList.length - 1];
      parentId = parent.substr("frame".length);
      return scope.$root.$broadcast('scrollblock', parentId);
    });
  };

  cache_animation = function(scope) {
    scope.cached_animation = scope.animation;
    return scope.animation = void 0;
  };

  init = function(frame, scope, el, ctx) {
    cache_animation(scope);
    return scope.$on('associate', function(event, ref) {
      if (frame.parentId === ref) {
        console.log("Setting parentId: " + frame.parentId + " / " + ref + " / " + ctx);
        scope.frameParent = frame.parentId;
        return scope.$on("animate-" + ctx, function(event, anRef) {
          if (ref === anRef) {
            return scope.animation = scope.cached_animation;
          }
        });
      }
    });
  };

  mod.directive('cxComix', function($timeout) {
    var controlsTemplate, offset, template, wantControls;
    wantControls = false;
    offset = "20";
    controlsTemplate = "<div style=\"position: fixed; bottom: " + offset + "px; width: 100%; z-index: 1000;\">\n        <div class=\"controls\" ng-show=\"controls\" class=\"text-center\" style=\"width: 100%\">\n                <span ng-click=\"goUp()\" class=\"glyphicon glyphicon-arrow-up\"></span>\n                <span ng-click=\"goDown()\" class=\"glyphicon glyphicon-arrow-down\"></span>\n                <span class=\"glyphicon glyphicon-home\"></span>\n                <span class=\"glyphicon glyphicon-share\"></span>\n        </div>\n</div>";
    template = function() {
      var rv;
      rv = "";
      rv += controlsTemplate;
      rv += '<div class="text-center"><h1>{{title}}</h1></div>';
      rv += "<div class=\"container\" ng-transclude=\"true\"></div>";
      return rv;
    };
    return {
      restrict: 'E',
      transclude: true,
      controller: [
        '$scope', function(scope) {
          scope.goUp = function() {
            console.log("Got up!");
            return scope.$root.$broadcast('up');
          };
          return scope.goDown = function() {
            console.log("Got down!");
            return scope.$root.$broadcast('down');
          };
        }
      ],
      link: function(scope, elem, attr) {
        if (scope.controls) {
          wantControls = true;
        }
        return setupScroll(scope);
      },
      scope: {
        controls: '@',
        title: '@'
      },
      template: template()
    };
  });

  mod.directive('cxFrame', function() {
    var getTemplate, parentIndex;
    parentIndex = 0;
    getTemplate = function() {
      return "<div class=\"col-md-3\" style=\"border: 1px dotted grey; height: 400px;\">\n<div ng-transclude=\"true\" class=\"scrollblock frame{{frameParent}}\"></div>\n</div>";
    };
    return {
      restrict: 'E',
      transclude: true,
      controller: function() {
        this.parentId = parentIndex;
        return parentIndex++;
      },
      link: function(scope, el, attr, controller) {
        console.log("Controller: " + controller.parentId);
        scope.$broadcast('associate', controller.parentId);
        return scope.$on('scrollblock', function(event, parentId) {
          console.log("Got scrollblock rebroadcast " + event.target + "/ " + parentId);
          if (parentIndex === parentId) {
            console.log("Receiving scrollblock and re-dispatching for " + parentId);
            scope.$root.$broadcast('animate-characters', parentId);
            return scope.$root.$broadcast('animate-dialogs', parentId);
          }
        });
      },
      template: getTemplate()
    };
  });

  mod.directive('cxCharacter', function() {
    return {
      restrict: 'E',
      require: '^cxFrame',
      scope: {
        name: '@',
        'animation': '@',
        width: '@',
        top: '@',
        left: '@'
      },
      link: function(scope, el, attr, frame) {
        return init(frame, scope, el, 'characters');
      },
      template: "<img src=\"/assets/images//{{ name }}.png\"\nstyle=\"width: {{ width }}px; height: auto; position: absolute; top: {{top}}px; left: {{left}}px;\"\nng-class=\"{ 'animated': animation, '{{animation}}': animation }\"/>"
    };
  });

  mod.directive('cxDialog', function() {
    return {
      restrict: 'E',
      require: '^cxFrame',
      link: function(scope, el, attr, frame) {
        return init(frame, scope, el, 'dialogs');
      },
      scope: {
        delay: '@',
        animation: '@'
      },
      template: "<p ng-transclude=\"true\" class=\"bubble speech\" ng-class=\"{ 'animated': animation, '{{animation}}': animation }\" ></p>",
      transclude: true
    };
  });

}).call(this);
